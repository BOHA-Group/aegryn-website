-- ============================================================
-- AEGRYN — CIFSO Valuation Index : journal des rafraîchissements automatiques
-- Cron hebdomadaire (lundi 06:00 Europe/Zurich) : /api/cron/index-refresh
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cifso_index_refresh_log (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  started_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at   TIMESTAMPTZ,
  status        TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running','ok','error')),
  period        TEXT,
  series_upserted INTEGER NOT NULL DEFAULT 0,
  dimensions_json JSONB,
  error         TEXT
);
ALTER TABLE public.cifso_index_refresh_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cifso_index_refresh_log FROM anon, authenticated;
GRANT ALL ON public.cifso_index_refresh_log TO service_role;
