-- ════════════════════════════════════════════════════════════════════════
-- 015_transaction_results.sql
--
-- Table des résultats de transactions anonymisés publiés sur
-- /auction/results — valide que le pipeline de publication fonctionne.
-- Aucune donnée vendeur/acquéreur n'est stockée ici.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS transaction_results (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_aeg               TEXT        NOT NULL
                                      CHECK (grade_aeg IN ('star', 'aaa', 'aa', 'a', 'b')),
  category                TEXT        NOT NULL,   -- ex : "SaaS B2B"
  sector                  TEXT        NOT NULL,   -- ex : "LegalTech"
  valuation_range         JSONB       NOT NULL DEFAULT '{}',
                                      -- { min: number, max: number } en €
  format                  TEXT        NOT NULL DEFAULT 'private_transaction'
                                      CHECK (format IN (
                                        'private_transaction', 'competitive_bid',
                                        'equity_stake', 'club_deal'
                                      )),
  process_duration_weeks  SMALLINT,
  closed_at               DATE        NOT NULL,
  is_public               BOOLEAN     NOT NULL DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transaction_results_public
  ON transaction_results(is_public, closed_at DESC);

-- ── Row-Level Security ────────────────────────────────────────────────────
ALTER TABLE transaction_results ENABLE ROW LEVEL SECURITY;

-- Lecture publique (anon) des résultats marqués is_public = true
CREATE POLICY "public_read_results"
  ON transaction_results FOR SELECT
  TO anon
  USING (is_public = true);

-- Lecture complète pour les acquéreurs authentifiés
CREATE POLICY "buyer_read_all_public_results"
  ON transaction_results FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Écriture admin uniquement
CREATE POLICY "admin_full_results"
  ON transaction_results FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ── Entrée test (à supprimer ou garder selon décision éditoriale) ─────────
INSERT INTO transaction_results
  (grade_aeg, category, sector, valuation_range, format,
   process_duration_weeks, closed_at, is_public)
VALUES
  ('aa', 'SaaS B2B', 'LegalTech',
   '{"min": 900000, "max": 1200000}',
   'private_transaction', 7, '2026-06-01', true);

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
