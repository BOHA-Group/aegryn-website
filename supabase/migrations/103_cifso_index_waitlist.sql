-- ============================================================
-- AEGRYN — cifso_index_waitlist
-- Liste d'attente pour l'accès anticipé au CIFSO Valuation Index
-- Lancement prévu Q1 2027
-- Sensibilité : FAIBLE (email + secteur déclaré, optionnel)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cifso_index_waitlist (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT        NOT NULL UNIQUE,
  org_type     TEXT,        -- 'founder' | 'investor' | 'advisor' | 'other'
  sector       TEXT,        -- cluster_key optionnel
  locale       TEXT,
  source_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cifso_waitlist_email_idx
  ON public.cifso_index_waitlist (email);

CREATE INDEX IF NOT EXISTS cifso_waitlist_created_idx
  ON public.cifso_index_waitlist (created_at DESC);

-- ── RLS ───────────────────────────────────────────────────
ALTER TABLE public.cifso_index_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cifso_waitlist_insert_public"
  ON public.cifso_index_waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "cifso_waitlist_write_service"
  ON public.cifso_index_waitlist
  FOR ALL
  TO service_role
  USING (true);

-- ── Grants PostgREST ──────────────────────────────────────
GRANT INSERT ON public.cifso_index_waitlist TO anon;
GRANT INSERT ON public.cifso_index_waitlist TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cifso_index_waitlist TO service_role;
