-- Migration 097: Admin Permissions System
-- Système de permissions granulaires pour déléguer des accès admin spécifiques

-- 1. Table des permissions disponibles
CREATE TABLE IF NOT EXISTS admin_permissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'talent', 'assets', 'users', 'content', 'finance', etc.
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Permissions initiales
INSERT INTO admin_permissions (id, name, description, category) VALUES
  -- Talent Management
  ('talent.view', 'Voir les candidatures et mandats', 'Accès en lecture à la section Talent', 'talent'),
  ('talent.edit', 'Éditer les candidatures et mandats', 'Modifier les informations, statuts, notes', 'talent'),
  ('talent.delete', 'Supprimer des candidatures et mandats', 'Supprimer définitivement des entrées', 'talent'),
  ('talent.manage_assignments', 'Gérer les assignations candidats-mandats', 'Créer et gérer les liens entre candidats et mandats', 'talent'),
  ('talent.view_financials', 'Voir les informations financières', 'Accès aux salaires et commissions', 'talent'),
  ('talent.edit_financials', 'Éditer les informations financières', 'Modifier salaires, commissions, calculs', 'talent'),
  
  -- User Management
  ('users.view', 'Voir les utilisateurs', 'Accès en lecture à la liste des utilisateurs', 'users'),
  ('users.edit', 'Éditer les utilisateurs', 'Modifier les informations utilisateurs', 'users'),
  ('users.delete', 'Supprimer des utilisateurs', 'Supprimer définitivement des comptes', 'users'),
  ('users.manage_roles', 'Gérer les rôles utilisateurs', 'Changer les rôles (buyer, seller, partner)', 'users'),
  ('users.manage_permissions', 'Gérer les permissions admin', 'Attribuer/retirer des permissions admin', 'users'),
  
  -- Assets Management
  ('assets.view', 'Voir les actifs', 'Accès en lecture aux actifs', 'assets'),
  ('assets.edit', 'Éditer les actifs', 'Modifier les informations des actifs', 'assets'),
  ('assets.delete', 'Supprimer des actifs', 'Supprimer définitivement des actifs', 'assets'),
  ('assets.manage_grades', 'Gérer les grades', 'Modifier les grades et certifications', 'assets'),
  
  -- Content Management
  ('content.view', 'Voir le contenu', 'Accès en lecture au contenu éditorial', 'content'),
  ('content.edit', 'Éditer le contenu', 'Modifier articles, pages, newsletter', 'content'),
  ('content.publish', 'Publier du contenu', 'Publier et dépublier du contenu', 'content'),
  
  -- Finance Management
  ('finance.view', 'Voir les finances', 'Accès en lecture aux données financières', 'finance'),
  ('finance.edit', 'Éditer les finances', 'Modifier transactions, commissions, paiements', 'finance'),
  
  -- System Administration
  ('system.settings', 'Gérer les paramètres système', 'Modifier la configuration globale', 'system'),
  ('system.logs', 'Voir les logs système', 'Accès aux logs et audit trail', 'system')
ON CONFLICT (id) DO NOTHING;

-- 2. Table de liaison: permissions attribuées aux utilisateurs
CREATE TABLE IF NOT EXISTS user_admin_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES admin_permissions(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  
  UNIQUE(user_id, permission_id)
);

-- Index pour recherche rapide
CREATE INDEX idx_user_permissions_user ON user_admin_permissions(user_id);
CREATE INDEX idx_user_permissions_permission ON user_admin_permissions(permission_id);

-- 3. Fonction pour vérifier si un utilisateur a une permission
CREATE OR REPLACE FUNCTION user_has_permission(
  p_user_id UUID,
  p_permission_id TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Les admins full ont toutes les permissions
  IF EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_user_id 
    AND role = 'admin'
  ) THEN
    RETURN TRUE;
  END IF;
  
  -- Vérifier si l'utilisateur a la permission spécifique
  RETURN EXISTS (
    SELECT 1 FROM user_admin_permissions
    WHERE user_id = p_user_id
    AND permission_id = p_permission_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Fonction pour obtenir toutes les permissions d'un utilisateur
CREATE OR REPLACE FUNCTION get_user_permissions(p_user_id UUID)
RETURNS TABLE (
  permission_id TEXT,
  permission_name TEXT,
  permission_description TEXT,
  category TEXT
) AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Vue pour faciliter les requêtes admin
CREATE OR REPLACE VIEW user_permissions_summary AS
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
WHERE p.role IN ('admin', 'buyer', 'seller', 'partner')
ORDER BY 
  CASE p.role 
    WHEN 'admin' THEN 1 
    ELSE 2 
  END,
  p.created_at DESC;

-- 6. RLS Policies
ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_admin_permissions ENABLE ROW LEVEL SECURITY;

-- Admins peuvent tout voir
CREATE POLICY "admin_permissions_admin_all"
  ON admin_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "user_admin_permissions_admin_all"
  ON user_admin_permissions FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Les utilisateurs peuvent voir leurs propres permissions
CREATE POLICY "user_admin_permissions_own_view"
  ON user_admin_permissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Grant permissions
GRANT ALL ON admin_permissions TO service_role;
GRANT ALL ON user_admin_permissions TO service_role;
GRANT SELECT ON user_permissions_summary TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION user_has_permission TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_user_permissions TO authenticated, service_role;

-- 7. Modifier les RLS de talent_hiring_requests et talent_candidates
-- pour prendre en compte les permissions granulaires

-- Drop anciennes policies
DROP POLICY IF EXISTS "talent_hiring_admin_all" ON talent_hiring_requests;
DROP POLICY IF EXISTS "talent_candidates_admin_all" ON talent_candidates;

-- Nouvelles policies avec permissions granulaires
CREATE POLICY "talent_hiring_view"
  ON talent_hiring_requests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR user_has_permission(auth.uid(), 'talent.view')
  );

CREATE POLICY "talent_hiring_edit"
  ON talent_hiring_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR user_has_permission(auth.uid(), 'talent.edit')
  );

CREATE POLICY "talent_hiring_delete"
  ON talent_hiring_requests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR user_has_permission(auth.uid(), 'talent.delete')
  );

CREATE POLICY "talent_candidates_view"
  ON talent_candidates FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR user_has_permission(auth.uid(), 'talent.view')
  );

CREATE POLICY "talent_candidates_edit"
  ON talent_candidates FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR user_has_permission(auth.uid(), 'talent.edit')
  );

CREATE POLICY "talent_candidates_delete"
  ON talent_candidates FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
    OR user_has_permission(auth.uid(), 'talent.delete')
  );

-- Comments
COMMENT ON TABLE admin_permissions IS 'Liste des permissions admin disponibles dans le système';
COMMENT ON TABLE user_admin_permissions IS 'Permissions admin attribuées aux utilisateurs (granularité fine)';
COMMENT ON FUNCTION user_has_permission IS 'Vérifie si un utilisateur a une permission spécifique';
COMMENT ON FUNCTION get_user_permissions IS 'Retourne toutes les permissions d''un utilisateur';
COMMENT ON VIEW user_permissions_summary IS 'Vue résumée des permissions par utilisateur';
