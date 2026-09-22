-- ============================================================
-- AEGRYN - CIFSO 5000 v4.12 : piste « stack licenciée » (dimension C)
--
-- Contexte : toute organisation utilise des logiciels, même sans code
-- propriétaire. La dimension C garde ses 20 pts et son nom public, mais
-- ses contrôles internes s'adaptent via input.code.technologyMode :
--   'proprietary'    → piste code propriétaire (existant, inchangé)
--   'licensed_stack' → piste gouvernance SI/SaaS licencié (C-60 → C-64)
--   'hybrid'         → moyenne des deux pistes
--
-- 1. Les pièces code propriétaire (C-01..C-09, sauf C-05/C-08 universelles)
--    deviennent conditionnelles : applicability = 'proprietary_code'.
-- 2. Nouvelles pièces licensed_stack : C-60 → C-64.
--    C-60/C-61/C-63 sont 'blocking' (parité avec les bloquants propriétaires) ;
--    elles ne bloquent QUE la publication/transaction-ready, jamais le calcul.
--
-- Rétrocompatibilité : sans technologyMode déclaré, les pages data room
-- dérivent 'proprietary' → checklist C inchangée pour les dossiers existants.
-- ============================================================

-- ── 1. Pièces code propriétaire → conditionnelles ───────────────────────
-- C-05 (schéma d'architecture → couvre la cartographie SI) et C-08
-- (historique incidents → pertinent sur tout SI) restent universelles.
UPDATE public.documents_catalog
SET applicability = 'proprietary_code'
WHERE code IN ('C-01', 'C-02', 'C-03', 'C-04', 'C-06', 'C-07', 'C-09');

-- ── 2. Piste licensed_stack ─────────────────────────────────────────────
INSERT INTO public.documents_catalog (code, dimension, label_fr, label_en, required_level, format_hint, note_seller, note_admin, sort_order, applicability) VALUES

('C-60', 'C', 'Inventaire des logiciels et services SaaS critiques',
  'Inventory of critical software and SaaS services',
  'blocking',
  'Tableau : fournisseur, usage, données traitées, criticité, coût annuel, date de renouvellement',
  'Toute organisation utilise des logiciels : listez ceux dont l''arrêt stopperait votre activité (ERP, CRM, comptabilité, métiers).',
  'Équivalent C-01 pour la piste licenciée. Alimente softwareInventory. Suffisant : inventaire à jour couvrant les processus critiques.',
  30, 'licensed_stack'),

('C-61', 'C', 'Registre des licences et conformité des versions',
  'License register and supported-versions compliance',
  'blocking',
  'Tableau des licences détenues, couverture des utilisateurs, versions en production vs versions supportées',
  'Prouve que les logiciels utilisés sont licenciés correctement et maintenus par l''éditeur (pas de versions en fin de vie).',
  'Alimente licenseCompliance. Suffisant : licences couvrant l''usage réel + aucune version hors support sur les outils critiques.',
  31, 'licensed_stack'),

('C-62', 'C', 'Cartographie du système d''information et interdépendances',
  'IS map and application interdependencies',
  'recommended',
  'Schéma des applications, flux de données entre outils, intégrations et points d''accès',
  'Rend le système d''information lisible pour un repreneur et réduit la dépendance à la connaissance individuelle.',
  'Alimente siMapping. Suffisant : cartographie couvrant les flux critiques.',
  32, 'licensed_stack'),

('C-63', 'C', 'Clauses de réversibilité et d''export des données (contrats fournisseurs)',
  'Reversibility and data-export clauses (vendor contracts)',
  'blocking',
  'Extraits contractuels : droit d''export des données, formats, préavis de sortie, restitution en fin de contrat',
  'La transmissibilité exige de pouvoir quitter un fournisseur sans perdre ses données : c''est l''anti lock-in contractuel.',
  'Alimente vendorReversibility. Vérifier export documenté + préavis raisonnable sur les fournisseurs critiques.',
  33, 'licensed_stack'),

('C-64', 'C', 'Analyse de concentration fournisseurs et coûts de sortie',
  'Vendor concentration and exit-cost analysis',
  'recommended',
  'Tableau : part de chaque fournisseur dans les processus critiques, alternatives identifiées, estimation des coûts de migration',
  'Une forte dépendance à un fournisseur unique est un risque de valorisation : documentez les alternatives.',
  'Alimente vendorConcentration. Suffisant : fournisseurs critiques identifiés avec alternative ou coût de sortie estimé.',
  34, 'licensed_stack')

ON CONFLICT (code) DO UPDATE SET
  label_fr = EXCLUDED.label_fr, label_en = EXCLUDED.label_en,
  required_level = EXCLUDED.required_level, format_hint = EXCLUDED.format_hint,
  note_seller = EXCLUDED.note_seller, note_admin = EXCLUDED.note_admin,
  sort_order = EXCLUDED.sort_order, applicability = EXCLUDED.applicability;
