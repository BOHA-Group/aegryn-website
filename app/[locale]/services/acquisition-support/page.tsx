import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Check, Shield, Info } from 'lucide-react'
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/jsonld'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'acquisition.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/services/acquisition-support', locale })
}

export default async function AcquisitionSupportPage({ params }: Props) {
  const { locale } = await params
  const t        = await getTranslations({ locale, namespace: 'acquisition' })
  const forWhom  = t.raw('forWhom.items')  as { title: string; desc: string }[]
  const steps    = t.raw('offer.steps')    as { num: string; title: string; desc: string }[]
  const diffItems = t.raw('diff.items')    as { title: string; desc: string }[]

  const serviceLd = serviceJsonLd({
    name:        'AEGRYN Advisory — Acquisition Support',
    description: 'Dedicated acquisition service for investors and funds seeking certified tech assets in Europe. Off-market pipeline, performance-based fees.',
    url:         'https://aegryn.com/services/acquisition-support',
    serviceType: 'Investment Advisory',
  })
  const breadcrumbLd = breadcrumbJsonLd([
    { name: 'AEGRYN',               url: 'https://aegryn.com' },
    { name: 'Services',             url: 'https://aegryn.com/services' },
    { name: 'Acquisition Support',  url: 'https://aegryn.com/services/acquisition-support' },
  ])

  return (
    <main id="main" className="bg-ag-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,76px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-10 leading-relaxed">
            {t('desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaPrimary')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border border-white/25 text-white/70 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              {t('ctaDiscover')}
            </Link>
          </div>
          <p className="font-sans text-[13px] text-ag-apex/70 mt-10 max-w-xl leading-relaxed border-t border-white/10 pt-8">
            {t('advisorNote')}
          </p>
        </div>
      </section>

      {/* ── For whom ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('forWhom.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-14"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('forWhom.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {forWhom.map(({ title, desc }) => (
              <div key={title} className="bg-ag-white p-10 flex flex-col gap-4">
                <div className="w-8 h-8 border border-ag-apex/30 flex items-center justify-center">
                  <Check size={14} className="text-ag-apex" />
                </div>
                <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.02em]">{title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-14">
            {t('offer.label')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border border border-ag-border">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="bg-ag-white p-8 flex flex-col gap-4">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
                <h3 className="font-sans font-semibold text-ag-black text-[16px] leading-snug">{title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Differentiators ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-14">
            {t('diff.label')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
            {diffItems.map(({ title, desc }) => (
              <div key={title} className="bg-ag-white p-10 flex gap-6">
                <Shield size={16} className="text-ag-apex shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-sans font-semibold text-ag-black text-[16px] mb-2">{title}</h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fees ── */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('fees.label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4"
              style={{ fontSize: 'clamp(24px,2.5vw,38px)' }}
            >
              {t('fees.title')}
            </h2>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-6">{t('fees.desc')}</p>
          </div>
          <div className="border border-ag-border bg-ag-white p-8 flex gap-4">
            <Info size={14} className="text-ag-gray-light shrink-0 mt-1" />
            <div>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">Important notice</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                {t('fees.note')}{' '}
                <Link href="/terms/cgv" className="underline underline-offset-2 hover:text-ag-black transition-colors">
                  Terms of Service
                </Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] max-w-lg mb-3"
              style={{ fontSize: 'clamp(22px,2.5vw,36px)' }}
            >
              {t('cta.title')}
            </h2>
            <p className="font-sans text-[14px] text-white/50 max-w-md">{t('cta.desc')}</p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('cta.btn')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

    </main>
  )
}
