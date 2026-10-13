import type { Metadata } from 'next'
import NextLink          from 'next/link'
import { Link }          from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { CheckCircle2 }  from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { WaveReveal }   from '@/components/animations/WaveReveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gradeSubmitSuccess' })
  const base = generateAegrynMetadata({
    title: t('metaTitle'),
    description: t('metaDesc'),
    path: '/grade/submit/success',
    locale,
  })
  return { ...base, robots: { index: false, follow: false } }
}

export default async function GradeSubmitSuccessPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gradeSubmitSuccess' })

  return (
    <main className="min-h-screen bg-ag-navy flex items-center justify-center px-6">
      <div className="w-full max-w-lg text-center">
        <CheckCircle2 size={40} className="text-ag-apex mx-auto mb-6" />
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">Aegryn</p>
        <WaveReveal delay={0.1}>
          <h1 className="font-sans font-bold text-white tracking-[-0.03em] mb-4" style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}>
            {t('title')}
          </h1>
        </WaveReveal>
        <ScrollReveal delay={0.25}>
        <p className="font-sans text-[16px] text-white leading-relaxed mb-3">
          {t('desc')}
        </p>
        <p className="font-sans text-[13px] text-white mb-10">
          {t('emailSent')}
        </p>
        </ScrollReveal>
        <ScrollReveal delay={0.35}>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/grade"
            className="rounded-lg inline-flex items-center gap-2 border border-white/20 text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-white/50 hover:text-white transition-colors"
          >
            {t('backToGrade')}
          </Link>
          {process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' && (
            <NextLink
              href="/client/login"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('accessSpace')}
            </NextLink>
          )}
        </div>
        </ScrollReveal>
      </div>
    </main>
  )
}
