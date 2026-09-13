-- ============================================================
-- AEGRYN — CIFSO 5000 : dimension O, périmètre certification / transaction,
--          vérification publique du certificat, mandats experts par périmètre
--
-- 1. Dimension O (Organisation & Talent) dans le catalogue documentaire,
--    la data room et les co-signatures partenaires (CIFS → CIFSO).
-- 2. assets.dossier_type : 'certification' (demande CIFSO 5000) ou
--    'transaction' (actif à céder). La data room est à double entrée :
--    même mécanique, catalogue et livrables distincts.
-- 3. Certificat : code de vérification public + validité (12 mois).
-- 4. Pré-scoring documentaire automatique (JSON) alimentant la revue.
-- 5. partner_certifications.scope : mandat expert limité à la certification
--    ou à la transaction (accès data room par dimension uniquement).
-- ============================================================

-- ── 1. Dimension O ──────────────────────────────────────────────────────
ALTER TABLE public.documents_catalog DROP CONSTRAINT IF EXISTS documents_catalog_dimension_check;
ALTER TABLE public.documents_catalog ADD CONSTRAINT documents_catalog_dimension_check
  CHECK (dimension IN ('C', 'I', 'F', 'S', 'O', 'T'));

ALTER TABLE public.data_room_documents DROP CONSTRAINT IF EXISTS data_room_documents_category_check;
ALTER TABLE public.data_room_documents ADD CONSTRAINT data_room_documents_category_check
  CHECK (category IN ('code', 'ip', 'finance', 'security', 'organisation', 'transversal', 'legal'));

ALTER TABLE public.data_room_documents DROP CONSTRAINT IF EXISTS data_room_documents_dimension_check;
ALTER TABLE public.data_room_documents ADD CONSTRAINT data_room_documents_dimension_check
  CHECK (dimension IN ('code', 'ip', 'finance', 'security', 'organisation') OR dimension IS NULL);

ALTER TABLE public.partner_certifications DROP CONSTRAINT IF EXISTS partner_certifications_dimension_check;
ALTER TABLE public.partner_certifications ADD CONSTRAINT partner_certifications_dimension_check
  CHECK (dimension IN ('code', 'ip', 'finance', 'security', 'organisation'));

INSERT INTO public.documents_catalog (code, dimension, label_fr, label_en, required_level, format_hint, note_seller, note_admin, sort_order) VALUES
('O-01', 'O', 'Organigramme nominatif et effectifs par fonction', 'Named org chart and headcount by function', 'blocking',
  'PDF ou tableau : fonctions, rattachements, ancienneté, temps plein/partiel',
  'Permet de mesurer la dépendance aux personnes clés et la profondeur de l''équipe.',
  'Compter les N-1 autonomes (keyPersonCount). Vérifier la cohérence avec les contrats de travail.', 1),
('O-02', 'O', 'Plan de succession et de continuité des personnes clés', 'Key-person succession and continuity plan', 'blocking',
  '1 à 3 pages : pour chaque personne clé, remplaçant identifié, délai, documentation associée',
  'Un plan même simple vaut mieux qu''aucun : il démontre la transmissibilité de l''organisation.',
  'Absence = successionPlanDocumented=no. Déclencheur O-** si combiné à la dépendance fondateur.', 2),
('O-03', 'O', 'Documentation opérationnelle (procédures, runbooks, onboarding)', 'Operational documentation (procedures, runbooks, onboarding)', 'blocking',
  'Index des procédures + 2 ou 3 exemples représentatifs (support, facturation, déploiement)',
  'Prouve que l''activité peut fonctionner sans transmission orale.',
  'Évaluer la couverture des processus critiques (operationalDocsComplete).', 3),
('O-04', 'O', 'Délégations de signature et de pouvoirs', 'Signing authority and delegation of powers', 'recommended',
  'Extrait registre, procès-verbal ou politique interne de délégation',
  'Montre que le fondateur n''est pas le seul à pouvoir engager la société.',
  'noSigningDelegation=yes si aucune délégation formalisée.', 4),
('O-05', 'O', 'Historique du turnover des talents clés (24 mois)', 'Key-talent turnover history (24 months)', 'recommended',
  'Tableau : départs/arrivées sur les postes critiques, motifs anonymisés',
  'Un faible turnover sur les postes clés est un signal fort de stabilité.',
  'lowKeyTalentTurnover=yes si aucun départ non remplacé sur poste critique.', 5),
('O-06', 'O', 'Gouvernance formalisée (comités, revues, reporting de direction)', 'Formalised management (committees, reviews, management reporting)', 'recommended',
  'Calendrier des comités, exemple d''ordre du jour et de reporting mensuel',
  'Une gouvernance formalisée rend l''organisation lisible pour un investisseur ou un acquéreur.',
  'formalizedManagement=yes si rituels documentés et tenus.', 6),
('O-07', 'O', 'Répartition commerciale : part des ventes portée par le fondateur', 'Sales ownership: share of revenue led by the founder', 'recommended',
  'Tableau : CA par commercial / canal sur 12 mois',
  'Si le fondateur porte l''essentiel des ventes, la valeur est fragile à la transmission.',
  'founderLeadsSales=yes si > 50 % du CA nouveau porté par le fondateur.', 7),
('O-08', 'O', 'Culture et valeurs documentées, politique RH', 'Documented culture and values, HR policy', 'optional',
  'Charte, manuel employé, politique de rémunération',
  'Optionnel mais valorisé : facilite l''intégration post-transmission.',
  'cultureDocumented=yes si document diffusé aux équipes.', 8),
('O-09', 'O', 'Conseil ou advisor indépendant (composition, mandats)', 'Independent board or advisor (composition, mandates)', 'optional',
  'Liste des membres, indépendance, fréquence des réunions',
  'Un regard externe structuré renforce la crédibilité de la gouvernance.',
  'independentAdvisor=yes si au moins un membre indépendant actif.', 9)
ON CONFLICT (code) DO NOTHING;

-- ── 2. Type de dossier ──────────────────────────────────────────────────
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS dossier_type TEXT NOT NULL DEFAULT 'transaction'
  CHECK (dossier_type IN ('certification', 'transaction'));

UPDATE public.assets SET dossier_type = 'certification'
WHERE asset_type = 'certification_cifso' AND dossier_type <> 'certification';

CREATE INDEX IF NOT EXISTS idx_assets_dossier_type ON public.assets (dossier_type, status);

-- ── 3. Certificat : vérification publique + validité ───────────────────
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS verification_code        TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS certificate_valid_until  TIMESTAMPTZ;

COMMENT ON COLUMN public.assets.verification_code IS
  'Code public de vérification du certificat CIFSO 5000 (format CIFSO-XXXX-XXXX). Généré à la publication du grade.';
COMMENT ON COLUMN public.assets.certificate_valid_until IS
  'Fin de validité du certificat : publication + 12 mois.';

-- ── 4. Pré-scoring documentaire automatique ────────────────────────────
ALTER TABLE public.assets
  ADD COLUMN IF NOT EXISTS prescore_json     JSONB,
  ADD COLUMN IF NOT EXISTS prescore_at       TIMESTAMPTZ;

-- ── 5. Périmètre du mandat expert ──────────────────────────────────────
ALTER TABLE public.partner_certifications
  ADD COLUMN IF NOT EXISTS scope TEXT NOT NULL DEFAULT 'certification'
  CHECK (scope IN ('certification', 'transaction'));
