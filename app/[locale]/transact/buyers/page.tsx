import type { Metadata }      from 'next'
import { getTranslations }    from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link }               from '@/i18n/navigation'
import { ArrowUpRight, Lock, ShieldCheck, Users, Eye } from 'lucide-react'
import BuyerForm              from './BuyerForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transactBuyers.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/buyers',
    locale,
    keywords: [
      'acquérir organisation Europe', 'acquisition PME confidentielle', 'acquisition entreprise',
      'deal flow confidentiel', 'acheteur qualifié M&A', 'acquisition Suisse',
      'reprise organisation', 'investisseur institutionnel',
    ],
  })
}

const STEP_NUMS    = ['01', '02', '03', '04']
const COMMIT_ICONS = [
  <Lock         key="1" size={16} className="text-ag-apex shrink-0 mt-0.5" />,
  <ShieldCheck  key="2" size={16} className="text-ag-apex shrink-0 mt-0.5" />,
  <Users        key="3" size={16} className="text-ag-apex shrink-0 mt-0.5" />,
  <Eye          key="4" size={16} className="text-ag-apex shrink-0 mt-0.5" />,
]

type Step       = { title: string; desc: string }
type Commitment = { title: string; desc: string }

export default async function TransactBuyersPage({ params }: Props) {
  const { locale }   = await params
  const t            = await getTranslations({ locale, namespace: 'transactBuyers' })
  const steps        = t.raw('accessSteps') as Step[]
  const commitments  = t.raw('commitments') as Commitment[]

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
          <a
            href="#form"
            className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-apex/90 transition-colors"
          >
            {t('heroCta')} <ArrowUpRight size={13} />
          </a>
        </div>
      </section>

      {/* ── Process d'accès ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('processLabel')}
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-16 max-w-lg">
            {t('processTitle')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border border-ag-border divide-y sm:divide-y-0 sm:divide-x divide-ag-border mb-20">
            {steps.map(({ title, desc }, i) => (
              <div key={STEP_NUMS[i]} className="p-8 flex flex-col gap-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{STEP_NUMS[i]}</span>
                <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-snug tracking-[-0.01em]">{title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          {/* ── Engagements ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
            {commitments.map(({ title, desc }, i) => (
              <div key={title} className="border border-ag-border bg-ag-off-white p-7 flex gap-4">
                {COMMIT_ICONS[i]}
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[14px] mb-1">{title}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Formulaire ── */}
          <div id="form" className="max-w-2xl scroll-mt-24">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
              {t('formLabel')}
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-8">
              {t('formTitle')}
            </h2>
            <BuyerForm />
          </div>
        </div>
      </section>

      {/* ── CTA secondaire ── */}
      <section className="rounded-lg py-16 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-sans text-[14px] text-ag-gray max-w-md leading-relaxed">
            {t('sellerNote')}
          </p>
          <Link
            href="/transact/sell"
            className="rounded-lg inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:border-ag-black transition-colors shrink-0"
          >
            {t('sellerCta')} <ArrowUpRight size={11} />
          </Link>
        </div>
      </section>

    </main>
  )
}
