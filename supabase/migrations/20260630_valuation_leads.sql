-- ============================================================
-- AEGRYN — valuation_leads
-- Prospects ayant utilisé /valuation et laissé leur email
-- Sensibilité : MOYENNE (email + données financières déclarées,
--               non vérifiées, pas de compte associé)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.valuation_leads (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT        NOT NULL,

  -- Données financières déclarées (non vérifiées)
  arr                   NUMERIC,
  growth_yoy            NUMERIC,
  churn_monthly         NUMERIC,
  nrr                   NUMERIC,
  gross_margin          NUMERIC,
  seniority             TEXT,       -- 'under1' | 'one_to_three' | 'above3'
  arr_audited           TEXT,       -- 'yes' | 'no' | 'not_yet'

  -- Résultat du simulateur
  estimated_grade       TEXT,       -- '★' | 'AAA' | 'AA' | 'A' | 'B' | 'NG'
  score_total           INTEGER,
  score_breakdown       JSONB,      -- {finance, code, ip, security}
  valuation_low         NUMERIC,
  valuation_high        NUMERIC,
  valuation_median      NUMERIC,
  pre_revenue           BOOLEAN     DEFAULT FALSE,

  -- Suivi commercial
  wants_advisor_contact BOOLEAN     DEFAULT FALSE,
  status                TEXT        DEFAULT 'new',   -- 'new' | 'contacted' | 'submitted' | 'closed'
  internal_notes        TEXT,

  -- Metadata
  locale                TEXT,
  source_url            TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les requêtes admin les plus fréquentes
CREATE INDEX IF NOT EXISTS valuation_leads_grade_idx
  ON public.valuation_leads (estimated_grade);

CREATE INDEX IF NOT EXISTS valuation_leads_created_idx
  ON public.valuation_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS valuation_leads_status_idx
  ON public.valuation_leads (status);

-- ── RLS ───────────────────────────────────────────────────
ALTER TABLE public.valuation_leads ENABLE ROW LEVEL SECURITY;

-- INSERT public : n'importe qui peut soumettre (pas de compte requis)
CREATE POLICY "valuation_leads_insert_public"
  ON public.valuation_leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- SELECT admin uniquement (service_role bypass RLS — lecture côté API admin)
-- Aucune policy SELECT public → seul service_role peut lire
-- (le client admin utilise createServiceClient() qui bypasse RLS)

-- UPDATE admin uniquement (pour marquer contacted / submitted)
CREATE POLICY "valuation_leads_update_service"
  ON public.valuation_leads
  FOR UPDATE
  TO service_role
  USING (true);

-- ── updated_at auto ───────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_valuation_leads_updated_at ON public.valuation_leads;
CREATE TRIGGER set_valuation_leads_updated_at
  BEFORE UPDATE ON public.valuation_leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
