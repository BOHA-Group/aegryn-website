import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { getFranchirIntro } from '@/content/franchir'
import { FRANCHIR_UI } from '@/content/franchir/ui'
import { DiagnosticLauncher } from '@/components/franchir/DiagnosticLauncher'
import { FranchirHeroScroll } from '@/components/sections/FranchirHeroScroll'
import type { CycleSlug } from '@/content/franchir/types'

/**
 * Section accueil FRANCHIR — reprend le contenu de l'ancienne page /valoriser
 * (héros montagne + 5 cartes cycle + diagnostic).
 * La page /valoriser a été supprimée : /valoriser redirige 301 vers /#accompagner.
 */
export function FranchirHomeSection({ locale }: { locale: string }) {
  const c  = getFranchirIntro(locale)
  const ui = FRANCHIR_UI[locale] ?? FRANCHIR_UI.fr
  const L  = (href: string) => `/${locale}${href}`
  const contactPath = (routing.pathnames['/contact'] as Record<string, string>)[locale] ?? '/contact'
  const echangeHref = L(`${contactPath}?action=echange`)
  const cycleTitle = Object.fromEntries(
    c.cycles.map(cy => [cy.slug, cy.title]),
  ) as Record<CycleSlug, string>

  return (
    <section id="accompagner" className="scroll-mt-20">
      {/* ── Intro : texte + image montagne qui s'étend au scroll ── */}
      <FranchirHeroScroll
        eyebrow={c.eyebrow}
        title={c.heroTitle}
        sub={c.heroSub}
        ctaLabel={c.cta.label}
        ctaHref={echangeHref}
      />

      {/* ── Cinq cartes de cycle ── */}
      <div id="cinq-cycles" className="scroll-mt-20 py-20 px-6 bg-ag-white">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-10">
            {ui.introCyclesTag}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {c.cycles.map(cy => (
              <Link
                key={cy.slug}
                href={L(`/accompagner/${cy.slug}`)}
                className="group rounded-2xl bg-ag-white border border-ag-border p-7 flex flex-col gap-4 hover:border-ag-navy/40 transition-colors"
              >
                <p className="font-sans font-semibold text-ag-black text-[15px] leading-snug tracking-[-0.02em] min-h-[2.75em]">{cy.title}</p>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed flex-1">{cy.stake}</p>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ag-apex-ink flex items-center gap-1.5 mt-auto group-hover:gap-2.5 transition-all">
                  <ArrowUpRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Où en êtes-vous ? : bouton d'action vert au bord droit, panneau au clic ── */}
      <DiagnosticLauncher
        title={c.diagnostic.title}
        questions={c.diagnostic.questions}
        cycleTitle={cycleTitle}
        locale={locale}
      />

    </section>
  )
}

