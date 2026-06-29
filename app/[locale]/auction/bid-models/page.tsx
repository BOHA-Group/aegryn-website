import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, ChevronLeft, ShieldCheck } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'bidModels' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/auction/bid-models',
    locale,
  })
}

const MODELS = ['model1', 'model2', 'model3'] as const

export default function BidModelsPage() {
  const t    = useTranslations('bidModels')
  const tNav = useTranslations('nav')

  return (
    <main id="main" className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/auction"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-ag-apex transition-colors mb-10"
          >
            <ChevronLeft size={11} /> {tNav('auction')}
          </Link>
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* 3 Model cards */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {MODELS.map((key, i) => (
            <div
              key={key}
              className="border border-ag-border p-8 flex flex-col gap-6 hover:border-ag-black transition-colors"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-apex">
                  {t(`${key}.label`)}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[0.12em] text-ag-gray-light border border-ag-border px-2 py-1">
                  {t(`${key}.badge`)}
                </span>
              </div>
              <h2
                className="font-sans font-bold text-ag-black leading-[1.15] tracking-[-0.025em] whitespace-pre-line"
                style={{ fontSize: 'clamp(18px,1.8vw,24px)' }}
              >
                {t(`${key}.title`)}
              </h2>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                {t(`${key}.desc`)}
              </p>
              <ul className="flex flex-col gap-2">
                {(t.raw(`${key}.features`) as string[]).map((feat, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <CheckCircle2 size={13} className="text-ag-apex mt-0.5 shrink-0" />
                    <span className="font-sans text-[12px] text-ag-black">{feat}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/auction/how-to-buy"
                className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.14em] text-ag-navy border border-ag-navy px-5 py-3 hover:bg-ag-navy hover:text-white transition-colors self-start mt-auto"
              >
                {t(`${key}.cta`)} <ArrowUpRight size={12} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Escrow mechanism */}
      <section className="bg-ag-off-white py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('escrow.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black leading-[1.1] tracking-[-0.03em] max-w-2xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(24px,3vw,44px)' }}
          >
            {t('escrow.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray mb-12 max-w-xl">
            {t('escrow.desc')}
          </p>

          {/* Steps timeline */}
          <div className="relative">
            <div className="absolute left-5 top-0 bottom-0 w-px bg-ag-border hidden md:block" />
            <div className="flex flex-col gap-0">
              {(t.raw('escrow.steps') as Array<{num:string;title:string;desc:string}>).map((step, i) => (
                <div key={step.num} className="flex gap-8 items-start py-6 border-b border-ag-border last:border-b-0">
                  <div className="w-10 h-10 rounded-full border border-ag-border bg-ag-white flex items-center justify-center shrink-0 relative z-10">
                    <span className="font-mono text-[10px] font-bold tracking-[0.08em] text-ag-apex">{step.num}</span>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-ag-black text-[14px] mb-1">{step.title}</p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bilateral protection */}
          <div className="mt-12 border border-ag-border p-8">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={18} className="text-ag-apex" />
              <p className="font-sans font-bold text-ag-black text-[14px] tracking-[-0.01em]">
                {t('escrow.penaltiesTitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(['penaltyBuyer', 'penaltySeller', 'penaltyCs'] as const).map(k => (
                <p key={k} className="font-sans text-[12px] text-ag-gray border-l-2 border-ag-apex/30 pl-4 leading-relaxed">
                  {t(`escrow.${k}`)}
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 border-t border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2
              className="font-sans font-bold text-white leading-[1.1] tracking-[-0.025em] mb-4"
              style={{ fontSize: 'clamp(22px,2.5vw,38px)' }}
            >
              {t('cta.title')}
            </h2>
            <p className="font-sans text-[14px] text-white/60 max-w-lg">{t('cta.desc')}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/auction/how-to-buy"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-bold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-white transition-colors"
            >
              {t('cta.btn')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/auction/catalog"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:border-white/60 transition-colors"
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
