import { getTranslations }  from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { HeroMountain }      from '@/components/sections/HeroMountain'
import { ManifestoSection }  from '@/components/sections/ManifestoSection'
import { BuildStrip }        from '@/components/sections/BuildStrip'
import { MissionVideoSection } from '@/components/sections/MissionVideoSection'
import { SegmentsSection }   from '@/components/sections/SegmentsSection'
import { HomeTalentStrip }   from '@/components/sections/HomeTalentStrip'
import { MetiersScroller } from '@/components/sections/MetiersScroller'
import { FranchirHomeSection } from '@/components/sections/FranchirHomeSection'
import { MarketStatStrip }   from '@/components/sections/MarketStatStrip'
import { WhyUseApps }        from '@/components/sections/WhyUseApps'
import { DiscoverStrip }     from '@/components/sections/DiscoverStrip'
import type { Metadata }    from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return generateAegrynMetadata({
    title: t('metaTitle'),
    description: t('metaDescription'),
    locale,
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const tDiscover = await getTranslations({ locale, namespace: 'discoverStrip' })

  return (
    <>
      {/* ── 0. Hero ────────────────────────────────────────── */}
      <HeroMountain />

      {/* ── 01. Notre Conviction + About ───────────────────── */}
      <ManifestoSection />

      {/* ── 03. Le Modèle Aegryn — 5 disciplines ──────────── */}
      <MissionVideoSection />

      {/* ── 04. Notre ADN hybride ──────────────────────────── */}

      {/* ── 05. Nos clients : de la startup à l'ETI ───────── */}
      <SegmentsSection />

      {/* ── 06. Conseil ────────────────────────────────────── */}
      <MetiersScroller />

      {/* ── 07. Conception ─────────────────────────────────── */}
      <BuildStrip />

      <MarketStatStrip />

      {/* ── 09b. Franchir — cycles de vie (ex-page /valoriser) ── */}
      <FranchirHomeSection locale={locale} />
      <WhyUseApps />

      {/* ── 10. Talent ─────────────────────────────────────── */}
      <HomeTalentStrip />

      {/* ── 5. Blog ─────────────────────────────────────────────── */}
      <DiscoverStrip
        magLabel={tDiscover('magLabel')}
        magTitle={tDiscover('magTitle')}
        magDesc={tDiscover('magDesc')}
        magFooter={tDiscover('magFooter')}
        magCta={tDiscover('magCta')}
        articlesLabel={tDiscover('label')}
        articlesCta={tDiscover('cta')}
      />
    </>
  )
}
