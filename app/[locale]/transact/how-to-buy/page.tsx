import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Check, ArrowUpRight } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.buy' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/how-to-buy',
    locale,
    keywords: [
      'buy tech company', 'acheter entreprise tech', 'acquire SaaS', 'acquisition numérique',
      'buy digital asset', 'comment acheter startup', 'M&A buyer', 'KYC investor',
      'NDA dossier confidentiel', 'offre ferme', 'club deal buyer', 'how to buy SaaS company',
    ],
  })
}

export default async function TransactBuyPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'transact.buy' })
  const tm = await getTranslations({ locale, namespace: 'transact.mandate' })

  const qualifItems    = t.raw('qualifItems')    as string[]
  const processSteps   = t.raw('processSteps')   as { num: string; title: string; desc: string }[]
  const buyPoints      = tm.raw('segment.buy.points') as string[]

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
            href="/contact"
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* ── Qualification profil + processus ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('qualifTitle')}
            </p>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-8">
              {t('qualifDesc')}
            </p>
            <ul className="flex flex-col gap-3">
              {qualifItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={14} className="text-ag-apex mt-0.5 shrink-0" />
                  <span className="font-sans text-[14px] text-ag-dark">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ag-off-white border border-ag-border p-10">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-6">
              {t('processTitle')}
            </p>
            <div className="flex flex-col gap-6">
              {processSteps.map(({ num, title, desc }) => (
                <div key={num} className="flex gap-5">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-ag-apex shrink-0 pt-0.5">{num}</span>
                  <div>
                    <p className="font-sans font-semibold text-ag-black text-[15px] mb-1">{title}</p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Mandat d'acquisition — conditions ── */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-12 items-start">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ag-apex mb-2">
                {tm('segment.buy.kicker')}
              </p>
              <h2 className="font-sans font-bold text-ag-black text-[22px] leading-snug tracking-[-0.02em] mb-3">
                {tm('segment.buy.title')}
              </h2>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-md">
                {tm('segment.buy.desc')}
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">
                Ce mandat inclut
              </p>
              <ul className="flex flex-col gap-2">
                {buyPoints.map((pt) => (
                  <li key={pt} className="flex items-start gap-3">
                    <span className="font-mono text-ag-apex text-[10px] mt-1 shrink-0">—</span>
                    <span className="font-sans text-[13px] text-ag-dark leading-snug">{pt}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className="self-start inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 hover:bg-ag-black transition-colors mt-4"
              >
                {tm('segment.buy.cta')} <ArrowUpRight size={11} />
              </Link>
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
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {tm('ndaCta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

    </main>
  )
}
