-- ============================================================
-- AEGRYN — cifso_market_multiples
-- Base interne des multiples de transaction EU lower mid-market
-- (€5M–€300M). Réactualisée tous les lundis à 6h00 (cron admin).
-- Sources : Argos Wityu, France Invest, Dealsuite, Aventis,
--           complétée par les certifications CIFSO 5000 (anonymisées).
-- RGPD/LPD : aucune donnée personnelle dans cette table.
-- Sensibilité : FAIBLE (données agrégées, aucun client nommé)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.cifso_market_multiples (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Cluster sectoriel (5 clusters CIFSO)
  cluster_key     TEXT        NOT NULL,     -- 'finance_capital' | 'sante_sciences' | 'industrie_infra' | 'commerce_services' | 'tech_innovation'
  cluster_label   JSONB       NOT NULL,     -- {"fr": "Finance & Capital", "en": "Finance & Capital", ...}

  -- Multiples médians de transaction
  ev_revenue_low  NUMERIC     NOT NULL,     -- ex: 2.8
  ev_revenue_high NUMERIC     NOT NULL,     -- ex: 4.1
  ev_ebitda_low   NUMERIC     NOT NULL,     -- ex: 8
  ev_ebitda_high  NUMERIC     NOT NULL,     -- ex: 12

  -- Corrélation Score CIFSO → Multiple (régression interne)
  -- Coefficient multiplicateur appliqué au multiple médian
  -- selon le score CIFSO de l'organisation
  cifso_coeff_score_40  NUMERIC DEFAULT 0.65,  -- score 40-50 → multiple × 0.65
  cifso_coeff_score_60  NUMERIC DEFAULT 0.85,  -- score 60-70 → multiple × 0.85
  cifso_coeff_score_80  NUMERIC DEFAULT 1.10,  -- score 80-90 → multiple × 1.10

  -- Métadonnées
  reference_period TEXT       NOT NULL,     -- ex: 'Q2 2026'
  sample_size      INTEGER,                 -- nb transactions anonymisées incluses
  note             TEXT,                    -- note éditoriale interne
  is_active        BOOLEAN    DEFAULT TRUE,
  updated_at       TIMESTAMPTZ DEFAULT NOW(),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS cifso_multiples_cluster_idx
  ON public.cifso_market_multiples (cluster_key);

CREATE INDEX IF NOT EXISTS cifso_multiples_active_idx
  ON public.cifso_market_multiples (is_active);

-- ── RLS ───────────────────────────────────────────────────
ALTER TABLE public.cifso_market_multiples ENABLE ROW LEVEL SECURITY;

-- SELECT public : données agrégées librement lisibles (pas de données perso)
CREATE POLICY "cifso_multiples_select_public"
  ON public.cifso_market_multiples
  FOR SELECT
  TO anon, authenticated
  USING (is_active = TRUE);

-- INSERT/UPDATE/DELETE : service_role uniquement (admin + cron)
CREATE POLICY "cifso_multiples_write_service"
  ON public.cifso_market_multiples
  FOR ALL
  TO service_role
  USING (true);

-- ── Grants PostgREST ──────────────────────────────────────
GRANT SELECT ON public.cifso_market_multiples TO anon;
GRANT SELECT ON public.cifso_market_multiples TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cifso_market_multiples TO service_role;

-- ── updated_at auto ───────────────────────────────────────
DROP TRIGGER IF EXISTS set_cifso_multiples_updated_at ON public.cifso_market_multiples;
CREATE TRIGGER set_cifso_multiples_updated_at
  BEFORE UPDATE ON public.cifso_market_multiples
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ── Seed initial Q2 2026 ──────────────────────────────────
-- Données sources : Argos Wityu Mid-Market H1 2026, France Invest PE 2025,
-- Dealsuite M&A Monitor Q2 2026, Aventis Advisors Tech M&A 2025.
-- Valeurs = fourchettes médianes des transactions lower mid-market EU (€5M–€300M).
-- Ces données ne constituent pas une évaluation. Source : Aegryn CIFSO Valuation Index.

INSERT INTO public.cifso_market_multiples
  (cluster_key, cluster_label, ev_revenue_low, ev_revenue_high, ev_ebitda_low, ev_ebitda_high, cifso_coeff_score_40, cifso_coeff_score_60, cifso_coeff_score_80, reference_period, sample_size, note)
VALUES
  (
    'finance_capital',
    '{"fr":"Finance & Capital","en":"Finance & Capital","de":"Finanzen & Kapital","es":"Finanzas & Capital","it":"Finanza & Capitale","nl":"Finance & Kapitaal"}',
    2.8, 4.1, 8, 12, 0.62, 0.87, 1.12,
    'Q2 2026', 42,
    'Inclut asset management, fintech, private credit, family offices'
  ),
  (
    'sante_sciences',
    '{"fr":"Santé & Sciences","en":"Health & Sciences","de":"Gesundheit & Wissenschaften","es":"Salud & Ciencias","it":"Salute & Scienze","nl":"Gezondheid & Wetenschappen"}',
    2.1, 3.8, 9, 14, 0.60, 0.88, 1.15,
    'Q2 2026', 28,
    'Inclut medtech, biotech, CDMO, diagnostics, santé numérique'
  ),
  (
    'industrie_infra',
    '{"fr":"Industrie & Infrastructure","en":"Industry & Infrastructure","de":"Industrie & Infrastruktur","es":"Industria & Infraestructura","it":"Industria & Infrastrutture","nl":"Industrie & Infrastructuur"}',
    0.8, 1.4, 6, 9, 0.70, 0.90, 1.08,
    'Q2 2026', 65,
    'Inclut manufacturing, distribution, BTP, énergie, logistique'
  ),
  (
    'commerce_services',
    '{"fr":"Commerce & Services","en":"Commerce & Services","de":"Handel & Dienstleistungen","es":"Comercio & Servicios","it":"Commercio & Servizi","nl":"Handel & Diensten"}',
    0.6, 1.2, 5, 8, 0.68, 0.88, 1.07,
    'Q2 2026', 78,
    'Inclut retail, restauration, services aux entreprises, RH, conseil'
  ),
  (
    'tech_innovation',
    '{"fr":"Tech & Innovation","en":"Tech & Innovation","de":"Tech & Innovation","es":"Tech & Innovación","it":"Tech & Innovazione","nl":"Tech & Innovatie"}',
    3.1, 5.2, 10, 16, 0.58, 0.82, 1.18,
    'Q2 2026', 54,
    'Inclut SaaS, marketplaces, IA/ML, cybersécurité, edtech'
  )
ON CONFLICT DO NOTHING;
