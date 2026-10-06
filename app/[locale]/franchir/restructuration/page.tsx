import type { Metadata } from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getCycleContent } from '@/content/franchir'
import { CyclePage } from '@/components/franchir/CyclePage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getCycleContent(locale, 'restructuration')
  return generateAegrynMetadata({ title: c.meta.title, description: c.meta.description, path: '/franchir/restructuration', locale })
}

export default async function FranchirRestructurationPage({ params }: Props) {
  const { locale } = await params
  return <CyclePage content={getCycleContent(locale, 'restructuration')} locale={locale} />
}
