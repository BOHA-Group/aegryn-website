import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, TrendingUp, Building2, Search, Handshake, Users } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/transact', locale })
}

export default async function TransactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.index' })
  const tValuation = await getTranslations({ locale, namespace: 'valuation.marketContext' })
  const marketItems = tValuation.raw('items') as { value: string; label: string }[]

  const SEGMENTS = [
    {
      icon: <Building2 size={20} className="text-ag-apex" />,
      key: 'sell',
      href: '/transact/how-to-sell',
    },
    {
      icon: <Search size={20} className="text-ag-apex" />,
      key: 'buy',
      href: '/transact/how-to-buy',
    },
    {
      icon: <TrendingUp size={20} className="text-ag-apex" />,
      key: 'raise',
      href: '/transact/mandate',
    },
    {
      icon: <Users size={20} className="text-ag-apex" />,
      key: 'equity',
      href: '/transact/mandate',
    },
  ] as const

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('eyebrow')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-12 leading-relaxed">
            {t('heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/transact/catalog"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaCatalog')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/transact/mandate"
              className="inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              {t('ctaMandate')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4 segments de mandat ── */}
      <section className="py-24 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
              {t('segmentsLabel')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-tight max-w-2xl whitespace-pre-line"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('segmentsTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border border border-ag-border">
            {SEGMENTS.map(({ icon, key, href }) => (
              <Link
                key={key}
                href={href}
                className="group bg-ag-white p-10 flex flex-col gap-5 hover:bg-ag-off-white transition-colors"
              >
                <div className="w-10 h-10 border border-ag-apex/30 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ag-apex mb-2">
                    {t(`segment.${key}.kicker`)}
                  </p>
                  <p className="font-sans font-semibold text-ag-black text-[17px] leading-snug tracking-[-0.02em] mb-3">
                    {t(`segment.${key}.title`)}
                  </p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                    {t(`segment.${key}.desc`)}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ag-apex flex items-center gap-1.5 mt-auto group-hover:gap-2.5 transition-all">
                  {t(`segment.${key}.cta`)} <ArrowUpRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valeur Aegryn TRANSACT ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5 flex items-center gap-3">
              <Handshake size={11} className="text-ag-apex" />
              {t('valueLabel')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-6 whitespace-pre-line"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              {t('valueTitle')}
            </h2>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-8 max-w-md">
              {t('valueDesc')}
            </p>
            <Link
              href="/transact/catalog"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-black transition-colors"
            >
              {t('valueCta')} <ArrowUpRight size={13} />
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
      </section>

      {/* ── Processus en 4 étapes ── */}
      <section className="py-24 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-14">
            {t('howLabel')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border border border-ag-border">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n} className="bg-ag-white p-10 flex flex-col gap-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">0{n}</span>
                <p className="font-sans font-semibold text-ag-black text-[17px] leading-snug tracking-[-0.02em]">
                  {t(`how.step${n}.title`)}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t(`how.step${n}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-3">
              {t('ctaStripLabel')}
            </p>
            <p className="font-sans font-bold text-white text-[22px] max-w-md leading-snug">
              {t('ctaStripTitle')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/transact/mandate"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaStripMandate')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/transact/catalog"
              className="inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-white/50 hover:text-white transition-all"
            >
              {t('ctaStripCatalog')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
