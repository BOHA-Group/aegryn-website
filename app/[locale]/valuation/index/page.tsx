import { getTranslations } from 'next-intl/server'
import { Suspense }        from 'react'
import type { Metadata }  from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import ValuationIndexTest from './ValuationIndexTest'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'valuation.indexTest' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/valuation/index',
    locale,
  })
}

export default function ValuationIndexTestPage() {
  return (
    <Suspense>
      <ValuationIndexTest />
    </Suspense>
  )
}
