-- ============================================================
-- AEGRYN — valuation_leads.industry
-- Ajoute l'industrie CIFSO déclarée (5 clusters, lib/indexTaxonomy.ts) à l'estimation
-- libre : détermine désormais le multiple de marché appliqué (facteur relatif par
-- industrie, cf. lib/cifsoIndex.ts industryFactor) et sert à la qualification du lead.
-- ============================================================

ALTER TABLE public.valuation_leads
  ADD COLUMN IF NOT EXISTS industry TEXT;  -- 'tech_innovation' | 'finance_capital' | 'sante_sciences' | 'industrie_infra' | 'commerce_services'

CREATE INDEX IF NOT EXISTS valuation_leads_industry_idx
  ON public.valuation_leads (industry);
