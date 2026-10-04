import type { Metadata }        from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'
import { AdvisoryLegacyPage }    from '@/components/advisory/AdvisoryLegacyPage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'strategy')
  if (v2) {
    return generateAegrynMetadata({ title: v2.meta.title, description: v2.meta.description, path: v2.path, locale, keywords: v2.meta.keywords })
  }
  return generateAegrynMetadata({
    title: 'Conseil en Stratégie | Aegryn',
    description: 'Conseil en stratégie pour entreprises tech européennes : stratégie internationale, transformation business, optimisation des coûts, innovation & croissance, talent & organisation.',
    path: '/advisory/strategy',
    locale,
    keywords: [
      'conseil stratégie',
      'stratégie internationale',
      'transformation business',
      'optimisation coûts',
      'innovation croissance',
      'stratégie RH',
      'conseil stratégique tech',
      'advisory stratégie',
      'consulting stratégie',
    ],
  })
}

export default async function StrategyAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'strategy')
  if (v2) return <AdvisoryPillarPage content={v2} locale={locale} />
  return <AdvisoryLegacyPage locale={locale} pillarKey="strategy" />
}
