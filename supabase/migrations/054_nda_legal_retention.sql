-- Migration 054 — Conservation légale des NDA (durée légale 5 ans)
--
-- Problème : ON DELETE CASCADE sur nda_acceptances.user_id supprimait les preuves
-- de signature lorsqu'un compte était effacé. Contraire aux obligations légales
-- (droit suisse CO art. 127, RGPD art. 7§1, LPD art. 21).
--
-- Solution :
--   1. Remplacer ON DELETE CASCADE par ON DELETE SET NULL sur nda_acceptances.user_id
--   2. Ajouter colonne `email` pour conserver l'identité après suppression compte
--   3. Ajouter colonne `deleted_account_at` pour tracer la suppression du compte source
--   4. Idem sur nda_signatures (table NDA auction)
--   5. Politique de rétention : les lignes NDA ne sont jamais supprimées automatiquement

-- ── nda_acceptances ──────────────────────────────────────────────────────────

-- Ajouter les colonnes de conservation
ALTER TABLE public.nda_acceptances
  ADD COLUMN IF NOT EXISTS email               TEXT,
  ADD COLUMN IF NOT EXISTS deleted_account_at  TIMESTAMPTZ;

COMMENT ON COLUMN public.nda_acceptances.email IS
  'Email du signataire copié à l''acceptation — conservé même après suppression du compte auth.';
COMMENT ON COLUMN public.nda_acceptances.deleted_account_at IS
  'Date à laquelle le compte auth associé a été supprimé. NULL = compte toujours actif.';

-- Changer la FK : CASCADE → SET NULL
ALTER TABLE public.nda_acceptances
  DROP CONSTRAINT IF EXISTS nda_acceptances_user_id_fkey;

ALTER TABLE public.nda_acceptances
  ADD CONSTRAINT nda_acceptances_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- ── nda_signatures (NDA auction) ──────────────────────────────────────────────

ALTER TABLE public.nda_signatures
  ADD COLUMN IF NOT EXISTS email               TEXT,
  ADD COLUMN IF NOT EXISTS deleted_account_at  TIMESTAMPTZ;

COMMENT ON COLUMN public.nda_signatures.email IS
  'Email du signataire copié à la signature — conservé même après suppression du compte auth.';
COMMENT ON COLUMN public.nda_signatures.deleted_account_at IS
  'Date à laquelle le compte auth associé a été supprimé. NULL = compte toujours actif.';

-- Changer la FK buyer_id : CASCADE → SET NULL (si existante)
ALTER TABLE public.nda_signatures
  DROP CONSTRAINT IF EXISTS nda_signatures_buyer_id_fkey;

ALTER TABLE public.nda_signatures
  ADD CONSTRAINT nda_signatures_buyer_id_fkey
  FOREIGN KEY (buyer_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- ── Index sur email pour recherches post-suppression ─────────────────────────
CREATE INDEX IF NOT EXISTS idx_nda_acceptances_email ON public.nda_acceptances(email);
CREATE INDEX IF NOT EXISTS idx_nda_signatures_email  ON public.nda_signatures(email);
