-- Modavalasa Mitra — Stage 2 / WP-1 database foundation
-- Apply only after reviewing the live schema and confirming the target project.
-- Emergency placeholders deliberately remain draft and phone_verified = false.

BEGIN;

-- 1. Private operational settings (includes the runtime kill switch).
CREATE TABLE IF NOT EXISTS public.assistant_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assistant_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.assistant_settings FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.assistant_settings TO service_role;

INSERT INTO public.assistant_settings (key, value)
VALUES ('assistant_status', '{"enabled": true, "reason": null}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. Restrict recognized administrative roles. Preflight confirmed current rows
-- are all 'admin'; this constraint must be rechecked if that data changes.
ALTER TABLE public.admin_users
    DROP CONSTRAINT IF EXISTS chk_admin_users_role;

ALTER TABLE public.admin_users
    ADD CONSTRAINT chk_admin_users_role
    CHECK (role IN ('admin', 'official'));

-- SECURITY DEFINER is intentional: the function performs a narrow role lookup.
-- auth.uid() plus an explicit row in admin_users is the authorization check.
CREATE OR REPLACE FUNCTION public.is_official()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $function$
    SELECT auth.uid() IS NOT NULL
       AND EXISTS (
           SELECT 1
           FROM public.admin_users AS au
           WHERE au.user_id = auth.uid()
             AND au.role IN ('admin', 'official')
       );
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.is_official() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_official() TO authenticated;

-- 3. Add draft-only placeholders, but only when the village resolves uniquely.
-- A DO block prevents silently inserting into an arbitrary duplicate village.
DO $block$
DECLARE
    v_village_id UUID;
    v_village_count INTEGER;
BEGIN
    SELECT count(*), min(id::text)::uuid
      INTO v_village_count, v_village_id
      FROM public.villages
     WHERE name = 'Modavalasa';

    IF v_village_count <> 1 THEN
        RAISE EXCEPTION
            'Expected exactly one public.villages row named Modavalasa; found %',
            v_village_count;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.contacts
        WHERE village_id = v_village_id AND phone = '101'
    ) THEN
        INSERT INTO public.contacts (
            village_id, name, name_te, category, phone, phone_verified,
            jurisdiction, source, verified_on, status, verification_method, address_status
        ) VALUES (
            v_village_id,
            '101 Fire & Rescue Emergency Services',
            '101 అగ్నిమాపక అత్యవసర సేవలు',
            'Emergency',
            '101',
            false,
            'Statewide',
            'Andhra Pradesh State Disaster Response and Fire Services Department',
            CURRENT_DATE,
            'draft',
            'WP1 placeholder; pending field verification with Vizianagaram Fire Station',
            'Statewide emergency transit network'
        );
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM public.contacts
        WHERE village_id = v_village_id AND phone = '14416'
    ) THEN
        INSERT INTO public.contacts (
            village_id, name, name_te, category, phone, phone_verified,
            jurisdiction, source, verified_on, status, verification_method, address_status
        ) VALUES (
            v_village_id,
            '14416 Tele-MANAS Mental Health Helpline',
            '14416 టెలి-మానస్ మానసిక ఆరోగ్య సహాయవాణి',
            'Emergency',
            '14416',
            false,
            'Statewide',
            'Ministry of Health and Family Welfare, Government of India & AP Health Dept',
            CURRENT_DATE,
            'draft',
            'WP1 placeholder; pending field verification with DMHO Mental Health Cell',
            'National tele-consultation network'
        );
    END IF;
END;
$block$;

-- 4. Private rate-limit storage and atomic sliding-window counter.
CREATE TABLE IF NOT EXISTS public.assistant_rate_limits (
    rate_key TEXT PRIMARY KEY,
    request_count INTEGER NOT NULL DEFAULT 1 CHECK (request_count >= 1),
    window_start TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_request_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assistant_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.assistant_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL PRIVILEGES ON TABLE public.assistant_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.check_assistant_rate_limit(
    p_rate_key TEXT,
    p_max_requests INTEGER,
    p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
DECLARE
    v_allowed BOOLEAN;
    v_now TIMESTAMPTZ := clock_timestamp();
BEGIN
    IF p_rate_key IS NULL
       OR length(p_rate_key) > 128
       OR p_rate_key !~ '^(sess|sub_mint|sub_req):[a-zA-Z0-9_.:/-]{1,100}$' THEN
        RAISE EXCEPTION 'Invalid rate limit key format';
    END IF;

    IF p_max_requests IS NULL OR p_max_requests < 1 OR p_max_requests > 1000 THEN
        RAISE EXCEPTION 'Invalid max requests boundary';
    END IF;

    IF p_window_seconds IS NULL OR p_window_seconds < 1 OR p_window_seconds > 86400 THEN
        RAISE EXCEPTION 'Invalid window seconds boundary';
    END IF;

    -- Opportunistic cleanup is bounded to old keys and runs on a small sample.
    IF random() < 0.05 THEN
        DELETE FROM public.assistant_rate_limits
         WHERE last_request_at < v_now - INTERVAL '2 hours';
    END IF;

    INSERT INTO public.assistant_rate_limits AS current_limit
        (rate_key, request_count, window_start, last_request_at)
    VALUES (p_rate_key, 1, v_now, v_now)
    ON CONFLICT (rate_key) DO UPDATE
       SET request_count = CASE
               WHEN v_now - current_limit.window_start >= make_interval(secs => p_window_seconds)
                   THEN 1
               ELSE current_limit.request_count + 1
           END,
           window_start = CASE
               WHEN v_now - current_limit.window_start >= make_interval(secs => p_window_seconds)
                   THEN v_now
               ELSE current_limit.window_start
           END,
           last_request_at = v_now
    RETURNING request_count <= p_max_requests INTO v_allowed;

    RETURN v_allowed;
END;
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.check_assistant_rate_limit(TEXT, INTEGER, INTEGER)
    FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.check_assistant_rate_limit(TEXT, INTEGER, INTEGER)
    TO service_role;

-- 5. Privacy-minimized telemetry. Do not add resident query text or raw IPs.
CREATE TABLE IF NOT EXISTS public.assistant_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_hash TEXT NOT NULL,
    latency_ms INTEGER NOT NULL CHECK (latency_ms >= 0),
    tools_invoked JSONB,
    prompt_tokens INTEGER CHECK (prompt_tokens IS NULL OR prompt_tokens >= 0),
    completion_tokens INTEGER CHECK (completion_tokens IS NULL OR completion_tokens >= 0),
    emergency_triggered BOOLEAN NOT NULL DEFAULT false,
    error_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.assistant_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL PRIVILEGES ON TABLE public.assistant_events FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT ON TABLE public.assistant_events TO service_role;

CREATE OR REPLACE FUNCTION public.purge_stale_assistant_events()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
    DELETE FROM public.assistant_events
     WHERE created_at < now() - INTERVAL '30 days';

    DELETE FROM public.assistant_rate_limits
     WHERE last_request_at < now() - INTERVAL '2 hours';
END;
$function$;

REVOKE ALL PRIVILEGES ON FUNCTION public.purge_stale_assistant_events() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.purge_stale_assistant_events() TO service_role;

COMMIT;
