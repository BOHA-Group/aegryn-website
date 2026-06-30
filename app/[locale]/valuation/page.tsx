import { getTranslations } from 'next-intl/server'
import { Suspense }        from 'react'
import type { Metadata }  from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import ValuationCalculator from './ValuationCalculator'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'valuation' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/valuation',
    locale,
  })
}

export default function ValuationPage() {
  return (
    <Suspense>
      <ValuationCalculator />
    </Suspense>
  )
}
