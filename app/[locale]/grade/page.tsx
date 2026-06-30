import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { GradeHero } from '@/components/sections/grade/GradeHero'
import { GradeCards } from '@/components/sections/grade/GradeCards'
import { GradeDimensions } from '@/components/sections/grade/GradeDimensions'
import { GradeProcess } from '@/components/sections/grade/GradeProcess'
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grade.meta' })
  return { title: t('title'), description: t('desc') }
}

export default function GradePage() {
  const t = useTranslations('grade.submit')

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

      {/* Submit CTA */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-3">
              {t('label')}
            </p>
            <h2
              className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-lg whitespace-pre-line"
              style={{ fontSize: 'clamp(24px,3vw,42px)' }}
            >
              {t('title')}
            </h2>
            <p className="font-sans text-[14px] text-white/50 max-w-md mt-3">{t('desc')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('cta')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/grade/methodology"
              className="inline-flex items-center gap-2 border border-white/25 text-white/70 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              Méthodologie
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
