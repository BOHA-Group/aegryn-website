import type { Metadata }        from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'
import { AdvisoryLegacyPage }    from '@/components/advisory/AdvisoryLegacyPage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'riskCompliance')
  if (v2) {
    return generateAegrynMetadata({ title: v2.meta.title, description: v2.meta.description, path: v2.path, locale, keywords: v2.meta.keywords })
  }
  return generateAegrynMetadata({
    title: 'Conseil en Risque & Conformité | Aegryn',
    description: 'Conseil en risque et conformité pour entreprises tech européennes : NIS2, DORA, AI Act, RGPD/LPD, gestion des risques, continuité d\'activité, préparation aux audits.',
    path: '/advisory/risk-compliance',
    locale,
    keywords: [
      'conseil risque conformité',
      'NIS2',
      'DORA',
      'AI Act',
      'RGPD LPD',
      'gestion des risques',
      'continuité d\'activité',
      'audit réglementaire',
      'advisory risque',
      'consulting conformité',
    ],
  })
}

export default async function RiskComplianceAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'riskCompliance')
  if (v2) return <AdvisoryPillarPage content={v2} locale={locale} />
  return <AdvisoryLegacyPage locale={locale} pillarKey="riskCompliance" />
}
