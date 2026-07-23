import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { DiscoverGrid } from '@/components/sections/discover/DiscoverGrid'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'discover.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params

  return (
    <main id="main">
      <DiscoverGrid locale={locale} />
    </main>
  )
}
