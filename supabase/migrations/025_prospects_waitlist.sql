-- ════════════════════════════════════════════════════════════════════════
-- 025_prospects_waitlist.sql
--
-- Table `prospects` — base de prospects qualifiants pour les sessions auction.
-- Capture les profils buyer / seller / partner avant création de compte.
-- Workflow admin : pending → reviewed → invited → converted | rejected
--
-- Conversion :
--   Quand l'admin invite un prospect, il crée le compte auth.users puis le
--   profil est lié via profiles.converted_from_prospect_id (traçabilité).
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Table prospects ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.prospects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Identification de base
  email       TEXT        NOT NULL,
  first_name  TEXT,
  last_name   TEXT,
  phone       TEXT,

  -- Type de profil déclaré
  profile_type TEXT       NOT NULL
                          CHECK (profile_type IN ('buyer', 'seller', 'partner', 'undecided')),

  -- ── Segmentation buyer ──────────────────────────────────────────────
  buyer_category TEXT
                 CHECK (buyer_category IS NULL OR buyer_category IN (
                   'individual_hnw', 'family_office', 'search_fund',
                   'pe_vc_fund', 'corporate_strategic', 'holding'
                 )),
  ticket_range TEXT
               CHECK (ticket_range IS NULL OR ticket_range IN (
                 '<500k', '500k-2m', '2m-5m', '5m-20m', '20m+'
               )),
  acquisition_intent TEXT
                     CHECK (acquisition_intent IS NULL OR acquisition_intent IN (
                       'single_asset', 'portfolio_buildup', 'exploratory'
                     )),
  sectors_interest    TEXT[]      NOT NULL DEFAULT '{}',
  timeline_to_deploy  TEXT
                      CHECK (timeline_to_deploy IS NULL OR timeline_to_deploy IN (
                        'immediate', '3-6m', '6-12m', 'opportunistic'
                      )),
  has_financing_secured BOOLEAN,

  -- ── Segmentation seller ─────────────────────────────────────────────
  seller_asset_stage TEXT
                     CHECK (seller_asset_stage IS NULL OR seller_asset_stage IN (
                       'idea', 'mvp', 'revenue_generating', 'scaling', 'mature'
                     )),
  seller_asset_arr_range TEXT
                         CHECK (seller_asset_arr_range IS NULL OR seller_asset_arr_range IN (
                           '<100k', '100k-500k', '500k-2m', '2m-10m', '10m+'
                         )),
  seller_reason_to_sell TEXT
                        CHECK (seller_reason_to_sell IS NULL OR seller_reason_to_sell IN (
                          'full_exit', 'partial', 'succession', 'burnout', 'strategic_pivot'
                        )),
  seller_timeline TEXT
                  CHECK (seller_timeline IS NULL OR seller_timeline IN (
                    'immediate', '3-6m', '6-12m', 'flexible'
                  )),

  -- ── Segmentation partner ────────────────────────────────────────────
  partner_category TEXT
                   CHECK (partner_category IS NULL OR partner_category IN (
                     'law_firm', 'accounting', 'ma_boutique', 'vc_pe',
                     'accelerator', 'other'
                   )),
  partner_deal_flow_estimate TEXT
                             CHECK (partner_deal_flow_estimate IS NULL OR partner_deal_flow_estimate IN (
                               '<5_per_year', '5-10_per_year', '10-20_per_year', '20+_per_year'
                             )),

  -- ── Provenance + scoring admin ──────────────────────────────────────
  source TEXT
         CHECK (source IS NULL OR source IN (
           'linkedin', 'referral', 'organic', 'event', 'partner_intro', 'direct'
         )),
  referred_by_partner_id UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_score            SMALLINT CHECK (admin_score IS NULL OR (admin_score >= 1 AND admin_score <= 5)),
  admin_notes            TEXT,

  -- ── Workflow ────────────────────────────────────────────────────────
  status TEXT  NOT NULL DEFAULT 'pending'
               CHECK (status IN (
                 'pending',   -- soumis, en attente de review
                 'reviewed',  -- vu par l'admin, pas encore statué
                 'invited',   -- invitation envoyée à créer son compte
                 'converted', -- compte créé, prospect promu en profil
                 'rejected'   -- refusé (hors scope, spam, etc.)
               )),
  invited_at   TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  reviewed_at  TIMESTAMPTZ,

  -- ── Consentement (RGPD / nLPD) ─────────────────────────────────────
  gdpr_consent      BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,

  -- Unicité email — un seul enregistrement par adresse
  CONSTRAINT prospects_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_prospects_profile_type ON public.prospects (profile_type);
CREATE INDEX IF NOT EXISTS idx_prospects_status       ON public.prospects (status);
CREATE INDEX IF NOT EXISTS idx_prospects_email        ON public.prospects (email);
CREATE INDEX IF NOT EXISTS idx_prospects_created_at   ON public.prospects (created_at DESC);
-- Index composite pour le dashboard admin (filtre status + score)
CREATE INDEX IF NOT EXISTS idx_prospects_admin_review ON public.prospects (status, admin_score DESC NULLS LAST);

DROP TRIGGER IF EXISTS trg_prospects_updated_at ON public.prospects;
CREATE TRIGGER trg_prospects_updated_at
  BEFORE UPDATE ON public.prospects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.prospects ENABLE ROW LEVEL SECURITY;

-- Insertion publique : email + gdpr_consent requis
CREATE POLICY "prospects_insert_public"
  ON public.prospects FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND email <> ''
    AND gdpr_consent = true
    AND profile_type IN ('buyer', 'seller', 'partner', 'undecided')
  );

-- Lecture de sa propre fiche (si connecté plus tard)
CREATE POLICY "prospects_select_own"
  ON public.prospects FOR SELECT
  TO authenticated
  USING (
    email = (
      SELECT email FROM auth.users WHERE id = auth.uid() LIMIT 1
    )
  );

GRANT INSERT ON public.prospects TO anon, authenticated;
GRANT SELECT ON public.prospects TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.prospects TO service_role;

-- ── 2. Lien de conversion : profiles.converted_from_prospect_id ───────
-- FK traçant quel prospect a donné naissance à ce profil.
-- Permet de retrouver le scoring et le profil déclaré en amont.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS converted_from_prospect_id UUID
    REFERENCES public.prospects(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_prospect_origin
  ON public.profiles (converted_from_prospect_id)
  WHERE converted_from_prospect_id IS NOT NULL;

COMMENT ON COLUMN public.profiles.converted_from_prospect_id IS
  'Lien vers le prospect d''origine (waiting list). Renseigné lors de la conversion
   invitation → compte. Permet de retrouver le scoring buyer/seller/partner initial.';

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
