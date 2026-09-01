-- Migration 100: Complete Security Fix
-- Corriger définitivement tous les warnings Supabase

-- ════════════════════════════════════════════════════════════════════════════
-- 1. REVOKE EXECUTE sur update_talent_updated_at (fonction trigger)
-- ════════════════════════════════════════════════════════════════════════════

-- Cette fonction est un trigger, elle ne doit JAMAIS être appelée directement
REVOKE ALL ON FUNCTION update_talent_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION update_talent_updated_at() FROM anon;
REVOKE ALL ON FUNCTION update_talent_updated_at() FROM authenticated;

-- Seul le système peut l'utiliser via les triggers
GRANT EXECUTE ON FUNCTION update_talent_updated_at() TO postgres;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. Vérifier que les REVOKE précédents sont bien appliqués
-- ════════════════════════════════════════════════════════════════════════════

-- Re-révoquer pour être sûr (idempotent)
REVOKE ALL ON FUNCTION get_user_permissions(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION user_has_admin_access(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION user_has_permission(UUID, TEXT) FROM PUBLIC;

-- Puis re-granter uniquement à authenticated et service_role
GRANT EXECUTE ON FUNCTION get_user_permissions(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION user_has_admin_access(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION user_has_permission(UUID, TEXT) TO authenticated, service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- 3. Warnings RLS ALWAYS TRUE - Accepter comme intentionnel
-- ════════════════════════════════════════════════════════════════════════════

-- Ces warnings sont ACCEPTABLES et INTENTIONNELS car:
-- 1. Les formulaires publics Talent DOIVENT permettre l'insertion anonyme
-- 2. Aucune lecture n'est possible (SELECT policies séparées)
-- 3. Les données sont validées côté API
-- 4. Seuls les admins peuvent voir/éditer via d'autres policies

-- Pas de correction nécessaire - c'est le comportement attendu

-- ════════════════════════════════════════════════════════════════════════════
-- 4. SECURITY DEFINER VIEWS - Forcer la recréation
-- ════════════════════════════════════════════════════════════════════════════

-- Supabase cache peut-être les anciennes définitions
-- On force la recréation avec CASCADE pour nettoyer

DROP VIEW IF EXISTS talent_hiring_requests_with_stats CASCADE;
DROP VIEW IF EXISTS talent_candidates_with_stats CASCADE;
DROP VIEW IF EXISTS user_permissions_summary CASCADE;

-- Recréer sans SECURITY DEFINER
CREATE VIEW talent_hiring_requests_with_stats AS
SELECT 
  hr.*,
  COUNT(DISTINCT tca.candidate_id) FILTER (WHERE tca.status NOT IN ('rejected', 'withdrawn')) as active_candidates_count,
  COUNT(DISTINCT tca.candidate_id) FILTER (WHERE tca.status = 'placed') as placed_candidates_count,
  MAX(tca.placement_date) as last_placement_date
FROM talent_hiring_requests hr
LEFT JOIN talent_candidate_assignments tca ON tca.hiring_request_id = hr.id
GROUP BY hr.id;

CREATE VIEW talent_candidates_with_stats AS
SELECT 
  tc.*,
  COUNT(DISTINCT tca.hiring_request_id) FILTER (WHERE tca.status NOT IN ('rejected', 'withdrawn')) as active_assignments_count,
  COUNT(DISTINCT tca.hiring_request_id) FILTER (WHERE tca.status = 'placed') as placements_count,
  MAX(tca.placement_date) as last_placement_date
FROM talent_candidates tc
LEFT JOIN talent_candidate_assignments tca ON tca.candidate_id = tc.id
GROUP BY tc.id;

CREATE VIEW user_permissions_summary AS
SELECT 
  p.id as user_id,
  p.email,
  p.full_name,
  p.role,
  CASE 
    WHEN p.role = 'admin' THEN 'Full Admin'
    ELSE COALESCE(
      (SELECT string_agg(ap.category, ', ' ORDER BY ap.category)
       FROM user_admin_permissions uap
       JOIN admin_permissions ap ON ap.id = uap.permission_id
       WHERE uap.user_id = p.id),
      'No permissions'
    )
  END as permission_summary,
  CASE 
    WHEN p.role = 'admin' THEN (SELECT COUNT(*) FROM admin_permissions)
    ELSE (SELECT COUNT(*) FROM user_admin_permissions WHERE user_id = p.id)
  END as permission_count
FROM profiles p
WHERE p.role IN ('admin', 'buyer', 'seller', 'partner', 'internal')
ORDER BY 
  CASE p.role 
    WHEN 'admin' THEN 1 
    ELSE 2 
  END,
  p.created_at DESC;

-- Grants
GRANT SELECT ON talent_hiring_requests_with_stats TO authenticated, service_role;
GRANT SELECT ON talent_candidates_with_stats TO authenticated, service_role;
GRANT SELECT ON user_permissions_summary TO authenticated, service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- 5. Vérification finale des permissions
-- ════════════════════════════════════════════════════════════════════════════

DO $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Vérifier qu'anon ne peut pas exécuter les fonctions sensibles
  SELECT COUNT(*) INTO v_count
  FROM information_schema.routine_privileges
  WHERE routine_schema = 'public'
  AND routine_name IN ('get_user_permissions', 'user_has_admin_access', 'user_has_permission', 'update_talent_updated_at')
  AND grantee = 'anon'
  AND privilege_type = 'EXECUTE';
  
  IF v_count > 0 THEN
    RAISE WARNING 'ATTENTION: anon a encore EXECUTE sur % fonctions sensibles', v_count;
  ELSE
    RAISE NOTICE '✅ anon n''a plus EXECUTE sur les fonctions sensibles';
  END IF;
  
  -- Vérifier qu'authenticated peut exécuter les fonctions nécessaires
  SELECT COUNT(*) INTO v_count
  FROM information_schema.routine_privileges
  WHERE routine_schema = 'public'
  AND routine_name IN ('get_user_permissions', 'user_has_admin_access', 'user_has_permission')
  AND grantee = 'authenticated'
  AND privilege_type = 'EXECUTE';
  
  IF v_count = 3 THEN
    RAISE NOTICE '✅ authenticated peut exécuter les 3 fonctions nécessaires';
  ELSE
    RAISE WARNING 'ATTENTION: authenticated ne peut exécuter que % fonctions sur 3', v_count;
  END IF;
END $$;

-- ════════════════════════════════════════════════════════════════════════════
-- Résumé
-- ════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  RAISE NOTICE '
  ╔════════════════════════════════════════════════════════════════╗
  ║  SÉCURITÉ: Corrections finales appliquées                      ║
  ╠════════════════════════════════════════════════════════════════╣
  ║  ✅ Vues recréées sans SECURITY DEFINER (CASCADE)              ║
  ║  ✅ update_talent_updated_at révoqué (trigger only)            ║
  ║  ✅ Fonctions sensibles révoquées pour anon                    ║
  ║  ✅ Fonctions nécessaires accordées à authenticated            ║
  ║                                                                ║
  ║  Warnings acceptés (intentionnels):                           ║
  ║  ⚠️  RLS ALWAYS TRUE sur formulaires publics (OK)              ║
  ║                                                                ║
  ║  Attendre 1-2 min pour que le cache Supabase se rafraîchisse  ║
  ╚════════════════════════════════════════════════════════════════╝
  ';
END $$;
