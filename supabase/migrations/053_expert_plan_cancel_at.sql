-- Migration 053 — Colonne expert_plan_cancel_at sur profiles
--
-- Stocke la date à laquelle l'abonnement expert s'arrêtera définitivement
-- après une résiliation programmée (cancel_at_period_end = true côté Stripe).
-- NULL = pas de résiliation programmée.
-- La fiche reste active et visible jusqu'à cette date.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS expert_plan_cancel_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.expert_plan_cancel_at IS
  'Date de fin effective après résiliation programmée (cancel_at_period_end Stripe). NULL = pas de résiliation en cours.';
