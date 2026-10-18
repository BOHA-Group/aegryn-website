import type { Metadata }        from 'next'
import { notFound }             from 'next/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { getAdvisoryPage }       from '@/content/advisory'
import { AdvisoryPillarPage }    from '@/components/advisory/AdvisoryPillarPage'
import { ImplementBlock }        from '@/components/advisory/ImplementBlock'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getAdvisoryPage(locale, 'financePerformance')
  if (!c) return {}
  return generateAegrynMetadata({ title: c.meta.title, description: c.meta.description, path: c.path, locale, keywords: c.meta.keywords, image: c.image })
}

export default async function FinancePerformancePage({ params }: Props) {
  const { locale } = await params
  const c = getAdvisoryPage(locale, 'financePerformance')
  if (!c) notFound()
  return <AdvisoryPillarPage content={c} locale={locale} implement={<ImplementBlock pillar="financePerformance" locale={locale} />} />
}
