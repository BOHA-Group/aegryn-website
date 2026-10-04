import type { AdvisoryKey, AdvisoryPageContent } from './types'
import { ADVISORY_FR } from './fr'
import { ADVISORY_EN } from './en'
import { ADVISORY_DE } from './de'
import { ADVISORY_IT } from './it'
import { ADVISORY_ES } from './es'
import { ADVISORY_NL } from './nl'

export type { AdvisoryKey, AdvisoryPageContent, LifecycleSlug } from './types'
export { ADVISORY_UI } from './ui'
export type { AdvisoryUi } from './ui'

/* Le français est la langue de référence ; les autres en sont traduites. */
const BY_LOCALE: Record<string, Record<AdvisoryKey, AdvisoryPageContent>> = {
  fr: ADVISORY_FR,
  en: ADVISORY_EN,
  de: ADVISORY_DE,
  it: ADVISORY_IT,
  es: ADVISORY_ES,
  nl: ADVISORY_NL,
}

export function getAdvisoryPage(locale: string, key: AdvisoryKey): AdvisoryPageContent | null {
  return (BY_LOCALE[locale] ?? BY_LOCALE.fr)?.[key] ?? null
}

/** Libellés des cycles de vie VALORISER, par langue (les slugs des routes restent en français) */
export const LIFECYCLE_LABELS: Record<string, Record<string, string>> = {
  fr: { lancement: 'Lancement & Structuration', croissance: 'Croissance & Mise à l’échelle', restructuration: 'Restructuration & Pivot', acquisition: 'Acquisition & Croissance externe', transmission: 'Transmission & Cession' },
  en: { lancement: 'Launch & Structuring', croissance: 'Growth & Scale', restructuration: 'Restructuring & Pivot', acquisition: 'Acquisition & External Growth', transmission: 'Transfer & Succession' },
  de: { lancement: 'Gründung & Strukturierung', croissance: 'Wachstum & Skalierung', restructuration: 'Restrukturierung & Pivot', acquisition: 'Akquisition & externes Wachstum', transmission: 'Übergabe & Verkauf' },
  it: { lancement: 'Lancio & Strutturazione', croissance: 'Crescita & Scalabilità', restructuration: 'Ristrutturazione & Pivot', acquisition: 'Acquisizione & Crescita esterna', transmission: 'Trasmissione & Cessione' },
  es: { lancement: 'Lanzamiento y Estructuración', croissance: 'Crecimiento y Escalado', restructuration: 'Reestructuración y Pivote', acquisition: 'Adquisición y Crecimiento externo', transmission: 'Transmisión y Venta' },
  nl: { lancement: 'Lancering & Structurering', croissance: 'Groei & Opschaling', restructuration: 'Herstructurering & Pivot', acquisition: 'Overname & Externe groei', transmission: 'Overdracht & Verkoop' },
}
