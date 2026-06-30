-- ════════════════════════════════════════════════════════════════════════
-- 014_benchmark_data.sql
--
-- Table d'ancrage marché pour le calculateur /valuation
-- Données sources : Software Equity Group, Aventis Advisors, Synergy AI,
--                   Oaklin/FT Partners, AEGRYN Market Analysis
-- Pondération calculateur : 60% benchmark / 40% grade interne
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS benchmark_data (
  id                UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  category          TEXT    NOT NULL
                            CHECK (category IN (
                              'saas_vertical', 'saas_horizontal', 'ai_native',
                              'marketplace', 'mobile_app', 'fintech', 'legaltech',
                              'healthtech', 'regtech', 'web3'
                            )),
  profile_tier      TEXT    NOT NULL
                            CHECK (profile_tier IN ('top', 'strong', 'median', 'weak')),
  nrr_min           NUMERIC NOT NULL,   -- Net Revenue Retention minimum %
  growth_min        NUMERIC NOT NULL,   -- Croissance ARR YoY minimum %
  gross_margin_min  NUMERIC NOT NULL,   -- Marge brute minimum %
  multiple_low      NUMERIC NOT NULL,   -- Multiple ARR bas de fourchette
  multiple_high     NUMERIC NOT NULL,   -- Multiple ARR haut de fourchette
  source            TEXT    NOT NULL,
  source_date       TEXT    NOT NULL,   -- ex : "2026-Q1"
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_benchmark_category_tier
  ON benchmark_data(category, profile_tier);

-- ── Row-Level Security ────────────────────────────────────────────────────
ALTER TABLE benchmark_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_benchmark" ON benchmark_data;
DROP POLICY IF EXISTS "admin_write_benchmark"  ON benchmark_data;

-- Lecture publique — données de marché non sensibles
CREATE POLICY "public_read_benchmark"
  ON benchmark_data FOR SELECT
  TO anon
  USING (true);

-- Écriture admin uniquement
CREATE POLICY "admin_write_benchmark"
  ON benchmark_data FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Données initiales ─────────────────────────────────────────────────────
INSERT INTO benchmark_data
  (category, profile_tier, nrr_min, growth_min, gross_margin_min,
   multiple_low, multiple_high, source, source_date)
VALUES
  ('saas_vertical',   'top',    110, 25, 75, 10.0, 14.0, 'Software Equity Group', '2026-Q1'),
  ('saas_vertical',   'strong', 105, 15, 65,  6.0,  9.0, 'Software Equity Group', '2026-Q1'),
  ('saas_vertical',   'median', 100, 10, 60,  4.0,  6.0, 'Aventis Advisors',      '2026-Q1'),
  ('saas_vertical',   'weak',    90,  0, 50,  1.5,  3.0, 'Aventis Advisors',      '2026-Q1'),
  ('saas_horizontal', 'top',    110, 25, 70,  8.0, 12.0, 'Software Equity Group', '2026-Q1'),
  ('saas_horizontal', 'strong', 105, 15, 62,  5.0,  8.0, 'Software Equity Group', '2026-Q1'),
  ('saas_horizontal', 'median', 100, 10, 55,  3.1,  4.5, 'Aventis Advisors',      '2026-Q1'),
  ('saas_horizontal', 'weak',    90,  0, 45,  1.2,  2.5, 'Aventis Advisors',      '2026-Q1'),
  ('ai_native',       'top',    110, 40, 70, 15.0, 25.0, 'Synergy AI',            '2026'),
  ('ai_native',       'strong', 105, 25, 65,  9.0, 14.0, 'Synergy AI',            '2026'),
  ('ai_native',       'median', 100, 15, 60,  5.0,  8.0, 'Synergy AI',            '2026'),
  ('ai_native',       'weak',    90,  5, 50,  2.0,  4.0, 'Synergy AI',            '2026'),
  ('marketplace',     'top',    110, 30, 55,  5.0,  8.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('marketplace',     'median',  95, 15, 40,  2.5,  4.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('marketplace',     'weak',    85,  5, 30,  1.0,  2.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('mobile_app',      'top',    105, 20, 65,  4.0,  7.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('mobile_app',      'median',  95, 10, 60,  2.0,  3.5, 'AEGRYN Market Analysis','2026-Q1'),
  ('mobile_app',      'weak',    85,  0, 50,  0.8,  1.5, 'AEGRYN Market Analysis','2026-Q1'),
  ('fintech',         'top',    110, 30, 65,  8.0, 12.0, 'Oaklin/FT Partners',    '2026-Q1'),
  ('fintech',         'strong', 105, 20, 58,  5.0,  8.0, 'Oaklin/FT Partners',    '2026-Q1'),
  ('fintech',         'median', 100, 10, 55,  3.5,  5.5, 'Oaklin/FT Partners',    '2026-Q1'),
  ('fintech',         'weak',    90,  0, 45,  1.5,  2.5, 'Oaklin/FT Partners',    '2026-Q1'),
  ('legaltech',       'top',    110, 25, 70,  9.0, 13.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('legaltech',       'strong', 105, 15, 63,  6.0,  9.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('legaltech',       'median', 100, 10, 60,  4.0,  6.5, 'AEGRYN Market Analysis','2026-Q1'),
  ('legaltech',       'weak',    90,  0, 50,  1.5,  3.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('regtech',         'top',    110, 30, 72, 10.0, 15.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('regtech',         'median', 100, 12, 62,  5.0,  8.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('healthtech',      'top',    108, 25, 68,  8.0, 12.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('healthtech',      'median', 100, 12, 60,  4.0,  6.5, 'AEGRYN Market Analysis','2026-Q1'),
  ('web3',            'top',    105, 50, 60, 12.0, 20.0, 'AEGRYN Market Analysis','2026-Q1'),
  ('web3',            'median', 100, 20, 50,  4.0,  8.0, 'AEGRYN Market Analysis','2026-Q1')
ON CONFLICT (category, profile_tier) DO UPDATE SET
  nrr_min          = EXCLUDED.nrr_min,
  growth_min       = EXCLUDED.growth_min,
  gross_margin_min = EXCLUDED.gross_margin_min,
  multiple_low     = EXCLUDED.multiple_low,
  multiple_high    = EXCLUDED.multiple_high,
  source           = EXCLUDED.source,
  source_date      = EXCLUDED.source_date,
  updated_at       = now();

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
