import type { Metadata }  from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import ExpertsContent from './ExpertsContent'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experts' })
  return generateAegrynMetadata({
    title:       t('meta.title'),
    description: t('meta.desc'),
    path:        '/experts',
    locale,
  })
}

export default function ExpertsPage() {
  return (
    <Suspense>
      <ExpertsContent />
    </Suspense>
  )
}
