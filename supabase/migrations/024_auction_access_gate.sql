-- ════════════════════════════════════════════════════════════════════════
-- 024_auction_access_gate.sql
--
-- Prérequis d'accès au catalogue auction (actifs tiers) :
--   1. Compte créé (auth.users)
--   2. NDA AEGRYN Auction signé  → profiles.auction_nda_signed_at
--   3. CGV AEGRYN Auction acceptées → profiles.auction_cgv_accepted_at
--
-- Ces deux champs sont renseignés manuellement par l'admin AEGRYN après
-- réception des documents signés. Aucune intégration Yousign — process email.
--
-- L'accès est au niveau SESSION (pas par actif) :
--   • Une seule signature NDA + CGV débloque tous les actifs de la session en cours.
--   • Révocation possible : l'admin remet les champs à NULL.
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Champs accès catalogue sur profiles ────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS auction_nda_signed_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS auction_cgv_accepted_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.auction_nda_signed_at IS
  'Date de signature du NDA AEGRYN Auction. NULL = non signé = accès catalogue refusé.
   Renseigné manuellement par l''admin AEGRYN après réception du document signé.';

COMMENT ON COLUMN public.profiles.auction_cgv_accepted_at IS
  'Date d''acceptation des CGV AEGRYN Auction. NULL = non acceptées = accès catalogue refusé.
   Renseigné manuellement par l''admin AEGRYN.';

-- Index pour les vérifications fréquentes côté applicatif
CREATE INDEX IF NOT EXISTS idx_profiles_auction_nda
  ON public.profiles (auction_nda_signed_at)
  WHERE auction_nda_signed_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_auction_cgv
  ON public.profiles (auction_cgv_accepted_at)
  WHERE auction_cgv_accepted_at IS NOT NULL;

-- ── 2. Table auction_access_requests — demandes catalogue (pré-NDA) ──────
-- Remplace le workflow email actuel de NdaRequestForm :
-- l'acquéreur non encore éligible soumet une demande depuis la page catalogue.
-- L'admin valide, envoie NDA+CGV, puis renseigne les champs profiles ci-dessus.

CREATE TABLE IF NOT EXISTS public.auction_access_requests (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Demandeur (peut être anon avant création de compte)
  user_id          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  email            TEXT        NOT NULL,
  full_name        TEXT        NOT NULL,
  company          TEXT,
  buyer_type       TEXT,       -- 'pe' | 'strategic' | 'family_office' | 'individual'
  capacity         TEXT,       -- fourchette déclarée
  message          TEXT,

  -- Workflow
  status           TEXT        NOT NULL DEFAULT 'pending'
                               CHECK (status IN (
                                 'pending',    -- soumis, en attente de revue
                                 'approved',   -- profil validé, NDA + CGV envoyés
                                 'nda_sent',   -- NDA envoyé par email
                                 'nda_signed', -- NDA retourné signé
                                 'cgv_sent',   -- CGV envoyées
                                 'active',     -- NDA + CGV signés → accès accordé (profiles mis à jour)
                                 'rejected',   -- refus définitif
                                 'revoked'     -- accès révoqué ultérieurement
                               )),

  reviewed_by      TEXT,
  reviewed_at      TIMESTAMPTZ,
  nda_sent_at      TIMESTAMPTZ,
  nda_signed_at    TIMESTAMPTZ,
  cgv_sent_at      TIMESTAMPTZ,
  cgv_accepted_at  TIMESTAMPTZ,
  admin_note       TEXT,

  locale           TEXT        DEFAULT 'fr',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_auction_access_req_user   ON public.auction_access_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_auction_access_req_email  ON public.auction_access_requests (email);
CREATE INDEX IF NOT EXISTS idx_auction_access_req_status ON public.auction_access_requests (status);

DROP TRIGGER IF EXISTS trg_auction_access_requests_updated_at ON public.auction_access_requests;
CREATE TRIGGER trg_auction_access_requests_updated_at
  BEFORE UPDATE ON public.auction_access_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.auction_access_requests ENABLE ROW LEVEL SECURITY;

-- Insertion publique (anon + authenticated) — soumission de demande
CREATE POLICY "auction_access_req_insert_public"
  ON public.auction_access_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Lecture de sa propre demande (utilisateur connecté)
CREATE POLICY "auction_access_req_select_own"
  ON public.auction_access_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role : accès total (admin AEGRYN)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.auction_access_requests TO service_role;
GRANT INSERT ON public.auction_access_requests TO anon, authenticated;
GRANT SELECT ON public.auction_access_requests TO authenticated;

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
