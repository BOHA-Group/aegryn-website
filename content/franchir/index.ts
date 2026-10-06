import { FRANCHIR_FR, FRANCHIR_INTRO_FR } from './fr'
import { FRANCHIR_EN, FRANCHIR_INTRO_EN } from './en'
import { FRANCHIR_DE, FRANCHIR_INTRO_DE } from './de'
import { FRANCHIR_IT, FRANCHIR_INTRO_IT } from './it'
import { FRANCHIR_ES, FRANCHIR_INTRO_ES } from './es'
import { FRANCHIR_NL, FRANCHIR_INTRO_NL } from './nl'
import type { CycleContent, CycleSlug, FranchirIntro } from './types'

export const CYCLE_SLUGS: CycleSlug[] = ['lancement', 'croissance', 'restructuration', 'acquisition', 'transmission']

const PAGES: Record<string, CycleContent[]> = {
  fr: FRANCHIR_FR, en: FRANCHIR_EN, de: FRANCHIR_DE,
  it: FRANCHIR_IT, es: FRANCHIR_ES, nl: FRANCHIR_NL,
}

const INTROS: Record<string, FranchirIntro> = {
  fr: FRANCHIR_INTRO_FR, en: FRANCHIR_INTRO_EN, de: FRANCHIR_INTRO_DE,
  it: FRANCHIR_INTRO_IT, es: FRANCHIR_INTRO_ES, nl: FRANCHIR_INTRO_NL,
}

export function getCycleContent(locale: string, slug: CycleSlug): CycleContent {
  const list = PAGES[locale] ?? FRANCHIR_FR
  return (list.find(p => p.slug === slug) ?? FRANCHIR_FR.find(p => p.slug === slug))!
}

export function getFranchirIntro(locale: string): FranchirIntro {
  return INTROS[locale] ?? FRANCHIR_INTRO_FR
}
