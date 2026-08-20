-- ============================================================
-- Migration 082 : Fix search_path mutable — update_term_sheets_updated_at
--                                            update_mandates_updated_at
-- ============================================================
--
-- Supabase Security Linter : function_search_path_mutable WARN
-- Ces 2 fonctions n'étaient pas couvertes par la migration 064
-- (qui a standardisé toutes les autres en SECURITY INVOKER + search_path='').
--
-- Alignement sur le standard 064 :
--   SECURITY INVOKER (pas d'élévation de privilèges, triggers n'en ont pas besoin)
--   SET search_path = '' (le plus strict — force qualification public.xxx)
-- ============================================================


-- ── update_term_sheets_updated_at (070) ──────────────────────

CREATE OR REPLACE FUNCTION public.update_term_sheets_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ── update_mandates_updated_at (072) ─────────────────────────

CREATE OR REPLACE FUNCTION public.update_mandates_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
