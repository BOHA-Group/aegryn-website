import Link                     from 'next/link'
import { ArrowUpRight }          from 'lucide-react'
import { getTranslations }       from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata }         from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Conseil en Stratégie | Aegryn',
    description: 'Conseil en stratégie pour entreprises tech européennes : stratégie internationale, transformation business, optimisation des coûts, innovation & croissance, talent & organisation.',
    path: '/advisory/strategy',
    locale,
    keywords: [
      'conseil stratégie',
      'stratégie internationale',
      'transformation business',
      'optimisation coûts',
      'innovation croissance',
      'stratégie RH',
      'conseil stratégique tech',
      'advisory stratégie',
      'consulting stratégie',
    ],
  })
}

export default async function StrategyAdvisoryPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'advisory' })

  const pillar = t.raw('pillars.strategy') as {
    title: string
    desc: string
    dimensions: { label: string; desc: string }[]
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            AEGRYN CONSEIL
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {pillar.title}
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            {pillar.desc}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex transition-colors"
          >
            {t('cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Dimensions */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="grid md:grid-cols-2 gap-12">
            {pillar.dimensions.map((dim, idx) => (
              <div key={idx} className="border-l-2 border-ag-apex/20 pl-6">
                <h3 className="font-sans font-semibold text-[18px] text-ag-navy mb-3">
                  {dim.label}
                </h3>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {dim.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-ag-border bg-ag-cream">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 text-center">
          <h2 className="font-sans font-bold text-[32px] text-ag-navy mb-6">
            Discutons de votre stratégie
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mx-auto mb-10">
            Chaque mission démarre par un diagnostic exhaustif avant toute recommandation. Nous documentons, nous mesurons, nous livrons.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex hover:text-ag-navy transition-colors"
          >
            Prendre contact <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
