import type { Metadata }        from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'
import { AdvisoryLegacyPage }    from '@/components/advisory/AdvisoryLegacyPage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'talentOrganization')
  if (v2) {
    return generateAegrynMetadata({ title: v2.meta.title, description: v2.meta.description, path: v2.path, locale, keywords: v2.meta.keywords })
  }
  return generateAegrynMetadata({
    title: 'Talent, et Organisation | Aegryn',
    description: 'Conseil en talent et organisation pour entreprises tech européennes : dépendance fondateur, profondeur de l\'équipe de direction, plan de succession, recrutement exécutif, rétention des talents clés.',
    path: '/advisory/talent-organization',
    locale,
    keywords: [
      'conseil talent organisation',
      'dépendance fondateur',
      'plan de succession',
      'recrutement exécutif',
      'rétention talents clés',
      'gouvernance board',
      'advisory talent',
      'organisation transmissible',
    ],
  })
}

export default async function TalentOrganizationAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const v2 = getAdvisoryPage(locale, 'talentOrganization')
  if (v2) return <AdvisoryPillarPage content={v2} locale={locale} />
  return <AdvisoryLegacyPage locale={locale} pillarKey="talentOrganization" />
}
