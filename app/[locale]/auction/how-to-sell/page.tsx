import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.sell' })
  return { title: t('title'), description: t('desc') }
}

export default function HowToSellPage() {
  const t = useTranslations('auction.sell')

  const steps = [
    { title: t('step1Title'), desc: t('step1Desc') },
    { title: t('step2Title'), desc: t('step2Desc') },
    { title: t('step3Title'), desc: t('step3Desc') },
    { title: t('step4Title'), desc: t('step4Desc') },
  ]

  return (
    <main id="main" className="bg-ag-white">
      {/* Hero */}
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
            href="/auction/submit"
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border border-ag-border divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {steps.map(({ title, desc }, i) => (
              <div key={i} className="p-10 flex flex-col gap-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">
                  0{i + 1}
                </span>
                <h2 className="font-sans font-semibold text-ag-black text-[20px] leading-snug tracking-[-0.02em]">
                  {title}
                </h2>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
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
    </main>
  )
}
