-- ============================================================
-- Migration 083 : Fix search_path mutable — fonctions non couvertes
-- ============================================================
--
-- Supabase Security Linter : function_search_path_mutable WARN
--
-- Contexte :
--   Migration 060 a déjà corrigé avec SET search_path = '' (strict) :
--     set_expert_profiles_updated_at, update_commission_tiers_updated_at,
--     update_invoices_updated_at, trg_fn_catalogue_requests
--   + REVOKE EXECUTE FROM anon, authenticated sur toutes ces fonctions.
--
--   Migration 082 a corrigé :
--     update_term_sheets_updated_at, update_mandates_updated_at
--
-- Restent non couvertes (migration d'origine sans SET search_path) :
--   001 — public.handle_updated_at
--   004 — public.set_updated_at
--   012 — public.set_profiles_updated_at
--   013 — public.set_auction_sessions_updated_at
--   035 — public.update_blocks_grading
--
-- Toutes sont des triggers internes — REVOKE EXECUTE sur anon/authenticated
-- est maintenu (déjà posé par 060, réaffirmé ici pour cohérence).
--
-- SET search_path = '' (vide) = standard le plus strict : force la
-- qualification explicite public.xxx, aligné avec 060.
-- ============================================================


-- ── handle_updated_at (001) ───────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.handle_updated_at() FROM anon, authenticated;


-- ── set_updated_at (004) ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated;


-- ── set_profiles_updated_at (012) ────────────────────────────

CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_profiles_updated_at() FROM anon, authenticated;


-- ── set_auction_sessions_updated_at (013) ────────────────────

CREATE OR REPLACE FUNCTION public.set_auction_sessions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_auction_sessions_updated_at() FROM anon, authenticated;


-- ── update_blocks_grading (035) ──────────────────────────────

CREATE OR REPLACE FUNCTION public.update_blocks_grading()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.blocks_grading := (
    NEW.required_level = 'blocking'
    AND NEW.admin_quality IN ('missing', 'insufficient')
  );
  RETURN NEW;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.update_blocks_grading() FROM anon, authenticated;
