import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Building2, Search, TrendingUp, Users } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.mandate.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/transact/mandate', locale })
}

const SEGMENT_ICONS = {
  sell:         <Building2 size={22} className="text-ag-apex" />,
  buy:          <Search size={22} className="text-ag-apex" />,
  fundraise:    <TrendingUp size={22} className="text-ag-apex" />,
  equity_stake: <Users size={22} className="text-ag-apex" />,
} as const

export default async function MandatePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.mandate' })

  const SEGMENTS = ['sell', 'buy', 'fundraise', 'equity_stake'] as const

  return (
    <main className="bg-ag-white">
      {/* Hero */}
      <section className="bg-ag-navy pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('eyebrow')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* 4 segments */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-14">
            {t('segmentsLabel')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
            {SEGMENTS.map((seg) => (
              <div key={seg} className="bg-ag-white p-12 flex flex-col gap-6">
                <div className="w-12 h-12 border border-ag-apex/30 flex items-center justify-center">
                  {SEGMENT_ICONS[seg]}
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ag-apex mb-2">
                    {t(`segment.${seg}.kicker`)}
                  </p>
                  <h2 className="font-sans font-bold text-ag-black text-[22px] leading-snug tracking-[-0.02em] mb-3">
                    {t(`segment.${seg}.title`)}
                  </h2>
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-md mb-6">
                    {t(`segment.${seg}.desc`)}
                  </p>
                  <ul className="flex flex-col gap-2 mb-8">
                    {(t.raw(`segment.${seg}.points`) as string[]).map((pt) => (
                      <li key={pt} className="flex items-start gap-3">
                        <span className="font-mono text-ag-apex text-[10px] mt-1">—</span>
                        <span className="font-sans text-[13px] text-ag-dark leading-snug">{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  href="/contact"
                  className="self-start inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 hover:bg-ag-black transition-colors"
                >
                  {t(`segment.${seg}.cta`)} <ArrowUpRight size={11} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus mandat */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
            {t('processLabel')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="bg-ag-white p-10 flex flex-col gap-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">0{n}</span>
                <p className="font-sans font-semibold text-ag-black text-[17px] leading-snug tracking-[-0.02em]">
                  {t(`process.step${n}.title`)}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t(`process.step${n}.desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NDA + confidentialité */}
      <section className="py-16 px-6 bg-ag-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-3">
              {t('ndaLabel')}
            </p>
            <p className="font-sans font-bold text-white text-[20px] max-w-lg leading-snug">
              {t('ndaTitle')}
            </p>
            <p className="font-sans text-[14px] text-white/55 mt-3 max-w-md leading-relaxed">
              {t('ndaDesc')}
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('ndaCta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  )
}
