-- ════════════════════════════════════════════════════════════════════════
-- 017_client_spaces_manual_workflow.sql
--
-- Fondations pour les 4 espaces clients (Buyer / Seller / Partner / Admin)
-- décrits dans l'architecture cible. Aucune intégration tierce (Yousign,
-- API bancaire, ancrage blockchain KRYV) : tout est géré manuellement par
-- l'équipe AEGRYN via des champs texte, cases à cocher et process email.
--
-- Ajoute :
--   • profiles.roles (multi-rôle : buyer/seller/partner/admin/super_admin)
--   • partner_certifications  — co-signature manuelle par dimension
--   • referrals               — apports d'affaires partenaires
--   • commissions             — commissions dues/versées (co-signature + apports)
--   • kyc_documents           — documents KYC unitaires (buyer + seller)
--   • transactions            — pipeline PTT (Promesse-To-Transfer) manuel
--
-- ⚠️  NE PAS APPLIQUER sans validation explicite de Yohann.
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Multi-rôle sur profiles ───────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS roles TEXT[] NOT NULL DEFAULT '{}';

COMMENT ON COLUMN public.profiles.roles IS
  'Rôles additionnels multi-valués : buyer | seller | partner | admin | super_admin.
   Coexiste avec la colonne role (legacy, user|admin) conservée pour compatibilité
   avec les vérifications existantes (requireAdmin, etc.)';

-- Migration douce : tout profil admin existant obtient aussi le rôle 'admin' dans roles[]
UPDATE public.profiles
SET roles = array_append(roles, 'admin')
WHERE role = 'admin' AND NOT ('admin' = ANY(roles));

CREATE INDEX IF NOT EXISTS profiles_roles_idx ON public.profiles USING GIN (roles);

-- ── 2. Co-signatures partenaires (manuel) ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.partner_certifications (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id        UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  partner_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  dimension       TEXT        NOT NULL CHECK (dimension IN ('ip', 'finance', 'security')),

  status          TEXT        NOT NULL DEFAULT 'assigned'
                              CHECK (status IN ('assigned', 'in_review', 'submitted', 'signed', 'declined')),

  score           SMALLINT    CHECK (score IS NULL OR (score >= 0 AND score <= 25)),
  subcodes        TEXT[]      NOT NULL DEFAULT '{}',
  summary         TEXT,                          -- avis visible dans le rapport
  reserves        TEXT,                          -- réserves visibles si grade < AAA
  internal_note   TEXT,                          -- note confidentielle AEGRYN uniquement
  recommendation  TEXT        CHECK (recommendation IS NULL OR recommendation IN ('none', 'review', 'remediation')),

  deadline_at     TIMESTAMPTZ,
  -- Acceptation manuelle : case à cocher + horodatage en lieu et place d'une signature électronique
  signed_by_checkbox BOOLEAN  NOT NULL DEFAULT false,
  signed_at       TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_partner_certifications_asset   ON public.partner_certifications(asset_id);
CREATE INDEX IF NOT EXISTS idx_partner_certifications_partner ON public.partner_certifications(partner_id, status);

ALTER TABLE public.partner_certifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_partner_certifications"
  ON public.partner_certifications FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "partners_own_certifications"
  ON public.partner_certifications FOR SELECT
  USING (auth.uid() = partner_id);

CREATE TRIGGER trg_partner_certifications_updated_at
  BEFORE UPDATE ON public.partner_certifications
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 3. Apports d'affaires (referrals) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.referrals (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type            TEXT        NOT NULL CHECK (type IN ('asset', 'buyer')),

  contact_name    TEXT        NOT NULL,
  contact_email   TEXT        NOT NULL,
  details         JSONB       NOT NULL DEFAULT '{}',  -- champs libres selon type
  context_note    TEXT,

  status          TEXT        NOT NULL DEFAULT 'new'
                              CHECK (status IN ('new', 'contacted', 'qualified', 'closed_won', 'closed_lost')),
  admin_note      TEXT,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_referrals_partner ON public.referrals(partner_id, status);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_referrals"
  ON public.referrals FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "partners_own_referrals"
  ON public.referrals FOR SELECT
  USING (auth.uid() = partner_id);

CREATE TRIGGER trg_referrals_updated_at
  BEFORE UPDATE ON public.referrals
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 4. Commissions (co-signature + apports) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.commissions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type              TEXT        NOT NULL
                                CHECK (type IN ('cosignature', 'referral_asset', 'referral_buyer')),

  referral_id       UUID        REFERENCES public.referrals(id) ON DELETE SET NULL,
  certification_id  UUID        REFERENCES public.partner_certifications(id) ON DELETE SET NULL,
  transaction_id    UUID,       -- FK ajoutée après création de la table transactions
  asset_id          UUID        REFERENCES public.assets(id) ON DELETE SET NULL,

  amount_chf        NUMERIC(14,2),
  eligible_at       DATE,       -- date du closing qui rend la commission due
  status            TEXT        NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('pending', 'to_invoice', 'invoiced', 'paid')),
  invoiced_at       TIMESTAMPTZ,
  paid_at           TIMESTAMPTZ,
  admin_note        TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commissions_partner ON public.commissions(partner_id, status);

ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_commissions"
  ON public.commissions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "partners_own_commissions"
  ON public.commissions FOR SELECT
  USING (auth.uid() = partner_id);

CREATE TRIGGER trg_commissions_updated_at
  BEFORE UPDATE ON public.commissions
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 5. KYC documents unitaires (buyer + seller) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doc_type        TEXT        NOT NULL,
                    -- 'id_card' | 'proof_of_address' | 'proof_of_funds' | 'kbis' |
                    -- 'articles_of_association' | 'director_id' | 'delegation' |
                    -- 'ubo' | 'regulatory_approval'
  file_url        TEXT,
  status          TEXT        NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending', 'in_review', 'validated', 'rejected', 'expired')),
  rejection_reason TEXT,
  expires_at      DATE,
  -- Champs spécifiques UBO (bénéficiaire effectif)
  ubo_full_name   TEXT,
  ubo_ownership_pct NUMERIC(5,2),
  ubo_nationality TEXT,

  validated_by    UUID        REFERENCES auth.users(id),
  validated_at    TIMESTAMPTZ,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kyc_documents_user ON public.kyc_documents(user_id, status);

ALTER TABLE public.kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_kyc_documents"
  ON public.kyc_documents FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "users_own_kyc_documents"
  ON public.kyc_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE TRIGGER trg_kyc_documents_updated_at
  BEFORE UPDATE ON public.kyc_documents
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 6. Transactions — pipeline PTT manuel ────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id          UUID        NOT NULL REFERENCES public.assets(id) ON DELETE CASCADE,
  bid_id            UUID        REFERENCES public.auction_bids(id) ON DELETE SET NULL,
  buyer_id          UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  seller_id         UUID        REFERENCES auth.users(id) ON DELETE SET NULL,

  status            TEXT        NOT NULL DEFAULT 'ei_submitted'
                                CHECK (status IN (
                                  'ei_submitted',    -- Expression d'Intérêt / offre acceptée
                                  'ap_signed',       -- Accord de Principe signé (checkbox + email)
                                  'escrow_paid',     -- Séquestre confirmé (manuel, banque/fiduciaire externe)
                                  'dd_in_progress',  -- Due diligence en cours
                                  'signing',         -- Signing en cours
                                  'closed',          -- Transaction clôturée
                                  'cancelled'
                                )),

  -- Accord de Principe — acceptation manuelle (case à cocher, pas de signature électronique)
  ap_accepted_buyer   BOOLEAN     NOT NULL DEFAULT false,
  ap_accepted_seller  BOOLEAN     NOT NULL DEFAULT false,
  ap_accepted_at      TIMESTAMPTZ,

  -- Séquestre — géré manuellement par une banque/fiduciaire partenaire externe
  escrow_amount_chf   NUMERIC(14,2),
  escrow_provider     TEXT,        -- nom de la banque/fiduciaire partenaire
  escrow_reference    TEXT,
  escrow_confirmed_at TIMESTAMPTZ,
  escrow_released_at  TIMESTAMPTZ,
  escrow_note         TEXT,

  -- Due diligence
  dd_started_at       DATE,
  dd_deadline_at       DATE,
  dd_extended_to       DATE,
  dataroom_url         TEXT,

  -- Signing — process manuel (documents échangés par email, pas de Yousign)
  signing_date         DATE,
  spa_document_url     TEXT,
  certificate_url      TEXT,       -- Certificat de Transaction AEGRYN (PDF généré manuellement)
  certificate_issued_at TIMESTAMPTZ,

  -- Commissions (calcul interne, pas d'automatisation bancaire)
  commission_seller_pct       NUMERIC(5,2),
  commission_buyer_premium_pct NUMERIC(5,2),
  commission_referrer_chf      NUMERIC(14,2),
  net_seller_proceeds_chf      NUMERIC(14,2),

  closed_at            TIMESTAMPTZ,
  admin_note           TEXT,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_transactions_asset  ON public.transactions(asset_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer   ON public.transactions(buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller  ON public.transactions(seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status  ON public.transactions(status);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_transactions"
  ON public.transactions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "buyers_own_transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = buyer_id);

CREATE POLICY "sellers_own_transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = seller_id);

CREATE TRIGGER trg_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- FK différée de commissions vers transactions (table créée après)
ALTER TABLE public.commissions
  ADD CONSTRAINT commissions_transaction_id_fkey
  FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON DELETE SET NULL;

-- ── 7. Notifications in-app (générique, tous espaces) ────────────────────
CREATE TABLE IF NOT EXISTS public.user_notifications (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type         TEXT        NOT NULL, -- ex: 'offer_received', 'kyc_validated', 'transaction_update'
  title        TEXT        NOT NULL,
  body         TEXT,
  link         TEXT,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON public.user_notifications(user_id, read_at);

ALTER TABLE public.user_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_user_notifications"
  ON public.user_notifications FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "users_own_notifications"
  ON public.user_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_mark_notifications_read"
  ON public.user_notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ════════════════════════════════════════════════════════════════════════
-- FIN — attendre validation Yohann avant db push
-- ════════════════════════════════════════════════════════════════════════
