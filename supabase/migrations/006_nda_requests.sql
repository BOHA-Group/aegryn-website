-- ============================================================
-- AEGRYN — nda_requests
-- Demandes d'accès NDA par les acquéreurs qualifiés
-- Déclenchée depuis /auction/catalog sur chaque actif publié
-- ============================================================

CREATE TABLE IF NOT EXISTS public.nda_requests (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Actif ciblé
  asset_id      UUID        REFERENCES public.assets(id) ON DELETE SET NULL,

  -- Acquéreur
  buyer_email   TEXT        NOT NULL,
  buyer_name    TEXT        NOT NULL,
  buyer_company TEXT,
  buyer_type    TEXT,        -- 'pe', 'strategic', 'family_office', 'individual'
  capacity      TEXT,        -- fourchette budget déclarée

  -- Motivation
  message       TEXT,

  -- Workflow
  status        TEXT        NOT NULL DEFAULT 'pending',
                             -- pending | approved | rejected | nda_sent | nda_signed
  reviewed_by   TEXT,
  reviewed_at   TIMESTAMPTZ,
  nda_sent_at   TIMESTAMPTZ,
  nda_signed_at TIMESTAMPTZ,

  locale        TEXT        DEFAULT 'fr',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS nda_requests_asset_idx  ON public.nda_requests (asset_id);
CREATE INDEX IF NOT EXISTS nda_requests_email_idx  ON public.nda_requests (buyer_email);
CREATE INDEX IF NOT EXISTS nda_requests_status_idx ON public.nda_requests (status);

DROP TRIGGER IF EXISTS nda_requests_updated_at ON public.nda_requests;
CREATE TRIGGER nda_requests_updated_at
  BEFORE UPDATE ON public.nda_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.nda_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nda_requests_insert_public"
  ON public.nda_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin (service_role) : accès total
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nda_requests TO service_role;
GRANT INSERT ON public.nda_requests TO anon, authenticated;
