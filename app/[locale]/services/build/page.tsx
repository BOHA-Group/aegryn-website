import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link } from '@/i18n/navigation'
import { TechStackShowcase } from '@/components/sections/TechStackShowcase'
import { PlatformArchitectureDiagram } from '@/components/sections/PlatformArchitectureDiagram'

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
    keywords:    ['conception actifs numériques', 'build digital asset', 'SaaS B2B', 'exit structuré', 'asset engineering'],
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

  const differenceItems         = t.raw('difference.items')           as { num: string; title: string; desc: string }[]
  const marketComparisonAgency  = t.raw('marketComparison.agencyItems') as string[]
  const marketComparisonAegryn  = t.raw('marketComparison.aegrynItems') as string[]
  const marketComparisonProcess = t.raw('marketComparison.processItems') as string[]
  const certBenefits            = t.raw('certificationBenefits.items')  as { title: string; desc: string }[]
  const processSteps            = t.raw('process.steps')                as { num: string; title: string; desc: string }[]
  const feeItems                = t.raw('fees.items')                   as { title: string; desc: string; format: string }[]
  const whyPoints               = t.raw('whySection.points')            as { title: string; desc: string }[]
  const domainItems             = t.raw('domainsSection.domains')       as { num: string; badge: string; title: string; desc: string }[]
  const platformLayers          = t.raw('platformSection.layers')       as { key: string; title: string; desc: string }[]
  const sovereigntyPillars      = t.raw('sovereigntySection.pillars')   as { key: string; title: string; desc: string }[]

  return (
    <main>

      {/* ── Section 1 : Hero ─────────────────────────────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-36">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(44px,6vw,80px)' }}
          >
            {t('title')}
          </h1>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('desc')}
          </p>
        </div>
      </section>

      {/* ── Section 1b : Why Sovereign Software ────────────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('whySection.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-6 max-w-2xl whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3.5vw,46px)' }}
          >
            {t('whySection.title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('whySection.desc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whyPoints.map((pt, i) => (
              <div key={i} className="border border-ag-border p-6 bg-ag-off-white">
                <p className="font-sans font-semibold text-[12px] uppercase tracking-[0.2em] text-ag-apex mb-2">
                  {pt.title}
                </p>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 1c : 10 Domaines logiciels ───────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('domainsSection.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('domainsSection.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl mb-14">
            {t('domainsSection.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
            {domainItems.map((item) => (
              <div key={item.num} className="bg-ag-white p-8 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-ag-apex-ink">{item.num}</span>
                  <span className="inline-flex font-mono text-[9px] tracking-[0.18em] uppercase px-2 py-0.5 border border-ag-navy/20 bg-ag-navy/5 text-ag-navy">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-ag-black text-[16px] leading-snug">{item.title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 1c : AEGRYN Enterprise Intelligence Platform ──────── */}
      <section className="border-b border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex mb-4">
            {t('platformSection.label')}
          </p>
          <h2
            className="font-sans font-bold text-white tracking-[-0.02em] leading-tight mb-4"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('platformSection.title')}
          </h2>
          <p className="font-sans text-[14px] text-white/70 leading-relaxed max-w-2xl mb-14">
            {t('platformSection.desc')}
          </p>
          {/* Schéma animé */}
          <PlatformArchitectureDiagram layers={platformLayers} verticalsLabel={t('platformSection.verticals.label')} />
        </div>
      </section>

      {/* ── Section 1d : Sovereignty by Architecture ──────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('sovereigntySection.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('sovereigntySection.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-xl mb-14">
            {t('sovereigntySection.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {sovereigntyPillars.map((pillar) => (
              <div key={pillar.key} className="bg-ag-white p-8 flex flex-col gap-3">
                <h3 className="font-sans font-bold text-ag-black text-[15px] leading-snug">{pillar.title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2 : La différence Aegryn ─────────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('difference.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('difference.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {differenceItems.map((item) => (
              <div key={item.num} className="bg-ag-white p-8 flex flex-col gap-4">
                <span className="font-mono text-[10px] tracking-[0.22em] text-ag-apex-ink">{item.num}</span>
                <h3 className="font-sans font-bold text-ag-black text-[18px] leading-snug">{item.title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3 : Comparaison marché ───────────────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('marketComparison.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('marketComparison.title')}
          </h2>
          <div className="border border-ag-border overflow-x-auto">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="bg-ag-off-white border-b border-ag-border">
                  <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-gray-light px-6 py-4 w-1/3">{t('marketComparison.agencyCol')}</th>
                  <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex-ink px-6 py-4 w-1/3">{t('marketComparison.aegrynCol')}</th>
                  <th className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-gray-light px-6 py-4 w-1/3">{t('marketComparison.processCol')}</th>
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
        </div>
      </section>

      {/* ── Section 4 : Bénéfices certification ──────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('certificationBenefits.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('certificationBenefits.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {certBenefits.map((item, i) => (
              <div key={i} className="bg-ag-white p-8 flex flex-col gap-4">
                <h3 className="font-sans font-bold text-ag-black text-[18px] leading-snug">{item.title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5b : Tech Stack ──────────────────────────────────── */}
      <TechStackShowcase />

      {/* ── Section 6 : Process ──────────────────────────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('process.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('process.title')}
          </h2>
          <div className="flex flex-col divide-y divide-ag-border border border-ag-border">
            {processSteps.map((step, i) => (
              <div key={step.num} className={`flex flex-col md:flex-row gap-6 md:gap-12 p-8 ${i % 2 === 1 ? 'bg-ag-off-white' : 'bg-ag-white'}`}>
                <span className="font-mono text-[11px] tracking-[0.22em] text-ag-apex-ink shrink-0 md:w-8">{step.num}</span>
                <div className="flex-1">
                  <h3 className="font-sans font-bold text-ag-black text-[16px] mb-2">{step.title}</h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7 : Maintenance ──────────────────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('maintenance.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('maintenance.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-xl mb-12">
            {t('maintenance.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border mb-8">
            <div className="bg-ag-white p-8 flex flex-col gap-3">
              <h3 className="font-sans font-bold text-ag-black text-[16px]">{t('maintenance.corrective.title')}</h3>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{t('maintenance.corrective.desc')}</p>
              <p className="font-mono text-[10px] tracking-[0.14em] text-ag-gray-light">{t('maintenance.corrective.format')}</p>
            </div>
            <div className="bg-ag-white p-8 flex flex-col gap-3">
              <h3 className="font-sans font-bold text-ag-black text-[16px]">{t('maintenance.evolutive.title')}</h3>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{t('maintenance.evolutive.desc')}</p>
              <p className="font-mono text-[10px] tracking-[0.14em] text-ag-gray-light">{t('maintenance.evolutive.format')}</p>
            </div>
          </div>
          <p className="font-sans text-[12px] text-ag-gray-light leading-relaxed border-l-2 border-ag-apex pl-4 max-w-2xl">
            {t('maintenance.note')}
          </p>
        </div>
      </section>

      {/* ── Section 8 : Honoraires ───────────────────────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('fees.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('fees.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border mb-8">
            {feeItems.map((item) => (
              <div key={item.title} className="bg-ag-white p-8 flex flex-col gap-3">
                <h3 className="font-sans font-bold text-ag-black text-[16px]">{item.title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{item.desc}</p>
                <p className="font-mono text-[10px] tracking-[0.14em] text-ag-gray-light">{item.format}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-[12px] text-ag-gray-light leading-relaxed border-l-2 border-ag-apex/40 pl-4 max-w-2xl">
            {t('fees.coInvestNote')}
          </p>
        </div>
      </section>

      {/* ── Exit Banner ──────────────────────────────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
            {t('exitBanner.text')}
          </p>
          <Link
            href="/transact/how-it-works"
            className="shrink-0 font-mono text-[10px] tracking-[0.18em] uppercase text-ag-navy border border-ag-navy/30 px-5 py-2.5 hover:bg-ag-navy hover:text-white transition-colors whitespace-nowrap"
          >
            {t('exitBanner.cta')} →
          </Link>
        </div>
      </section>

      {/* ── Section 9 : CTA final ────────────────────────────────────── */}
      <section className="bg-ag-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center flex flex-col items-center gap-8">
          <h2
            className="font-sans font-bold text-white tracking-[-0.02em] leading-tight"
            style={{ fontSize: 'clamp(32px,5vw,64px)' }}
          >
            {t('cta.title')}
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed max-w-xl">
            {t('cta.desc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/contact"
              className="font-mono text-[11px] tracking-[0.18em] uppercase bg-ag-apex text-ag-navy font-semibold px-8 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('cta.primary')} →
            </Link>
            <Link
              href="/assets"
              className="font-mono text-[11px] tracking-[0.18em] uppercase border border-white/30 text-white px-8 py-3.5 hover:border-white hover:bg-white/5 transition-colors"
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
