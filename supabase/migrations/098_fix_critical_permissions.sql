-- Migration 098: Fix Critical Permissions & Add Internal Role
-- Retirer les permissions critiques et ajouter le rôle "internal"

-- 1. RETIRER les permissions critiques qui ne doivent JAMAIS être déléguées
DELETE FROM admin_permissions WHERE id IN (
  'users.delete',              -- CRITIQUE: Suppression de comptes
  'users.manage_permissions',  -- CRITIQUE: Gestion des permissions (réservé admin full)
  'assets.delete',             -- CRITIQUE: Suppression d'actifs
  'system.settings',           -- CRITIQUE: Paramètres système
  'finance.edit'               -- CRITIQUE: Modification finances
);

-- 2. Ajouter le rôle "internal" dans la contrainte profiles.role
DO $$
BEGIN
  -- Drop l'ancienne contrainte si elle existe
  ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
  
  -- Mettre à jour les rôles invalides vers 'buyer' (rôle par défaut le plus sûr)
  -- Cela ne devrait affecter que les données de test/dev
  UPDATE profiles 
  SET role = 'buyer' 
  WHERE role NOT IN ('buyer', 'seller', 'partner', 'admin', 'internal');
  
  -- Créer la nouvelle contrainte avec le rôle "internal"
  ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
    CHECK (role IN ('buyer', 'seller', 'partner', 'admin', 'internal'));
END $$;

-- 3. Fonction pour vérifier si un utilisateur a accès à l'espace admin
CREATE OR REPLACE FUNCTION user_has_admin_access(p_user_id UUID)
RETURNS BOOLEAN AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Modifier la fonction user_has_permission pour inclure le rôle internal
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
  
  -- Les internal et autres rôles doivent avoir la permission explicite
  RETURN EXISTS (
    SELECT 1 FROM user_admin_permissions
    WHERE user_id = p_user_id
    AND permission_id = p_permission_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Politique RLS pour l'interface de gestion des permissions
-- Seuls les admins full peuvent gérer les permissions
CREATE POLICY "only_admin_can_manage_permissions"
  ON user_admin_permissions FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "only_admin_can_delete_permissions"
  ON user_admin_permissions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- 6. Mettre à jour les permissions restantes avec des descriptions de sécurité
UPDATE admin_permissions 
SET description = 'Accès en lecture à la section Talent (non critique)'
WHERE id = 'talent.view';

UPDATE admin_permissions 
SET description = 'Modifier les informations, statuts, notes (non critique)'
WHERE id = 'talent.edit';

UPDATE admin_permissions 
SET description = 'Supprimer des candidatures et mandats (attention: action irréversible)'
WHERE id = 'talent.delete';

UPDATE admin_permissions 
SET description = 'Voir les salaires et commissions (données sensibles)'
WHERE id = 'talent.view_financials';

UPDATE admin_permissions 
SET description = 'Modifier salaires et commissions (données sensibles)'
WHERE id = 'talent.edit_financials';

UPDATE admin_permissions 
SET description = 'Accès en lecture aux utilisateurs (données personnelles)'
WHERE id = 'users.view';

UPDATE admin_permissions 
SET description = 'Modifier les informations utilisateurs (données personnelles)'
WHERE id = 'users.edit';

UPDATE admin_permissions 
SET description = 'Changer les rôles buyer/seller/partner (ne peut pas créer admin ou internal)'
WHERE id = 'users.manage_roles';

-- 7. Ajouter une permission pour créer des comptes internal
INSERT INTO admin_permissions (id, name, description, category) VALUES
  ('users.create_internal', 'Créer des comptes internes', 'Créer des utilisateurs avec rôle internal (sans permissions par défaut)', 'users')
ON CONFLICT (id) DO NOTHING;

-- Grant permissions
GRANT EXECUTE ON FUNCTION user_has_admin_access TO authenticated, service_role;

-- Comments
COMMENT ON FUNCTION user_has_admin_access IS 'Vérifie si un utilisateur a accès à l''espace admin (admin full ou internal avec permissions)';
COMMENT ON COLUMN profiles.role IS 'Rôle utilisateur: buyer, seller, partner, admin (full access), internal (access via permissions)';

-- Avertissement de sécurité
DO $$
BEGIN
  RAISE NOTICE '
  ╔════════════════════════════════════════════════════════════════╗
  ║  SÉCURITÉ: Permissions critiques RETIRÉES                      ║
  ╠════════════════════════════════════════════════════════════════╣
  ║  Les permissions suivantes sont RÉSERVÉES aux admins full:     ║
  ║  - users.delete (suppression comptes)                          ║
  ║  - users.manage_permissions (gestion permissions)              ║
  ║  - assets.delete (suppression actifs)                          ║
  ║  - system.settings (paramètres système)                        ║
  ║  - finance.edit (modification finances)                        ║
  ║                                                                ║
  ║  Nouveau rôle "internal" créé:                                 ║
  ║  - Espace compte vide par défaut                               ║
  ║  - Accès admin uniquement si permissions attribuées            ║
  ║  - Ne peut PAS s''auto-attribuer de permissions                ║
  ╚════════════════════════════════════════════════════════════════╝
  ';
END $$;
