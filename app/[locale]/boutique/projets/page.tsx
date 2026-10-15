import { getTranslations }        from 'next-intl/server'
import Image                      from 'next/image'
import type { Metadata }           from 'next'
import { AssetsGrid }              from '@/components/sections/assets/AssetsGrid'
import { generateAegrynMetadata }  from '@/lib/seo'
import { WaveReveal }   from '@/components/animations/WaveReveal'
import { VisionTypewriter } from '@/components/sections/VisionTypewriter'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.portfolio.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/boutique/projets',
    locale,
    image: '/images/portfolio/hero-stars.jpg',
  })
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.portfolio' })

  return (
    <main>
      {/* Hero — même format que les pages métiers (image plein cadre sur navy) */}
      <section
        className="relative overflow-hidden bg-ag-navy pt-36 pb-24 px-6 md:px-12"
        style={{ minHeight: 'clamp(460px,50vw,620px)' }}
      >
        <Image
          src="/images/portfolio/hero-stars.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          unoptimized
          sizes="100vw"
          className="object-cover object-[center_80%]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/70 via-ag-navy/60 to-ag-navy/95" />
        <div className="relative max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <WaveReveal delay={0.1}>
            <h1
              className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-4xl text-balance whitespace-pre-line"
              style={{ fontSize: 'clamp(36px,5vw,72px)' }}
            >
              {t('title')}
            </h1>
          </WaveReveal>
        </div>
      </section>

      {/* Intro — format « Notre vision » (a-propos) : label a gauche, frappe au scroll */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="py-16 md:pr-16">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('introLabel')}</p>
            </div>
            <div className="py-16 md:px-16">
              <VisionTypewriter
                segments={t.raw('introSegments') as { t: string; bold?: boolean }[]}
                completeAtVh={0.55}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grille complète des actifs du groupe — subblink exclu (assets only) */}
      <AssetsGrid excludeIds={['subblink']} />
    </main>
  )
}
