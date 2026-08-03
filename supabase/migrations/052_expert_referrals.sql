-- ── Migration 052 — Parrainage expert + crédits abonnement manuels ──────────
--
-- 1. Colonnes parrainage sur profiles
-- 2. Table expert_subscription_credits  (crédits mois manuels admin ou parrainage)
-- 3. Table expert_referrals             (suivi parrainage parrain ↔ filleul)
-- ──────────────────────────────────────────────────────────────────────────────

-- ── 1. Colonnes profiles ──────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code          TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS referral_months_credit INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS referred_by            UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.profiles.referral_code          IS 'Code de parrainage unique 8 chars — auto-généré à la première demande.';
COMMENT ON COLUMN public.profiles.referral_months_credit IS 'Compteur cumulé de mois gratuits obtenus via parrainage (plafond 6).';
COMMENT ON COLUMN public.profiles.referred_by            IS 'UUID du parrain ayant introduit ce partenaire.';

-- ── 2. Table expert_subscription_credits ─────────────────────────────────────
--
-- Crédits accordés manuellement par un admin, ou automatiquement par le système
-- de parrainage. Immutables (jamais modifiés en place, on insère uniquement).

CREATE TABLE IF NOT EXISTS public.expert_subscription_credits (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  months      INTEGER     NOT NULL CHECK (months > 0),
  source      TEXT        NOT NULL DEFAULT 'admin'
                          CHECK (source IN ('admin', 'referral_sponsor', 'referral_referred')),
  note        TEXT,
  admin_id    UUID        REFERENCES public.profiles(id) ON DELETE SET NULL,
  referral_id UUID,       -- référence expert_referrals.id (nullable, FK ajoutée plus bas)
  applied     BOOLEAN     NOT NULL DEFAULT FALSE,
  applied_at  TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE  public.expert_subscription_credits                IS 'Crédits mois abonnement accordés (admin ou parrainage). Immutables.';
COMMENT ON COLUMN public.expert_subscription_credits.source         IS 'admin | referral_sponsor | referral_referred';
COMMENT ON COLUMN public.expert_subscription_credits.applied        IS 'TRUE quand le mois a été ajouté à expert_plan_end.';

-- RLS
ALTER TABLE public.expert_subscription_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "credits_own_read"  ON public.expert_subscription_credits;
DROP POLICY IF EXISTS "credits_service_all" ON public.expert_subscription_credits;

CREATE POLICY "credits_own_read" ON public.expert_subscription_credits
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "credits_service_all" ON public.expert_subscription_credits
  FOR ALL USING (auth.role() IN ('service_role', 'supabase_admin'));

-- ── 3. Table expert_referrals ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.expert_referrals (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id          UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id          UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- statut
  status               TEXT        NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'rewarded', 'cancelled')),

  -- horodatages
  code_used_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  code_expires_at      TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '30 days'),
  payment_confirmed_at TIMESTAMPTZ,          -- filleul a payé son 1er mois
  rewarded_at          TIMESTAMPTZ,          -- récompense accordée
  cancelled_at         TIMESTAMPTZ,

  -- RGPD
  referral_data_consent BOOLEAN NOT NULL DEFAULT FALSE,

  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- contraintes
  UNIQUE (referrer_id, referred_id),
  CHECK (referrer_id <> referred_id)
);

COMMENT ON TABLE  public.expert_referrals              IS 'Parrainage expert-to-expert. Récompense : 1 mois parrain + 1 mois filleul.';
COMMENT ON COLUMN public.expert_referrals.status       IS 'pending → rewarded | cancelled';

-- FK vers credits (ajoutée après création de la table)
ALTER TABLE public.expert_subscription_credits
  DROP CONSTRAINT IF EXISTS fk_credit_referral;
ALTER TABLE public.expert_subscription_credits
  ADD CONSTRAINT fk_credit_referral
  FOREIGN KEY (referral_id) REFERENCES public.expert_referrals(id) ON DELETE SET NULL;

-- RLS
ALTER TABLE public.expert_referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrals_own_read"   ON public.expert_referrals;
DROP POLICY IF EXISTS "referrals_service_all" ON public.expert_referrals;

CREATE POLICY "referrals_own_read" ON public.expert_referrals
  FOR SELECT USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "referrals_service_all" ON public.expert_referrals
  FOR ALL USING (auth.role() IN ('service_role', 'supabase_admin'));

-- ── 4. Index utiles ───────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_referrals_referrer  ON public.expert_referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred  ON public.expert_referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status    ON public.expert_referrals(status);
CREATE INDEX IF NOT EXISTS idx_credits_user        ON public.expert_subscription_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_applied     ON public.expert_subscription_credits(applied) WHERE applied = FALSE;
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code) WHERE referral_code IS NOT NULL;
