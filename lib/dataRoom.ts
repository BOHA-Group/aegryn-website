/**
 * lib/dataRoom.ts
 *
 * Types et helpers pour la data room sécurisée Aegryn.
 * Toujours utiliser via l'API route /api/data-room/signed-url
 * — jamais générer d'URL signée côté client.
 */

export type DataRoomCategory = 'code' | 'ip' | 'finance' | 'security' | 'transversal' | 'legal'

export type DataRoomVisibility = 'admin_only' | 'assigned_partner' | 'nda_buyers' | 'light_buyers'

export type DocumentRequiredLevel = 'blocking' | 'recommended' | 'optional'

export type DocumentAdminQuality = 'pending_review' | 'sufficient' | 'insufficient' | 'missing'

export type DocumentDimension = 'C' | 'I' | 'F' | 'S' | 'T'

/** Niveau de data room : 'light' = préliminaire (12 docs), 'full' = complète CIFS */
export type DataRoomLevel = 'light' | 'full'

export interface DataRoomDocument {
  id: string
  asset_id: string
  category: DataRoomCategory
  document_type: string
  file_path: string
  file_name: string
  file_size_bytes: number | null
  mime_type: string | null
  uploaded_by: string
  visible_to: DataRoomVisibility
  is_sensitive: boolean
  notes: string | null
  uploaded_at: string
  expires_at: string | null
  document_code: string | null
  required_level: DocumentRequiredLevel
  admin_quality: DocumentAdminQuality
  admin_note: string | null
  blocks_grading: boolean
  room_level: DataRoomLevel
}

export interface DocumentCatalogEntry {
  code: string
  dimension: DocumentDimension
  label_fr: string
  label_en: string
  required_level: DocumentRequiredLevel
  format_hint: string | null
  note_seller: string | null
  note_admin: string | null
  sort_order: number
}

/* ── Mapping dimension → catégorie data_room ─────────────────────── */
export const DIMENSION_TO_CATEGORY: Record<DocumentDimension, DataRoomCategory> = {
  C: 'code',
  I: 'ip',
  F: 'finance',
  S: 'security',
  T: 'transversal',
}

export const DIMENSION_LABELS: Record<DocumentDimension, string> = {
  C: 'C — Code & Architecture',
  I: 'I — IP & Droits',
  F: 'F — Finance',
  S: 'S — Sécurité',
  T: 'T — Transversal',
}

export const ADMIN_QUALITY_LABELS: Record<DocumentAdminQuality, string> = {
  pending_review: 'À évaluer',
  sufficient:     'Suffisant',
  insufficient:   'Insuffisant',
  missing:        'Manquant',
}

export const ADMIN_QUALITY_COLORS: Record<DocumentAdminQuality, string> = {
  pending_review: 'bg-gray-50 text-gray-500',
  sufficient:     'bg-emerald-50 text-emerald-700',
  insufficient:   'bg-amber-50 text-amber-700',
  missing:        'bg-red-50 text-red-600',
}

export const REQUIRED_LEVEL_LABELS: Record<DocumentRequiredLevel, string> = {
  blocking:    'Bloquant',
  recommended: 'Recommandé',
  optional:    'Optionnel',
}

export interface DataRoomAccessLog {
  id: string
  document_id: string
  user_id: string
  action: 'signed_url_generated' | 'view_start' | 'view_end' | 'suspicious_activity' | 'session_end'
  detail: string | null
  ip_address: string | null
  user_agent: string | null
  session_duration_seconds: number | null
  created_at: string
}

/* ── Checklist de documents requis par dimension ─────────────────────── */
export const REQUIRED_DOCUMENTS: Record<DataRoomCategory, { type: string; label: string; sensitive: boolean }[]> = {
  code: [
    { type: 'repo_access',       label: 'Accès repository (lecture seule ou export)',       sensitive: false },
    { type: 'tech_doc',          label: 'Documentation technique (README, architecture)',    sensitive: false },
    { type: 'test_coverage',     label: 'Rapport de couverture de tests',                   sensitive: false },
    { type: 'incident_history',  label: 'Historique incidents techniques (12 derniers mois)',sensitive: false },
    { type: 'dependencies',      label: 'Liste des dépendances tierces critiques',           sensitive: false },
    { type: 'cicd_report',       label: 'Rapport CI/CD',                                    sensitive: false },
  ],
  ip: [
    { type: 'trademark_cert',    label: 'Certificat(s) de dépôt de marque',                 sensitive: true  },
    { type: 'ip_assignment',     label: 'Contrats de cession de droits (fondateurs, salariés, freelances)', sensitive: true },
    { type: 'oss_licenses',      label: 'Contrats de licence open source critiques',         sensitive: false },
    { type: 'client_contracts',  label: 'Contrats clients (clauses pertinentes)',            sensitive: true  },
    { type: 'kbis',              label: 'Extrait Kbis ou équivalent',                        sensitive: false },
    { type: 'statuts',           label: 'Statuts de la société',                             sensitive: false },
    { type: 'shareholders',      label: 'Registre des associés / actionnaires',              sensitive: true  },
    { type: 'ip_no_dispute',     label: "Preuve d'absence de litige IP (déclaration)",       sensitive: false },
  ],
  finance: [
    { type: 'annual_accounts',   label: 'Comptes annuels certifiés (2-3 derniers exercices)',sensitive: true  },
    { type: 'ledger',            label: 'Grand livre ou export comptable détaillé',          sensitive: true  },
    { type: 'arr_mrr',           label: 'Tableau de bord ARR/MRR mensuel (12-24 mois)',      sensitive: true  },
    { type: 'churn_nrr',         label: 'Détail churn et NRR par cohorte',                   sensitive: true  },
    { type: 'client_revenue',    label: 'Liste clients avec CA par client',                  sensitive: true  },
    { type: 'forecast',          label: 'Prévisionnel financier',                            sensitive: true  },
    { type: 'bank_statements',   label: 'Justificatifs bancaires (relevés récents)',         sensitive: true  },
    { type: 'cap_table',         label: 'Cap table (répartition du capital)',                sensitive: true  },
  ],
  security: [
    { type: 'pentest',           label: 'Rapport de pentest le plus récent',                 sensitive: true  },
    { type: 'rgpd_register',     label: 'Registre de traitement RGPD/LPD',                  sensitive: true  },
    { type: 'privacy_policy',    label: 'Politique de confidentialité et CGU actuelles',     sensitive: false },
    { type: 'mfa_proof',         label: 'Preuve de MFA / gestion des accès',                 sensitive: false },
    { type: 'security_incidents',label: 'Historique incidents de sécurité déclarés',         sensitive: false },
    { type: 'dpa_contracts',     label: 'Contrats sous-traitants données (DPA signés)',      sensitive: true  },
  ],
  transversal: [
    { type: 'org_chart',         label: 'Organigramme et effectifs',                         sensitive: false },
    { type: 'supplier_contracts',label: 'Baux, contrats fournisseurs significatifs',         sensitive: true  },
    { type: 'insurance',         label: 'Assurances en cours (RC Pro, cyber)',               sensitive: false },
    { type: 'id_legal_rep',      label: "Pièce d'identité du représentant légal (KYC)",      sensitive: true  },
  ],
  legal: [
    { type: 'kbis',              label: 'Kbis ou équivalent (< 3 mois)',                     sensitive: false },
    { type: 'statuts',           label: 'Statuts à jour',                                    sensitive: false },
    { type: 'cap_table',         label: 'Cap table (répartition du capital, anonymisé)',     sensitive: true  },
    { type: 'litigation',        label: 'Déclaration de litiges en cours (ou absence)',      sensitive: false },
  ],
}

export const CATEGORY_LABELS: Record<DataRoomCategory, string> = {
  code:        'Code (C)',
  ip:          'IP & Droits (I)',
  finance:     'Finance (F)',
  security:    'Sécurité (S)',
  transversal: 'Transversal',
  legal:       'Légal (L)',
}

export const VISIBILITY_LABELS: Record<DataRoomVisibility, string> = {
  admin_only:       'Masqué (admin/vendeur uniquement)',
  assigned_partner: 'Visible partenaire assigné',
  light_buyers:     'Data room light (KYC validé, avant offre de principe)',
  nda_buyers:       'Data room complète (séquestre reçu)',
}

/* ── Expiration par défaut des URLs signées : 1 heure ── */
export const SIGNED_URL_EXPIRY_SECONDS = 3600

/* ════════════════════════════════════════════════════════════════════════
 * DATA ROOM LIGHT PRESET — 12 documents fondamentaux
 *
 * Ces 12 documents répondent aux 4 questions qu'un acquéreur sérieux
 * pose avant de faire une offre de principe :
 *   1. "Est-ce que l'actif existe vraiment ?" (légal)
 *   2. "Est-ce qu'il génère des revenus réels ?" (finance)
 *   3. "Est-ce que le code m'appartient ?" (IP + code)
 *   4. "Est-ce qu'il y a des bombes cachées ?" (sécurité/risques)
 *
 * 8 bloquants + 4 recommandés = minimum viable pour une offre informée.
 * Accès débloqué quand les 8 bloquants ont admin_quality='sufficient'.
 * ════════════════════════════════════════════════════════════════════════ */
export const DATA_ROOM_LIGHT_PRESET = [
  /* ── L — Légal ─────────────────────────────────────────────────────── */
  {
    code:           'L-01',
    label_fr:       'Kbis ou équivalent (immatriculation < 3 mois)',
    label_en:       'Company registration certificate (< 3 months)',
    category:       'legal'     as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   false,
    format_hint:    'Kbis INPI, extrait RC Suisse, etc.',
    note_seller:    'Prouve que la société existe et est en règle. Document à renouveler tous les 3 mois.',
  },
  {
    code:           'L-02',
    label_fr:       'Statuts à jour',
    label_en:       'Articles of association (current)',
    category:       'legal'     as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   false,
    format_hint:    'PDF signé — version la plus récente avec toutes les modifications',
    note_seller:    'Prouve la structure de propriété et la gouvernance.',
  },
  {
    code:           'L-03',
    label_fr:       'Cap table (répartition du capital, anonymisé)',
    label_en:       'Cap table (anonymised)',
    category:       'legal'     as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   true,
    format_hint:    'Tableau : Associé A, X%, type (ordinaire/préférentielle)',
    note_seller:    'Prouve que la cession est possible sans blocage minoritaire. Identités anonymisables.',
  },
  {
    code:           'R-01',
    label_fr:       'Déclaration de litiges en cours (ou attestation d\'absence)',
    label_en:       'Litigation disclosure statement',
    category:       'legal'     as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   false,
    format_hint:    '1 page — "Aucun litige en cours" ou liste avec statut',
    note_seller:    'Document souvent oublié qui peut bloquer une offre si découvert tardivement.',
  },

  /* ── F — Finance ────────────────────────────────────────────────────── */
  {
    code:           'F-01',
    label_fr:       'Dashboard MRR/ARR des 12 derniers mois',
    label_en:       'MRR/ARR dashboard — last 12 months',
    category:       'finance'   as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   true,
    format_hint:    'Export Stripe, ChartMogul, Baremetrics ou tableau Excel structuré',
    note_seller:    'Document le plus regardé en premier. Sans ça, aucune offre sérieuse n\'est possible.',
  },
  {
    code:           'F-02',
    label_fr:       'Compte de résultat simplifié (2 derniers exercices)',
    label_en:       'P&L — last 2 fiscal years (simplified)',
    category:       'finance'   as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'recommended' as DocumentRequiredLevel,
    is_sensitive:   true,
    format_hint:    'Revenus, charges opérationnelles, résultat net. Pas les comptes complets.',
    note_seller:    'Permet à l\'acquéreur de comprendre la structure de marge sans due diligence complète.',
  },
  {
    code:           'F-03',
    label_fr:       'Tableau de trésorerie (3 derniers mois)',
    label_en:       'Cash flow — last 3 months',
    category:       'finance'   as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'recommended' as DocumentRequiredLevel,
    is_sensitive:   true,
    format_hint:    'Relevé ou export bancaire avec solde de trésorerie',
    note_seller:    'Prouve que l\'actif est opérationnel et solvable au moment de la cession.',
  },
  {
    code:           'F-04',
    label_fr:       'Liste clients anonymisée avec ARR par client',
    label_en:       'Anonymised client list with ARR per client',
    category:       'finance'   as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   true,
    format_hint:    '"Client A, secteur SaaS B2B, 24K€/an, contrat 2 ans" — sans noms réels',
    note_seller:    'Montre la concentration client. Un acquéreur refuse une offre si 80% ARR = 1 client.',
  },

  /* ── I — IP & Droits ────────────────────────────────────────────────── */
  {
    code:           'I-01',
    label_fr:       'Preuve de propriété du domaine + marque (si déposée)',
    label_en:       'Domain + trademark proof of ownership',
    category:       'ip'        as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'recommended' as DocumentRequiredLevel,
    is_sensitive:   false,
    format_hint:    'Screenshot WHOIS + certificat IPI/INPI/EUIPO si disponible',
    note_seller:    'Si pas de marque déposée, une simple déclaration d\'usage suffit.',
  },
  {
    code:           'I-02',
    label_fr:       'Déclaration de cession des droits sur le code',
    label_en:       'IP rights assignment declaration (code)',
    category:       'ip'        as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   true,
    format_hint:    '1-2 pages signées par fondateur + prestataires principaux ayant contribué au code',
    note_seller:    'Sans ce document, l\'acheteur ne sait pas s\'il achète réellement le code source.',
  },

  /* ── C — Code ───────────────────────────────────────────────────────── */
  {
    code:           'C-01',
    label_fr:       'README technique + vue d\'ensemble de l\'architecture',
    label_en:       'Technical README + architecture overview',
    category:       'code'      as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'recommended' as DocumentRequiredLevel,
    is_sensitive:   false,
    format_hint:    '1-2 pages : stack, infrastructure, dépendances critiques, volume de code',
    note_seller:    'Pas les détails secrets — juste la structure pour que l\'acquéreur comprenne ce qu\'il achète.',
  },

  /* ── S — Sécurité & Risques ─────────────────────────────────────────── */
  {
    code:           'S-01',
    label_fr:       'Déclaration de conformité RGPD / registre simplifié',
    label_en:       'GDPR compliance declaration / simplified register',
    category:       'security'  as DataRoomCategory,
    room_level:     'light'     as DataRoomLevel,
    required_level: 'blocking'  as DocumentRequiredLevel,
    is_sensitive:   false,
    format_hint:    '1 page : types de données, base légale, durée de conservation, transferts',
    note_seller:    'Prouve qu\'il n\'y a pas de bombe RGPD. Requis pour tout actif traitant des données UE.',
  },
] as const

/** Codes des documents bloquants de la data room light */
export const DATA_ROOM_LIGHT_BLOCKING_CODES = DATA_ROOM_LIGHT_PRESET
  .filter((d) => d.required_level === 'blocking')
  .map((d) => d.code) as string[]

/** Nombre de bloquants requis pour débloquer l'accès light */
export const DATA_ROOM_LIGHT_BLOCKING_MIN = DATA_ROOM_LIGHT_BLOCKING_CODES.length // = 8

/** Seuil minimum de bloquants validés (sufficient) pour que la DR light soit complète */
export const DATA_ROOM_LIGHT_COMPLETE_THRESHOLD = DATA_ROOM_LIGHT_BLOCKING_MIN
