import type { Metadata } from 'next'
import { generateAegrynMetadata } from '@/lib/seo'
import { getCycleContent } from '@/content/franchir'
import { CyclePage } from '@/components/franchir/CyclePage'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const c = getCycleContent(locale, 'lancement')
  return generateAegrynMetadata({ title: c.meta.title, description: c.meta.description, path: '/franchir/lancement', locale })
}

export default async function FranchirLancementPage({ params }: Props) {
  const { locale } = await params
  return <CyclePage content={getCycleContent(locale, 'lancement')} locale={locale} />
}
