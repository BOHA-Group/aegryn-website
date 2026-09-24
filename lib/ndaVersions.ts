/**
 * lib/ndaVersions.ts
 * Source unique de vérité pour les versions NDA profil.
 * Changer une version force tous les membres de ce rôle à re-signer.
 *
 * 'client' : NDA générique demandé pour toute demande de certification
 *            CIFSO (accès dossiers + data room) — sans dépendance aux
 *            anciens rôles acquéreur/cédant.
 * 'partner': réécrit sans vocabulaire de transaction — re-signature requise.
 */
export const NDA_VERSIONS = {
  seller:  '2026-08',
  buyer:   '2026-08',
  partner: '2026-09',
  client:  '2026-09',
} as const

export type NdaRole = keyof typeof NDA_VERSIONS
