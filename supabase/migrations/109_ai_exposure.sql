-- ============================================================
-- AEGRYN — Exposition IA (CIFSO 5000, dimension S : Sécurité & Souveraineté)
--
-- Le certificat évalue le niveau d'exposition de l'organisation aux solutions d'IA
-- tierces et les risques associés sur la maîtrise de ses actifs, de ses données et la
-- protection de ses clients. Un usage massif de fournisseurs non souverains sans cadre
-- contractuel constitue un risque public tracé en Data Room et pénalisé au grading
-- (sous-codes S-41 à S-46, lib/gradingSystem, lib/gradeEngine).
-- ============================================================
INSERT INTO public.documents_catalog (code, dimension, label_fr, label_en, required_level, format_hint, note_seller, note_admin, sort_order) VALUES
('S-10', 'S', 'Inventaire des services IA et fournisseurs (souveraineté, localisation, données transmises)',
  'Inventory of AI services and providers (sovereignty, data residency, data shared)',
  'blocking',
  'Tableau : service, fournisseur, hébergement (UE/CH ou hors), usage, données transmises, clause de non-entraînement, criticité',
  'Listez tous les services d''IA utilisés (API de modèles, assistants, outils intégrés, copilotes de développement). Précisez les données qui leur sont transmises. Cet inventaire alimente le sous-code S-41.',
  'Vérifier la cohérence avec le code (C-01, dépendances) et les contrats fournisseurs (I). Absence d''inventaire alors que l''IA est utilisée = S-41 non validé. Dépendance forte non souveraine = S-44.',
  38),
('S-11', 'S', 'Politique d''usage de l''IA et protection des données clients',
  'AI usage policy and client data protection',
  'recommended',
  'Document : données autorisées / interdites, fournisseurs approuvés, revue humaine, journalisation, formation des équipes',
  'Politique interne encadrant l''usage de l''IA : quelles données peuvent être transmises à quels fournisseurs, sous quelles conditions. Alimente S-42.',
  'Si des données clients ou sensibles sont transmises à des modèles tiers sans contrat de traitement ni clause de non-entraînement : S-45 (pénalité forte).',
  39),
('S-12', 'S', 'Contrats et engagements des fournisseurs IA (DPA, non-entraînement, localisation)',
  'AI provider contracts and commitments (DPA, no-training, data residency)',
  'recommended',
  'Contrats, avenants DPA, conditions d''entreprise, attestations de localisation des traitements',
  'Pour chaque fournisseur IA non souverain : contrat de traitement des données, engagement de non-entraînement sur vos données, localisation des traitements. Alimente S-43.',
  'Sans ces engagements, l''usage de fournisseurs non souverains ne peut être qualifié « encadré » (S-43) : basculer sur S-44 selon l''intensité.',
  40)
ON CONFLICT (code) DO UPDATE SET
  label_fr = EXCLUDED.label_fr, label_en = EXCLUDED.label_en, required_level = EXCLUDED.required_level,
  format_hint = EXCLUDED.format_hint, note_seller = EXCLUDED.note_seller, note_admin = EXCLUDED.note_admin, sort_order = EXCLUDED.sort_order;
