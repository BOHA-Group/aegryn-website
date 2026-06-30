-- ============================================================
-- AEGRYN — assessment_day_bookings
-- Réservations journées d'expertise gratuites
-- Sensibilité : FAIBLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.assessment_day_bookings (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  email            TEXT        NOT NULL,
  company          TEXT,
  preferred_city   TEXT,       -- 'paris' | 'geneve' | 'amsterdam' | 'online'
  preferred_format TEXT,       -- 'physical' | 'video'
  asset_type       TEXT,       -- 'saas' | 'marketplace' | 'api' | 'other'
  arr_range        TEXT,       -- 'pre_revenue' | '<500k' | '500k-2m' | '2m-10m' | '>10m'
  message          TEXT,
  status           TEXT        DEFAULT 'pending', -- pending | confirmed | completed | cancelled
  locale           TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS assessment_bookings_created_idx
  ON public.assessment_day_bookings (created_at DESC);

CREATE INDEX IF NOT EXISTS assessment_bookings_status_idx
  ON public.assessment_day_bookings (status);

ALTER TABLE public.assessment_day_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "assessment_bookings_insert_public"
  ON public.assessment_day_bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

GRANT INSERT ON public.assessment_day_bookings TO anon;
GRANT INSERT ON public.assessment_day_bookings TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assessment_day_bookings TO service_role;

-- ============================================================
-- AEGRYN — alliance_applications
-- Candidatures partenaires (5 types d'alliance)
-- Sensibilité : FAIBLE
-- ============================================================

CREATE TABLE IF NOT EXISTS public.alliance_applications (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT        NOT NULL,
  alliance_type     TEXT        NOT NULL, -- 'certification' | 'distribution' | 'dealflow' | 'technical' | 'ecosystem'
  country           TEXT,
  description       TEXT,
  email             TEXT        NOT NULL,
  website           TEXT,
  status            TEXT        DEFAULT 'new', -- new | reviewed | accepted | declined
  locale            TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS alliance_applications_type_idx
  ON public.alliance_applications (alliance_type);

CREATE INDEX IF NOT EXISTS alliance_applications_created_idx
  ON public.alliance_applications (created_at DESC);

ALTER TABLE public.alliance_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "alliance_applications_insert_public"
  ON public.alliance_applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

GRANT INSERT ON public.alliance_applications TO anon;
GRANT INSERT ON public.alliance_applications TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alliance_applications TO service_role;
