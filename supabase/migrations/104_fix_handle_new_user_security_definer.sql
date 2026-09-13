-- ============================================================
-- AEGRYN — fix handle_new_user : création de compte cassée
--
-- Symptôme : POST /auth/v1/signup et auth.admin.createUser → 500
--            "Database error creating new user" (toute inscription échoue).
--
-- Causes   : 1. La migration 098 a restreint profiles.role à
--               ('buyer','seller','partner','admin','internal') alors que
--               le trigger insère 'user' par défaut → violation de
--               profiles_role_check → échec de la transaction signup.
--            2. La migration 074 a mis handle_new_user() en SECURITY
--               INVOKER : exécuté sous supabase_auth_admin, sans GRANT sur
--               profiles / newsletter_subscribers / report_subscribers
--               (RLS actif) → INSERT refusé dès que la contrainte passe.
--
-- Correctif: - contrainte étendue au rôle principal 'client' (demandeur
--              de certification CIFSO, rôle par défaut de /client/register)
--            - trigger : rôle par défaut 'client' au lieu de 'user'
--            - SECURITY DEFINER (owner postgres) + search_path vide,
--              REVOKE EXECUTE public pour satisfaire le linter
--              "anon_security_definer_function_executable".
-- ============================================================

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('client', 'buyer', 'seller', 'partner', 'admin', 'internal'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _locale TEXT;
BEGIN
  -- ── Profil utilisateur ────────────────────────────────────────────────
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE WHEN NEW.raw_app_meta_data->>'role' IN ('client','buyer','seller','partner','admin','internal')
         THEN NEW.raw_app_meta_data->>'role' ELSE 'client' END
  )
  ON CONFLICT (id) DO NOTHING;

  -- ── Locale (optionnelle dans le meta utilisateur) ─────────────────────
  _locale := COALESCE(NEW.raw_user_meta_data->>'locale', 'fr');
  IF _locale NOT IN ('fr','en','de','es','it','nl') THEN
    _locale := 'fr';
  END IF;

  -- ── Newsletter blog AEGRYN (articles hebdomadaires) ───────────────────
  INSERT INTO public.newsletter_subscribers (email, user_id, locale, status)
  VALUES (NEW.email, NEW.id, _locale, 'active')
  ON CONFLICT (email) DO NOTHING;

  -- ── The AEGRYN magazine (notification parution annuelle) ──────────────
  INSERT INTO public.report_subscribers (email, user_id, locale, status)
  VALUES (NEW.email, NEW.id, _locale, 'active')
  ON CONFLICT (email) DO NOTHING;

  RETURN NEW;
END;
$$;

ALTER FUNCTION public.handle_new_user() OWNER TO postgres;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT  EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- data_room_documents : le trigger trg_data_room_documents_updated_at
-- (set_profiles_updated_at) écrit NEW.updated_at alors que la colonne
-- n'existe pas → toute mise à jour échoue :
--   record "new" has no field "updated_at"
-- Impact : validation/rejet des pièces par l'admin, changement de
-- visibilité par le client. Ajout de la colonne manquante.
-- ============================================================
ALTER TABLE public.data_room_documents
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
