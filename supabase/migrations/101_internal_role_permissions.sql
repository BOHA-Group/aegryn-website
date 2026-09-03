-- Migration 101: Rôle internal + permissions granulaires étendues
-- Ajoute le rôle 'internal' au système de permissions
-- + nouvelles permissions métier : catalog, kyc, grading, dataroom, magazine, experts

-- ─── 1. Nouvelles permissions ────────────────────────────────────────────────
INSERT INTO admin_permissions (id, name, description, category) VALUES
  -- Catalogue
  ('catalog.view',           'Voir le catalogue privé',                 'Accès en lecture au catalogue d''actifs publiés',                  'catalog'),
  ('catalog.manage_access',  'Gérer les accès catalogue',               'Valider/révoquer l''accès qualifié des acquéreurs au catalogue',   'catalog'),
  ('catalog.publish',        'Publier des actifs au catalogue',         'Passer un actif en statut publié dans le catalogue',              'catalog'),

  -- KYC
  ('kyc.view',               'Voir les dossiers KYC',                   'Accès en lecture aux dossiers de vérification d''identité',       'kyc'),
  ('kyc.review',             'Instruire les dossiers KYC',              'Valider, rejeter ou demander des documents complémentaires KYC',  'kyc'),

  -- Grading
  ('grading.view',           'Voir les gradings',                       'Accès en lecture aux fiches de notation CIFS',                    'grading'),
  ('grading.review',         'Conduire des revues de grading internes', 'Rédiger et valider les rapports de notation en interne',          'grading'),
  ('grading.assign_auditors','Affecter des auditeurs externes',         'Assigner des dossiers aux auditeurs externes pour revue',         'grading'),

  -- Data Room
  ('dataroom.view',          'Voir les data rooms',                     'Accès en lecture aux data rooms des actifs',                      'dataroom'),
  ('dataroom.manage',        'Gérer les data rooms',                    'Ajouter, organiser et contrôler l''accès aux documents',          'dataroom'),

  -- Magazine
  ('magazine.view',          'Voir le contenu magazine',                'Accès en lecture aux brouillons et publications magazine',        'magazine'),
  ('magazine.publish',       'Publier le magazine',                     'Publier, dépublier et programmer les numéros du magazine',        'magazine'),

  -- Auditeurs externes (anciennement "experts.validate") — DÉSACTIVÉE intentionnellement
  -- Cette permission est réservée à un futur module ; elle est créée ici pour apparaître
  -- dans l''UI grisée sous le nom "Auditeurs externes" jusqu''à activation.
  ('experts.validate',       'Auditeurs externes',                      'Valider les fiches d''experts et gérer les auditeurs externes — fonctionnalité non encore disponible', 'experts')

ON CONFLICT (id) DO UPDATE
  SET name        = EXCLUDED.name,
      description = EXCLUDED.description,
      category    = EXCLUDED.category;

-- ─── 2. Vue user_permissions_summary ─────────────────────────────────────────
-- 097 : créée sans 'internal' dans le WHERE
-- 099 + 100 : recréée avec 'internal' inclus (p.role) — déjà correct en base
--             grâce à la contrainte profiles_role_check de 098
-- 101 : pas de modification nécessaire sur la vue — elle est déjà correcte.
-- Le seul ajout ici est l'ordre explicite 'internal' en position 2 après 'admin'.
DROP VIEW IF EXISTS user_permissions_summary;
CREATE VIEW user_permissions_summary AS
SELECT
  p.id              AS user_id,
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
      'Aucune permission'
    )
  END AS permission_summary,
  CASE
    WHEN p.role = 'admin'
      THEN (SELECT COUNT(*) FROM admin_permissions WHERE disabled IS NOT TRUE)
    ELSE (SELECT COUNT(*) FROM user_admin_permissions WHERE user_id = p.id)
  END AS permission_count
FROM profiles p
WHERE p.role IN ('admin', 'buyer', 'seller', 'partner', 'internal')
ORDER BY
  CASE p.role
    WHEN 'admin'    THEN 1
    WHEN 'internal' THEN 2
    ELSE 3
  END,
  p.created_at DESC;

GRANT SELECT ON user_permissions_summary TO authenticated, service_role;

-- ─── 3. Marquer experts.validate comme désactivée ────────────────────────────
-- Colonne optionnelle pour indiquer les permissions en attente d'activation
ALTER TABLE admin_permissions
  ADD COLUMN IF NOT EXISTS disabled BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE admin_permissions
  SET disabled = TRUE
  WHERE id = 'experts.validate';

-- ─── 4. Commentaires ─────────────────────────────────────────────────────────
COMMENT ON COLUMN admin_permissions.disabled IS
  'Si TRUE, la permission est grisée dans l''UI et non attribuable (fonctionnalité non encore disponible)';
