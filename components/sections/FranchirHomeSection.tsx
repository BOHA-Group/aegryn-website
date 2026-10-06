import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { getFranchirIntro } from '@/content/franchir'
import { FRANCHIR_UI } from '@/content/franchir/ui'
import { FranchirDiagnostic } from '@/components/franchir/FranchirDiagnostic'
import type { CycleSlug } from '@/content/franchir/types'

/**
 * Section accueil FRANCHIR — reprend le contenu de l'ancienne page /valoriser
 * (héros montagne + 5 cartes cycle + « deux cycles à la fois » + diagnostic).
 * La page /valoriser a été supprimée : /valoriser redirige 301 vers /#franchir.
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
    <section id="franchir" className="scroll-mt-20">
      {/* ── Intro : texte + image montagne illustrative ── */}
      <div className="bg-ag-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex-ink mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-ag-apex/50 inline-block" />
              {c.eyebrow}
            </p>
            <h2
              className="font-sans font-bold text-ag-black leading-[1.05] tracking-[-0.03em] mb-6"
              style={{ fontSize: 'clamp(30px,4vw,56px)' }}
            >
              {c.heroTitle}
            </h2>
            <p className="font-sans text-[15px] text-ag-gray max-w-xl mb-10 leading-relaxed">
              {c.heroSub}
            </p>
            <Link
              href={echangeHref}
              className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-navy-mid transition-colors"
            >
              {c.cta.label} <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-ag-border">
            <Image
              src="/images/transact/hero-valorisation.webp"
              alt="Aegryn Group"
              fill
              unoptimized
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* ── Cinq cartes de cycle ── */}
      <div className="py-20 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-10">
            {ui.introCyclesTag}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {c.cycles.map(cy => (
              <Link
                key={cy.slug}
                href={L(`/franchir/${cy.slug}`)}
                className="group rounded-2xl bg-ag-white border border-ag-border p-7 flex flex-col gap-4 hover:border-ag-navy/40 transition-colors"
              >
                <p className="font-sans font-semibold text-ag-black text-[15px] leading-snug tracking-[-0.02em]">{cy.title}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{cy.stake}</p>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ag-apex-ink flex items-center gap-1.5 mt-auto group-hover:gap-2.5 transition-all">
                  <ArrowUpRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Deux cycles à la fois ? ── */}
      <div className="py-14 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-10 items-start">
          <div>
            <h3 className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight text-[24px] md:text-[30px] mb-6">
              {c.overlap.title}
            </h3>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl">{c.overlap.text}</p>
          </div>
          <div className="flex flex-col gap-3">
            {c.overlap.examples.map((ex, i) => {
              const [partA, partB] = ex.label.split('+').map(s => s.trim())
              return (
                <div key={i} className="rounded-2xl bg-ag-off-white border border-ag-border px-6 py-4 whitespace-nowrap">
                  <Link href={L(`/franchir/${ex.a}`)} className="font-sans font-semibold text-[14px] text-ag-black hover:text-ag-apex-ink transition-colors">
                    {partA}
                  </Link>
                  <span className="font-sans text-ag-gray-light mx-1">+</span>
                  <Link href={L(`/franchir/${ex.b}`)} className="font-sans font-semibold text-[14px] text-ag-black hover:text-ag-apex-ink transition-colors">
                    {partB}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Où en êtes-vous ? ── */}
      <div className="py-14 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <FranchirDiagnostic
            title={c.diagnostic.title}
            questions={c.diagnostic.questions}
            cycleTitle={cycleTitle}
            locale={locale}
          />
        </div>
      </div>

    </section>
  )
}

