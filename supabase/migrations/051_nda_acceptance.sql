-- Migration 051 — NDA profil-spécifique
-- Chaque rôle (seller, buyer, partner) a son propre NDA à accepter en ligne.
-- Tracabilité complète : IP, user-agent, version du document, timestamp.

-- ── 1. Champs sur profiles ─────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS seller_nda_accepted_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS seller_nda_version      TEXT,
  ADD COLUMN IF NOT EXISTS buyer_nda_accepted_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS buyer_nda_version       TEXT,
  ADD COLUMN IF NOT EXISTS partner_nda_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS partner_nda_version     TEXT;

-- ── 2. Table audit nda_acceptances ────────────────────────────────────────
-- Chaque acceptation est immuable : on n'update jamais, on insère.
-- Permet de conserver l'historique complet en cas de mise à jour du NDA.

CREATE TABLE IF NOT EXISTS public.nda_acceptances (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nda_type     TEXT        NOT NULL CHECK (nda_type IN ('seller', 'buyer', 'partner')),
  nda_version  TEXT        NOT NULL,          -- ex: '2026-08'
  accepted_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address   TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nda_acceptances_user   ON public.nda_acceptances(user_id);
CREATE INDEX IF NOT EXISTS idx_nda_acceptances_type   ON public.nda_acceptances(nda_type);

ALTER TABLE public.nda_acceptances ENABLE ROW LEVEL SECURITY;

-- L'utilisateur peut insérer sa propre acceptation
CREATE POLICY "nda_accept_insert_own"
  ON public.nda_acceptances FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- L'utilisateur peut lire ses propres acceptations
CREATE POLICY "nda_accept_select_own"
  ON public.nda_acceptances FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Service role : accès total (admin)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nda_acceptances TO service_role;
GRANT INSERT, SELECT ON public.nda_acceptances TO authenticated;
