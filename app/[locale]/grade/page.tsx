import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { GradeHero } from '@/components/sections/grade/GradeHero'
import { GradeCards } from '@/components/sections/grade/GradeCards'
import { GradeDimensions } from '@/components/sections/grade/GradeDimensions'
import { GradeProcess } from '@/components/sections/grade/GradeProcess'
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

  return (
    <main>
      <GradeHero />
      <GradeCards />
      <GradeDimensions />
      <GradeProcess />

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
