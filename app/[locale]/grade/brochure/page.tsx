import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CifsoBrochure } from '@/components/sections/grade/CifsoBrochure'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'brochure' })
  return generateAegrynMetadata({ title: t('previewTitle'), description: t('previewDesc'), path: '/grade/brochure', locale })
}

export default function BrochurePage() {
  return (
    <Suspense fallback={null}>
      <CifsoBrochure />
    </Suspense>
  )
}
