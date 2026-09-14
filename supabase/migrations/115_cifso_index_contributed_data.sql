-- ============================================================
-- AEGRYN — cifso_index_contributed_data
-- Contributions anonymisées issues du test gratuit /valuation/index (étape 1 du parcours
-- « Index non abonné ») : alimentent automatiquement le CIFSO Valuation Index (dimensions
-- C/I/F/S/O, multiples par vertical) une fois un échantillon minimal atteint. AUCUN nom
-- d'entreprise, AUCUN email : uniquement les données déclarées par industrie/vertical.
-- Sensibilité : FAIBLE (anonyme par construction — ne jamais y ajouter de colonne identifiante).
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cifso_index_contributed_data (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Segmentation (jamais l'entreprise elle-même)
  industry          TEXT        NOT NULL,   -- ClusterKey : 'tech_innovation' | 'finance_capital' | 'sante_sciences' | 'industrie_infra' | 'commerce_services'
  vertical          TEXT,                   -- clé vertical (lib/indexTaxonomy.ts, INDEX_VERTICALS), nullable si non renseigné

  -- Score CIFSO déclaré (0-20 par dimension, 0-100 total) et grade dérivé
  score_capital     INTEGER,
  score_integrity   INTEGER,
  score_finance     INTEGER,
  score_security    INTEGER,
  score_org         INTEGER,
  score_total       INTEGER,
  grade             TEXT,       -- '★' | 'AAA' | 'AA' | 'A' | 'B' | 'NG'

  -- Métriques financières déclarées (jamais associées à un nom d'entreprise)
  arr               NUMERIC,
  growth_yoy        NUMERIC,
  churn_monthly     NUMERIC,
  nrr               NUMERIC,
  gross_margin      NUMERIC,
  ebitda_margin     NUMERIC,

  -- Metadata non identifiante
  locale            TEXT,
  source_url        TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cifso_index_contributed_data_industry_idx
  ON public.cifso_index_contributed_data (industry);
CREATE INDEX IF NOT EXISTS cifso_index_contributed_data_vertical_idx
  ON public.cifso_index_contributed_data (vertical);

-- ── RLS : écriture via service_role uniquement (route API), jamais côté client ──
ALTER TABLE public.cifso_index_contributed_data ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cifso_index_contributed_data_write_service"
  ON public.cifso_index_contributed_data
  FOR ALL
  TO service_role
  USING (true);

-- ── Grants PostgREST ──────────────────────────────────────
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cifso_index_contributed_data TO service_role;
