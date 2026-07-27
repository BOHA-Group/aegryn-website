-- ════════════════════════════════════════════════════════════════════════
-- 041_expert_network.sql
--
-- Réseau d'experts AEGRYN — workflow complet :
--
--   ÉTAPE 1  Candidature publique (expert_applications)
--            → formulaire sur /experts → liste d'attente → admin approuve
--            → rôle 'expert' ajouté à profiles.roles
--
--   ÉTAPE 2  Fiche expert (expert_profiles)
--            → profil lié au compte → soumis par l'expert → validé admin
--            → is_visible = true quand admin valide ET plan actif
--
--   ABONNEMENT  profiles.expert_plan (null | 'active' | 'suspended')
--               Stripe branch plus tard. Pour l'instant : admin active manuellement.
--               Seuls les profils is_visible = true ET expert_plan = 'active'
--               apparaissent publiquement.
--
-- Tables ajoutées :
--   • expert_applications  — candidatures pré-compte
--   • expert_profiles      — fiches experts liées au compte
-- Colonnes ajoutées sur profiles :
--   • expert_plan          TEXT  (null | 'active' | 'suspended')
--   • expert_plan_start    TIMESTAMPTZ
-- ════════════════════════════════════════════════════════════════════════

-- ── 0. Extension profiles ──────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS expert_plan       TEXT
    CHECK (expert_plan IS NULL OR expert_plan IN ('active', 'suspended')),
  ADD COLUMN IF NOT EXISTS expert_plan_start TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.expert_plan IS
  'Plan abonnement expert : null = non-abonné, active = abonnement actif (89 €/mois HT), suspended = suspendu. Stripe à brancher.';

-- ── 1. Candidatures experts (formulaire public — pré-compte) ───────────

CREATE TABLE IF NOT EXISTS public.expert_applications (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  prenom       TEXT        NOT NULL,
  nom          TEXT        NOT NULL,
  email        TEXT        NOT NULL,
  profession   TEXT        NOT NULL,
  specialties  TEXT[]      NOT NULL DEFAULT '{}',
  city         TEXT,
  country      TEXT        DEFAULT 'CH',
  bio          TEXT,
  organization TEXT,
  website      TEXT,
  status       TEXT        NOT NULL DEFAULT 'pending'
                 CHECK (status IN ('pending', 'contacted', 'approved', 'rejected')),
  admin_note   TEXT,
  reviewed_by  TEXT,
  reviewed_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS expert_applications_email_unique
  ON public.expert_applications (lower(email));

CREATE INDEX IF NOT EXISTS idx_expert_applications_status
  ON public.expert_applications (status, created_at DESC);

ALTER TABLE public.expert_applications ENABLE ROW LEVEL SECURITY;

-- Lecture publique des statuts : non (données personnelles)
-- Service role uniquement
CREATE POLICY "service_role_expert_applications"
  ON public.expert_applications FOR ALL
  USING (auth.role() = 'service_role');

-- ── 2. Fiches experts (liées au compte utilisateur) ───────────────────

CREATE TABLE IF NOT EXISTS public.expert_profiles (
  id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name     TEXT        NOT NULL,
  last_name      TEXT        NOT NULL,
  profession     TEXT        NOT NULL,
  specialties    TEXT[]      NOT NULL DEFAULT '{}',
  city           TEXT,
  country_code   TEXT        NOT NULL DEFAULT 'CH',
  bio            TEXT,
  organization   TEXT,
  email_public   TEXT,
  phone          TEXT,
  website        TEXT,
  min_rate_eur   INTEGER,
  languages      TEXT[]      NOT NULL DEFAULT '{}',
  avatar_url     TEXT,
  is_visible     BOOLEAN     NOT NULL DEFAULT false,
  hidden_reason  TEXT,
  verified_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS expert_profiles_user_unique
  ON public.expert_profiles (user_id);

CREATE INDEX IF NOT EXISTS idx_expert_profiles_visible
  ON public.expert_profiles (is_visible, verified_at DESC);

CREATE INDEX IF NOT EXISTS idx_expert_profiles_profession
  ON public.expert_profiles (profession) WHERE is_visible = true;

ALTER TABLE public.expert_profiles ENABLE ROW LEVEL SECURITY;

-- Lecture publique : seules les fiches visibles
CREATE POLICY "expert_profiles_public_read"
  ON public.expert_profiles FOR SELECT
  USING (is_visible = true);

-- L'expert lit et modifie uniquement sa propre fiche
CREATE POLICY "expert_profiles_own_select"
  ON public.expert_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "expert_profiles_own_insert"
  ON public.expert_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "expert_profiles_own_update"
  ON public.expert_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role : accès total
CREATE POLICY "service_role_expert_profiles"
  ON public.expert_profiles FOR ALL
  USING (auth.role() = 'service_role');

-- Trigger updated_at
CREATE OR REPLACE FUNCTION public.set_expert_profiles_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_expert_profiles_updated_at ON public.expert_profiles;
CREATE TRIGGER trg_expert_profiles_updated_at
  BEFORE UPDATE ON public.expert_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_expert_profiles_updated_at();

DROP TRIGGER IF EXISTS trg_expert_applications_updated_at ON public.expert_applications;
CREATE TRIGGER trg_expert_applications_updated_at
  BEFORE UPDATE ON public.expert_applications
  FOR EACH ROW EXECUTE FUNCTION public.set_expert_profiles_updated_at();

-- ── 3. Grants service_role ────────────────────────────────────────────

GRANT SELECT, INSERT, UPDATE, DELETE ON public.expert_applications TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expert_profiles      TO service_role;

-- ── 4. Commentaires ───────────────────────────────────────────────────

COMMENT ON TABLE public.expert_applications IS
  'Candidatures au réseau expert AEGRYN via formulaire public /experts. '
  'Workflow : pending → contacted → approved (rôle expert ajouté au compte) | rejected.';

COMMENT ON TABLE public.expert_profiles IS
  'Fiches experts publiées sur /experts. Visibilité conditionnée par : '
  '1/ admin valide (is_visible=true + verified_at), '
  '2/ plan abonnement actif (profiles.expert_plan = active). '
  'Toute modification remet is_visible=false et verified_at=null.';
