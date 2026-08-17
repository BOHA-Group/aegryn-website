import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, TrendingUp, Users } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.sell' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/how-to-sell',
    locale,
    keywords: [
      'sell tech company', 'vendre entreprise tech', 'sell SaaS', 'cession actif numérique',
      'sell digital asset', 'vendre startup', 'exit tech', 'M&A exit', 'transact sell digital business',
      'how to sell SaaS', 'structured sale tech asset', 'vente structurée actif tech',
    ],
  })
}

export default async function TransactSellPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'transact.sell' })
  const tm = await getTranslations({ locale, namespace: 'transact.mandate' })

  const steps = [
    { title: t('step1Title'), desc: t('step1Desc') },
    { title: t('step2Title'), desc: t('step2Desc') },
    { title: t('step3Title'), desc: t('step3Desc') },
    { title: t('step4Title'), desc: t('step4Desc') },
  ]

  const sellPoints   = tm.raw('segment.sell.points')   as string[]
  const fundraisePoints = tm.raw('segment.fundraise.points') as string[]
  const equityPoints = tm.raw('segment.equity_stake.points') as string[]

  return (
    <main className="bg-ag-white">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-10">
            {t('desc')}
          </p>
          <Link
            href={{ pathname: '/transact/mandate', query: { type: 'sell' } }}
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── Mandat de cession — process + conditions ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
            {tm('segment.sell.kicker')}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12 items-start mb-16">
            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-ag-border divide-y md:divide-y-0 md:divide-x divide-ag-border">
              {steps.map(({ title, desc }, i) => (
                <div key={i} className="p-10 flex flex-col gap-4">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">0{i + 1}</span>
                  <h2 className="font-sans font-semibold text-ag-black text-[20px] leading-snug tracking-[-0.02em]">{title}</h2>
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            {/* Conditions cession */}
            <div className="bg-ag-off-white border border-ag-border p-8 flex flex-col gap-4">
              <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex mb-2">
                {tm('segment.sell.kicker')}
              </p>
              <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug">
                {tm('segment.sell.title')}
              </p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                {tm('segment.sell.desc')}
              </p>
              <ul className="flex flex-col gap-2 pt-2">
                {sellPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <span className="font-mono text-ag-apex text-[10px] mt-1 shrink-0">—</span>
                    <span className="font-sans text-[13px] text-ag-dark leading-snug">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mandats complémentaires : levée de fonds + equity ── */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
            {tm('segmentsLabel')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
            {/* Levée de fonds */}
            <div className="bg-ag-white p-10 flex flex-col gap-5">
              <div className="w-10 h-10 border border-ag-apex/30 flex items-center justify-center">
                <TrendingUp size={18} className="text-ag-apex" />
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ag-apex mb-2">
                  {tm('segment.fundraise.kicker')}
                </p>
                <h3 className="font-sans font-bold text-ag-black text-[18px] leading-snug tracking-[-0.02em] mb-3">
                  {tm('segment.fundraise.title')}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed mb-5">
                  {tm('segment.fundraise.desc')}
                </p>
                <ul className="flex flex-col gap-2">
                  {fundraisePoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <span className="font-mono text-ag-apex text-[10px] mt-1 shrink-0">—</span>
                      <span className="font-sans text-[13px] text-ag-dark leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={{ pathname: '/transact/mandate', query: { type: 'fundraise' } }}
                className="self-start inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-colors mt-auto"
              >
                {tm('segment.fundraise.cta')} <ArrowUpRight size={11} />
              </Link>
            </div>
            {/* Ouverture du capital */}
            <div className="bg-ag-white p-10 flex flex-col gap-5">
              <div className="w-10 h-10 border border-ag-apex/30 flex items-center justify-center">
                <Users size={18} className="text-ag-apex" />
              </div>
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ag-apex mb-2">
                  {tm('segment.equity_stake.kicker')}
                </p>
                <h3 className="font-sans font-bold text-ag-black text-[18px] leading-snug tracking-[-0.02em] mb-3">
                  {tm('segment.equity_stake.title')}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed mb-5">
                  {tm('segment.equity_stake.desc')}
                </p>
                <ul className="flex flex-col gap-2">
                  {equityPoints.map((pt) => (
                    <li key={pt} className="flex items-start gap-3">
                      <span className="font-mono text-ag-apex text-[10px] mt-1 shrink-0">—</span>
                      <span className="font-sans text-[13px] text-ag-dark leading-snug">{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={{ pathname: '/transact/mandate', query: { type: 'equity_stake' } }}
                className="self-start inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-colors mt-auto"
              >
                {tm('segment.equity_stake.cta')} <ArrowUpRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tarification ── */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('feesTitle')}
          </p>
          <p className="font-sans text-[15px] text-ag-gray max-w-xl mb-10">{t('feesDesc')}</p>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="border border-ag-border bg-ag-white p-8 flex-1">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mb-3">{t('feesCert')}</p>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('feesCertValue')}</p>
            </div>
            <div className="border border-ag-apex/30 bg-ag-white p-8 flex-1">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-apex mb-3">{t('feesSuccess')}</p>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('feesSuccessValue')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── NDA ── */}
      <section className="py-16 px-6 bg-ag-navy border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/40 mb-3">
              {tm('ndaLabel')}
            </p>
            <p className="font-sans font-bold text-white text-[20px] max-w-lg leading-snug">
              {tm('ndaTitle')}
            </p>
            <p className="font-sans text-[14px] text-white/55 mt-3 max-w-md leading-relaxed">
              {tm('ndaDesc')}
            </p>
          </div>
          <Link
            href={{ pathname: '/transact/mandate', query: { type: 'sell' } }}
            className="shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {tm('ndaCta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

    </main>
  )
}
