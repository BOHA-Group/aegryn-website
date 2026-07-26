/**
 * lib/dataRoom.ts
 *
 * Types et helpers pour la data room sécurisée AEGRYN.
 * Toujours utiliser via l'API route /api/data-room/signed-url
 * — jamais générer d'URL signée côté client.
 */

export type DataRoomCategory = 'code' | 'ip' | 'finance' | 'security' | 'transversal'

export type DataRoomVisibility = 'admin_only' | 'assigned_partner' | 'nda_buyers'

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
}

export const CATEGORY_LABELS: Record<DataRoomCategory, string> = {
  code:        'Code (C)',
  ip:          'IP & Droits (I)',
  finance:     'Finance (F)',
  security:    'Sécurité (S)',
  transversal: 'Transversal',
}

export const VISIBILITY_LABELS: Record<DataRoomVisibility, string> = {
  admin_only:       'Masqué (admin/vendeur uniquement)',
  assigned_partner: 'Visible partenaire assigné',
  nda_buyers:       'Visible acheteurs NDA',
}

/* ── Expiration par défaut des URLs signées : 1 heure ── */
export const SIGNED_URL_EXPIRY_SECONDS = 3600
