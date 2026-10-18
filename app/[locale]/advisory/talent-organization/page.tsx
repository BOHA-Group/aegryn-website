import type { Metadata }        from 'next'
import { notFound }             from 'next/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'
import { ImplementBlock }        from '@/components/advisory/ImplementBlock'
import { SelectBlock }           from '@/components/advisory/SelectBlock'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getAdvisoryPage(locale, 'talentOrganization')
  if (!c) return {}
  return generateAegrynMetadata({ title: c.meta.title, description: c.meta.description, path: c.path, locale, keywords: c.meta.keywords, image: c.image })
}

export default async function TalentOrganizationAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const c = getAdvisoryPage(locale, 'talentOrganization')
  if (!c) notFound()
  return <AdvisoryPillarPage content={c} locale={locale} implement={<><ImplementBlock pillar="talent-organization" locale={locale} /><SelectBlock locale={locale} /></>} />
}
