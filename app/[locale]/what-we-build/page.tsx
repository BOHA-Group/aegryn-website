import { getTranslations } from 'next-intl/server'
import Link  from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { AEGRYN_ASSETS, ASSET_CATEGORIES } from '@/data/assets'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'What We Make | Digital Ecosystems by Aegryn',
    description: 'Discover the proprietary digital ecosystems designed and operated by Aegryn, structured for scalability, resilience and long-term value.',
    path: '/what-we-build',
    locale,
  })
}

const STATUS_CONFIG = {
  live:  { label: 'Live',              dot: 'bg-ag-live' },
  beta:  { label: 'Bêta',             dot: 'bg-ag-beta' },
  dev:   { label: 'En développement', dot: 'bg-ag-dev' },
} as const

export default async function WhatWeBuildPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'build' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-28">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            {t('hero.label')}
          </p>
          <h1
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.95] max-w-2xl"
            style={{ fontSize: 'clamp(48px,6vw,80px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-base text-ag-gray leading-relaxed max-w-lg">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Intro image */}
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(280px, 40vw, 560px)' }}>
        <Image
          src="/images/assets-intro.jpg"
          alt="Aegryn — Nos actifs numériques"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-ag-white/60" />
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 pb-10">
          <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/70">
            Engineered to Last — Swiss Tech Asset Builder
          </p>
        </div>
      </div>

      {/* Assets by category */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {(Object.keys(ASSET_CATEGORIES) as Array<keyof typeof ASSET_CATEGORIES>).map((cat) => {
            const catAssets = AEGRYN_ASSETS.filter((a) => a.category === cat && a.id !== 'kryv')
            if (!catAssets.length) return null

            return (
              <div key={cat} className="mb-16 last:mb-0">
                <div className="flex items-center justify-between border-y border-ag-border py-4 mb-0">
                  <span className="font-display font-bold text-[11px] tracking-[0.18em] uppercase text-ag-black">
                    {ASSET_CATEGORIES[cat].label}
                  </span>
                  <span className="font-mono text-[11px] text-ag-gray-light">
                    {String(catAssets.length).padStart(2, '0')}
                  </span>
                </div>
                <div className={`grid border-b border-ag-border ${
                  catAssets.length <= 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {catAssets.map((asset) => {
                    const status = STATUS_CONFIG[asset.status]
                    return (
                      <Link
                        key={asset.id}
                        href={`/assets/${asset.slug}`}
                        className="group flex flex-col border-r border-ag-border p-10 min-h-[260px] bg-ag-white hover:bg-ag-off-white transition-colors last:border-r-0"
                      >
                        <div className="flex justify-between items-start mb-auto">
                          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light border border-ag-border px-2.5 py-1 group-hover:border-ag-border-h transition-colors">
                            {asset.badge}
                          </span>
                          <span className="w-8 h-8 border border-ag-border flex items-center justify-center text-ag-gray group-hover:bg-ag-black group-hover:border-ag-black group-hover:text-white transition-all">
                            <ArrowUpRight size={13} />
                          </span>
                        </div>
                        <div className="mt-12">
                          <h2 className="font-display font-black text-ag-black text-[24px] tracking-[-0.03em] leading-none mb-2">
                            {asset.name}
                          </h2>
                          <p className="font-mono text-[12px] text-ag-gray leading-relaxed mb-4">
                            {asset.tagline}
                          </p>
                          <p className="text-[13px] text-ag-gray leading-relaxed mb-5">
                            {asset.description}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
                              {status.label}
                            </span>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Advisory CTA */}
      <section className="border-t border-ag-border bg-ag-navy py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40 mb-3">
              Aegryn Advisory
            </p>
            <h2 className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-lg"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {t('advisoryCta.text')}
            </h2>
          </div>
          <Link
            href="/advisory"
            className="shrink-0 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            {t('advisoryCta.button')}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
