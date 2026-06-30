-- ============================================================
-- AEGRYN — catalog_waitlist
-- Acquéreurs intéressés avant ouverture du catalogue
-- Sensibilité : FAIBLE-MOYENNE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.catalog_waitlist (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT        NOT NULL,
  acquirer_type   TEXT,       -- 'individual' | 'company' | 'fund'
  sectors_interest TEXT[],   -- ex: ['saas','fintech','healthtech']
  capacity_range  TEXT,       -- '<500k' | '500k-2m' | '2m-10m' | '>10m'
  locale          TEXT,
  status          TEXT        DEFAULT 'pending', -- pending | notified | converted
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS catalog_waitlist_created_idx
  ON public.catalog_waitlist (created_at DESC);

ALTER TABLE public.catalog_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "catalog_waitlist_insert_public"
  ON public.catalog_waitlist FOR INSERT
  TO anon, authenticated WITH CHECK (true);

GRANT INSERT ON public.catalog_waitlist TO anon;
GRANT INSERT ON public.catalog_waitlist TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_waitlist TO service_role;
