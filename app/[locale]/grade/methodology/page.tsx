import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { GradingSystemPage } from '@/components/sections/grade/GradingSystemPage'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'gradingSystem.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/grade/methodology', locale })
}

export default async function GradeMethodologyPage({ params }: Props) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'gradingSystem' })
  return <GradingSystemPage />
}
