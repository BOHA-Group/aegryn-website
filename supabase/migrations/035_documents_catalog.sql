-- ════════════════════════════════════════════════════════════════════════
-- 035_documents_catalog.sql
--
-- 1. Catalogue maître des 33+ codes de documents CIFS+T
--    (source de vérité pour checklist vendeur + évaluation admin)
-- 2. ALTER data_room_documents :
--    document_code, required_level, admin_quality, admin_note, blocks_grading
-- ════════════════════════════════════════════════════════════════════════

-- ── 1. Table catalogue maître ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.documents_catalog (
  code          TEXT        PRIMARY KEY,          -- ex: 'C-01', 'F-02', 'S-04'
  dimension     TEXT        NOT NULL
    CHECK (dimension IN ('C', 'I', 'F', 'S', 'T')),
  label_fr      TEXT        NOT NULL,
  label_en      TEXT        NOT NULL,
  required_level TEXT       NOT NULL DEFAULT 'recommended'
    CHECK (required_level IN ('blocking', 'recommended', 'optional')),
  format_hint   TEXT,                             -- conseils format (visible vendeur)
  note_seller   TEXT,                             -- note pédagogique vendeur
  note_admin    TEXT,                             -- critères d'évaluation (admin only)
  sort_order    INT         NOT NULL DEFAULT 99,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.documents_catalog IS
  'Catalogue maître des documents requis par dimension CIFS+T pour le grading AEGRYN.';

-- ── 2. Remplissage du catalogue ───────────────────────────────────────

INSERT INTO public.documents_catalog
  (code, dimension, label_fr, label_en, required_level, format_hint, note_seller, note_admin, sort_order)
VALUES

-- ── DIMENSION C — CODE & ARCHITECTURE ─────────────────────────────────
('C-01', 'C', 'Accès repository en lecture seule',
  'Read-only repository access',
  'blocking',
  'Invitation GitHub/GitLab OU export ZIP horodaté',
  'L''accès sera révoqué automatiquement 30 jours après le closing.',
  'Suffisant : code propre, commits réguliers, pas de credentials en dur dans l''historique git. Insuffisant : dépôt vide, commits irréguliers >6 mois, secrets exposés.',
  1),

('C-02', 'C', 'README et documentation d''installation',
  'README and installation documentation',
  'blocking',
  'Fichier .md ou .pdf',
  'Un README vide ou générique entraîne une pénalité sur le score Code.',
  'Suffisant : README avec setup, architecture, déploiement. Insuffisant : README vide ou copié-collé d''un template.',
  2),

('C-03', 'C', 'Liste des dépendances principales avec versions',
  'Dependency list with versions',
  'blocking',
  'package.json / requirements.txt / Gemfile / pom.xml / go.mod ou export PDF',
  'Inclure les dépendances directes ET transitives si possible.',
  'Suffisant : fichier à jour, dépendances < 24 mois. Insuffisant : dépendances non maintenues ou >2 ans, CVE critique identifiable.',
  3),

('C-04', 'C', 'Rapport de couverture de tests',
  'Test coverage report',
  'recommended',
  'Export HTML ou PDF (Jest, pytest, etc.)',
  'Si vous n''avez pas de rapport formel, une capture d''écran de votre CI avec % de couverture est acceptée.',
  'Bloquant si absent pour Grade ★ ou AAA. Accepté pour Grade AA→B avec pénalité de score.',
  4),

('C-05', 'C', 'Schéma d''architecture technique',
  'Technical architecture diagram',
  'recommended',
  'PDF, PNG, draw.io, Mermaid',
  'Un schéma de 5 minutes vaut mieux qu''une description textuelle longue.',
  NULL,
  5),

('C-06', 'C', 'Rapport CI/CD',
  'CI/CD pipeline report',
  'recommended',
  'Capture ou export GitHub Actions / GitLab CI / CircleCI',
  NULL,
  NULL,
  6),

('C-07', 'C', 'Documentation API',
  'API documentation',
  'recommended',
  'Swagger/OpenAPI .yaml, Postman collection, ou PDF',
  'Uniquement si une API est exposée.',
  NULL,
  7),

('C-08', 'C', 'Historique des incidents techniques (12 derniers mois)',
  'Technical incident history (last 12 months)',
  'optional',
  'Export Sentry / Datadog / PagerDuty ou document libre',
  NULL,
  NULL,
  8),

('C-09', 'C', 'Rapport de dette technique',
  'Technical debt report',
  'optional',
  'Rapport SonarQube, CodeClimate, ou document libre',
  NULL,
  NULL,
  9),

-- ── DIMENSION I — IP & DROITS ──────────────────────────────────────────
('I-01', 'I', 'Extrait Kbis ou équivalent (<3 mois)',
  'Company registration extract (<3 months)',
  'blocking',
  'PDF officiel',
  'Pour les entités hors France : extrait du registre du commerce de votre juridiction, traduit si nécessaire.',
  NULL,
  10),

('I-02', 'I', 'Statuts de la société (version en vigueur)',
  'Articles of incorporation (current version)',
  'blocking',
  'PDF',
  NULL,
  NULL,
  11),

('I-03', 'I', 'Registre des associés / cap table actuelle',
  'Shareholders register / current cap table',
  'blocking',
  'PDF ou export Excel',
  'Inclure les pourcentages de détention et tout instrument dilutif (BSPCE, options, obligations convertibles).',
  NULL,
  12),

('I-04', 'I', 'Contrats de cession de droits salariés/prestataires',
  'IP assignment agreements (employees/contractors)',
  'blocking',
  'Contrats signés (PDF) ou attestation avocat',
  'C''est le document le plus fréquemment manquant. Même un contrat de freelance de 2019 doit y figurer si ce freelance a contribué au code.',
  'Suffisant : tous les contributeurs couverts. Insuffisant : prestataires sans contrat. Bloquant grade ★/AAA : contributeur clé sans aucun contrat.',
  13),

('I-05', 'I', 'Certificat(s) de dépôt de marque',
  'Trademark registration certificate(s)',
  'recommended',
  'Certificat INPI / IGE-IPI / EUIPO (PDF officiel)',
  'Si la marque est en cours de dépôt, joindre l''accusé de réception.',
  'Suffisant : marque déposée dans la juridiction principale. Risque : en cours avec opposition possible. Bloquant : non déposée ET nom générique non protégeable.',
  14),

('I-06', 'I', 'Audit des licences open source',
  'Open source license audit',
  'recommended',
  'Rapport FOSSA / WhiteSource / Black Duck ou liste manuelle',
  'Une dépendance GPL non identifiée peut bloquer la cession — mieux vaut l''identifier maintenant.',
  'Bloquant : dépendance GPL dans un actif propriétaire B2B SaaS sans analyse de risque documentée.',
  15),

('I-07', 'I', 'Contrats clients significatifs (extraits)',
  'Significant client contracts (extracts)',
  'recommended',
  'PDF avec données sensibles client masquées',
  'Masquer le nom du client si souhaité — ce qui intéresse l''acheteur : les clauses de propriété des développements et de non-résiliation.',
  NULL,
  16),

('I-08', 'I', 'Brevets ou dépôts de brevets',
  'Patents or patent applications',
  'optional',
  'Certificat ou numéro de dépôt vérifiable',
  NULL,
  NULL,
  17),

('I-09', 'I', 'Contrats de licence entrants (logiciels tiers payants)',
  'Inbound license agreements (paid third-party software)',
  'optional',
  'Contrats ou captures des abonnements actifs',
  NULL,
  NULL,
  18),

('I-10', 'I', 'Déclaration d''absence de litige IP',
  'Declaration of absence of IP dispute',
  'optional',
  'Document libre signé par le représentant légal',
  'Si un litige existe, le déclarer ici est protégé — le dissimuler entraîne une résolution automatique du grade en cas de découverte.',
  'Bloquant automatique : litige IP actif non résolu → code refus I-18.',
  19),

-- ── DIMENSION F — FINANCE ──────────────────────────────────────────────
('F-01', 'F', 'Comptes annuels (2 derniers exercices)',
  'Annual accounts (last 2 fiscal years)',
  'blocking',
  'Liasse fiscale complète (PDF officiel) ou comptes certifiés expert-comptable',
  'Si l''exercice <12 mois : joindre les relevés bancaires des 12 derniers mois en complément.',
  'Suffisant : certifiés par expert-comptable. Insuffisant : déclaratifs sans certification → active automatiquement F-12 (ARR auto-déclaré).',
  20),

('F-02', 'F', 'Tableau ARR/MRR mensuel (24 derniers mois minimum)',
  'Monthly ARR/MRR table (24+ months)',
  'blocking',
  'Excel ou CSV : mois / nouveaux clients / churned / expansion / ARR total',
  'C''est le document le plus analysé. Un tableau propre et cohérent avec les comptes annuels booste significativement le score F.',
  'Suffisant : tableau propre, cohérent avec F-01, sans trous. Insuffisant : données incomplètes, mois manquants, formules cassées. Bloquant grade F1 : données non réconciliables.',
  21),

('F-03', 'F', 'Liste des clients actifs avec CA annuel par client',
  'Active client list with annual revenue per client',
  'blocking',
  'Excel ou CSV — le nom du client peut être remplacé par un identifiant anonyme',
  'L''objectif n''est pas d''identifier vos clients mais de mesurer la concentration.',
  'Automatiquement calculé : si 1 client > 30% du CA → code F-39. Si 1 client > 50% → note interne "Deal risk élevé".',
  22),

('F-04', 'F', 'Analyse de la rétention (churn et NRR par cohorte)',
  'Retention analysis (churn and NRR by cohort)',
  'recommended',
  'Tableau Excel ou export ChartMogul / Baremetrics / ProfitWell',
  'Si vous n''avez pas d''outil de suivi, un calcul manuel expliqué est accepté.',
  NULL,
  23),

('F-05', 'F', 'Prévisionnel financier 12-24 mois',
  'Financial forecast 12-24 months',
  'recommended',
  'Modèle Excel avec hypothèses documentées',
  'Un prévisionnel sans hypothèses expliquées a peu de valeur. Expliquez vos hypothèses de croissance.',
  NULL,
  24),

('F-06', 'F', 'Cap table détaillée',
  'Detailed cap table',
  'recommended',
  'Excel ou PDF',
  'Inclure les instruments dilutifs (BSPCE, obligations convertibles, prêts convertibles). Si déjà dans I-03, non nécessaire.',
  NULL,
  25),

('F-07', 'F', 'Contrats de prêts / dettes en cours',
  'Loan agreements / current debts',
  'recommended',
  'Contrats ou tableau récapitulatif',
  'Inclure les dettes fournisseurs significatives.',
  'Bloquant si dette > 3x ARR sans plan de remboursement documenté.',
  26),

('F-08', 'F', 'Relevés bancaires 6 derniers mois',
  'Bank statements (last 6 months)',
  'optional',
  'PDF banque',
  'Optionnel si F-01 couvre la période.',
  NULL,
  27),

('F-09', 'F', 'Tableau de bord opérationnel (KPIs)',
  'Operational dashboard (KPIs)',
  'optional',
  'Export PDF ou capture (Notion, Looker, Metabase…)',
  NULL,
  NULL,
  28),

-- ── DIMENSION S — SÉCURITÉ ────────────────────────────────────────────
('S-01', 'S', 'Politique de confidentialité en vigueur',
  'Current privacy policy',
  'blocking',
  'URL publique ou PDF',
  'Si la politique date de plus de 24 mois sans mise à jour, c''est une alerte sur le score S.',
  NULL,
  29),

('S-02', 'S', 'Registre de traitement RGPD/LPD',
  'GDPR/LPD processing register',
  'blocking',
  'Template Excel CNIL ou équivalent',
  'Si vous n''avez pas de registre formel, une déclaration sur l''honneur des traitements principaux est acceptée pour un Grade A/B — bloquante pour AAA/★.',
  'Bloquant grade ★/AAA : registre absent. Acceptable grade A/B : déclaration sur l''honneur.',
  30),

('S-03', 'S', 'Liste des sous-traitants de données (DPA)',
  'Data processor list (DPA)',
  'blocking',
  'Liste avec DPA signé ou lien vers DPA public (AWS, Stripe, Intercom…)',
  'Un DPA non signé avec un sous-traitant traitant des données EU est une non-conformité RGPD.',
  NULL,
  31),

('S-04', 'S', 'Rapport de pentest le plus récent',
  'Most recent penetration test report',
  'recommended',
  'Rapport PDF du prestataire de sécurité',
  'Sans pentest dans les 18 derniers mois, le score S sera plafonné à 2/4 au maximum.',
  '< 6 mois + 0 vuln critique → S-11. 6-12 mois → S-12. > 12 mois → S-13. Absent → S-14. Bloquant automatique : vuln critique non résolue → S-17.',
  32),

('S-05', 'S', 'Preuve de gestion des accès (MFA, RBAC)',
  'Access management proof (MFA, RBAC)',
  'recommended',
  'Capture panel admin + description de la politique d''accès',
  'La présence de MFA sur tous les comptes admin est vérifiée — pas uniquement sur votre compte.',
  NULL,
  33),

('S-06', 'S', 'Attestation de gestion des secrets',
  'Secret management attestation',
  'recommended',
  'Document décrivant la gestion des clés API, tokens, credentials (vault, env vars, HSM)',
  'Si des credentials apparaissent en dur dans le code, le score C est également impacté.',
  'Bloquant automatique si couplé à C-01 avec credentials visibles dans git history → code C-40.',
  34),

('S-07', 'S', 'Certification ISO 27001 ou SOC 2',
  'ISO 27001 or SOC 2 certification',
  'optional',
  'Certificat ou rapport d''audit',
  'Rare sur les actifs de moins de 2M€ ARR — mais un avantage décisif si présent.',
  NULL,
  35),

('S-08', 'S', 'Historique des incidents de sécurité déclarés',
  'Declared security incident history',
  'optional',
  'Document libre',
  'Un incident géré et documenté est moins pénalisant qu''une absence totale d''historique.',
  NULL,
  36),

('S-09', 'S', 'Plan de continuité / reprise d''activité (PCA/PRA)',
  'Business continuity / disaster recovery plan',
  'optional',
  'Document libre ou extract de runbook',
  NULL,
  NULL,
  37),

-- ── TRANSVERSAL ───────────────────────────────────────────────────────
('T-01', 'T', 'Organigramme et effectifs actuels',
  'Current org chart and headcount',
  'recommended',
  'PDF ou Excel',
  'Préciser les rôles clés et si des personnes clés ont un contrat de non-départ post-cession.',
  NULL,
  38),

('T-02', 'T', 'Liste des contrats fournisseurs significatifs',
  'List of significant supplier contracts',
  'recommended',
  'Tableau récapitulatif',
  'Contrats > 5K€/an uniquement.',
  NULL,
  39),

('T-03', 'T', 'Assurances en vigueur (RC Pro, cyber)',
  'Current insurance policies (liability, cyber)',
  'recommended',
  'Attestation assureur',
  NULL,
  NULL,
  40)

ON CONFLICT (code) DO NOTHING;

-- ── 3. ALTER data_room_documents ─────────────────────────────────────

ALTER TABLE public.data_room_documents
  ADD COLUMN IF NOT EXISTS document_code TEXT,
  ADD COLUMN IF NOT EXISTS required_level TEXT DEFAULT 'recommended'
    CHECK (required_level IN ('blocking', 'recommended', 'optional')),
  ADD COLUMN IF NOT EXISTS admin_quality TEXT DEFAULT 'pending_review'
    CHECK (admin_quality IN ('pending_review', 'sufficient', 'insufficient', 'missing')),
  ADD COLUMN IF NOT EXISTS admin_note TEXT,
  ADD COLUMN IF NOT EXISTS blocks_grading BOOLEAN DEFAULT FALSE;

COMMENT ON COLUMN public.data_room_documents.document_code IS
  'Code du catalogue AEGRYN : C-01, I-04, F-02, S-04, T-01… NULL si document libre hors catalogue.';
COMMENT ON COLUMN public.data_room_documents.required_level IS
  'blocking = bloque le grading si absent. recommended = impacte le score. optional = différencie positivement.';
COMMENT ON COLUMN public.data_room_documents.admin_quality IS
  'Évaluation qualitative admin : pending_review / sufficient / insufficient / missing.';
COMMENT ON COLUMN public.data_room_documents.admin_note IS
  'Note interne admin — JAMAIS visible du vendeur. Champ libre.';
COMMENT ON COLUMN public.data_room_documents.blocks_grading IS
  'TRUE si required_level=blocking ET admin_quality IN (missing, insufficient). Calculé par trigger.';

-- ── 4. Trigger : calculer blocks_grading automatiquement ──────────────

CREATE OR REPLACE FUNCTION public.update_blocks_grading()
RETURNS TRIGGER AS $$
BEGIN
  NEW.blocks_grading := (
    NEW.required_level = 'blocking'
    AND NEW.admin_quality IN ('missing', 'insufficient')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_blocks_grading ON public.data_room_documents;
CREATE TRIGGER trg_blocks_grading
  BEFORE INSERT OR UPDATE ON public.data_room_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_blocks_grading();

-- ── 5. Vue complétude par dimension (admin) ───────────────────────────

CREATE OR REPLACE VIEW public.v_document_completeness AS
SELECT
  d.asset_id,
  c.dimension,
  COUNT(c.code)                                                           AS total_catalog,
  COUNT(c.code) FILTER (WHERE c.required_level = 'blocking')             AS blocking_total,
  COUNT(d2.id)  FILTER (WHERE c.required_level = 'blocking'
    AND d2.admin_quality = 'sufficient')                                  AS blocking_ok,
  COUNT(d2.id)  FILTER (WHERE c.required_level = 'recommended')          AS recommended_uploaded,
  COUNT(c.code) FILTER (WHERE c.required_level = 'recommended')          AS recommended_total,
  BOOL_OR(d2.blocks_grading)                                             AS has_blocking_doc,
  STRING_AGG(c.code, ', ') FILTER (WHERE d2.blocks_grading IS TRUE)      AS blocking_codes
FROM public.documents_catalog c
CROSS JOIN (SELECT DISTINCT asset_id FROM public.data_room_documents) d
LEFT JOIN public.data_room_documents d2
  ON d2.asset_id = d.asset_id AND d2.document_code = c.code
GROUP BY d.asset_id, c.dimension;

GRANT SELECT ON public.v_document_completeness TO service_role, authenticated;

-- ── 6. RLS sur documents_catalog (lecture seule pour tous) ────────────

ALTER TABLE public.documents_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "catalog_read_all"
  ON public.documents_catalog FOR SELECT
  USING (true);

GRANT SELECT ON public.documents_catalog TO authenticated, anon;
GRANT ALL    ON public.documents_catalog TO service_role;

-- ── 7. Index ──────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_drd_document_code ON public.data_room_documents(document_code);
CREATE INDEX IF NOT EXISTS idx_drd_blocks_grading ON public.data_room_documents(asset_id, blocks_grading)
  WHERE blocks_grading = TRUE;
