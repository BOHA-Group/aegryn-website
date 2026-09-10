import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { WhitepaperContent } from './WhitepaperContent'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grade.index' })
  return generateAegrynMetadata({
    title: t('whitepaperTitle'),
    description: t('whitepaperDesc'),
    path: '/grade/whitepaper',
    locale,
  })
}

export default async function WhitepaperPage({ params }: Props) {
  const { locale } = await params
  await getTranslations({ locale, namespace: 'grade.index' })
  await getTranslations({ locale, namespace: 'gradingSystem' })
  return <WhitepaperContent />
}
