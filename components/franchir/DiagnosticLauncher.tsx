'use client'

/**
 * « Où en êtes-vous ? » (accueil du cabinet) : bouton d'action vert au bord droit, visible face à la section
 * « Cinq cycles », qui ouvre un panneau avec les cinq questions (une par cycle de vie).
 */
import { SideDrawerLauncher } from '@/components/ui/SideDrawerLauncher'
import { FranchirDiagnostic } from '@/components/franchir/FranchirDiagnostic'
import type { CycleSlug } from '@/content/franchir/types'

type Props = {
  title: string
  questions: { q: string; cycle: CycleSlug }[]
  cycleTitle: Record<CycleSlug, string>
  locale: string
}

export function DiagnosticLauncher({ title, questions, cycleTitle, locale }: Props) {
  return (
    <SideDrawerLauncher label={title} targetId="cinq-cycles" mode="within" locale={locale}>
      <FranchirDiagnostic title={title} questions={questions} cycleTitle={cycleTitle} locale={locale} panel />
    </SideDrawerLauncher>
  )
}
