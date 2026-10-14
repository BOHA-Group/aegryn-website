import { getTranslations }               from 'next-intl/server'
import type { Metadata }                  from 'next'
import { AssetHeroBannerVideo }           from '@/components/sections/AssetHeroBannerVideo'
import { ProprietaryAssetsGrid }          from '@/components/sections/assets/ProprietaryAssetsGrid'
import { generateAegrynMetadata }         from '@/lib/seo'
import { Link }                           from '@/i18n/navigation'
import { ArrowUpRight }                   from 'lucide-react'

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

      {/* Protocole CIFSO 5000 : accessible uniquement depuis les outils propriétaires */}
      <section className="border-t border-ag-border bg-ag-off-white/60">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-14 grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 lg:gap-16 items-start">
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
              / {t('cifso.label')}
            </p>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2] text-[20px] md:text-[24px]">
              {t('cifso.title')}
            </h2>
          </div>
          <div className="space-y-5">
            <p className="text-[15px] text-ag-gray leading-relaxed">{t('cifso.desc')}</p>
            <Link
              href={'/grade' as never}
              className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-gray border border-ag-border px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-all"
            >
              {t('cifso.cta')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
