import type { Metadata }        from 'next'
import { notFound }             from 'next/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getAdvisoryPage(locale, 'technology')
  if (!c) return {}
  return generateAegrynMetadata({ title: c.meta.title, description: c.meta.description, path: c.path, locale, keywords: c.meta.keywords })
}

export default async function TechnologyAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const c = getAdvisoryPage(locale, 'technology')
  if (!c) notFound()
  return <AdvisoryPillarPage content={c} locale={locale} />
}
