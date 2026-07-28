import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { GradeHero } from '@/components/sections/grade/GradeHero'
import { GradeCards } from '@/components/sections/grade/GradeCards'
import { GradeDimensions } from '@/components/sections/grade/GradeDimensions'
import { GradeProcess } from '@/components/sections/grade/GradeProcess'
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grade.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/grade', locale })
}

export default async function GradePage({ params }: Props) {
  const { locale } = await params
  const tSubmit = await getTranslations({ locale, namespace: 'grade.submit' })
  const t = await getTranslations({ locale, namespace: 'grade.index' })
  const tValuation = await getTranslations({ locale, namespace: 'valuation.marketContext' })
  const marketItems = tValuation.raw('items') as { value: string; label: string }[]

  const serviceLd = serviceJsonLd({
    name:        'AEGRYN Grade — Tech Asset Certification',
    description: 'Independent certification of digital tech assets across 4 dimensions: Code, IP, Finance, Security.',
    url:         'https://aegryn.com/grade',
    serviceType: 'Asset Certification',
  })
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'AEGRYN', url: 'https://aegryn.com' },
    { name: 'Grade',  url: 'https://aegryn.com/grade' },
  ])

  return (
    <main id="main">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <GradeHero />
      <GradeCards />
      <GradeDimensions />
      <GradeProcess />

      {/* ── Section bifurcation multiples ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5">
            {t('marketLabel')}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-6 whitespace-pre-line"
                style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
              >
                {t('marketTitle')}
              </h2>
              <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-8 max-w-md">
                {t('marketDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/grade/submit"
                  className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
                >
                  {t('marketCta')} <ArrowUpRight size={13} />
                </Link>
                <Link
                  href="/grade/methodology"
                  className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-ag-black hover:text-ag-black transition-all"
                >
                  {t('marketCtaSecondary')}
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-px bg-ag-border border border-ag-border">
              {marketItems.map(({ value, label }) => (
                <div key={label} className="bg-ag-white p-8 flex flex-col gap-2">
                  <span className="font-sans font-bold text-ag-black tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,2.5vw,36px)' }}>{value}</span>
                  <span className="font-sans text-[12px] text-ag-gray leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submit CTA */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-3">
              {tSubmit('label')}
            </p>
            <h2
              className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-lg whitespace-pre-line"
              style={{ fontSize: 'clamp(24px,3vw,42px)' }}
            >
              {tSubmit('title')}
            </h2>
            <p className="font-sans text-[14px] text-white/50 max-w-md mt-3">{tSubmit('desc')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/grade/submit"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {tSubmit('cta')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/grade/methodology"
              className="inline-flex items-center gap-2 border border-white/25 text-white/70 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              {t('marketCtaSecondary')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
