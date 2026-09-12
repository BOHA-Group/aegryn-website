import type { Metadata }      from 'next'
import { getTranslations }    from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link }               from '@/i18n/navigation'
import {
  ArrowUpRight, BarChart3, ShieldCheck, FileText,
  Users, Landmark, CheckCircle2,
} from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transactHow.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/how-it-works',
    locale,
    keywords: [
      'processus cession organisation', 'certification CIFSO', 'grade organisation',
      'cession structurée', 'séquestre suisse M&A', 'comment vendre son organisation',
      'how to sell a company Europe', 'M&A process Switzerland',
    ],
  })
}

const STEP_ICONS = [
  <BarChart3    key="1" size={22} className="text-ag-apex" />,
  <FileText     key="2" size={22} className="text-ag-apex" />,
  <ShieldCheck  key="3" size={22} className="text-ag-apex" />,
  <Users        key="4" size={22} className="text-ag-apex" />,
  <FileText     key="5" size={22} className="text-ag-apex" />,
  <Landmark     key="6" size={22} className="text-ag-apex" />,
]
const STEP_SIDES = ['seller', 'seller', 'aegryn', 'aegryn', 'both', 'aegryn'] as const
const STEP_CTAS = ['/valuation', '/transact/submit', '/grade/grading-system', '/transact/buyers', null, null] as const

const SIDE_COLORS: Record<string, string> = {
  seller: 'bg-blue-50 text-blue-700 border-blue-200',
  aegryn: 'bg-ag-apex/10 text-ag-navy border-ag-apex/30',
  both:   'bg-purple-50 text-purple-700 border-purple-200',
}

type Step = { num: string; title: string; desc: string; detail: string; cta: string | null }
type CompareRow = { label: string; aegryn: string; other: string }

export default async function HowItWorksPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transactHow' })
  const steps       = t.raw('steps')       as Step[]
  const compareRows = t.raw('compareRows') as CompareRow[]

  return (
    <main className="bg-ag-white">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('heroLabel')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            {t('heroDesc')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/transact/sell"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-apex/90 transition-colors">
              {t('ctaSeller')} <ArrowUpRight size={13} />
            </Link>
            <Link href="/transact/buyers"
              className="rounded-lg inline-flex items-center gap-2 border border-white/30 text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:border-white/70 transition-colors">
              {t('ctaBuyer')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6 étapes ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('stepsLabel')}
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-16 max-w-lg">
            {t('stepsTitle')}
          </h2>

          <div className="flex flex-col gap-0 border border-ag-border divide-y divide-ag-border">
            {steps.map((step, i) => (
              <div key={step.num} className="grid grid-cols-1 lg:grid-cols-[80px_1fr_280px] gap-0">
                {/* Num */}
                <div className="flex items-start justify-center pt-8 pb-4 lg:py-8 lg:border-r border-ag-border">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{step.num}</span>
                </div>
                {/* Content */}
                <div className="px-6 lg:px-8 py-8 lg:border-r border-ag-border flex flex-col gap-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    {STEP_ICONS[i]}
                    <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.01em]">{step.title}</h3>
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border ${SIDE_COLORS[STEP_SIDES[i]]}`}>
                      {t(`side.${STEP_SIDES[i]}`)}
                    </span>
                  </div>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-xl">{step.desc}</p>
                  <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed">{step.detail}</p>
                  {step.cta && STEP_CTAS[i] && (
                    <Link href={STEP_CTAS[i]!}
                      className="inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] uppercase tracking-[0.14em] text-ag-navy hover:text-ag-apex transition-colors mt-1 self-start">
                      {step.cta} <ArrowUpRight size={11} />
                    </Link>
                  )}
                </div>
                {/* Visual indicator */}
                <div className="hidden lg:flex items-center justify-center py-8 px-6">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="w-12 h-12 border border-ag-apex/30 flex items-center justify-center bg-ag-apex/5">
                      {STEP_ICONS[i]}
                    </div>
                    {step.num !== '06' && (
                      <div className="w-px h-8 bg-ag-border mt-1" />
                    )}
                    {step.num === '06' && (
                      <CheckCircle2 size={16} className="text-ag-apex mt-1" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comparatif Aegryn vs autres ── */}
      <section className="rounded-lg py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('compareLabel')}
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] mb-10">
            {t('compareTitle')}
          </h2>

          <div className="border border-ag-border overflow-x-auto">
            <div className="min-w-[480px]">
              <div className="grid grid-cols-3 bg-ag-navy">
                <div className="px-5 py-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-white/50" />
                <div className="px-5 py-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex border-l border-white/10">Aegryn</div>
                <div className="px-5 py-3 font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-white/50 border-l border-white/10">{t('compareOther')}</div>
              </div>
              {compareRows.map(({ label, aegryn, other }, i) => (
                <div key={label} className={`grid grid-cols-3 border-t border-ag-border ${i % 2 === 0 ? 'bg-ag-white' : 'bg-ag-off-white'}`}>
                  <div className="px-5 py-4 font-sans font-semibold text-[12px] text-ag-black border-r border-ag-border">{label}</div>
                  <div className="px-5 py-4 font-sans text-[12px] text-ag-black border-r border-ag-border flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-ag-apex shrink-0" />
                    {aegryn}
                  </div>
                  <div className="px-5 py-4 font-sans text-[12px] text-ag-gray-light">{other}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA dual ── */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-0 border border-ag-border divide-y sm:divide-y-0 sm:divide-x divide-ag-border">
          <div className="p-10 flex flex-col gap-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">{t('ctaSellerLabel')}</p>
            <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">{t('ctaSellerTitle')}</h3>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('ctaSellerDesc')}</p>
            <Link href="/transact/sell"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors self-start mt-auto">
              {t('ctaSellerBtn')} <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="p-10 flex flex-col gap-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-apex">{t('ctaBuyerLabel')}</p>
            <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">{t('ctaBuyerTitle')}</h3>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('ctaBuyerDesc')}</p>
            <Link href="/transact/buyers"
              className="rounded-lg inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3.5 hover:border-ag-black transition-colors self-start mt-auto">
              {t('ctaBuyerBtn')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
