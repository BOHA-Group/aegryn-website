import type { Metadata }        from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'
import { AdvisoryLegacyPage }    from '@/components/advisory/AdvisoryLegacyPage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'technology')
  if (v2) {
    return generateAegrynMetadata({ title: v2.meta.title, description: v2.meta.description, path: v2.path, locale, keywords: v2.meta.keywords })
  }
  return generateAegrynMetadata({
    title: 'Conseil en Technologie | Aegryn',
    description: 'Conseil en technologie pour entreprises tech européennes : transformation digitale, data & analytics, IA, cybersécurité, cloud & infrastructure, blockchain & Web3.',
    path: '/advisory/technology',
    locale,
    keywords: [
      'conseil technologie',
      'transformation digitale',
      'data analytics',
      'intelligence artificielle',
      'cybersécurité',
      'cloud infrastructure',
      'blockchain web3',
      'conseil tech',
      'advisory tech',
      'consulting technologie',
    ],
  })
}

export default async function TechnologyAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'technology')
  if (v2) return <AdvisoryPillarPage content={v2} locale={locale} />
  return <AdvisoryLegacyPage locale={locale} pillarKey="technology" />
}
