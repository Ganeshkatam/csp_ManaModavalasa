-- ==============================================================================
-- Migration: 20261014010000_restrict_survey_inserts_and_enforce_rate_limits
-- Purpose: 
-- 1. Restrict public direct table inserts on survey_responses and survey_answers.
--    Direct table mutations are restricted to authenticated administrators.
-- 2. Channel all public survey submissions through atomic SECURITY DEFINER
--    submit_survey() RPC.
-- 3. Enforce server-side rate limits and duplicate submission replay guards
--    inside submit_survey() RPC (max 30 submissions/min/village, 5-minute replay guard).
-- ==============================================================================

-- 1. Restrict table-level RLS policies on survey_responses
DROP POLICY IF EXISTS "Surveyors insert survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Admin manage survey responses" ON public.survey_responses;

CREATE POLICY "Admin manage survey responses"
  ON public.survey_responses FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 2. Restrict table-level RLS policies on survey_answers
DROP POLICY IF EXISTS "Surveyors insert survey answers" ON public.survey_answers;
DROP POLICY IF EXISTS "Admin manage survey answers" ON public.survey_answers;

CREATE POLICY "Admin manage survey answers"
  ON public.survey_answers FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 3. Replace submit_survey RPC with rate-limiting and replay guards
CREATE OR REPLACE FUNCTION public.submit_survey(
    p_village_id UUID,
    p_respondent_code TEXT,
    p_interviewer_name TEXT,
    p_ward_street TEXT,
    p_locality_ward TEXT,
    p_started_at TIMESTAMPTZ,
    p_completed_at TIMESTAMPTZ,
    p_survey_client_uuid UUID,
    p_notes TEXT,
    p_answers JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
    v_clean_code TEXT;
    v_clean_interviewer TEXT;
    v_clean_ward TEXT;
    v_clean_locality TEXT;
    v_response_id UUID;
    v_existing_id UUID;
    v_answer JSONB;
    v_q_code TEXT;
    v_a_val TEXT;
    v_q_rec RECORD;
    v_d5_val INT;
    v_inserted_count INT := 0;
    v_recent_same_respondent INT;
    v_recent_village_total INT;
BEGIN
    -- 1. Input sanitization and bounds enforcement
    v_clean_code := trim(p_respondent_code);
    v_clean_interviewer := trim(p_interviewer_name);
    v_clean_ward := trim(p_ward_street);
    v_clean_locality := trim(p_locality_ward);

    IF v_clean_code IS NULL OR length(v_clean_code) < 3 OR length(v_clean_code) > 50 THEN
        RAISE EXCEPTION 'respondent_code must be between 3 and 50 characters';
    END IF;

    IF v_clean_interviewer IS NULL OR length(v_clean_interviewer) < 2 OR length(v_clean_interviewer) > 100 THEN
        RAISE EXCEPTION 'interviewer_name must be between 2 and 100 characters';
    END IF;

    IF v_clean_ward IS NULL OR length(v_clean_ward) < 2 OR length(v_clean_ward) > 200 THEN
        RAISE EXCEPTION 'ward_street must be between 2 and 200 characters';
    END IF;

    IF v_clean_locality IS NULL OR length(v_clean_locality) < 2 OR length(v_clean_locality) > 100 THEN
        RAISE EXCEPTION 'locality_ward must be between 2 and 100 characters';
    END IF;

    -- Validate village exists
    IF NOT EXISTS (SELECT 1 FROM public.villages WHERE id = p_village_id) THEN
        RAISE EXCEPTION 'Specified village does not exist';
    END IF;

    -- Validate started_at and completed_at
    IF p_started_at IS NOT NULL AND p_completed_at IS NOT NULL AND p_completed_at < p_started_at THEN
        RAISE EXCEPTION 'completed_at cannot precede started_at';
    END IF;

    -- 2. Idempotency Check: if survey_client_uuid already exists, return existing record
    IF p_survey_client_uuid IS NOT NULL THEN
        SELECT id INTO v_existing_id
        FROM public.survey_responses
        WHERE survey_client_uuid = p_survey_client_uuid;

        IF v_existing_id IS NOT NULL THEN
            SELECT count(*) INTO v_inserted_count
            FROM public.survey_answers
            WHERE response_id = v_existing_id;

            RETURN jsonb_build_object(
                'success', true,
                'response_id', v_existing_id,
                'already_existed', true,
                'answers_count', v_inserted_count
            );
        END IF;
    END IF;

    -- 3. Anti-replay and rate limiting guards
    -- Anti-replay: prevent duplicate respondent_code submissions within 5 minutes
    SELECT COUNT(*) INTO v_recent_same_respondent
    FROM public.survey_responses
    WHERE lower(respondent_code) = lower(v_clean_code)
      AND village_id = p_village_id
      AND created_at > (now() - interval '5 minutes');

    IF v_recent_same_respondent > 0 THEN
        RAISE EXCEPTION 'A survey response for respondent code % was recently recorded. Please wait 5 minutes before resubmitting.', v_clean_code;
    END IF;

    -- Burst protection: max 30 survey submissions per minute per village
    SELECT COUNT(*) INTO v_recent_village_total
    FROM public.survey_responses
    WHERE village_id = p_village_id
      AND created_at > (now() - interval '1 minute');

    IF v_recent_village_total >= 30 THEN
        RAISE EXCEPTION 'Survey submission rate limit exceeded for this village. Please retry shortly.';
    END IF;

    -- 4. Validate answers array
    IF p_answers IS NULL OR jsonb_typeof(p_answers) <> 'array' THEN
        RAISE EXCEPTION 'answers must be a valid JSON array';
    END IF;

    IF jsonb_array_length(p_answers) < 1 THEN
        RAISE EXCEPTION 'answers payload cannot be empty';
    END IF;

    IF jsonb_array_length(p_answers) > 60 THEN
        RAISE EXCEPTION 'answers payload exceeds maximum permitted count of 60 answers';
    END IF;

    -- Validate each answer prior to mutating state
    FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
        v_q_code := trim(v_answer->>'question_code');
        v_a_val := trim(v_answer->>'answer_value');

        IF v_q_code IS NULL OR v_q_code = '' THEN
            RAISE EXCEPTION 'question_code is required for all answer entries';
        END IF;

        IF v_a_val IS NULL OR v_a_val = '' THEN
            RAISE EXCEPTION 'answer_value is required for question %', v_q_code;
        END IF;

        IF length(v_a_val) > 500 THEN
            RAISE EXCEPTION 'answer_value for % exceeds maximum permitted length of 500 characters', v_q_code;
        END IF;

        -- Validate that question_code exists in registered questionnaire
        SELECT question_code, question_type, options INTO v_q_rec
        FROM public.survey_questions
        WHERE question_code = v_q_code;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Unrecognized question_code: %', v_q_code;
        END IF;

        -- Specific type validation for household size number
        IF v_q_rec.question_type = 'number' AND v_q_code = 'D5' THEN
            IF v_a_val !~ '^[0-9]+$' THEN
                RAISE EXCEPTION 'Household size D5 must be a positive integer';
            END IF;
            v_d5_val := v_a_val::int;
            IF v_d5_val < 1 OR v_d5_val > 30 THEN
                RAISE EXCEPTION 'Household size D5 must be between 1 and 30';
            END IF;
        END IF;
    END LOOP;

    -- 5. Atomic insertion of survey response header
    INSERT INTO public.survey_responses (
        village_id,
        respondent_code,
        interviewer_name,
        ward_street,
        locality_ward,
        consent_obtained,
        started_at,
        completed_at,
        survey_client_uuid,
        notes
    ) VALUES (
        p_village_id,
        v_clean_code,
        v_clean_interviewer,
        v_clean_ward,
        v_clean_locality,
        true,
        p_started_at,
        p_completed_at,
        p_survey_client_uuid,
        p_notes
    )
    RETURNING id INTO v_response_id;

    -- 6. Atomic insertion of validated answers with accurate insertion count
    FOR v_answer IN SELECT * FROM jsonb_array_elements(p_answers)
    LOOP
        INSERT INTO public.survey_answers (
            response_id,
            question_code,
            answer_value,
            notes
        ) VALUES (
            v_response_id,
            trim(v_answer->>'question_code'),
            trim(v_answer->>'answer_value'),
            NULLIF(trim(v_answer->>'notes'), '')
        )
        ON CONFLICT (response_id, question_code, answer_value) DO NOTHING;
        
        IF FOUND THEN
            v_inserted_count := v_inserted_count + 1;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'response_id', v_response_id,
        'already_existed', false,
        'answers_count', v_inserted_count
    );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_survey(
    UUID, TEXT, TEXT, TEXT, TEXT, TIMESTAMPTZ, TIMESTAMPTZ, UUID, TEXT, JSONB
) TO anon, authenticated;
