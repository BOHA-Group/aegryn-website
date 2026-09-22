-- ============================================================
-- AEGRYN - CIFSO 5000 v4.11 : conformité réglementaire ventilée par dimension
--
-- 1. documents_catalog.applicability : conditionne le document au profil
--    réglementaire de l'actif (matrice d'applicabilité, lib/gradeEngine.ts).
--    NULL = universel.
-- 2. Nouvelles entrées catalogue : codes alignés sur les sous-codes du moteur :
--      C-50 CRA · C-51/C-52 Data Act technique · I-50 Data Act B2B ·
--      I-51 ePrivacy · I-52 DSA/P2B · I-53 sanctions · I-54 AML ·
--      S-52 NIS2 · S-53 DORA · S-54 AI Act · O-50 gouvernance conformité
--
-- Toutes les entrées sont 'recommended' - JAMAIS 'blocking' : le rapport CIFSO
-- reste toujours produisible et la publication n'est pas rétroactivement
-- bloquée pour les dossiers existants. Les manquements se traduisent en
-- pénalités de score, plafond AA et impact TRS côté moteur (v4.11).
-- ============================================================

-- ── 1. Colonne d'applicabilité ──────────────────────────────────────────
ALTER TABLE public.documents_catalog
  ADD COLUMN IF NOT EXISTS applicability TEXT;

COMMENT ON COLUMN public.documents_catalog.applicability IS
  'Clé du RegulatoryProfile (lib/gradeEngine.ts) qui conditionne le document : sellsConnectedProducts, processesEUData, isFinancialEntityOrICT, providesAISystems, operatesCriticalSector, sellsDigitalProducts, operatesPlatform, regulatory_scope (toute régulation applicable), NULL = universel.';

-- ── 2. Entrées catalogue ────────────────────────────────────────────────
INSERT INTO public.documents_catalog (code, dimension, label_fr, label_en, required_level, format_hint, note_seller, note_admin, sort_order, applicability) VALUES

-- ── C - Code & Architecture : conformité produit ────────────────────────
('C-50', 'C', 'SBOM et processus de gestion des vulnérabilités (Cyber Resilience Act)',
  'SBOM and vulnerability management process (Cyber Resilience Act)',
  'recommended',
  'SBOM (CycloneDX / SPDX) + document décrivant la gestion des vulnérabilités (détection, correctifs, coordinated disclosure)',
  'Si votre produit comporte des éléments numériques mis sur le marché UE : le CRA exige une SBOM et un processus documenté de gestion des vulnérabilités.',
  'Alimente le contrôle C-50 du moteur. Suffisant : SBOM à jour + processus formalisé. Insuffisant : SBOM absente ou processus informel.',
  10, 'sellsDigitalProducts'),

('C-51', 'C', 'Mécanisme d''accès aux données produit (EU Data Act : accès by design)',
  'Product data access mechanism (EU Data Act : access by design)',
  'recommended',
  'Documentation technique : interface utilisateur ou API donnant un accès direct, gratuit et par défaut aux données générées par le produit',
  'Si vous fabriquez ou vendez des produits connectés : le Data Act exige un accès direct, gratuit et par défaut aux données générées, pas via un tier payant ni un ticket support.',
  'Alimente le contrôle C-51 du moteur. Vérifier que l''accès est réellement direct/gratuit/défaut. Non conforme = plafond AA + TRS bloqué.',
  11, 'sellsConnectedProducts'),

('C-52', 'C', 'Portabilité des données et formats d''export (anti lock-in, Data Act ch. VI)',
  'Data portability and export formats (anti lock-in, Data Act ch. VI)',
  'recommended',
  'Documentation des formats d''export, API de récupération, procédure de changement de fournisseur de traitement',
  'Le client doit pouvoir changer de service de traitement de données. Le lock-in par incompatibilité de format n''est plus un modèle acceptable.',
  'Alimente C-51/I-50. Suffisant : export documenté et fonctionnel. Insuffisant : formats propriétaires non exportables.',
  12, 'sellsConnectedProducts'),

-- ── I - IP & Droits : conformité contractuelle et juridique ─────────────
('I-50', 'I', 'Conditions de partage de données B2B conformes FRAND (Data Act ch. III)',
  'B2B data-sharing terms compliant with FRAND (Data Act ch. III)',
  'recommended',
  'Conditions générales ou avenant : termes équitables, raisonnables et non discriminatoires, protection des secrets d''affaires',
  'Si vous détenez des données générées par les opérations de vos clients : elles peuvent être demandées et doivent être fournies à des conditions FRAND.',
  'Alimente le contrôle I-50 du moteur. Vérifier les clauses de partage, la protection des trade secrets et l''absence de clauses déloyales.',
  20, 'sellsConnectedProducts'),

('I-51', 'I', 'Registre des trackers et conformité du consentement (ePrivacy / cookies)',
  'Tracker register and consent compliance (ePrivacy / cookies)',
  'recommended',
  'Export du CMP (axeptio, Cookiebot…) ou document : liste des trackers, finalités, preuve du refus aussi simple que l''acceptation',
  'Tout site ou application traitant des données UE : le consentement cookies doit être conforme, refus aussi simple que l''acceptation.',
  'Alimente le contrôle I-51 du moteur. Vérifier l''absence de cookies déposés avant consentement.',
  21, 'processesEUData'),

('I-52', 'I', 'Conditions plateforme conformes DSA / P2B (transparence, business users)',
  'Platform terms compliant with DSA / P2B (transparency, business users)',
  'recommended',
  'CGU plateforme : transparence du ranking, préavis de modification, mécanisme de médiation interne',
  'Si vous opérez une plateforme en ligne : le règlement P2B impose des conditions équitables et transparentes pour les business users.',
  'Alimente le contrôle I-52 du moteur. Vérifier transparence du classement, préavis 30 jours, médiation.',
  22, 'operatesPlatform'),

('I-53', 'I', 'Déclaration d''absence d''exposition aux sanctions et embargos',
  'Declaration of no exposure to sanctions and embargoes',
  'recommended',
  'Document signé par le représentant légal : dirigeants, bénéficiaires effectifs et contreparties non soumis à sanctions EU/ONU/OFAC',
  'Document universel requis pour toute transaction : attestation d''absence d''exposition aux sanctions internationales.',
  'Alimente le contrôle I-53 du moteur. Exposition identifiée = TRS bloqué. Absence de déclaration = pénalité.',
  23, NULL),

('I-54', 'I', 'Politique AML/KYC documentée',
  'Documented AML/KYC policy',
  'recommended',
  'Procédures d''identification client, filtrage des bénéficiaires effectifs, processus de reporting',
  'Si l''actif est une entité financière ou opère une activité financière/crypto régulée : la politique anti-blanchiment doit être documentée.',
  'Alimente le contrôle I-54 du moteur. Suffisant : procédures écrites et appliquées. Insuffisant : pratique informelle non documentée.',
  24, 'isFinancialEntityOrICT'),

-- ── S - Sécurité : conformité cyber/résilience ──────────────────────────
('S-52', 'S', 'Enregistrement NIS2 et mesures de gestion des risques',
  'NIS2 registration and risk management measures',
  'recommended',
  'Preuve d''enregistrement auprès de l''autorité compétente + politique de gestion des risques + processus de notification d''incidents 24h/72h',
  'Si l''actif opère dans un secteur essentiel ou important (santé, énergie, transport, administration, numérique) : NIS2 impose enregistrement, mesures de gestion des risques et notification des incidents.',
  'Alimente le contrôle S-52 du moteur. Vérifier l''enregistrement effectif et l''existence du processus de notification.',
  41, 'operatesCriticalSector'),

('S-53', 'S', 'Registre TIC, tests de résilience et clauses prestataires (DORA)',
  'ICT register, resilience testing and provider clauses (DORA)',
  'recommended',
  'Registre d''information TIC + rapports de tests de résilience + avenants contractuels des prestataires TIC critiques',
  'Si l''actif est une entité financière ou un prestataire TIC du secteur financier : DORA exige un registre TIC, des tests de résilience et des clauses contractuelles spécifiques.',
  'Alimente le contrôle S-53 du moteur. Vérifier la tenue du registre et la couverture des prestataires critiques.',
  42, 'isFinancialEntityOrICT'),

('S-54', 'S', 'Classification de risque EU AI Act et documentation technique',
  'EU AI Act risk classification and technical documentation',
  'recommended',
  'Document de classification (annexe III / GPAI / risque minimal) + documentation technique du système IA si applicable',
  'Si l''actif développe ou fournit des systèmes d''IA : l''AI Act impose une classification de risque documentée et, selon la classe, une documentation technique et des obligations de transparence.',
  'Alimente le contrôle S-54 du moteur. Système haut risque (annexe III) sans évaluation de conformité = TRS bloqué.',
  43, 'providesAISystems'),

-- ── O - Organisation & Talent : gouvernance conformité ──────────────────
('O-50', 'O', 'Gouvernance de la conformité réglementaire',
  'Regulatory compliance governance',
  'recommended',
  'Organigramme ou PV désignant le responsable conformité (DPO, référent réglementaire) + reporting au niveau direction',
  'Dès qu''au moins une régulation est applicable : un responsable conformité doit être désigné avec une accountability formalisée au niveau direction.',
  'Alimente le contrôle O-50 du moteur. Suffisant : responsable nommé + accountability documentée. Insuffisant : responsabilité diffuse non formalisée.',
  10, 'regulatory_scope')

ON CONFLICT (code) DO UPDATE SET
  label_fr = EXCLUDED.label_fr, label_en = EXCLUDED.label_en,
  required_level = EXCLUDED.required_level, format_hint = EXCLUDED.format_hint,
  note_seller = EXCLUDED.note_seller, note_admin = EXCLUDED.note_admin,
  sort_order = EXCLUDED.sort_order, applicability = EXCLUDED.applicability;
