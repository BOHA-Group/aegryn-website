import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { routing } from '@/i18n/routing'
import { getFranchirIntro } from '@/content/franchir'
import { FRANCHIR_UI } from '@/content/franchir/ui'
import { FranchirDiagnostic } from '@/components/franchir/FranchirDiagnostic'
import type { CycleSlug } from '@/content/franchir/types'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getFranchirIntro(locale)
  return generateAegrynMetadata({ title: c.meta.title, description: c.meta.description, path: '/valoriser', locale })
}

export default async function FranchirIntroPage({ params }: Props) {
  const { locale } = await params
  const c  = getFranchirIntro(locale)
  const ui = FRANCHIR_UI[locale] ?? FRANCHIR_UI.fr
  const L  = (href: string) => `/${locale}${href}`
  const contactPath = (routing.pathnames['/contact'] as Record<string, string>)[locale] ?? '/contact'
  const echangeHref = L(`${contactPath}?action=echange`)
  const cycleTitle = Object.fromEntries(
    c.cycles.map(cy => [cy.slug, cy.title]),
  ) as Record<CycleSlug, string>

  return (
    <main>
      {/* ── Hero : image montagne conservée ── */}
      <section className="relative overflow-hidden bg-ag-navy pt-32 pb-24 px-6">
        <Image
          src="/images/transact/hero-valorisation.webp"
          alt="Aegryn Group"
          fill
          priority
          unoptimized
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/7QAkUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAgcAVoAAxslR//hAIBFeGlmAABJSSoACAAAAAUAEgEDAAEAAAABAAAAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAaYcEAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAAAACAAKgBAABAAAAMBQAAAOgBAABAAAAYAsAAAAAAAD/4QD6aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49IiIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJHbyBYTVAgU0RLIDEuMCI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48L3JkZjpSREY+PC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InciPz7/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAOABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAYDBAX/xAAjEAACAQQABgMAAAAAAAAAAAABAgMABAURIjJBYXGRQlGh/8QAFgEBAQEAAAAAAAAAAAAAAAAABAAC/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAIBEQMhMf/aAAwDAQACEQMRAD8Ap4K4EwC3dvMjKpJ0vC3cHp4rQt4Ipog0rFX2QRrf7SljL9rE7jUHfMD8vNSR5OeFAiMVUdAaUrtfQrItcGeYWMYIV2dh9AAD3RSzJlZpFKycQ7gE+6KzLZr0xRGGtqf/2Q=="
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/80" />
        <div className="relative max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {c.eyebrow}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {c.heroTitle}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-12 leading-relaxed">
            {c.heroSub}
          </p>
          <Link
            href={echangeHref}
            className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {c.cta.label} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── Cinq cartes de cycle ── */}
      <section className="py-24 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
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
      </section>

      {/* ── Deux cycles à la fois ? ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
          <div>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight text-[26px] md:text-[32px] mb-6">
              {c.overlap.title}
            </h2>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl">{c.overlap.text}</p>
          </div>
          <div className="flex flex-col gap-3">
            {c.overlap.examples.map((ex, i) => (
              <div key={i} className="rounded-2xl bg-ag-white border border-ag-border px-6 py-5 flex items-center justify-between gap-4">
                <span className="font-sans font-semibold text-[14px] text-ag-black">{ex.label}</span>
                <span className="flex items-center gap-2 shrink-0">
                  <Link href={L(`/franchir/${ex.a}`)} className="font-mono text-[9px] uppercase tracking-[0.14em] text-ag-navy hover:text-ag-apex-ink transition-colors flex items-center gap-1">
                    {cycleTitle[ex.a]} <ArrowRight size={9} />
                  </Link>
                  <span className="text-ag-gray-light">·</span>
                  <Link href={L(`/franchir/${ex.b}`)} className="font-mono text-[9px] uppercase tracking-[0.14em] text-ag-navy hover:text-ag-apex-ink transition-colors flex items-center gap-1">
                    {cycleTitle[ex.b]} <ArrowRight size={9} />
                  </Link>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Où en êtes-vous ? ── */}
      <section className="py-24 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <FranchirDiagnostic
            title={c.diagnostic.title}
            questions={c.diagnostic.questions}
            cycleTitle={cycleTitle}
            locale={locale}
          />
        </div>
      </section>

      {/* ── Lien vers les actifs + CTA ── */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <p className="font-sans text-[14px] text-white/60 leading-relaxed max-w-md">
            {c.assetsLink.text}{' '}
            <Link href={L('/assets')} className="text-ag-apex hover:text-white underline underline-offset-4 transition-colors">
              {c.assetsLink.label}
            </Link>
          </p>
          <Link
            href={echangeHref}
            className="rounded-lg shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {c.cta.label} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  )
}
