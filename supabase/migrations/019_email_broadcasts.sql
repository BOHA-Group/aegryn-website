-- ════════════════════════════════════════════════════════════════════════
-- 019_email_broadcasts.sql
--
-- Système de notifications email admin → clients (buyer / seller / partner)
-- Inspiré du pattern subblink-app/api/notifications.js
--
-- Ajoute :
--   • email_broadcasts   — log des envois admin (audit trail)
--   • profiles.email_notifications_enabled — opt-out granulaire par utilisateur
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Opt-out email par profil ──────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_notifications_enabled BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.email_notifications_enabled IS
  'Consentement email marketing/transactionnel client. true = reçoit les notifications admin. false = opt-out.';

-- ── 2. Table email_broadcasts (audit trail) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.email_broadcasts (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Ciblage
  target_role      TEXT        NOT NULL
                               CHECK (target_role IN ('all', 'buyer', 'seller', 'partner')),

  -- Contenu
  subject          TEXT        NOT NULL,
  title            TEXT        NOT NULL,
  body_text        TEXT        NOT NULL,
  cta_label        TEXT,
  cta_url          TEXT,

  -- Notification in-app couplée
  notif_type       TEXT        NOT NULL DEFAULT 'broadcast_info'
                               CHECK (notif_type IN ('broadcast_info', 'broadcast_alert', 'broadcast_action')),
  create_in_app    BOOLEAN     NOT NULL DEFAULT true,

  -- Résultats d'envoi
  recipient_count  INTEGER     NOT NULL DEFAULT 0,
  sent_count       INTEGER     NOT NULL DEFAULT 0,
  failed_count     INTEGER     NOT NULL DEFAULT 0,

  -- Statut
  status           TEXT        NOT NULL DEFAULT 'draft'
                               CHECK (status IN ('draft', 'sending', 'sent', 'partial', 'failed')),

  sent_at          TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.email_broadcasts IS
  'Audit trail des envois d''emails admin vers les espaces clients AEGRYN.';

CREATE INDEX IF NOT EXISTS email_broadcasts_admin_idx    ON public.email_broadcasts (admin_id);
CREATE INDEX IF NOT EXISTS email_broadcasts_target_idx   ON public.email_broadcasts (target_role);
CREATE INDEX IF NOT EXISTS email_broadcasts_status_idx   ON public.email_broadcasts (status);
CREATE INDEX IF NOT EXISTS email_broadcasts_created_idx  ON public.email_broadcasts (created_at DESC);

-- ── 3. RLS — table réservée aux admins ──────────────────────────────────────
ALTER TABLE public.email_broadcasts ENABLE ROW LEVEL SECURITY;

-- Seul le service-role (admin backend) peut insérer / lire
-- Les profils admin humains passent par le service client, pas par RLS directe
CREATE POLICY "service_role_full_access_email_broadcasts"
  ON public.email_broadcasts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
