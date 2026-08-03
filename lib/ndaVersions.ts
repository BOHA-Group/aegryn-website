/**
 * lib/ndaVersions.ts
 * Source unique de vérité pour les versions NDA profil.
 * Changer une version force tous les membres de ce rôle à re-signer.
 */
export const NDA_VERSIONS = {
  seller:  '2026-08',
  buyer:   '2026-08',
  partner: '2026-08',
} as const

export type NdaRole = keyof typeof NDA_VERSIONS
