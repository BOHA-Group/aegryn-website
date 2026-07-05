/**
 * Migration 020 — Dismissed notifications + Buyer transaction commission
 *
 * 1. dismissed_at   — archivage côté client des notifications
 * 2. commission_type — distingue les deux flux de commission AEGRYN :
 *      'partner_introduction'  → AEGRYN → Partenaire (flux existant)
 *      'buyer_transaction_fee' → Acheteur → AEGRYN (nouveau flux, frais de transaction)
 * 3. buyer_id sur commissions → lien vers l'acheteur débiteur (Flux 2)
 * 4. non_circumvention_signed_at sur profiles → horodatage acceptation clause
 */

-- ────────────────────────────────────────────────────────────────────────────
-- 1. dismissed_at sur user_notifications
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.user_notifications
  ADD COLUMN IF NOT EXISTS dismissed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.user_notifications.dismissed_at IS
  'Horodatage du masquage côté client. NULL = visible. Non-null = archivé.';

CREATE INDEX IF NOT EXISTS user_notifications_dismissed_idx
  ON public.user_notifications (user_id, dismissed_at)
  WHERE dismissed_at IS NULL;

-- ────────────────────────────────────────────────────────────────────────────
-- 2. commission_type sur la table commissions
-- ────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type WHERE typname = 'commission_type_enum'
  ) THEN
    CREATE TYPE commission_type_enum AS ENUM (
      'partner_introduction',   -- Flux 1 : AEGRYN doit au partenaire
      'buyer_transaction_fee'   -- Flux 2 : Acheteur doit à AEGRYN
    );
  END IF;
END $$;

ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS commission_type commission_type_enum
    NOT NULL DEFAULT 'partner_introduction';

COMMENT ON COLUMN public.commissions.commission_type IS
  'partner_introduction = AEGRYN → Partenaire (introducteur) ;
   buyer_transaction_fee = Acheteur → AEGRYN (frais de transaction au closing).';

-- ────────────────────────────────────────────────────────────────────────────
-- 3. buyer_id sur commissions (Flux 2 — débiteur = acheteur)
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.commissions
  ADD COLUMN IF NOT EXISTS buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.commissions.buyer_id IS
  'Renseigné uniquement pour commission_type = buyer_transaction_fee.
   Référence le profil acheteur débiteur de la commission de transaction.';

CREATE INDEX IF NOT EXISTS commissions_buyer_idx
  ON public.commissions (buyer_id)
  WHERE buyer_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS commissions_type_idx
  ON public.commissions (commission_type);

-- ────────────────────────────────────────────────────────────────────────────
-- 4. Clause de non-contournement — horodatage d'acceptation
-- ────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS non_circumvention_signed_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.non_circumvention_signed_at IS
  'Horodatage (UTC) d''acceptation explicite de la clause de non-contournement (24 mois, CO art. 412 ss).
   Null = clause non encore acceptée. Utilisé comme preuve de consentement spécifique et éclairé.';

-- ────────────────────────────────────────────────────────────────────────────
-- 5. Vue helper — commissions acheteur dues (utilisée par /client/buyer/commissions)
-- ────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.buyer_commission_dues AS
  SELECT
    c.id,
    c.transaction_id,
    c.buyer_id,
    c.amount_chf,
    c.eligible_at,
    c.status,
    c.commission_type,
    c.created_at,
    c.updated_at,
    c.asset_id,
    t.stage AS transaction_stage
  FROM public.commissions c
  LEFT JOIN public.transactions t ON t.id = c.transaction_id
  WHERE c.commission_type = 'buyer_transaction_fee'
    AND c.buyer_id IS NOT NULL;

COMMENT ON VIEW public.buyer_commission_dues IS
  'Commission de transaction dues par l''acheteur à AEGRYN (Flux 2). Read-only.';
