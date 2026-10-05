import fr from './cgv.fr.json'
import en from './cgv.en.json'
import de from './cgv.de.json'
import it from './cgv.it.json'
import es from './cgv.es.json'
import nl from './cgv.nl.json'

export interface CgvBlock { title?: string; body: string }
export interface CgvSection { title: string; blocks?: CgvBlock[]; defs?: [string, string][] }
export interface CgvContent {
  meta: { title: string; desc: string }
  label: string
  version: string
  note: string
  sections: CgvSection[]
  ctaContact: string
  ctaTermsUse: string
}

const ALL: Record<string, CgvContent> = { fr, en, de, it, es, nl } as Record<string, CgvContent>

/** Conditions générales de vente et de service, par langue (FR de référence). */
export function getCgv(locale: string): CgvContent {
  return ALL[locale] ?? ALL.fr
}

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV']
export const roman = (i: number) => ROMAN[i] ?? String(i + 1)
