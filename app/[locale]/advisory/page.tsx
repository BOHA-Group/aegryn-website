import Link                     from 'next/link'
import { ArrowUpRight }          from 'lucide-react'
import { getTranslations }       from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import IndustriesSection         from '@/components/sections/IndustriesSection'
import type { Metadata }         from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Aegryn Advisory — Tech, AI, Cybersecurity & M&A Advisory | All Industries',
    description: 'Strategic advisory in technology, AI, cybersecurity and M&A. Executive recruitment. Asset engineering. Operating across 23+ industries in Europe. Built by operators.',
    path: '/advisory',
    locale,
    keywords: [
      'tech advisory',
      'AI advisory',
      'cybersecurity consulting',
      'M&A advisory',
      'executive recruitment',
      'tech asset engineering',
      'strategic consulting',
      'digital transformation',
      'fintech advisory',
      'healthtech consulting',
      'proptech advisory',
      'SaaS advisory',
      'European tech advisory',
      'Switzerland advisory',
    ],
  })
}

export default async function AdvisoryPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'advisoryPage' })

  const whoFor  = t.raw('whoFor.items')  as { title: string; desc: string }[]
  const experts = t.raw('experts.items') as { title: string; desc: string }[]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            {t('hero.desc1')}
            <br /><br />
            {t('hero.desc2')}
          </p>
          <p className="font-sans font-semibold text-[13px] text-white/60 leading-relaxed max-w-xl mb-10 border-l-2 border-ag-apex/40 pl-5 whitespace-pre-line">
            {t('hero.quote')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex transition-colors"
          >
            {t('hero.cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Why Advisory */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('why.label')}
            </p>
          </div>
          <div className="grid md:grid-cols-[1fr_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">
            <div className="py-16 md:pr-16">
              <p className="text-[15px] text-ag-gray leading-relaxed mb-6">{t('why.desc1')}</p>
              <p className="text-[15px] text-ag-gray leading-relaxed">{t('why.desc2')}</p>
            </div>
            <div className="py-16 md:pl-16">
              <p
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2]"
                style={{ fontSize: 'clamp(20px,2vw,28px)' }}
              >
                {t('why.tagline')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who is it for */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('whoFor.label')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {whoFor.map((item, i) => (
              <div key={i} className="py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
                  style={{ fontSize: 'clamp(16px,1.4vw,20px)' }}
                >
                  {item.title}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experts */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center border-b border-ag-border py-4 mb-12">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('experts.label')}
            </p>
          </div>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('experts.desc')}
          </p>
          <div className="border border-ag-border divide-y divide-ag-border">
            {Array.from({ length: Math.ceil(experts.length / 2) }, (_, row) => (
              <div key={row} className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ag-border">
                {experts.slice(row * 2, row * 2 + 2).map((item, col) => (
                  <div key={col} className="p-6 hover:bg-ag-off-white transition-colors group">
                    <div className="flex items-start gap-4">
                      <span className="font-sans font-semibold text-[10px] text-ag-gray-light w-5 shrink-0 pt-0.5">
                        {String(row * 2 + col + 1).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.02em] group-hover:text-ag-navy transition-colors mb-1">
                          {item.title}
                        </p>
                        <p className="font-sans font-normal text-[12px] text-ag-gray leading-snug">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Valuation CTA */}
      <section className="border-b border-ag-border bg-ag-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
              / {t('valuationCta.label')}
            </p>
            <p
              className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.2] max-w-xl"
              style={{ fontSize: 'clamp(18px,2vw,28px)' }}
            >
              {t('valuationCta.title')}
            </p>
          </div>
          <Link
            href={t('valuationCta.href')}
            className="shrink-0 inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex hover:text-ag-navy transition-colors"
          >
            {t('valuationCta.cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Industries */}
      <IndustriesSection />

      {/* Approach + CTA */}
      <section className="bg-ag-navy border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="font-sans font-bold text-[28px] text-white leading-tight">
              {t('approach.title')}
            </h2>
            <p className="mt-4 text-[14px] text-white/50 max-w-lg leading-relaxed">
              {t('approach.desc')}
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3.5 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('approach.cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
