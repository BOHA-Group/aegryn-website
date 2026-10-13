import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import type { ComponentProps } from 'react'

type LinkHref = ComponentProps<typeof Link>['href']
import { VideoScrollGrow } from '@/components/sections/VideoScrollGrow'
import { VisionTypewriter } from '@/components/sections/VisionTypewriter'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { WaveReveal }   from '@/components/animations/WaveReveal'

const BASE = 'https://aegryn.com'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'build_service' })
  const base = generateAegrynMetadata({
    title:       t('meta.title'),
    description: t('meta.desc'),
    path:        '/services/build',
    locale,
    keywords:    ['solutions logicielles sur mesure', 'bespoke software', 'maîtrise d\u2019œuvre numérique', 'souveraineté numérique', 'build to operate'],
  })
  return {
    ...base,
    alternates: {
      canonical: `${BASE}/${locale}/services/build`,
      languages: {
        fr:          `${BASE}/fr/services/build`,
        en:          `${BASE}/en/services/build`,
        de:          `${BASE}/de/services/build`,
        es:          `${BASE}/es/services/build`,
        it:          `${BASE}/it/services/build`,
        nl:          `${BASE}/nl/services/build`,
        'x-default': `${BASE}/en/services/build`,
      },
    },
  }
}

export default async function BuildServicePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'build_service' })

  const marketComparisonAgency  = t.raw('marketComparison.agencyItems') as string[]
  const marketComparisonAegryn  = t.raw('marketComparison.aegrynItems') as string[]
  const marketComparisonProcess = t.raw('marketComparison.processItems') as string[]
  const processSteps            = t.raw('process.steps')                as { num: string; title: string; desc: string }[]

  const domainItems             = t.raw('domainsSection.domains')       as { num: string; badge: string; title: string; desc: string }[]
  const sovereigntyPillars      = t.raw('sovereigntySection.pillars')   as { key: string; title: string; desc: string }[]
  const formatCards             = t.raw('formatsSection.cards')         as { key: string; badge: string; subtitle: string; title: string; desc: string }[]


  return (
    <main>

      {/* ── Section 1 : Hero ─────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden border-b border-ag-border bg-ag-navy flex items-center"
        style={{ minHeight: 'clamp(460px,50vw,620px)' }}
      >
        <Image
          src="/images/services/build-hero.jpg"
          alt={t('heroAlt')}
          fill
          priority
          fetchPriority="high"
          unoptimized
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/70 via-ag-navy/60 to-ag-navy/95" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-24 w-full">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-6">
            {t('label')}
          </p>
          <WaveReveal delay={0.1}><h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {t('title')}
          </h1></WaveReveal>
<ScrollReveal delay={0.25}>          <p className="text-[16px] text-white/60 leading-relaxed max-w-2xl">
            {t('desc')}
          </p>
          <Link
            href={'/advisory/technology' as LinkHref}
            className="mt-5 inline-block font-mono text-[11px] tracking-[0.18em] uppercase text-ag-apex/80 hover:text-ag-apex transition-colors"
          >
            {t('advisoryLink')} →
          </Link></ScrollReveal>
        </div>
      </section>

      {/* ── Section 1b : Conviction, format « Notre vision » ───────────── */}
      <section className="border-b border-ag-border bg-ag-off-white/80">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid md:grid-cols-[280px_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">
            <div className="py-16 md:pr-16 flex items-start">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
                / {t('builtToLast.label')}
              </p>
            </div>
            <div className="py-16 md:px-16">
              <VisionTypewriter
                segments={t.raw('builtToLast.segments') as { t: string; bold?: boolean }[]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1c : 3 formats de mission ──────────────────────────── */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('formatsSection.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('formatsSection.title')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl mb-14">
            {t('formatsSection.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formatCards.map((card, _i) => (
              <div key={card.key} className={`rounded-2xl p-8 flex flex-col gap-4 ${
                card.key === 'btl' ? 'bg-ag-navy' : 'bg-ag-white border border-ag-border'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[10px] tracking-[0.24em] uppercase font-bold px-2 py-0.5 border ${
                    card.key === 'btl'
                      ? 'border-ag-apex/40 bg-ag-apex/10 text-ag-apex-ink'
                      : 'border-ag-border bg-ag-off-white text-ag-gray'
                  }`}>
                    {card.badge}
                  </span>
                </div>
                <p className={`font-mono text-[10px] tracking-[0.14em] uppercase ${
                  card.key === 'btl' ? 'text-white/50' : 'text-ag-gray-light'
                }`}>
                  {card.subtitle}
                </p>
                <h3 className={`font-sans font-bold text-[17px] leading-snug ${
                  card.key === 'btl' ? 'text-white' : 'text-ag-black'
                }`}>
                  {card.title}
                </h3>
                <p className={`font-sans text-[13px] leading-relaxed flex-1 ${
                  card.key === 'btl' ? 'text-white/70' : 'text-ag-gray'
                }`}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section : Domaines logiciels ───────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('domainsSection.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('domainsSection.title')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-14">
            {t('domainsSection.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {domainItems.map((item) => (
              <div key={item.num} className="rounded-2xl bg-ag-white border border-ag-border p-8 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-ag-apex-ink">{item.num}</span>
                  <span className="rounded-lg inline-flex font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 border border-ag-navy/20 bg-ag-navy/5 text-ag-navy">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-ag-black text-[16px] leading-snug">{item.title}</h3>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Transition vidéo : petite, centrée, grossit en plein écran au scroll ── */}
      <VideoScrollGrow
        srcWeb="/videos/sailboat-rope-web.mp4"
        srcMobile="/videos/sailboat-rope-mobile.mp4"
        poster="/images/services/sailboat-rope-poster.jpg"
      />

      {/* ── Section 1d : Sovereignty by Architecture ──────────────────── */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('sovereigntySection.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('sovereigntySection.title')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-4">
            {t('sovereigntySection.desc')}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ag-gray-light mb-14">
            <a href={t('sovereigntySection.sourceUrl')} target="_blank" rel="noopener noreferrer" className="hover:text-ag-apex-ink transition-colors">
              {t('sovereigntySection.source')} ↗
            </a>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {sovereigntyPillars.map((pillar) => (
              <div key={pillar.key} className="rounded-2xl bg-ag-white border border-ag-border p-8 flex flex-col gap-3">
                <h3 className="font-sans font-bold text-ag-black text-[15px] leading-snug">{pillar.title}</h3>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed flex-1">{pillar.desc}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-[15px] text-ag-gray-light leading-relaxed border-l-2 border-ag-apex pl-4 max-w-2xl">
            {t('sovereigntySection.stackLine')}
          </p>
        </ScrollReveal>
      </section>

      {/* ── Section 3 : Comparaison marché ───────────────────────────── */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('marketComparison.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('marketComparison.title')}
          </h2>
          <div className="rounded-2xl border border-ag-border overflow-x-auto overflow-hidden">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-ag-off-white border-b border-ag-border">
                  <th className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light px-6 py-4 w-1/3">{t('marketComparison.agencyCol')}</th>
                  <th className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex-ink px-6 py-4 w-1/3">{t('marketComparison.aegrynCol')}</th>
                  <th className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light px-6 py-4 w-1/3">{t('marketComparison.processCol')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ag-border">
                {marketComparisonAgency.map((agencyItem, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-ag-white' : 'bg-ag-off-white'}>
                    <td className="px-6 py-4 font-sans text-[13px] text-ag-gray">{agencyItem}</td>
                    <td className="px-6 py-4 font-sans text-[13px] text-ag-black font-medium">{marketComparisonAegryn[i]}</td>
                    <td className="px-6 py-4 font-mono text-[11px] text-ag-gray-light tracking-[0.08em]">{marketComparisonProcess[i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 6 : Process ──────────────────────────────────────── */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('process.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-12 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('process.title')}
          </h2>

          {/* 5 cards en ligne — scroll horizontal sur mobile */}
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-0 min-w-[1100px] xl:min-w-0">
              {processSteps.map((step, i) => (
                <div key={step.num} className="flex items-stretch flex-1">
                  {/* Card */}
                  <div className="flex-1 flex flex-col gap-3 rounded-2xl border border-ag-border bg-ag-white p-5 hover:bg-ag-off-white transition-colors">
                    {/* Numéro */}
                    <span className="font-mono text-[10px] tracking-[0.28em] text-ag-apex-ink">
                      {step.num}
                    </span>
                    {/* Titre */}
                    <h3 className="font-sans font-bold text-ag-black text-[13px] leading-snug">
                      {step.title}
                    </h3>
                    {/* Description */}
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed flex-1">
                      {step.desc}
                    </p>
                  </div>
                  {/* Connecteur → entre les étapes (sauf la dernière) */}
                  {i < processSteps.length - 1 && (
                    <div className="flex items-center justify-center w-6 shrink-0">
                      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="text-ag-border">
                        <path d="M0 5H13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 9 : CTA final ────────────────────────────────────── */}
      <section className="bg-ag-navy">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center flex flex-col items-center gap-8">
          <h2
            className="font-sans font-bold text-white tracking-[-0.02em] leading-tight"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('cta.title')}
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed max-w-xl">
            {t('cta.desc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/contact"
              className="rounded-lg font-mono text-[11px] tracking-[0.18em] uppercase bg-ag-apex text-ag-navy font-semibold px-8 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('cta.primary')} →
            </Link>
            <Link
              href="/assets"
              className="rounded-lg font-mono text-[11px] tracking-[0.18em] uppercase border border-white/30 text-white px-8 py-3.5 hover:border-white hover:bg-white/5 transition-colors"
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </ScrollReveal>
      </section>

    </main>
  )
}
