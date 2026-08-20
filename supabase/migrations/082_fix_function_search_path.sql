-- ============================================================
-- Migration 082 : Fix search_path mutable — 2 fonctions trigger
-- ============================================================
--
-- Supabase Security Linter — 2 warnings WARN :
--   - public.update_term_sheets_updated_at
--   - public.update_mandates_updated_at
--
-- Problème : sans SET search_path, une fonction plpgsql peut être
-- piégée par un search_path manipulé (schema injection). Un acteur
-- malveillant ayant CREATE SCHEMA peut substituer des objets du
-- schéma public (ex: remplacer now() par une fonction hostile).
--
-- Solution : ajouter SECURITY DEFINER SET search_path = public
-- sur ces fonctions trigger pour fixer le schéma de résolution.
-- Ces fonctions n'accèdent qu'à NEW.updated_at = now() — le
-- SECURITY DEFINER est sans risque ici (pas d'accès à d'autres
-- tables, pas de lecture de données sensibles).
-- ============================================================


-- ── update_term_sheets_updated_at ────────────────────────────

CREATE OR REPLACE FUNCTION public.update_term_sheets_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ── update_mandates_updated_at ────────────────────────────────

CREATE OR REPLACE FUNCTION public.update_mandates_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
