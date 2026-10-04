import type { AdvisoryKey, AdvisoryPageContent } from './types'
import { ADVISORY_FR } from './fr'

export type { AdvisoryKey, AdvisoryPageContent, LifecycleSlug } from './types'

/* Une langue est ajoutée ici une fois son contenu validé. Tant qu'elle
   n'y figure pas, la page retombe sur le gabarit i18n historique. */
const BY_LOCALE: Partial<Record<string, Record<AdvisoryKey, AdvisoryPageContent>>> = {
  fr: ADVISORY_FR,
}

export function getAdvisoryPage(locale: string, key: AdvisoryKey): AdvisoryPageContent | null {
  return BY_LOCALE[locale]?.[key] ?? null
}

/** Libellés des cycles de vie VALORISER, par langue (slugs FR des routes) */
export const LIFECYCLE_LABELS: Record<string, Record<string, string>> = {
  fr: {
    lancement:       'Lancement & Structuration',
    croissance:      'Croissance & Mise à l’échelle',
    restructuration: 'Restructuration & Pivot',
    acquisition:     'Acquisition & Croissance externe',
    transmission:    'Transmission & Cession',
  },
}
