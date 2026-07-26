-- Migration 040 — Table rgpd_requests (audit trail RGPD/nLPD)
-- Trace toutes les demandes de gestion de données personnelles initiées
-- par les utilisateurs (export, anonymisation, suppression) et traitées
-- par les administrateurs. Conforme RGPD Art. 17/20 et nLPD Art. 30/32.

CREATE TABLE IF NOT EXISTS rgpd_requests (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID,                                        -- NULL si compte supprimé
  user_email    TEXT,                                        -- snapshot email au moment de la demande
  type          TEXT NOT NULL
                  CHECK (type IN ('export', 'anonymize', 'delete_partial', 'delete_full')),
  status        TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
  admin_note    TEXT,
  requested_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes admin (tri par date, filtre par statut)
CREATE INDEX IF NOT EXISTS idx_rgpd_requests_user_id    ON rgpd_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_rgpd_requests_status     ON rgpd_requests (status);
CREATE INDEX IF NOT EXISTS idx_rgpd_requests_type       ON rgpd_requests (type);
CREATE INDEX IF NOT EXISTS idx_rgpd_requests_requested  ON rgpd_requests (requested_at DESC);

-- RLS : l'utilisateur voit uniquement ses propres demandes.
--       Les admins (service_role) voient tout via service client côté serveur.
ALTER TABLE rgpd_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY rgpd_requests_user_select
  ON rgpd_requests FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON TABLE rgpd_requests IS
  'Audit trail des demandes RGPD/nLPD : export portabilité (Art.20 RGPD / Art.28 nLPD), '
  'anonymisation (Art.17 RGPD / Art.30 nLPD), suppression partielle ou totale. '
  'Les entrées delete_full sont créées automatiquement lors de la suppression de compte.';
