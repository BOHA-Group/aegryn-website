import { getTranslations }          from 'next-intl/server'
import type { Metadata }             from 'next'
import Link                          from 'next/link'
import { ArrowUpRight, Info }        from 'lucide-react'
import { AssetHeroBannerVideo }      from '@/components/sections/AssetHeroBannerVideo'
import { AssetsGrid }                from '@/components/sections/assets/AssetsGrid'
import { generateAegrynMetadata }    from '@/lib/seo'

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

      {/* Bannière éditoriale — portefeuille propriétaire vs tiers */}
      <div className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info size={14} className="text-ag-gray-light mt-0.5 shrink-0" />
            <p className="font-sans text-[12px] text-ag-gray leading-relaxed max-w-2xl">
              {t('ownedNote')}
            </p>
          </div>
          <Link
            href="/transact/catalog"
            className="shrink-0 inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-4 py-2 hover:bg-ag-navy hover:text-white transition-colors whitespace-nowrap"
          >
            {t('ctaAuction')} <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>

      <AssetsGrid />
    </main>
  )
}
