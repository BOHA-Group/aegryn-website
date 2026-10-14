/**
 * Configuration du NDA mutuel Aegryn.
 *
 * NDA_TEMPLATE_STATUS : 'draft' tant que le modèle n'a pas été validé par le
 * conseil juridique ; l'admin affiche alors un avertissement. Passer à
 * 'validated' une fois le texte approuvé.
 * Changer NDA_TEMPLATE_VERSION à chaque modification du texte : la version
 * et l'empreinte du texte accepté sont conservées avec chaque signature.
 */
export const NDA_TEMPLATE_VERSION = '2026-10-v1'
export const NDA_TEMPLATE_STATUS: 'draft' | 'validated' = 'draft'

export const AEGRYN_PARTY = {
  name:    'Aegryn',
  address: 'c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Suisse',
  uid:     'CHE-402.011.821',
} as const

/** Signataire autorisé d'Aegryn (contresignature automatique) : variables d'environnement */
export function getAegrynSignatory(): { name: string; title: string } | null {
  const name  = process.env.NDA_AEGRYN_SIGNATORY_NAME?.trim()
  const title = process.env.NDA_AEGRYN_SIGNATORY_TITLE?.trim()
  return name && title ? { name, title } : null
}

export const NDA_DEFAULT_TERM_YEARS = 5
export const NDA_LINK_VALIDITY_DAYS = 14
export const NDA_BUCKET = 'nda-signed'
