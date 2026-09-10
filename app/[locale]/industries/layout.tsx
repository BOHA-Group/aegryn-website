import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'industries.page.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/industries',
    locale,
  })
}

export default function IndustriesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
