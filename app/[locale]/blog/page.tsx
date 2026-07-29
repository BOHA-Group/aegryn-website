import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { DiscoverGrid } from '@/components/sections/discover/DiscoverGrid'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'discover.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/blog', locale })
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params

  return (
    <main>
      <DiscoverGrid locale={locale} />
    </main>
  )
}
