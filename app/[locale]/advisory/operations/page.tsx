import type { Metadata } from 'next'
import { AdvisoryComingPage } from '@/components/advisory/AdvisoryComingPage'
import { NEW_PILLARS, type Lang } from '@/content/advisory/implement'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as Lang
  return { title: NEW_PILLARS['operations'].name[lang], robots: { index: false, follow: true } }
}

export default async function Page({ params }: Props) {
  const { locale } = await params
  return <AdvisoryComingPage pillar="operations" locale={locale} />
}
