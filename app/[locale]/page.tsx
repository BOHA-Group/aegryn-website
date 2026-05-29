import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata, aegrynOrganizationSchema } from '@/lib/seo'
import { HeroMountain }    from '@/components/sections/HeroMountain'
import { ManifestoSection } from '@/components/sections/ManifestoSection'
import { AssetGrid }        from '@/components/sections/AssetGrid'
import { StatementStrip }   from '@/components/sections/StatementStrip'
import { StatsRow }         from '@/components/sections/StatsRow'
import type { Metadata }    from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })
  return generateAegrynMetadata({
    title: t('tagline'),
    description: 'Aegryn est un Swiss Tech Asset Builder. Nous construisons des actifs propriétaires conçus pour durer.',
    locale,
  })
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />
      <HeroMountain />
      <ManifestoSection />
      <AssetGrid />
      <StatementStrip
        label="Aegryn Advisory"
        title="Nous protégeons ce que vous construisez."
        cta="Découvrir l'advisory"
        href="/advisory"
      />
      <StatsRow />
    </>
  )
}
