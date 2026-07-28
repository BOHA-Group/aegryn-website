-- ── Migration 044 — profiles : champs Stripe abonnement expert ──────────────
--
-- Ajoute sur la table profiles :
--   • stripe_customer_id      TEXT — ID customer Stripe (réutilisé entre sessions)
--   • stripe_subscription_id  TEXT — ID subscription Stripe active
--   • expert_plan_end         TIMESTAMPTZ — fin de la période courante (renewal ou expiry)
--
-- La colonne expert_plan (TEXT) et expert_plan_start (TIMESTAMPTZ) existent déjà
-- (migration 041_expert_network.sql).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id     TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS expert_plan_end        TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.stripe_customer_id     IS 'ID customer Stripe — créé lors du premier abonnement expert.';
COMMENT ON COLUMN public.profiles.stripe_subscription_id IS 'ID de la subscription Stripe expert active.';
COMMENT ON COLUMN public.profiles.expert_plan_end        IS 'Date de fin de la période d''abonnement expert en cours.';
