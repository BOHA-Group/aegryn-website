-- ════════════════════════════════════════════════════════════════════════
-- 012_profiles_admin_role.sql
--
-- Table profiles : infos utilisateur + rôle (user / admin)
-- Le rôle admin est AUSSI stocké dans app_metadata.role via service_role
-- (double vérification : JWT + table)
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Table profiles ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id           uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        text        NOT NULL,
  full_name    text,
  role         text        NOT NULL DEFAULT 'user'
                           CHECK (role IN ('user', 'admin')),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lecture : utilisateur voit son propre profil
CREATE POLICY "profiles_self_read"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- MAJ : utilisateur modifie uniquement son propre profil (sauf role)
CREATE POLICY "profiles_self_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

-- Service role : accès total (admin backend)
CREATE POLICY "profiles_service_all"
  ON public.profiles FOR ALL
  USING (auth.role() = 'service_role');

-- ── 2. Trigger : créer profile automatiquement au signup ─────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_app_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 3. Trigger updated_at ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_profiles_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_profiles_updated_at();

-- ── 4. Vue admin : liste tous les utilisateurs + rôle ────────────────────
CREATE OR REPLACE VIEW public.admin_user_list AS
  SELECT
    p.id,
    p.email,
    p.full_name,
    p.role,
    p.created_at,
    u.last_sign_in_at
  FROM public.profiles p
  JOIN auth.users u ON u.id = p.id;

COMMENT ON TABLE  public.profiles IS 'Profil utilisateur avec rôle AEGRYN (user | admin)';
COMMENT ON COLUMN public.profiles.role IS 'user = acheteur qualifié, admin = équipe AEGRYN';

-- ── 5. Index ─────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles(role);
