-- ============================================================
-- AEGRYN — Valorisation indicative CIFSO 5000 (complément quantitatif au grade)
--
-- À la publication du grade, le moteur traduit le score CIFSO en fourchette
-- de valeur d'entreprise à partir des multiples de marché par cluster
-- (cifso_market_multiples) ajustés sur les cinq dimensions (lib/cifsoValuation).
-- Résultat stocké sur le dossier et sur l'évaluation publiée (audit trail).
-- Visible du client uniquement après publication ; jamais public.
-- ============================================================
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS valuation_cluster TEXT
    CHECK (valuation_cluster IN ('tech_innovation','finance_capital','sante_sciences','industrie_infra','commerce_services')),
  ADD COLUMN IF NOT EXISTS valuation_json    JSONB,
  ADD COLUMN IF NOT EXISTS valuation_at      TIMESTAMPTZ;

ALTER TABLE public.grade_assessments
  ADD COLUMN IF NOT EXISTS valuation_json    JSONB;

COMMENT ON COLUMN public.assets.valuation_json IS
  'Valorisation indicative CIFSO (lib/cifsoValuation) calculée à la publication du grade : multiples, fourchette EV, impacts par dimension, potentiel.';
