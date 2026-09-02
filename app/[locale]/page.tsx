import { getTranslations }  from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { HeroMountain }      from '@/components/sections/HeroMountain'
import { ManifestoSection }  from '@/components/sections/ManifestoSection'
import { FounderQuoteStrip } from '@/components/sections/FounderQuoteStrip'
import { BuildStrip }        from '@/components/sections/BuildStrip'
import { MissionVideoSection } from '@/components/sections/MissionVideoSection'
import { SegmentsSection }   from '@/components/sections/SegmentsSection'
import { HybridBlock }       from '@/components/sections/HybridBlock'
import { HomeTalentStrip }   from '@/components/sections/HomeTalentStrip'
import { BuildEngineeringStrip } from '@/components/sections/BuildEngineeringStrip'
import { AdvisoryTechStrip } from '@/components/sections/AdvisoryTechStrip'
import { DiscoverStrip }     from '@/components/sections/DiscoverStrip'
import type { Metadata }    from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return generateAegrynMetadata({
    title: t('tagline'),
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

      {/* ── 02. Citation fondateur ─────────────────────────── */}
      <FounderQuoteStrip />

      {/* ── 03. Le Modèle Aegryn — 5 disciplines ──────────── */}
      <MissionVideoSection />

      {/* ── 04. Notre ADN hybride ──────────────────────────── */}
      <HybridBlock />

      {/* ── 05. Nos clients — 4 segments ──────────────────── */}
      <SegmentsSection />

      {/* ── 06. Conseil ────────────────────────────────────── */}
      <AdvisoryTechStrip />

      {/* ── 07. Conception ─────────────────────────────────── */}
      <BuildStrip />
      <BuildEngineeringStrip />

      {/* ── 08. Talent ─────────────────────────────────────── */}
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
