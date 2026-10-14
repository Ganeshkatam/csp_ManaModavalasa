-- ==============================================================================
-- Migration: 20260929201012_enable_rls_on_search_aliases
-- Enables Row Level Security on search_aliases and defines access policies.
-- ==============================================================================

ALTER TABLE public.search_aliases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published search aliases" ON public.search_aliases;
CREATE POLICY "Public read published search aliases"
  ON public.search_aliases FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DROP POLICY IF EXISTS "Admin manage search aliases" ON public.search_aliases;
CREATE POLICY "Admin manage search aliases"
  ON public.search_aliases FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
