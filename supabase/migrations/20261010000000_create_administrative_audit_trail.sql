-- ==============================================================================
-- Migration: 20261010000000_create_administrative_audit_trail.sql
-- Description: Production Append-Only Administrative Audit Trail
-- Architecture: Supabase PostgreSQL (Postgres 15+)
-- Rules: Zero emojis, immutable append-only table, server-derived actor identity,
--        sensitive field redaction, strict RLS, search_path pinned to public, pg_temp.
-- ==============================================================================

-- 1. Create audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    actor_id UUID,
    actor_email TEXT,
    old_data JSONB,
    new_data JSONB,
    changed_fields JSONB,
    client_ip TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for high-performance administrative queries
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- 2. Sensitive data redaction helper function with recursive sanitization policy
CREATE OR REPLACE FUNCTION public.sanitize_audit_payload(p_data JSONB)
RETURNS JSONB
LANGUAGE plpgsql
IMMUTABLE
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
    v_clean JSONB := '{}'::jsonb;
    v_key TEXT;
    v_val JSONB;
    v_val_text TEXT;
    v_val_type TEXT;
    v_lower_key TEXT;
    v_clean_digits TEXT;
    v_masked_phone TEXT;
BEGIN
    IF p_data IS NULL THEN
        RETURN NULL;
    END IF;

    v_val_type := jsonb_typeof(p_data);

    -- Primitive scalar types (string, number, boolean, null)
    IF v_val_type = 'null' THEN
        RETURN 'null'::jsonb;
    ELSIF v_val_type IN ('string', 'number', 'boolean') THEN
        RETURN p_data;
    END IF;

    -- Recursive array sanitization
    IF v_val_type = 'array' THEN
        IF jsonb_array_length(p_data) = 0 THEN
            RETURN '[]'::jsonb;
        END IF;

        SELECT COALESCE(jsonb_agg(public.sanitize_audit_payload(elem)), '[]'::jsonb)
        INTO v_clean
        FROM jsonb_array_elements(p_data) AS elem;

        RETURN v_clean;
    END IF;

    -- Recursive object sanitization
    IF v_val_type = 'object' THEN
        FOR v_key, v_val IN SELECT * FROM jsonb_each(p_data)
        LOOP
            v_lower_key := lower(v_key);

            -- 1. Sensitive authentication keys, passwords, tokens, API keys, credentials, PII identity identifiers
            IF v_lower_key ~ '(password|passwd|secret|token|api_?key|auth_?code|credentials|private_?key|access_?token|refresh_?token|bearer|passcode|otp|aadhaar|ssn|national_?id)' THEN
                CONTINUE; -- Exclude sensitive keys entirely from the audit payload
            END IF;

            -- 2. Personal contact and phone number fields: recursive sanitize if object/array, or mask digits if string/number
            IF v_lower_key ~ '(phone|mobile|cell|contact_phone|emergency_phone|telephone)' THEN
                IF jsonb_typeof(v_val) = 'string' THEN
                    v_val_text := v_val #>> '{}';
                    v_clean_digits := regexp_replace(v_val_text, '\D', '', 'g');
                    IF length(v_clean_digits) >= 4 THEN
                        v_masked_phone := repeat('X', greatest(length(v_clean_digits) - 4, 2)) || right(v_clean_digits, 4);
                        v_clean := v_clean || jsonb_build_object(v_key, to_jsonb(v_masked_phone));
                    ELSIF length(v_clean_digits) > 0 THEN
                        v_clean := v_clean || jsonb_build_object(v_key, to_jsonb(repeat('X', length(v_clean_digits))));
                    ELSE
                        v_clean := v_clean || jsonb_build_object(v_key, to_jsonb(v_val_text));
                    END IF;
                    CONTINUE;
                ELSIF jsonb_typeof(v_val) = 'number' THEN
                    v_val_text := v_val::text;
                    IF length(v_val_text) >= 4 THEN
                        v_masked_phone := repeat('X', greatest(length(v_val_text) - 4, 2)) || right(v_val_text, 4);
                        v_clean := v_clean || jsonb_build_object(v_key, to_jsonb(v_masked_phone));
                    ELSE
                        v_clean := v_clean || jsonb_build_object(v_key, to_jsonb(repeat('X', length(v_val_text))));
                    END IF;
                    CONTINUE;
                END IF;
            END IF;

            -- 3. Recursively sanitize nested structures
            IF jsonb_typeof(v_val) IN ('object', 'array') THEN
                v_clean := v_clean || jsonb_build_object(v_key, public.sanitize_audit_payload(v_val));
            ELSE
                v_clean := v_clean || jsonb_build_object(v_key, v_val);
            END IF;
        END LOOP;

        RETURN v_clean;
    END IF;

    RETURN p_data;
END;
$$;

-- 3. Core trigger function capturing mutations and actor identity
CREATE OR REPLACE FUNCTION public.log_administrative_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
DECLARE
    v_actor_id UUID;
    v_actor_email TEXT;
    v_old_data JSONB := NULL;
    v_new_data JSONB := NULL;
    v_changed_fields JSONB := NULL;
    v_entity_id UUID;
    v_action TEXT;
    v_key TEXT;
    v_changes TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Derive actor identity from PostgreSQL execution context
    v_actor_id := auth.uid();
    BEGIN
        v_actor_email := current_setting('request.jwt.claim.email', true);
    EXCEPTION WHEN OTHERS THEN
        v_actor_email := NULL;
    END;

    IF v_actor_email IS NULL THEN
        v_actor_email := current_user;
    END IF;

    IF TG_OP = 'INSERT' THEN
        v_action := 'INSERT';
        v_entity_id := NEW.id;
        v_new_data := public.sanitize_audit_payload(to_jsonb(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        v_action := 'UPDATE';
        v_entity_id := NEW.id;
        v_old_data := public.sanitize_audit_payload(to_jsonb(OLD));
        v_new_data := public.sanitize_audit_payload(to_jsonb(NEW));

        -- Calculate changed fields
        FOR v_key IN SELECT jsonb_object_keys(to_jsonb(NEW))
        LOOP
            IF (to_jsonb(OLD)->v_key) IS DISTINCT FROM (to_jsonb(NEW)->v_key) THEN
                v_changes := array_append(v_changes, v_key);
            END IF;
        END LOOP;

        -- If no columns changed, skip redundant logging
        IF array_length(v_changes, 1) IS NULL THEN
            RETURN NEW;
        END IF;

        v_changed_fields := to_jsonb(v_changes);
    ELSIF TG_OP = 'DELETE' THEN
        v_action := 'DELETE';
        v_entity_id := OLD.id;
        v_old_data := public.sanitize_audit_payload(to_jsonb(OLD));
    END IF;

    INSERT INTO public.audit_logs (
        entity_type,
        entity_id,
        action,
        actor_id,
        actor_email,
        old_data,
        new_data,
        changed_fields
    ) VALUES (
        TG_TABLE_NAME,
        v_entity_id,
        v_action,
        v_actor_id,
        v_actor_email,
        v_old_data,
        v_new_data,
        v_changed_fields
    );

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$;

-- 4. Anti-tamper immutability trigger preventing modification or deletion of audit logs
CREATE OR REPLACE FUNCTION public.prevent_audit_log_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'pg_temp'
AS $$
BEGIN
    RAISE EXCEPTION 'Audit log entries are immutable and cannot be altered or deleted.';
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_logs_immutable ON public.audit_logs;
CREATE TRIGGER trg_audit_logs_immutable
    BEFORE UPDATE OR DELETE ON public.audit_logs
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_audit_log_mutation();

-- 5. Row-Level Security and Privileges
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated administrators to query audit logs
DROP POLICY IF EXISTS audit_logs_read_admin ON public.audit_logs;
CREATE POLICY audit_logs_read_admin ON public.audit_logs
    FOR SELECT
    USING (public.is_admin());

-- Strictly revoke direct client writes, updates, and deletes
REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON public.audit_logs FROM PUBLIC, anon, authenticated;

-- 6. Attach triggers to core directory and state tables
DROP TRIGGER IF EXISTS trg_audit_villages ON public.villages;
CREATE TRIGGER trg_audit_villages
    AFTER INSERT OR UPDATE OR DELETE ON public.villages
    FOR EACH ROW EXECUTE FUNCTION public.log_administrative_mutation();

DROP TRIGGER IF EXISTS trg_audit_schemes ON public.schemes;
CREATE TRIGGER trg_audit_schemes
    AFTER INSERT OR UPDATE OR DELETE ON public.schemes
    FOR EACH ROW EXECUTE FUNCTION public.log_administrative_mutation();

DROP TRIGGER IF EXISTS trg_audit_contacts ON public.contacts;
CREATE TRIGGER trg_audit_contacts
    AFTER INSERT OR UPDATE OR DELETE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION public.log_administrative_mutation();

DROP TRIGGER IF EXISTS trg_audit_institutions ON public.institutions;
CREATE TRIGGER trg_audit_institutions
    AFTER INSERT OR UPDATE OR DELETE ON public.institutions
    FOR EACH ROW EXECUTE FUNCTION public.log_administrative_mutation();

DROP TRIGGER IF EXISTS trg_audit_announcements ON public.announcements;
CREATE TRIGGER trg_audit_announcements
    AFTER INSERT OR UPDATE OR DELETE ON public.announcements
    FOR EACH ROW EXECUTE FUNCTION public.log_administrative_mutation();

DROP TRIGGER IF EXISTS trg_audit_feedback_status ON public.citizen_feedback;
CREATE TRIGGER trg_audit_feedback_status
    AFTER UPDATE OF status ON public.citizen_feedback
    FOR EACH ROW EXECUTE FUNCTION public.log_administrative_mutation();
