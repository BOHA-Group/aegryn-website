import { notFound }          from 'next/navigation'
import Link                   from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { Aegryn_ASSETS, ASSET_CATEGORIES } from '@/data/assets'
import { getTranslations }    from 'next-intl/server'
import type { Metadata }      from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

const STATUS_DOT: Record<string, { dot: string; text: string }> = {
  live:        { dot: 'bg-ag-live',       text: 'text-ag-live'       },
  beta:        { dot: 'bg-ag-beta',       text: 'text-ag-beta'       },
  dev:         { dot: 'bg-ag-gray-light', text: 'text-ag-gray-light' },
  not_started: { dot: 'bg-ag-gray-light', text: 'text-ag-gray-light' },
} as const

const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl']

export async function generateStaticParams() {
  const assets = Aegryn_ASSETS.filter((a) => a.id !== 'kryv')
  return LOCALES.flatMap((locale) =>
    assets.map((a) => ({ locale, slug: a.slug }))
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const asset = Aegryn_ASSETS.find((a) => a.slug === slug && a.id !== 'kryv')
  if (!asset) return {}
  return generateAegrynMetadata({
    title: asset.name,
    description: asset.tagline,
    path: `/assets/${slug}`,
    locale,
  })
}

export default async function AssetPage({ params }: Props) {
  const { locale, slug } = await params
  const t       = await getTranslations({ locale, namespace: 'assetPage' })
  const tStatus = await getTranslations({ locale, namespace: 'assetStatus' })
  const tFooter  = await getTranslations({ locale, namespace: 'footer' })
  const asset = Aegryn_ASSETS.find((a) => a.slug === slug && a.id !== 'kryv')
  if (!asset) notFound()

  const assetId = asset.id as 'subblink' | 'neediu' | 'primiom' | 'movtoo' | 'hobconnect'
  const hasAssetI18n = ['subblink', 'neediu', 'primiom', 'movtoo', 'hobconnect'].includes(assetId)
  const longDesc  = hasAssetI18n ? t(`assets.${assetId}.longDesc`) : asset.description
  const audience  = hasAssetI18n ? t(`assets.${assetId}.audience`) : ''
  const features  = hasAssetI18n ? (t.raw(`assets.${assetId}.features`) as string[]) : []

  const statusKey = asset.status as keyof typeof STATUS_DOT
  const statusDot = STATUS_DOT[statusKey] ?? STATUS_DOT.not_started
  const statusLabel = statusKey === 'live' ? tStatus('live')
    : statusKey === 'beta' ? tStatus('beta')
    : statusKey === 'dev'  ? tStatus('dev')
    : tStatus('notStarted')
  const category = ASSET_CATEGORIES[asset.category]
  const isLive   = !!asset.url

  return (
    <>

      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28">
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-gray-light border border-ag-border px-3 py-1">
              {category.label}
            </span>
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase border border-ag-border px-3 py-1 text-ag-gray-light">
              {asset.badge}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${statusDot.dot}`} />
              <span className={`font-sans font-semibold text-[10px] tracking-[0.14em] uppercase ${statusDot.text}`}>
                {statusLabel}
              </span>
            </span>
          </div>

          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl mb-6"
            style={{ fontSize: 'clamp(56px,7vw,96px)' }}
          >
            {asset.name}
          </h1>
          <p className="font-sans font-semibold text-[14px] text-ag-gray leading-relaxed max-w-xl mb-10">
            {asset.tagline}
          </p>

          {isLive ? (
            <a
              href={asset.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-navy transition-colors"
            >
              {t('visit')} {asset.name}
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 border border-ag-border text-ag-gray-light font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 cursor-default select-none">
              {t('comingSoon')}
            </span>
          )}
        </div>
      </section>

      {/* Divider strip */}
      <div className="h-px bg-gradient-to-r from-transparent via-ag-apex/40 to-transparent" />

      {/* Description + features */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ag-border">

            {/* Long description */}
            <div className="py-20 md:pr-16">
              <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                {t('presentation')}
              </p>
              <p className="text-[15px] text-ag-dark leading-[1.8]">
                {longDesc}
              </p>
              {audience && (
                <div className="mt-10 pt-8 border-t border-ag-border">
                  <p className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">
                    {t('audience')}
                  </p>
                  <p className="text-[14px] text-ag-gray">{audience}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="py-20 md:pl-16">
              <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                {t('features')}
              </p>
              <ul className="space-y-4">
                {features.map((f, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-[3px] w-4 h-4 shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ag-apex" />
                    </span>
                    <span className="text-[14px] text-ag-gray leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

            </div>
          </div>
        </div>
      </section>

      {/* Neediu legal notice — only on the neediu page */}
      {asset.id === 'neediu' && (
        <div className="border-b border-ag-border bg-ag-off-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex items-center justify-end">
            <Link
              href="/data-protection-notice-neediu"
              className="font-sans font-semibold text-[10px] tracking-[0.16em] uppercase text-ag-gray-light hover:text-ag-black transition-colors"
            >
              {tFooter('neediuLegal')}
            </Link>
          </div>
        </div>
      )}

      {/* CTA strip */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              {t('cta.label')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              {t('cta.title')}
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/what-we-build"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
            >
              {t('cta.allAssets')}
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-navy bg-ag-apex px-6 py-3 hover:bg-white transition-colors"
            >
              {t('cta.contact')}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
