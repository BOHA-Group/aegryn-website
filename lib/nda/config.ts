/**
 * Configuration du NDA mutuel Aegryn.
 *
 * NDA_TEMPLATE_STATUS : 'draft' tant que le modèle n'a pas été validé par le
 * conseil juridique ; l'admin affiche alors un avertissement. Passer à
 * 'validated' une fois le texte approuvé.
 * Changer NDA_TEMPLATE_VERSION à chaque modification du texte : la version
 * et l'empreinte du texte accepté sont conservées avec chaque signature.
 */
export const NDA_TEMPLATE_VERSION = '2026-10-v2'
export const NDA_TEMPLATE_STATUS: 'draft' | 'validated' = 'draft'

export const AEGRYN_PARTY = {
  name:    'Aegryn',
  address: 'c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Suisse',
  uid:     'CHE-402.011.821',
} as const

/** Signataire autorisé d'Aegryn (contresignature automatique). Surchargeable par variables d'environnement. */
export function getAegrynSignatory(): { name: string; title: string } {
  return {
    name:  process.env.NDA_AEGRYN_SIGNATORY_NAME?.trim()  || 'Yohann Bollack',
    title: process.env.NDA_AEGRYN_SIGNATORY_TITLE?.trim() || 'CEO',
  }
}

/** Destinataire des notifications NDA (copies signées, demandes) : le compte admin qui gère les NDA */
export const getNdaNotifyEmail = () => process.env.NDA_NOTIFY_EMAIL?.trim() || 'admin@boha-group.com'

export const NDA_DEFAULT_TERM_YEARS = 5
export const NDA_LINK_VALIDITY_DAYS = 14
export const NDA_BUCKET = 'nda-signed'
