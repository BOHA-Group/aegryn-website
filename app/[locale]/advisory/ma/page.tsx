import type { Metadata }        from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'
import { AdvisoryLegacyPage }    from '@/components/advisory/AdvisoryLegacyPage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'ma')
  if (v2) {
    return generateAegrynMetadata({ title: v2.meta.title, description: v2.meta.description, path: v2.path, locale, keywords: v2.meta.keywords })
  }
  return generateAegrynMetadata({
    title: 'Conseil en M&A | Aegryn',
    description: 'Conseil en fusions-acquisitions pour entreprises tech européennes : due diligence tech, technology blueprint, integration management office, post-merger integration.',
    path: '/advisory/ma',
    locale,
    keywords: [
      'conseil M&A',
      'fusions acquisitions',
      'due diligence tech',
      'integration IT',
      'post-merger integration',
      'carve-out',
      'spin-off',
      'conseil transaction',
      'advisory M&A',
    ],
  })
}

export default async function MAAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'ma')
  if (v2) return <AdvisoryPillarPage content={v2} locale={locale} />
  return <AdvisoryLegacyPage locale={locale} pillarKey="ma" />
}
