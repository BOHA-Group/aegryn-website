-- ════════════════════════════════════════════════════════════════════════
-- 074_auto_subscribe_on_signup.sql
--
-- Auto-inscription aux deux listes dès création de compte Supabase Auth.
--
-- Les deux abonnements sont DISTINCTS :
--   • newsletter_subscribers  — articles blog AEGRYN (hebdomadaire)
--   • report_subscribers      — The AEGRYN (magazine annuel, ex-report)
--
-- Comportement :
--   • Idempotent : ON CONFLICT DO NOTHING — un désabonné reste désabonné.
--   • locale déduite de raw_user_meta_data->>'locale' si fournie, sinon 'fr'.
--   • Erreur d'upsert non-bloquante : INSERT dans profiles réussit toujours.
--
-- ════════════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
DECLARE
  _locale TEXT;
BEGIN
  -- ── Profil utilisateur ────────────────────────────────────────────────
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_app_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;

  -- ── Locale (optionnelle dans le meta utilisateur) ─────────────────────
  _locale := COALESCE(
    NEW.raw_user_meta_data->>'locale',
    'fr'
  );
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
END; $$;

-- Le trigger on_auth_user_created existe déjà (migration 012) — on le recrée
-- pour qu'il pointe vers la version mise à jour.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
