import { Link }                  from '@/i18n/navigation'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { getTranslations }       from 'next-intl/server'
import type { Metadata }         from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { ScrollReveal }          from '@/components/animations/ScrollReveal'
import { WaveReveal }            from '@/components/animations/WaveReveal'
import { ADVISORY_HUB }          from '@/content/advisory/hub'
import { ADVISORY_UI, LIFECYCLE_LABELS } from '@/content/advisory'
import { getAction }             from '@/content/advisory/actions'

type Props = { params: Promise<{ locale: string }> }
type Pillar = { title: string; desc: string; href?: string }

const LABEL = 'font-mono text-[10px] tracking-[0.28em] uppercase'
const CYCLES = ['lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = ADVISORY_HUB[locale] ?? ADVISORY_HUB.fr
  return generateAegrynMetadata({
    title: c.metaTitle,
    description: c.metaDesc,
    path: '/advisory',
    locale,
    keywords: ['cabinet de conseil intégré', 'conseil stratégie', 'finance et performance', 'opérations', 'pilotage de projets', 'M&A', 'PME Suisse', 'integrated advisory firm Switzerland'],
  })
}

export default async function AdvisoryPage({ params }: Props) {
  const { locale } = await params
  const c   = ADVISORY_HUB[locale] ?? ADVISORY_HUB.fr
  const t   = await getTranslations({ locale, namespace: 'advisory' })
  const tn  = await getTranslations({ locale, namespace: 'nav' })
  const ui  = ADVISORY_UI[locale] ?? ADVISORY_UI.fr
  const cycles = LIFECYCLE_LABELS[locale] ?? LIFECYCLE_LABELS.fr
  const pillars = Object.values(t.raw('pillars') as Record<string, Pillar>)
  const echange = getAction(locale, 'program', 'echange30')

  return (
    <main className="bg-ag-white">
      {/* ── Hero ── */}
      <section className="bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 py-32 md:px-12">
          <p className={`${LABEL} mb-8 flex items-center gap-3 text-ag-apex`}><span className="inline-block h-px w-5 bg-ag-apex/50" />{tn('craftFrameDeliver')}</p>
          <WaveReveal delay={0.1}>
            <h1 className="mb-8 max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.03em] text-white text-balance" style={{ fontSize: 'clamp(36px,5vw,72px)' }}>{c.h1}</h1>
          </WaveReveal>
          <ScrollReveal delay={0.25}>
            <p className="mb-10 max-w-2xl font-sans text-[16px] leading-relaxed text-white/70">{c.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg inline-flex items-center gap-2 bg-ag-apex px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ag-navy transition-colors hover:bg-ag-apex/90">
                {echange?.label} <ArrowUpRight size={12} />
              </Link>
              <a href="#situations" className="rounded-lg inline-flex items-center gap-2 border border-white/60 bg-white/10 px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-white hover:text-ag-navy">
                {tn('craftTransact')}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── Huit métiers ── */}
      <section className="border-t border-ag-border px-6 py-24 md:px-12">
        <ScrollReveal className="mx-auto max-w-7xl">
          <p className={`${LABEL} mb-10 flex items-center gap-3 text-ag-apex-ink`}><span className="inline-block h-px w-5 bg-ag-apex/50" />{c.label}</p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Link key={i} href={(p.href ?? '/advisory') as never} className="group flex flex-col rounded-2xl border border-ag-border bg-ag-white p-7 transition-colors hover:border-ag-navy/40">
                <span className="mb-5 font-mono text-[10px] tracking-[0.2em] text-ag-apex-ink">{String(i + 1).padStart(2, '0')}</span>
                <h2 className="mb-3 font-sans text-[17px] font-bold leading-snug tracking-[-0.01em] text-ag-black">{p.title}</h2>
                <p className="flex-1 font-sans text-[15px] leading-relaxed text-ag-gray">{p.desc}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-ag-apex-ink transition-colors group-hover:text-ag-black">{t('pillarLink')} <ArrowUpRight size={11} /></span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Par situation ── */}
      <section id="situations" className="scroll-mt-24 border-t border-ag-border bg-ag-off-white px-6 py-24 md:px-12">
        <ScrollReveal className="mx-auto max-w-7xl">
          <p className={`${LABEL} mb-4 flex items-center gap-3 text-ag-apex-ink`}><span className="inline-block h-px w-5 bg-ag-apex/50" />{tn('craftTransact')}</p>
          <h2 className="mb-10 max-w-2xl font-sans font-bold leading-[1.15] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{tn('craftTransactDesc')}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {CYCLES.map(cy => (
              <Link key={cy} href={`/accompagner/${cy}` as never} className="group flex items-center justify-between gap-3 rounded-2xl border border-ag-border bg-ag-white px-6 py-5 transition-colors hover:border-ag-navy/40">
                <span className="font-sans text-[15px] font-semibold leading-snug text-ag-black">{cycles[cy]}</span>
                <ArrowRight size={13} className="shrink-0 text-ag-gray-light transition-colors group-hover:text-ag-black" />
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Sélectionner + réseau + industries ── */}
      <section className="border-t border-ag-border px-6 py-24 md:px-12">
        <ScrollReveal className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-3">
          <div>
            <p className={`${LABEL} mb-4 text-ag-apex-ink`}>{tn('craftRecruit')}</p>
            <p className="mb-5 font-sans text-[15px] leading-relaxed text-ag-gray">{tn('craftRecruitDesc')}</p>
            <ul className="flex flex-col gap-2 font-sans text-[15px] font-semibold text-ag-black">
              <li><Link href="/talent/entreprises" className="underline-offset-4 hover:underline">{tn('craftRecruitHire')}</Link></li>
              <li><Link href="/talent/transition" className="underline-offset-4 hover:underline">{tn('craftRecruitTransition')}</Link></li>
              <li><Link href="/talent/candidats" className="underline-offset-4 hover:underline">{tn('craftRecruitPool')}</Link></li>
            </ul>
          </div>
          <div>
            <p className={`${LABEL} mb-4 text-ag-apex-ink`}>{c.networkTitle}</p>
            <p className="mb-5 font-sans text-[15px] leading-relaxed text-ag-gray">{c.networkDesc}</p>
            <ul className="flex flex-col gap-2 font-sans text-[15px] font-semibold text-ag-black">
              <li><Link href={'/experts' as never} className="underline-offset-4 hover:underline">{tn('craftSupportNetworkNew')}</Link></li>
              <li><Link href={'/alliances' as never} className="underline-offset-4 hover:underline">{tn('whoAlliances')}</Link></li>
            </ul>
          </div>
          <div>
            <p className={`${LABEL} mb-4 text-ag-apex-ink`}>{tn('whoIndustries')}</p>
            <p className="mb-5 font-sans text-[15px] leading-relaxed text-ag-gray">{tn('whoIndustriesDesc')}</p>
            <Link href={'/industries' as never} className="inline-flex items-center gap-2 font-sans text-[15px] font-semibold text-ag-black underline-offset-4 hover:underline">{tn('whoIndustriesLink')} <ArrowRight size={13} /></Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── CTA ── */}
      <section className="bg-ag-navy px-6 py-24 md:px-12">
        <ScrollReveal className="mx-auto max-w-7xl">
          <p className={`${LABEL} mb-6 text-ag-apex`}>{ui.ctaEyebrow}</p>
          <p className="mb-10 max-w-lg font-sans text-[15px] leading-relaxed text-white/70">{ui.ctaBody}</p>
          <Link href="/contact" className="rounded-lg inline-flex items-center gap-2 bg-ag-apex px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ag-navy transition-colors hover:bg-ag-apex/90">
            {echange?.label} <ArrowUpRight size={12} />
          </Link>
        </ScrollReveal>
      </section>
    </main>
  )
}
