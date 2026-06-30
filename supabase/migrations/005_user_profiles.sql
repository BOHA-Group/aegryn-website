-- ============================================================
-- AEGRYN — user_profiles
-- Profils des utilisateurs authentifiés (vendeurs / acquéreurs)
-- Liés à auth.users via uid (Supabase Auth)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        TEXT        NOT NULL DEFAULT 'seller', -- 'seller' | 'buyer' | 'admin'
  full_name   TEXT,
  company     TEXT,
  phone       TEXT,
  locale      TEXT        DEFAULT 'fr',
  invited_by  TEXT,       -- email de l'admin qui a invité
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS user_profiles_role_idx ON public.user_profiles (role);

DROP TRIGGER IF EXISTS user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur ne voit que son propre profil
CREATE POLICY "user_profiles_select_own"
  ON public.user_profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id);

-- Admin (service_role) peut tout faire
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_profiles TO service_role;

-- ============================================================
-- Lier les assets au user via seller_uid
-- ============================================================
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS seller_uid UUID REFERENCES auth.users(id);

CREATE INDEX IF NOT EXISTS assets_seller_uid_idx ON public.assets (seller_uid);

-- Vendeur peut lire ses propres actifs (une fois connecté)
CREATE POLICY "assets_select_own_seller"
  ON public.assets FOR SELECT
  TO authenticated
  USING (seller_uid = auth.uid());
