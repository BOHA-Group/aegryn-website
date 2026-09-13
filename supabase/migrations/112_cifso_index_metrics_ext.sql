-- ============================================================
-- AEGRYN — CIFSO Valuation Index : métriques collectées (Europe et Suisse en priorité)
-- Adoption de l'IA et mesures de sécurité des entreprises (dimension S), défaillances et
-- créations d'entreprises (dimension F), change EUR/CHF, taux de crédit aux entreprises.
-- ============================================================
ALTER TABLE public.cifso_index_benchmarks DROP CONSTRAINT IF EXISTS cifso_index_benchmarks_metric_check;
ALTER TABLE public.cifso_index_benchmarks ADD CONSTRAINT cifso_index_benchmarks_metric_check CHECK (metric IN (
  'ev_revenue','ev_ebitda','arr_multiple','growth_yoy','nrr','gross_margin','ebitda_margin','rule_of_40',
  'cifso_coeff','cifso_score','dimension_uplift','deal_volume_eur_bn','deal_count',
  'rate_10y','policy_rate','equity_index','gdp_growth','inflation','market_conditions',
  'fx_eurchf','lending_rate','ai_adoption','security_risk_assessment','security_tests','security_policy',
  'bankruptcies_yoy','registrations_yoy'));
ALTER TABLE public.cifso_index_sources ADD COLUMN IF NOT EXISTS region TEXT CHECK (region IN ('CH','EU','INTL','internal'));
