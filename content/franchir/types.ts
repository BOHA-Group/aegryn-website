/**
 * Modèle de contenu du bloc FRANCHIR (cycles de vie de l'entreprise).
 * Une entrée par cycle et par langue ; la langue de référence est le
 * français (content/franchir/fr.ts). Les autres langues en sont traduites.
 * Aucune mention du CIFSO, de la certification ni de l'estimation dans ce
 * bloc : ces sujets vivent dans les actifs Aegryn (/assets).
 */

import type { DiagnosticQuestion, DiagnosticLevel } from '@/content/advisory/types'

export type { DiagnosticQuestion, DiagnosticLevel }

export type CycleSlug = 'lancement' | 'croissance' | 'restructuration' | 'acquisition' | 'transmission'

/** Métiers mobilisables sur une page cycle (liens fixes, cf. spec) */
export type MetierChip = 'strategie' | 'conformite' | 'technologie' | 'talent' | 'ma' | 'construire' | 'recruter'

export interface CycleSituation {
  /** La situation dans les mots du client (affichée entre guillemets) */
  quote:       string
  decision:    string
  /** Métiers mobilisés, affichés en puces liées */
  metiers:     MetierChip[]
  deliverable: string
}

export interface CycleContent {
  slug:         CycleSlug
  path:         string
  meta:         { title: string; description: string }
  eyebrow:      string
  h1:           string
  subtitle:     string
  /** Ligne « Ce que nous faisons » : trois verbes */
  verbs:        [string, string, string]
  constat:      { text: string; source: string }
  situations:   { title: string; items: CycleSituation[] }
  /** Métiers du cycle : mobilises (●) ou disponibles (○) */
  metiers:      { mobilized: MetierChip[]; available: MetierChip[] }
  bySize:       { title: string; items: { label: string; desc: string }[] }
  bySector:     { title: string; items: { cluster: string; desc: string }[] }
  scenario:     { tag: string; text: string }
  ai:           { title: string; text: string }
  diagnostic:   {
    title:     string
    intro:     string
    questions: DiagnosticQuestion[]
    levels:    DiagnosticLevel[]
    privacy:   string
  }
  /** Mention obligatoire (acquisition, transmission) */
  mandate?:     string
  /** Liens « Cycle suivant » (ou precedent pour la transmission) */
  nextLabel:    string
  next:         { label: string; slug: CycleSlug }[]
  /** Page Restructuration uniquement : bouton contact d'urgence */
  urgency?:     boolean
}

export interface FranchirIntro {
  meta:      { title: string; description: string }
  eyebrow:   string
  heroTitle: string
  heroSub:   string
  /** Cinq cartes de cycle : titre, enjeu en une ligne */
  cycles:    { slug: CycleSlug; title: string; stake: string }[]
  overlap:   { title: string; text: string; examples: { label: string; a: CycleSlug; b: CycleSlug }[] }
  /** « Où en êtes-vous ? » : une question par cycle, « oui » mène à la page */
  diagnostic: { title: string; questions: { q: string; cycle: CycleSlug }[] }
  assetsLink: { text: string; label: string }
  cta:        { label: string }
}
