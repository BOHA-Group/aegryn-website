-- ============================================================
-- AEGRYN — Durcissement sécurité (Supabase database linter, 2026-09-13)
--
-- 1. security_definer_view (ERROR ×3) : vues exécutées avec les droits du
--    créateur → passage en security_invoker (RLS de l'appelant).
-- 2. rls_policy_always_true (WARN ×3) : INSERT anonyme sans condition sur
--    cifso_index_waitlist, talent_candidates, talent_hiring_requests. Toutes
--    ces insertions passent par les routes API serveur (service_role) →
--    suppression des policies et révocation d'INSERT pour anon/authenticated.
-- 3. authenticated_security_definer_function_executable (WARN ×3) :
--    get_user_permissions / user_has_admin_access / user_has_permission
--    appelables via /rest/v1/rpc par tout utilisateur connecté et permettant
--    de sonder les droits d'un autre utilisateur. Déplacées dans le schéma
--    `internal` (non exposé par PostgREST), avec garde auth.uid() ; les
--    policies talent_* les référencent désormais dans ce schéma.
-- 4. Hors linter : anon et authenticated détenaient TRUNCATE, TRIGGER et
--    REFERENCES sur toutes les tables publiques (privilèges par défaut
--    Supabase jamais révoqués). TRUNCATE contourne la RLS. Révocation +
--    privilèges par défaut corrigés pour les tables futures.
-- ============================================================

-- ── 1. Vues : security_invoker ──────────────────────────────────────────
ALTER VIEW public.talent_candidates_with_stats      SET (security_invoker = true);
ALTER VIEW public.talent_hiring_requests_with_stats SET (security_invoker = true);
ALTER VIEW public.user_permissions_summary          SET (security_invoker = true);

-- ── 2. INSERT anonymes : policies WITH CHECK (true) ────────────────────
DROP POLICY IF EXISTS cifso_waitlist_insert_public    ON public.cifso_index_waitlist;
DROP POLICY IF EXISTS talent_candidates_public_insert ON public.talent_candidates;
DROP POLICY IF EXISTS talent_hiring_public_insert     ON public.talent_hiring_requests;

REVOKE INSERT ON public.cifso_index_waitlist   FROM anon, authenticated;
REVOKE INSERT ON public.talent_candidates      FROM anon, authenticated;
REVOKE INSERT ON public.talent_hiring_requests FROM anon, authenticated;

-- ── 3. Fonctions de permissions : schéma non exposé + garde auth.uid() ──
CREATE SCHEMA IF NOT EXISTS internal;
GRANT USAGE ON SCHEMA internal TO authenticated, service_role;
REVOKE ALL ON SCHEMA internal FROM anon, PUBLIC;

CREATE OR REPLACE FUNCTION internal.user_has_admin_access(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Un utilisateur connecté ne peut interroger que ses propres droits
  IF auth.uid() IS NOT NULL AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RETURN FALSE;
  END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin') THEN
    RETURN TRUE;
  END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'internal')
     AND EXISTS (SELECT 1 FROM public.user_admin_permissions WHERE user_id = p_user_id) THEN
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION internal.user_has_permission(p_user_id uuid, p_permission_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RETURN FALSE;
  END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin') THEN
    RETURN TRUE;
  END IF;
  RETURN EXISTS (
    SELECT 1 FROM public.user_admin_permissions
    WHERE user_id = p_user_id AND permission_id = p_permission_id
  );
END;
$$;

CREATE OR REPLACE FUNCTION internal.get_user_permissions(p_user_id uuid)
RETURNS TABLE(permission_id text, permission_name text, permission_description text, category text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND p_user_id IS DISTINCT FROM auth.uid() THEN
    RETURN;
  END IF;
  IF EXISTS (SELECT 1 FROM public.profiles WHERE id = p_user_id AND role = 'admin') THEN
    RETURN QUERY
      SELECT ap.id, ap.name, ap.description, ap.category
      FROM public.admin_permissions ap ORDER BY ap.category, ap.name;
  ELSE
    RETURN QUERY
      SELECT ap.id, ap.name, ap.description, ap.category
      FROM public.user_admin_permissions uap
      JOIN public.admin_permissions ap ON ap.id = uap.permission_id
      WHERE uap.user_id = p_user_id ORDER BY ap.category, ap.name;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION internal.user_has_admin_access(uuid)      FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION internal.user_has_permission(uuid, text)  FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION internal.get_user_permissions(uuid)       FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION internal.user_has_admin_access(uuid)     TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION internal.user_has_permission(uuid, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION internal.get_user_permissions(uuid)      TO authenticated, service_role;

-- Policies talent_* : référencer internal.user_has_permission
DO $$
DECLARE
  t text; p text; perm text;
BEGIN
  FOREACH t IN ARRAY ARRAY['talent_candidates', 'talent_hiring_requests'] LOOP
    FOR p, perm IN SELECT * FROM (VALUES ('view','talent.view'), ('edit','talent.edit'), ('delete','talent.delete')) v(p, perm) LOOP
      EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I',
        CASE WHEN t = 'talent_candidates' THEN 'talent_candidates_' || p ELSE 'talent_hiring_' || p END, t);
      EXECUTE format(
        'CREATE POLICY %I ON public.%I FOR %s TO authenticated USING (
           EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin'')
           OR internal.user_has_permission(auth.uid(), %L))',
        CASE WHEN t = 'talent_candidates' THEN 'talent_candidates_' || p ELSE 'talent_hiring_' || p END,
        t,
        CASE p WHEN 'view' THEN 'SELECT' WHEN 'edit' THEN 'UPDATE' ELSE 'DELETE' END,
        perm);
    END LOOP;
  END LOOP;
END $$;

DROP FUNCTION IF EXISTS public.get_user_permissions(uuid);
DROP FUNCTION IF EXISTS public.user_has_admin_access(uuid);
DROP FUNCTION IF EXISTS public.user_has_permission(uuid, text);

-- ── 4. Privilèges dangereux hérités des défauts Supabase ───────────────
REVOKE TRUNCATE, TRIGGER, REFERENCES ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE TRUNCATE, TRIGGER, REFERENCES ON TABLES FROM anon, authenticated;
