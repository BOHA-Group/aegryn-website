-- ============================================================
-- AEGRYN — evaluation_tiers
-- Stratification en 3 paliers d'évaluation sur la table assets
-- Migration purement additive — zéro risque sur données existantes
-- Les actifs existants héritent de evaluation_type='full_certification'
-- ============================================================

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS evaluation_type TEXT DEFAULT 'full_certification'
    CHECK (evaluation_type IN ('review_internal', 'review_partner', 'full_certification'));

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS evaluation_fee_amount NUMERIC;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS evaluation_fee_paid BOOLEAN DEFAULT FALSE;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS evaluation_fee_paid_at TIMESTAMPTZ;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS partner_reviewer_type TEXT
    CHECK (partner_reviewer_type IN ('legal', 'accounting', NULL));

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS partner_reviewer_name TEXT;

ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS source_valuation_lead_id UUID
    REFERENCES public.valuation_leads(id);

CREATE INDEX IF NOT EXISTS idx_assets_evaluation_type
  ON public.assets (evaluation_type);

CREATE INDEX IF NOT EXISTS idx_assets_source_lead
  ON public.assets (source_valuation_lead_id);

-- RLS : aucun changement requis
-- Les policies existantes (assets_select_own_seller) couvrent déjà
-- ces nouvelles colonnes (même table, mêmes règles d'accès)
