-- ============================================================
-- AEGRYN — CIFSO Valuation Index : moteur de benchmarks
--
-- Série normalisée (scope × métrique × période) alimentée par les données déjà curées
-- par Aegryn (cifso_market_multiples, benchmark_data) et, à terme, par les dossiers
-- certifiés (médianes par dimension et par grade). Les colonnes source_internal et
-- internal_notes ne sont JAMAIS exposées : la source affichée aux clients est
-- « Aegryn CIFSO Valuation Index ».
-- Accès : service_role uniquement (API /api/valuation/index en mode aperçu ou abonné).
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cifso_index_benchmarks (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type      TEXT NOT NULL CHECK (scope_type IN ('market','cluster','vertical','grade','dimension')),
  scope_key       TEXT NOT NULL,
  metric          TEXT NOT NULL CHECK (metric IN (
                    'ev_revenue','ev_ebitda','arr_multiple','growth_yoy','nrr','gross_margin',
                    'ebitda_margin','rule_of_40','cifso_coeff','cifso_score','dimension_uplift',
                    'deal_volume_eur_bn','deal_count')),
  period          TEXT NOT NULL,                 -- ex. '2026-Q2'
  p25             NUMERIC,
  p50             NUMERIC,
  p75             NUMERIC,
  sample_size     INTEGER,
  unit            TEXT NOT NULL DEFAULT 'x' CHECK (unit IN ('x','%','pts','eur_bn','count')),
  is_public       BOOLEAN NOT NULL DEFAULT false, -- visible en aperçu (accès libre)
  is_active       BOOLEAN NOT NULL DEFAULT true,
  source_internal TEXT,                          -- jamais exposé
  internal_notes  TEXT,                          -- jamais exposé
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (scope_type, scope_key, metric, period)
);

ALTER TABLE public.cifso_index_benchmarks ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.cifso_index_benchmarks FROM anon, authenticated;
GRANT ALL ON public.cifso_index_benchmarks TO service_role;

COMMENT ON TABLE public.cifso_index_benchmarks IS
  'CIFSO Valuation Index : séries de benchmarks agrégées (p25/p50/p75) par cluster, vertical, grade et dimension. Sources internes non exposées.';

-- ── Seed : clusters (EV/Revenue, EV/EBITDA, coefficients CIFSO) depuis cifso_market_multiples
INSERT INTO public.cifso_index_benchmarks (scope_type, scope_key, metric, period, p25, p50, p75, unit, is_public, source_internal)
SELECT 'cluster', cluster_key, 'ev_revenue', reference_period,
       ev_revenue_low, round((ev_revenue_low + ev_revenue_high) / 2, 2), ev_revenue_high, 'x',
       cluster_key = 'tech_innovation', 'cifso_market_multiples'
FROM public.cifso_market_multiples WHERE is_active
ON CONFLICT (scope_type, scope_key, metric, period) DO UPDATE SET p25 = EXCLUDED.p25, p50 = EXCLUDED.p50, p75 = EXCLUDED.p75, updated_at = now();

INSERT INTO public.cifso_index_benchmarks (scope_type, scope_key, metric, period, p25, p50, p75, unit, is_public, source_internal)
SELECT 'cluster', cluster_key, 'ev_ebitda', reference_period,
       ev_ebitda_low, round((ev_ebitda_low + ev_ebitda_high) / 2, 1), ev_ebitda_high, 'x',
       false, 'cifso_market_multiples'
FROM public.cifso_market_multiples WHERE is_active AND ev_ebitda_low IS NOT NULL
ON CONFLICT (scope_type, scope_key, metric, period) DO UPDATE SET p25 = EXCLUDED.p25, p50 = EXCLUDED.p50, p75 = EXCLUDED.p75, updated_at = now();

-- Coefficient CIFSO par grade (score 40 / 60 / 80) et par cluster
INSERT INTO public.cifso_index_benchmarks (scope_type, scope_key, metric, period, p25, p50, p75, unit, is_public, source_internal)
SELECT 'cluster', cluster_key, 'cifso_coeff', reference_period,
       cifso_coeff_score_40, cifso_coeff_score_60, cifso_coeff_score_80, 'x',
       true, 'cifso_market_multiples'
FROM public.cifso_market_multiples WHERE is_active
ON CONFLICT (scope_type, scope_key, metric, period) DO UPDATE SET p25 = EXCLUDED.p25, p50 = EXCLUDED.p50, p75 = EXCLUDED.p75, updated_at = now();

-- ── Seed : verticaux (multiple ARR) depuis benchmark_data
--    p25 = bas du profil médian, p50 = milieu du profil médian, p75 = bas du profil top
INSERT INTO public.cifso_index_benchmarks (scope_type, scope_key, metric, period, p25, p50, p75, unit, is_public, source_internal)
SELECT 'vertical', m.category, 'arr_multiple', m.source_date,
       m.multiple_low, round((m.multiple_low + m.multiple_high) / 2, 2),
       COALESCE(t.multiple_low, m.multiple_high), 'x',
       m.category = 'saas_horizontal', 'benchmark_data'
FROM public.benchmark_data m
LEFT JOIN public.benchmark_data t ON t.category = m.category AND t.profile_tier = 'top'
WHERE m.profile_tier = 'median'
ON CONFLICT (scope_type, scope_key, metric, period) DO UPDATE SET p25 = EXCLUDED.p25, p50 = EXCLUDED.p50, p75 = EXCLUDED.p75, updated_at = now();

-- Seuils de qualité par vertical (NRR, croissance, marge brute minimales du profil médian)
INSERT INTO public.cifso_index_benchmarks (scope_type, scope_key, metric, period, p25, p50, p75, unit, is_public, source_internal)
SELECT 'vertical', m.category, x.metric, m.source_date, x.w, x.m50, x.t, '%', false, 'benchmark_data'
FROM public.benchmark_data m
JOIN public.benchmark_data w ON w.category = m.category AND w.profile_tier = 'weak'
JOIN public.benchmark_data t ON t.category = m.category AND t.profile_tier = 'top'
CROSS JOIN LATERAL (VALUES
  ('nrr',          w.nrr_min,          m.nrr_min,          t.nrr_min),
  ('growth_yoy',   w.growth_min,       m.growth_min,       t.growth_min),
  ('gross_margin', w.gross_margin_min, m.gross_margin_min, t.gross_margin_min)
) AS x(metric, w, m50, t)
WHERE m.profile_tier = 'median'
ON CONFLICT (scope_type, scope_key, metric, period) DO UPDATE SET p25 = EXCLUDED.p25, p50 = EXCLUDED.p50, p75 = EXCLUDED.p75, updated_at = now();
