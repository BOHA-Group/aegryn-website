import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import TalentPageClient from '@/components/pages/TalentPageClient'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent.meta' })
  return generateAegrynMetadata({ 
    title: t('title'), 
    description: t('desc'), 
    path: '/talent', 
    locale 
  })
}

export default async function TalentPage({ params }: Props) {
  const { locale } = await params
  return <TalentPageClient locale={locale} />
}
