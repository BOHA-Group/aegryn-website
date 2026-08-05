-- Migration 058 — Demandes de mise au catalogue + Factures AEGRYN
-- Objectif :
--   1. Tracer les demandes d'acceptation catalogue (full_certification + accord frais CHF 2000)
--   2. Permettre à l'admin de créer/éditer/télécharger des factures liées à ces demandes

-- ── 1. Table catalogue_requests ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.catalogue_requests (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id         UUID        REFERENCES public.assets(id) ON DELETE SET NULL,
  seller_uid       UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  seller_email     TEXT        NOT NULL,
  seller_name      TEXT        NOT NULL,
  asset_name       TEXT        NOT NULL,
  -- Accord explicite du cédant
  catalogue_agreed         BOOLEAN NOT NULL DEFAULT false,
  publication_fee_agreed   BOOLEAN NOT NULL DEFAULT false,  -- frais CHF 2000
  -- Statut de la demande
  status           TEXT        NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','invoice_sent','fee_received','admitted','rejected')),
  admin_note       TEXT,
  -- Délais contractuels
  -- Admission = J0, catalogue ouvert à J+15, visible acquéreurs à J+45
  admitted_at        TIMESTAMPTZ,
  catalogue_open_at  TIMESTAMPTZ,   -- calculé par trigger : admitted_at + 15 jours
  buyer_visible_at   TIMESTAMPTZ,   -- calculé par trigger : admitted_at + 45 jours
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cat_req_seller_uid   ON public.catalogue_requests(seller_uid);
CREATE INDEX IF NOT EXISTS idx_cat_req_asset_id     ON public.catalogue_requests(asset_id);
CREATE INDEX IF NOT EXISTS idx_cat_req_status       ON public.catalogue_requests(status);

-- Trigger : updated_at + calcul des délais catalogue
CREATE OR REPLACE FUNCTION trg_fn_catalogue_requests()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  IF NEW.admitted_at IS NOT NULL THEN
    NEW.catalogue_open_at = NEW.admitted_at + INTERVAL '15 days';
    NEW.buyer_visible_at  = NEW.admitted_at + INTERVAL '45 days';
  ELSE
    NEW.catalogue_open_at = NULL;
    NEW.buyer_visible_at  = NULL;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_cat_req_updated_at
  BEFORE INSERT OR UPDATE ON public.catalogue_requests
  FOR EACH ROW EXECUTE FUNCTION trg_fn_catalogue_requests();

-- ── 2. Table invoices ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.invoices (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Référence
  invoice_number      TEXT        UNIQUE NOT NULL,
  catalogue_request_id UUID       REFERENCES public.catalogue_requests(id) ON DELETE SET NULL,
  asset_id            UUID        REFERENCES public.assets(id) ON DELETE SET NULL,
  seller_uid          UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  -- Coordonnées destinataire (pré-rempli, modifiable par admin)
  recipient_name      TEXT        NOT NULL,
  recipient_email     TEXT        NOT NULL,
  recipient_address   TEXT,
  recipient_company   TEXT,
  recipient_vat_num   TEXT,
  -- Lignes de facturation (JSONB : [{description, unit, qty, unit_price_ht}])
  line_items          JSONB       NOT NULL DEFAULT '[]',
  -- Montants
  subtotal_ht         NUMERIC(12,2) NOT NULL DEFAULT 0,
  vat_rate            NUMERIC(5,2)  NOT NULL DEFAULT 0,   -- ex: 8.1 pour TVA CH
  vat_amount          NUMERIC(12,2) NOT NULL DEFAULT 0,
  total_ttc           NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency            TEXT        NOT NULL DEFAULT 'CHF',
  -- RIB AEGRYN (pré-rempli depuis env ou saisie admin)
  iban                TEXT,
  bic                 TEXT,
  bank_name           TEXT,
  account_holder      TEXT,
  -- Statut
  status              TEXT        NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft','sent','paid','cancelled')),
  due_date            DATE,
  paid_at             TIMESTAMPTZ,
  -- PDF stocké dans Supabase Storage
  pdf_storage_path    TEXT,
  -- Dates
  issued_at           DATE        NOT NULL DEFAULT CURRENT_DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by_admin    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_seller_uid      ON public.invoices(seller_uid);
CREATE INDEX IF NOT EXISTS idx_invoices_cat_req_id      ON public.invoices(catalogue_request_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status          ON public.invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_issued_at       ON public.invoices(issued_at DESC);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoices_updated_at();

-- Séquence pour numérotation facture (YYYY-NNNN)
CREATE SEQUENCE IF NOT EXISTS invoice_seq START 1;

-- ── 3. RLS ───────────────────────────────────────────────────────────────────

ALTER TABLE public.catalogue_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- catalogue_requests : cédant lit les siennes
CREATE POLICY "cat_req_seller_read" ON public.catalogue_requests FOR SELECT
  TO authenticated
  USING (seller_uid = auth.uid());

-- catalogue_requests : cédant peut insérer (via API route, service_role)
-- Gestion via service_role uniquement (API route)

-- invoices : cédant lit les siennes
CREATE POLICY "invoices_seller_read" ON public.invoices FOR SELECT
  TO authenticated
  USING (seller_uid = auth.uid());

-- Grants service_role (admin)
GRANT ALL ON public.catalogue_requests TO service_role;
GRANT ALL ON public.invoices TO service_role;
GRANT USAGE ON SEQUENCE invoice_seq TO service_role;
GRANT SELECT ON public.catalogue_requests TO authenticated;
GRANT SELECT ON public.invoices TO authenticated;
