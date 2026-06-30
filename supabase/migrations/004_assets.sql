-- ============================================================
-- AEGRYN — assets
-- Actifs soumis à certification via /grade/submit
-- Sensibilité : HAUTE (données confidentielles vendeur)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.assets (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identité du vendeur
  seller_name         TEXT        NOT NULL,
  seller_email        TEXT        NOT NULL,
  company_name        TEXT,
  website             TEXT,

  -- Données déclaratives soumission
  asset_type          TEXT,       -- 'saas' | 'marketplace' | 'api' | 'platform' | 'other'
  sector              TEXT,
  arr                 NUMERIC,
  arr_growth          NUMERIC,    -- % croissance YoY déclaré
  team_size           INTEGER,
  founded_year        INTEGER,
  description         TEXT,
  asking_price        NUMERIC,    -- prix demandé (optionnel)
  locale              TEXT,

  -- Grade officiel (renseigné par analyste AEGRYN)
  official_grade      TEXT,       -- '★' | 'AAA' | 'AA' | 'A' | 'B' | 'NG'
  score_code          INTEGER,    -- 0-25
  score_ip            INTEGER,    -- 0-25
  score_finance       INTEGER,    -- 0-25
  score_security      INTEGER,    -- 0-25
  score_total         INTEGER     GENERATED ALWAYS AS (
                        COALESCE(score_code, 0) +
                        COALESCE(score_ip, 0) +
                        COALESCE(score_finance, 0) +
                        COALESCE(score_security, 0)
                      ) STORED,

  -- Co-signataires
  cosigner_legal      TEXT,       -- Nom cabinet juridique
  cosigner_legal_date DATE,
  cosigner_account    TEXT,       -- Nom expert-comptable
  cosigner_account_date DATE,
  cosigner_cyber      TEXT,       -- Nom partenaire cyber (optionnel)
  cosigner_cyber_date DATE,

  -- KRYV Protocol
  kryv_hash           TEXT,       -- Hash enregistré manuellement pour le MVP

  -- Publication catalogue
  public_summary      TEXT,       -- Affiché anonymisé sur /auction/catalog
  internal_notes      TEXT,       -- Jamais visible client

  -- Workflow
  status              TEXT        DEFAULT 'submitted',
  -- submitted → under_review → graded → published → sold | withdrawn

  -- Timestamps
  submitted_at        TIMESTAMPTZ DEFAULT NOW(),
  graded_at           TIMESTAMPTZ,
  published_at        TIMESTAMPTZ,
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS assets_status_idx   ON public.assets (status);
CREATE INDEX IF NOT EXISTS assets_grade_idx    ON public.assets (official_grade);
CREATE INDEX IF NOT EXISTS assets_seller_idx   ON public.assets (seller_email);
CREATE INDEX IF NOT EXISTS assets_submitted_idx ON public.assets (submitted_at DESC);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS assets_updated_at ON public.assets;
CREATE TRIGGER assets_updated_at
  BEFORE UPDATE ON public.assets
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Vendeurs : insert public (soumission /grade/submit)
CREATE POLICY "assets_insert_public"
  ON public.assets FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Admin : lecture + modification complète via service_role
GRANT INSERT ON public.assets TO anon;
GRANT INSERT ON public.assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO service_role;
