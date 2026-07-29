import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, TrendingUp } from 'lucide-react'
import { AuctionHero } from '@/components/sections/auction/AuctionHero'
import { AuctionStats } from '@/components/sections/auction/AuctionStats'
import { AuctionSteps } from '@/components/sections/auction/AuctionSteps'
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/auction', locale })
}

export default async function AuctionPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.index' })
  const tValuation = await getTranslations({ locale, namespace: 'valuation.marketContext' })
  const marketItems = tValuation.raw('items') as { value: string; label: string }[]

  const serviceLd = serviceJsonLd({
    name:        'AEGRYN Auction — Certified Tech Asset Transactions',
    description: 'Private auction sessions for certified tech assets. Institutional escrow. NDA. Less than 25% acceptance rate.',
    url:         'https://aegryn.com/auction',
    serviceType: 'Asset Transaction',
  })
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'AEGRYN',  url: 'https://aegryn.com' },
    { name: 'Auction', url: 'https://aegryn.com/auction' },
  ])

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <AuctionHero />
      <AuctionStats />
      <AuctionSteps />

      {/* ── Section marché 2026 ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5 flex items-center gap-3">
                <TrendingUp size={11} className="text-ag-apex" />
                {t('marketLabel')}
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-6 whitespace-pre-line"
                style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
              >
                {t('marketTitle')}
              </h2>
              <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-8 max-w-md">
                {t('marketDesc')}
              </p>
              <Link
                href="/valuation"
                className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
              >
                {t('marketCta')} <ArrowUpRight size={13} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-px bg-ag-border border border-ag-border">
              {marketItems.map(({ value, label }) => (
                <div key={label} className="bg-ag-white p-8 flex flex-col gap-2">
                  <span className="font-sans font-bold text-ag-black tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,2.5vw,36px)' }}>{value}</span>
                  <span className="font-sans text-[12px] text-ag-gray leading-snug">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA strip */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-3">
              {t('label')}
            </p>
            <p className="font-sans font-bold text-white text-[22px] max-w-md leading-snug">
              Prêt à vendre ou acquérir un actif tech certifié ?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/auction/how-to-sell"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaSubmit')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/auction/how-to-buy"
              className="inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-white/50 hover:text-white transition-all"
            >
              {t('ctaSession')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
