-- Migration 049 — Table commission_tiers
-- Grille dégressive AEGRYN — configurable sans déploiement
-- Chaque tranche : min_amount (inclusif), max_amount (NULL = illimité), rate (décimal), minimum_fee

CREATE TABLE IF NOT EXISTS commission_tiers (
  id           SERIAL PRIMARY KEY,
  min_amount   NUMERIC(14,2) NOT NULL,
  max_amount   NUMERIC(14,2),            -- NULL = pas de plafond (dernière tranche)
  rate         NUMERIC(5,4) NOT NULL,    -- ex: 0.10 = 10%
  minimum_fee  NUMERIC(14,2) NOT NULL DEFAULT 25000,
  label        TEXT,
  active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Grille initiale officielle AEGRYN (juillet 2026)
INSERT INTO commission_tiers (min_amount, max_amount, rate, minimum_fee, label) VALUES
  (100000,    250000,   0.10, 25000, '100 000 € – 250 000 €'),
  (250001,    500000,   0.09, 25000, '250 001 € – 500 000 €'),
  (500001,   1000000,   0.08, 25000, '500 001 € – 1 000 000 €'),
  (1000001,  2500000,   0.07, 25000, '1 000 001 € – 2 500 000 €'),
  (2500001,  5000000,   0.06, 25000, '2 500 001 € – 5 000 000 €'),
  (5000001,  NULL,      NULL, 25000, '> 5 000 000 € — taux convenu au mandat');

-- RLS : lecture publique (service role pour écriture)
ALTER TABLE commission_tiers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "commission_tiers_read" ON commission_tiers FOR SELECT USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_commission_tiers_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;
CREATE TRIGGER trg_commission_tiers_updated_at
  BEFORE UPDATE ON commission_tiers
  FOR EACH ROW EXECUTE FUNCTION update_commission_tiers_updated_at();

GRANT SELECT ON commission_tiers TO anon, authenticated;
GRANT ALL    ON commission_tiers TO service_role;
