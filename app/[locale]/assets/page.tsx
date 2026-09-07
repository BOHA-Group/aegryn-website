import { getTranslations }               from 'next-intl/server'
import type { Metadata }                  from 'next'
import { AssetHeroBannerVideo }           from '@/components/sections/AssetHeroBannerVideo'
import { ProprietaryAssetsGrid }          from '@/components/sections/assets/ProprietaryAssetsGrid'
import { generateAegrynMetadata }         from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.page.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/assets', locale })
}

export default async function AssetsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.page' })

  return (
    <main>
      <AssetHeroBannerVideo
        label={t('heroLabel')}
        title={t('heroTitle')}
        sub={t('heroSub')}
      />

      <ProprietaryAssetsGrid />
    </main>
  )
}
