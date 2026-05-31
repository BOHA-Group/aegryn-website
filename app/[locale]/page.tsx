import { getTranslations }  from 'next-intl/server'
import { generateAegrynMetadata, aegrynOrganizationSchema } from '@/lib/seo'
import { HeroMountain }     from '@/components/sections/HeroMountain'
import { ManifestoSection } from '@/components/sections/ManifestoSection'
import { AssetGrid }        from '@/components/sections/AssetGrid'
import { WhyUseApps }       from '@/components/sections/WhyUseApps'
import { StatementStrip }   from '@/components/sections/StatementStrip'
import { StatsRow }         from '@/components/sections/StatsRow'
import type { Metadata }    from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return generateAegrynMetadata({
    title: t('tagline'),
    description: 'We are a Swiss Tech Asset Builder designing and operating digital ecosystems, with selective advisory in Data, AI and Cybersecurity across Europe.',
    locale,
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const tAdv = await getTranslations({ locale, namespace: 'advisory' })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />
      <HeroMountain />
      <ManifestoSection />
      <AssetGrid />
      <WhyUseApps />
      <StatementStrip
        label="Aegryn Advisory"
        title={tAdv('hero.title')}
        cta={tAdv('cta')}
        href="/advisory"
      />
      <StatsRow />
    </>
  )
}
