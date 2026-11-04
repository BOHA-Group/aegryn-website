/**
 * Préinscription des pros neediu : visible en preview et en local uniquement.
 * En production, la page, l'API et le lien du hero restent fermés tant que NEEDIU_PRO_PUBLIC n'est pas
 * défini à « true » (le go de publication) ; seul le sticker vert s'affiche, non cliquable.
 */
export const isNeediuProPublic = () => process.env.NEEDIU_PRO_PUBLIC === 'true'
export const isNeediuProVisible = () => isNeediuProPublic() || process.env.VERCEL_ENV !== 'production'

/** Villes proposées d'office ; toute autre ville est une saisie libre, regroupée ensuite côté neediu. */
export const NEEDIU_CITIES = [
  { key: 'bruxelles', name: 'Bruxelles', country: 'BE' },
  { key: 'paris', name: 'Paris', country: 'FR' },
  { key: 'geneve', name: 'Genève', country: 'CH' },
  { key: 'lausanne', name: 'Lausanne', country: 'CH' },
] as const
