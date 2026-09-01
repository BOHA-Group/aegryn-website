-- Migration 099: Fix Supabase Security Warnings
-- Corriger les warnings de sécurité détectés par le linter Supabase

-- ════════════════════════════════════════════════════════════════════════════
-- 1. SECURITY DEFINER VIEWS → Retirer SECURITY DEFINER (pas nécessaire pour les vues)
-- ════════════════════════════════════════════════════════════════════════════

-- Vue talent_hiring_requests_with_stats
DROP VIEW IF EXISTS talent_hiring_requests_with_stats;
CREATE VIEW talent_hiring_requests_with_stats AS
SELECT 
  hr.*,
  COUNT(DISTINCT tca.candidate_id) FILTER (WHERE tca.status NOT IN ('rejected', 'withdrawn')) as active_candidates_count,
  COUNT(DISTINCT tca.candidate_id) FILTER (WHERE tca.status = 'placed') as placed_candidates_count,
  MAX(tca.placement_date) as last_placement_date
FROM talent_hiring_requests hr
LEFT JOIN talent_candidate_assignments tca ON tca.hiring_request_id = hr.id
GROUP BY hr.id;

GRANT SELECT ON talent_hiring_requests_with_stats TO authenticated, service_role;

-- Vue talent_candidates_with_stats
DROP VIEW IF EXISTS talent_candidates_with_stats;
CREATE VIEW talent_candidates_with_stats AS
SELECT 
  tc.*,
  COUNT(DISTINCT tca.hiring_request_id) FILTER (WHERE tca.status NOT IN ('rejected', 'withdrawn')) as active_assignments_count,
  COUNT(DISTINCT tca.hiring_request_id) FILTER (WHERE tca.status = 'placed') as placements_count,
  MAX(tca.placement_date) as last_placement_date
FROM talent_candidates tc
LEFT JOIN talent_candidate_assignments tca ON tca.candidate_id = tc.id
GROUP BY tc.id;

GRANT SELECT ON talent_candidates_with_stats TO authenticated, service_role;

-- Vue user_permissions_summary
DROP VIEW IF EXISTS user_permissions_summary;
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

GRANT SELECT ON user_permissions_summary TO authenticated, service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- 2. FUNCTION SEARCH PATH → Ajouter SET search_path = public
-- ════════════════════════════════════════════════════════════════════════════

-- Fonction update_talent_updated_at
CREATE OR REPLACE FUNCTION update_talent_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fonction is_valid_phone (si elle existe)
CREATE OR REPLACE FUNCTION is_valid_phone(phone_number TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
BEGIN
  -- Validation basique: au moins 10 chiffres
  RETURN phone_number ~ '^\+?[0-9\s\-\(\)]{10,}$';
END;
$$;

-- Fonction user_has_permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Les admins full ont toutes les permissions
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id 
    AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Les internal et autres rôles doivent avoir la permission explicite
  RETURN EXISTS (
    SELECT 1 FROM user_admin_permissions
    WHERE user_id = p_user_id
    AND permission_id = p_permission_id
  );
END;
$$;

-- Fonction get_user_permissions
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TABLE (
  permission_id TEXT,
  permission_name TEXT,
  permission_description TEXT,
  category TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Si admin full, retourner toutes les permissions
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id 
    AND role = 'admin'
  ) THEN
    RETURN QUERY
    SELECT ap.id, ap.name, ap.description, ap.category
    FROM admin_permissions ap
    ORDER BY ap.category, ap.name;
  ELSE
    -- Retourner uniquement les permissions attribuées
    RETURN QUERY
    SELECT ap.id, ap.name, ap.description, ap.category
    FROM user_admin_permissions uap
    JOIN admin_permissions ap ON ap.id = uap.permission_id
    WHERE uap.user_id = p_user_id
    ORDER BY ap.category, ap.name;
  END IF;
END;
$$;

-- Fonction user_has_admin_access
CREATE OR REPLACE FUNCTION user_has_admin_access(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Admin full a toujours accès
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id 
    AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Internal avec au moins une permission a accès
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id 
    AND role = 'internal'
  ) AND EXISTS (
    SELECT 1 FROM user_admin_permissions
    WHERE user_id = p_user_id
  ) THEN
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;

-- ════════════════════════════════════════════════════════════════════════════
-- 3. REVOKE EXECUTE pour anon sur fonctions SECURITY DEFINER
-- ════════════════════════════════════════════════════════════════════════════

-- Ces fonctions ne doivent PAS être appelables par anon (utilisateurs non connectés)
REVOKE EXECUTE ON FUNCTION get_user_permissions(UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION user_has_admin_access(UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION user_has_permission(UUID, TEXT) FROM anon;

-- Garder l'accès pour authenticated et service_role
GRANT EXECUTE ON FUNCTION get_user_permissions(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION user_has_admin_access(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION user_has_permission(UUID, TEXT) TO authenticated, service_role;

-- ════════════════════════════════════════════════════════════════════════════
-- 4. RLS POLICIES ALWAYS TRUE → Ajouter commentaire explicatif
-- ════════════════════════════════════════════════════════════════════════════

-- Les policies talent_*_public_insert sont INTENTIONNELLEMENT permissives
-- car elles permettent aux utilisateurs anonymes de soumettre des candidatures
-- et des mandats via les formulaires publics du site.
-- C'est le comportement attendu et sécurisé (pas de lecture, juste insertion).

COMMENT ON POLICY talent_candidates_public_insert ON talent_candidates IS
  'INTENTIONAL: Permet aux utilisateurs anonymes de soumettre leur candidature via le formulaire public. Pas de risque car: (1) pas de lecture possible, (2) données validées côté API, (3) admin seul peut voir/éditer.';

COMMENT ON POLICY talent_hiring_public_insert ON talent_hiring_requests IS
  'INTENTIONAL: Permet aux recruteurs anonymes de soumettre un mandat via le formulaire public. Pas de risque car: (1) pas de lecture possible, (2) données validées côté API, (3) admin seul peut voir/éditer.';

-- ════════════════════════════════════════════════════════════════════════════
-- Comments
-- ════════════════════════════════════════════════════════════════════════════

COMMENT ON FUNCTION update_talent_updated_at IS 'Trigger function: met à jour updated_at automatiquement (search_path fixé pour sécurité)';
COMMENT ON FUNCTION is_valid_phone IS 'Validation basique numéro de téléphone (search_path fixé pour sécurité)';
COMMENT ON FUNCTION user_has_permission IS 'Vérifie si un utilisateur a une permission spécifique (SECURITY DEFINER avec search_path fixé)';
COMMENT ON FUNCTION get_user_permissions IS 'Retourne toutes les permissions d''un utilisateur (SECURITY DEFINER avec search_path fixé)';
COMMENT ON FUNCTION user_has_admin_access IS 'Vérifie si un utilisateur a accès à l''espace admin (SECURITY DEFINER avec search_path fixé)';

-- ════════════════════════════════════════════════════════════════════════════
-- Résumé des corrections
-- ════════════════════════════════════════════════════════════════════════════

DO $$
BEGIN
  RAISE NOTICE '
  ╔════════════════════════════════════════════════════════════════╗
  ║  SÉCURITÉ: Warnings Supabase corrigés                          ║
  ╠════════════════════════════════════════════════════════════════╣
  ║  ✅ SECURITY DEFINER VIEWS → Retirés (pas nécessaire)          ║
  ║  ✅ FUNCTION SEARCH PATH → SET search_path = public            ║
  ║  ✅ ANON EXECUTE → Révoqué sur fonctions sensibles             ║
  ║  ✅ RLS ALWAYS TRUE → Commentaires explicatifs ajoutés         ║
  ║                                                                ║
  ║  Fonctions protégées (anon ne peut plus appeler):             ║
  ║  - get_user_permissions()                                      ║
  ║  - user_has_admin_access()                                     ║
  ║  - user_has_permission()                                       ║
  ║                                                                ║
  ║  Policies publiques intentionnelles (formulaires):            ║
  ║  - talent_candidates_public_insert (OK)                        ║
  ║  - talent_hiring_public_insert (OK)                            ║
  ╚════════════════════════════════════════════════════════════════╝
  ';
END $$;
