-- ════════════════════════════════════════════════════════════════════════
-- 013_auction_sessions.sql
--
-- Table de gestion des sessions AEGRYN (physiques / digitales / hybrides)
-- Utilisée par /admin/sessions pour créer, suivre et publier les résultats.
-- ════════════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS auction_sessions (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  type             TEXT        NOT NULL DEFAULT 'main'
                               CHECK (type IN ('main', 'thematic')),
  theme            TEXT,                          -- requis si type = 'thematic'
  session_date     TIMESTAMPTZ,
  location         TEXT,                          -- ex : "Suisse, lieu à confirmer"
  format           TEXT        NOT NULL DEFAULT 'digital'
                               CHECK (format IN ('physical', 'digital', 'hybrid')),
  status           TEXT        NOT NULL DEFAULT 'planning'
                               CHECK (status IN (
                                 'planning', 'confirmed', 'open',
                                 'live', 'closed', 'published'
                               )),
  lots             JSONB       NOT NULL DEFAULT '[]', -- [{asset_id, lot_number, slug}]
  participant_ids  UUID[]      DEFAULT '{}',
  notes            TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auction_sessions_status ON auction_sessions(status);
CREATE INDEX IF NOT EXISTS idx_auction_sessions_date   ON auction_sessions(session_date DESC);

-- ── Trigger updated_at ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_auction_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_auction_sessions_updated_at
  BEFORE UPDATE ON auction_sessions
  FOR EACH ROW EXECUTE FUNCTION set_auction_sessions_updated_at();

-- ── Row-Level Security ────────────────────────────────────────────────────
ALTER TABLE auction_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_full_access_sessions"     ON auction_sessions;
DROP POLICY IF EXISTS "public_read_published_sessions" ON auction_sessions;
DROP POLICY IF EXISTS "buyer_read_open_sessions"       ON auction_sessions;

CREATE POLICY "admin_full_access_sessions"
  ON auction_sessions FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Lecture publique des sessions publiées (front /auction/sessions)
CREATE POLICY "public_read_published_sessions"
  ON auction_sessions FOR SELECT
  TO anon
  USING (status = 'published');

-- Lecture authentifiée des sessions open/live/published (acquéreurs)
CREATE POLICY "buyer_read_open_sessions"
  ON auction_sessions FOR SELECT
  TO authenticated
  USING (status IN ('open', 'live', 'published'));

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
