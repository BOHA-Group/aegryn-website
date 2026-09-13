-- ============================================================
-- AEGRYN — CIFSO Valuation Index : moteur de collecte automatique
--
-- Registre des sources externes (flux officiels ouverts : BCE, Eurostat, BNS) et
-- internes (tables curées, dossiers certifiés) interrogées automatiquement par le
-- cron hebdomadaire, avec statut de chaque collecte. Les noms de sources restent
-- internes : la source affichée aux clients est « Aegryn CIFSO Valuation Index ».
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cifso_index_sources (
  key             TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  kind            TEXT NOT NULL CHECK (kind IN ('official_api','internal_curated','internal_certified','derived')),
  cadence         TEXT NOT NULL DEFAULT 'weekly',
  enabled         BOOLEAN NOT NULL DEFAULT true,
  last_run_at     TIMESTAMPTZ,
  last_status     TEXT CHECK (last_status IN ('ok','error','skipped')),
  last_error      TEXT,
  last_rows       INTEGER NOT NULL DEFAULT 0,
  last_latest_obs TEXT,            -- date de la dernière observation reçue
  consecutive_failures INTEGER NOT NULL DEFAULT 0,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.cifso_index_sources ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cifso_index_sources FROM anon, authenticated;
GRANT ALL ON public.cifso_index_sources TO service_role;

-- Métriques macro collectées automatiquement
ALTER TABLE public.cifso_index_benchmarks DROP CONSTRAINT IF EXISTS cifso_index_benchmarks_metric_check;
ALTER TABLE public.cifso_index_benchmarks ADD CONSTRAINT cifso_index_benchmarks_metric_check CHECK (metric IN (
  'ev_revenue','ev_ebitda','arr_multiple','growth_yoy','nrr','gross_margin','ebitda_margin','rule_of_40',
  'cifso_coeff','cifso_score','dimension_uplift','deal_volume_eur_bn','deal_count',
  'rate_10y','policy_rate','equity_index','gdp_growth','inflation','market_conditions'));
ALTER TABLE public.cifso_index_benchmarks DROP CONSTRAINT IF EXISTS cifso_index_benchmarks_unit_check;
ALTER TABLE public.cifso_index_benchmarks ADD CONSTRAINT cifso_index_benchmarks_unit_check CHECK (unit IN ('x','%','pts','eur_bn','count','index'));

ALTER TABLE public.cifso_index_refresh_log ADD COLUMN IF NOT EXISTS sources_json JSONB;
ALTER TABLE public.cifso_index_refresh_log ADD COLUMN IF NOT EXISTS trigger TEXT NOT NULL DEFAULT 'cron';
