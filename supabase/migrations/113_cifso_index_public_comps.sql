-- ============================================================
-- AEGRYN — CIFSO Valuation Index : comparables cotés et marges sectorielles (sources publiques)
-- Compense les comparables cotés sous licence : registre SEC EDGAR (fondamentaux XBRL, ouvert)
-- et statistiques structurelles Eurostat (taux de marge et productivité par secteur).
-- ============================================================
ALTER TABLE public.cifso_index_benchmarks DROP CONSTRAINT IF EXISTS cifso_index_benchmarks_metric_check;
ALTER TABLE public.cifso_index_benchmarks ADD CONSTRAINT cifso_index_benchmarks_metric_check CHECK (metric IN (
  'ev_revenue','ev_ebitda','arr_multiple','growth_yoy','nrr','gross_margin','ebitda_margin','rule_of_40',
  'cifso_coeff','cifso_score','dimension_uplift','deal_volume_eur_bn','deal_count',
  'rate_10y','policy_rate','equity_index','gdp_growth','inflation','market_conditions',
  'fx_eurchf','lending_rate','ai_adoption','security_risk_assessment','security_tests','security_policy',
  'bankruptcies_yoy','registrations_yoy',
  'public_comps_p_revenue','public_comps_revenue_growth','sector_operating_margin','sector_value_added_per_employee'));
ALTER TABLE public.cifso_index_benchmarks DROP CONSTRAINT IF EXISTS cifso_index_benchmarks_unit_check;
ALTER TABLE public.cifso_index_benchmarks ADD CONSTRAINT cifso_index_benchmarks_unit_check CHECK (unit IN ('x','%','pts','eur_bn','count','index','keur'));
