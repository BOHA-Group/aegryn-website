/**
 * Modèle de contenu des pages métiers ACCOMPAGNER (/advisory/*).
 * Version 2, octobre 2026. Une entrée par métier et par langue ; la langue
 * de référence est le français (content/advisory/fr.ts). Les autres langues
 * sont ajoutées après validation du FR : tant qu'une langue n'existe pas,
 * la page retombe sur le gabarit i18n historique (advisory.pillars.*).
 */

export type AdvisoryKey = 'strategy' | 'riskCompliance' | 'technology' | 'talentOrganization' | 'ma'

/** Cycles de vie VALORISER (slugs FR de /valoriser/*) */
export type LifecycleSlug = 'lancement' | 'croissance' | 'restructuration' | 'acquisition' | 'transmission'

export interface StatCard {
  value:  string
  label:  string
  source: string
}

export interface Situation {
  /** La situation dans les mots du client, entre guillemets à l'affichage */
  quote:       string
  decision:    string
  deliverable: string
  /** Ordre de grandeur, jamais une durée ferme tant que non validée */
  format?:     string
  cycles:      LifecycleSlug[]
}

export interface FrameworkAxis {
  label: string
  desc:  string
}

export interface Framework {
  name:        string
  intro:       string
  axes:        FrameworkAxis[]
  deliverable: string
}

export interface SizeReading {
  label: string
  desc:  string
}

export interface SectorReading {
  cluster: string
  desc:    string
}

export interface Scenario {
  /** Étiquette obligatoire tant qu'il n'existe pas de mission publiable */
  tag:  string
  text: string
}

export interface DiagnosticQuestion {
  q: string
}

export interface DiagnosticLevel {
  /** Nombre minimum de « oui » pour atteindre ce niveau */
  min:        number
  label:      string
  desc:       string
  nextAction: string
}

export interface Perspective {
  title: string
  href:  string
  kind:  'article' | 'magazine'
}

export interface AdvisoryPageContent {
  key:          AdvisoryKey
  path:         string
  image:        string
  imageAlt:     string
  meta:         { title: string; description: string; keywords: string[] }
  eyebrow:      string
  h1:           string
  subtitle:     string
  /** Renvois de périmètre vers les autres métiers / offres */
  scope:        { label: string; href: string }[]
  observation:  {
    title:     string
    cards:     StatCard[]
    paragraphs: string[]
    change:    string
    sources:   string
  }
  outcomes:     { title: string; items: string[] }
  situations:   { title: string; items: Situation[] }
  services:     { title: string; items: string[] }
  framework:    Framework
  bySize:       { title: string; items: SizeReading[] }
  bySector:     { title: string; items: SectorReading[] }
  scenario:     Scenario
  ai:           { title: string; text: string; legal?: string }
  /** Bloc « Retour d'expérience d'opérateur », à écrire par Aegryn ; non rendu si absent */
  operator?:    { title: string; text: string }
  complement?:  { title: string; text: string }
  diagnostic:   {
    title:      string
    intro:      string
    questions:  DiagnosticQuestion[]
    levels:     DiagnosticLevel[]
    privacy:    string
  }
  perspectives: { title: string; items: Perspective[] }
  cta:          { primary: string; secondary?: string; subject: string }
}
