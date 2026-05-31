import { getTranslations } from 'next-intl/server'
import Link  from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { AssetHeroBannerVideo } from '@/components/sections/AssetHeroBannerVideo'
import { AssetGridWithDrawer } from '@/components/sections/AssetDrawer'
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

export default async function WhatWeBuildPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'build' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-28">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[0.95] max-w-2xl"
            style={{ fontSize: 'clamp(48px,6vw,80px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-base text-ag-gray leading-relaxed max-w-lg">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Bannière image + vidéo cross-fade avec texte animé — Standard 8 */}
      <AssetHeroBannerVideo videoSrc="/videos/assets-reel.mp4" />

      {/* Grille actifs — drawer au clic */}
      <AssetGridWithDrawer />

      {/* Advisory CTA */}
      <section className="border-t border-ag-border bg-ag-navy py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-3">
              {t('advisoryCta.label')}
            </p>
            <h2 className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.95] max-w-lg"
              style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
            >
              {t('advisoryCta.text')}
            </h2>
          </div>
          <Link
            href="/advisory"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            {t('advisoryCta.button')}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
