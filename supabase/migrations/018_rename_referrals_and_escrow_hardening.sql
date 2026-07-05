-- ════════════════════════════════════════════════════════════════════════
-- 018_rename_referrals_and_escrow_hardening.sql
--
-- Migration incrémentale sur 017 (déjà appliquée telle quelle en base).
-- Ne PAS rejouer 017 — ses CREATE TABLE IF NOT EXISTS ne modifieraient pas
-- le schéma déjà en place. Ce fichier applique les deltas suivants :
--
--   1. Renommage referrals -> introductions (vocabulaire M&A/PE institutionnel,
--      "referral" étant un terme SaaS/marketing hors de propos pour AEGRYN)
--   2. Renommage des colonnes associées (type/status -> introduction_type/introduction_status)
--   3. commissions.referral_id -> introduction_id + FK mise à jour
--   4. commissions.type enum : referral_asset/referral_buyer -> introduction_asset/introduction_buyer
--   5. transactions : ajout escrow_bank_iban, escrow_release_validated_admin,
--      escrow_release_validated_external (libération séquestre à double instruction)
--   6. user_notifications : ajout payload JSONB (données contextuelles structurées)
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1-2. Renommage table + colonnes ───────────────────────────────────────
ALTER TABLE IF EXISTS public.referrals RENAME TO introductions;
ALTER TABLE IF EXISTS public.introductions RENAME COLUMN type   TO introduction_type;
ALTER TABLE IF EXISTS public.introductions RENAME COLUMN status TO introduction_status;

-- Renommage des index/policies/trigger héréditaires (Postgres ne les renomme pas automatiquement)
ALTER INDEX IF EXISTS idx_referrals_partner RENAME TO idx_introductions_partner;

DROP POLICY IF EXISTS "service_role_referrals" ON public.introductions;
DROP POLICY IF EXISTS "partners_own_referrals" ON public.introductions;

CREATE POLICY "service_role_introductions"
  ON public.introductions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "partners_own_introductions"
  ON public.introductions FOR SELECT
  USING (auth.uid() = partner_id);

DROP TRIGGER IF EXISTS trg_referrals_updated_at ON public.introductions;
CREATE TRIGGER trg_introductions_updated_at
  BEFORE UPDATE ON public.introductions
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 3. commissions.referral_id -> introduction_id ────────────────────────
ALTER TABLE IF EXISTS public.commissions RENAME COLUMN referral_id TO introduction_id;

-- ── 4. commissions.type enum : referral_* -> introduction_* ──────────────
ALTER TABLE public.commissions DROP CONSTRAINT IF EXISTS commissions_type_check;

UPDATE public.commissions SET type = 'introduction_asset' WHERE type = 'referral_asset';
UPDATE public.commissions SET type = 'introduction_buyer' WHERE type = 'referral_buyer';

ALTER TABLE public.commissions
  ADD CONSTRAINT commissions_type_check
  CHECK (type IN ('cosignature', 'introduction_asset', 'introduction_buyer'));

-- ── 5. Séquestre — IBAN + libération à double instruction ────────────────
ALTER TABLE public.transactions
  ADD COLUMN IF NOT EXISTS escrow_bank_iban TEXT,
  ADD COLUMN IF NOT EXISTS escrow_release_validated_admin    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS escrow_release_validated_external BOOLEAN NOT NULL DEFAULT false;

COMMENT ON COLUMN public.transactions.escrow_bank_iban IS
  'IBAN du compte séquestre chez la banque/fiduciaire partenaire externe.';
COMMENT ON COLUMN public.transactions.escrow_release_validated_admin IS
  'Libération à double instruction : validation côté admin AEGRYN.';
COMMENT ON COLUMN public.transactions.escrow_release_validated_external IS
  'Libération à double instruction : validation côté partie externe (notaire/banque).
   escrow_released_at ne doit être renseigné que lorsque les deux validations sont true
   (contrainte applicative, pas de trigger DB pour rester flexible en MVP).';

-- ── 6. Notifications — payload structuré ─────────────────────────────────
ALTER TABLE public.user_notifications
  ADD COLUMN IF NOT EXISTS payload JSONB NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.user_notifications.payload IS
  'Données contextuelles structurées par type de notification (asset_id, montant, statut...),
   exploitables directement par le frontend sans reparser le texte.';

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
