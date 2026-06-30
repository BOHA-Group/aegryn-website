import { getTranslations }          from 'next-intl/server'
import type { Metadata }             from 'next'
import { AssetHeroBannerVideo }      from '@/components/sections/AssetHeroBannerVideo'
import { AssetsGrid }                from '@/components/sections/assets/AssetsGrid'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.page.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function AssetsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.page' })

  return (
    <main id="main">
      <AssetHeroBannerVideo
        label={t('heroLabel')}
        title={t('heroTitle')}
        sub={t('heroSub')}
      />
      <AssetsGrid />
    </main>
  )
}
