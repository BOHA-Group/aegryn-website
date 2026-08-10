import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link } from '@/i18n/navigation'

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

  const differenceItems = t.raw('difference.items') as { num: string; title: string; desc: string }[]
  const assetTypeItems  = t.raw('assetTypes.items')  as { badge: string; title: string; desc: string }[]
  const exitItems       = t.raw('exits.items')       as { phase: string; title: string; desc: string; grade: string; cta: string; href: string }[]
  const processSteps    = t.raw('process.steps')     as { num: string; title: string; desc: string }[]
  const feeItems        = t.raw('fees.items')        as { title: string; desc: string; format: string; href?: string }[]

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

      {/* ── Section 3 : Types d'actifs ───────────────────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('assetTypes.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('assetTypes.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {assetTypeItems.map((item) => (
              <div key={item.badge} className="bg-ag-white p-8 flex flex-col gap-4">
                <span className="inline-flex self-start font-mono text-[9px] tracking-[0.22em] uppercase px-3 py-1 border border-ag-navy/30 bg-ag-navy/5 text-ag-navy">
                  {item.badge}
                </span>
                <h3 className="font-sans font-bold text-ag-black text-[18px] leading-snug">{item.title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 4 : Sorties possibles ───────────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('exits.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14 whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('exits.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {exitItems.map((item, i) => (
              <div key={i} className="bg-ag-white p-8 flex flex-col gap-4">
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-gray-light">{item.phase}</span>
                <h3 className="font-sans font-bold text-ag-black text-[18px] leading-snug">{item.title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{item.desc}</p>
                <p className="font-mono text-[10px] tracking-[0.12em] text-ag-apex-ink font-semibold">{item.grade}</p>
                <Link
                  href={item.href as '/auction/bid-models' | '/grade/submit' | '/contact'}
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-ag-navy border border-ag-navy/30 px-4 py-2 hover:bg-ag-navy hover:text-white transition-colors self-start mt-auto"
                >
                  {item.cta} →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 5 : Process ──────────────────────────────────────── */}
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

      {/* ── Section 6 : Maintenance ──────────────────────────────────── */}
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

      {/* ── Section 7 : Honoraires ───────────────────────────────────── */}
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
                {item.href && (
                  <Link
                    href={item.href as '/terms/cgv'}
                    className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-navy hover:underline self-start"
                  >
                    CGV →
                  </Link>
                )}
              </div>
            ))}
          </div>
          <p className="font-sans text-[12px] text-ag-gray-light leading-relaxed border-l-2 border-ag-apex/40 pl-4 max-w-2xl">
            {t('fees.coInvestNote')}
          </p>
        </div>
      </section>

      {/* ── Section 8 : CTA final ────────────────────────────────────── */}
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
