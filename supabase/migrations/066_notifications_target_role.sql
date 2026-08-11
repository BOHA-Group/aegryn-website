/**
 * Migration 066 — Notifications target_role + delete personnel
 *
 * Problème : les notifications sont affichées dans tous les espaces d'un
 * utilisateur multi-rôle (buyer/seller/partner), ce qui provoque des
 * incohérences : une notif "fiche expert" apparaît dans le dashboard Acheteur.
 *
 * Solution :
 *   1. Ajouter target_role TEXT sur user_notifications
 *      NULL = toutes les espaces (broadcast global)
 *      'buyer' | 'seller' | 'partner' | 'admin' = espace ciblé uniquement
 *   2. Ajouter deleted_at pour suppression douce côté utilisateur
 *      (distinct de dismissed_at qui archive sans supprimer visuellement)
 *   3. Index + policy mise à jour
 */

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. Colonnes
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_notifications
  ADD COLUMN IF NOT EXISTS target_role TEXT
    CHECK (target_role IN ('buyer', 'seller', 'partner', 'admin', 'expert') OR target_role IS NULL);

COMMENT ON COLUMN public.user_notifications.target_role IS
  'Espace destinataire : buyer | seller | partner | admin | expert. NULL = tous les espaces.';

ALTER TABLE public.user_notifications
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

COMMENT ON COLUMN public.user_notifications.deleted_at IS
  'Suppression manuelle par l''utilisateur. Non-null = masqué définitivement.';

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. Index
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS user_notifications_role_idx
  ON public.user_notifications (user_id, target_role, dismissed_at, deleted_at)
  WHERE deleted_at IS NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. Backfill : notifs existantes avec lien /client/partner/* → target_role partner
-- ─────────────────────────────────────────────────────────────────────────────
UPDATE public.user_notifications
SET target_role = 'partner'
WHERE target_role IS NULL
  AND (
    link LIKE '/client/partner/%'
    OR type IN ('expert_validated', 'expert_published', 'expert_rejected', 'expert_reset',
                'certification_update', 'commission_update', 'mandate_update')
  );

UPDATE public.user_notifications
SET target_role = 'buyer'
WHERE target_role IS NULL
  AND (
    link LIKE '/client/buyer/%'
    OR type IN ('offer_received', 'offer_retained', 'offer_rejected', 'escrow_confirmed',
                'dd_started', 'signing_ready', 'deal_closed')
  );

UPDATE public.user_notifications
SET target_role = 'seller'
WHERE target_role IS NULL
  AND (
    link LIKE '/client/seller/%'
    OR type IN ('asset_published', 'asset_graded', 'nda_signed')
  );
