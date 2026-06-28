import { getTranslations } from 'next-intl/server'
import Link              from 'next/link'
import { ArrowUpRight }  from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'growWithUs' })
  return generateAegrynMetadata({
    title: `${t('hero.title')} | Aegryn`,
    description: t('hero.desc'),
    path: '/grow-with-us',
    locale,
  })
}

export default async function GrowWithUsPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'growWithUs' })
  const tFooter = await getTranslations({ locale, namespace: 'footer' })

  const investorItems = t.raw('investors.items') as { num: string; title: string; desc: string }[]
  const partnerItems  = t.raw('partners.items')  as { title: string; desc: string }[]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-3.5 hover:bg-ag-navy transition-colors"
          >
            {t('hero.cta')}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Investors */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between border-b border-ag-border py-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              {t('investors.label')}
            </p>
            <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.02em]">
              {t('investors.sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-y divide-ag-border">
            {investorItems.map((item) => (
              <div key={item.num} className="py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {item.num}
                </p>
                <h2
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-none mb-4"
                  style={{ fontSize: 'clamp(18px,1.6vw,22px)' }}
                >
                  {item.title}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center justify-between mb-12">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              {t('partners.label')}
            </p>
            <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.02em]">
              {t('partners.sub')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border">
            {partnerItems.map((op) => (
              <div key={op.title} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                <h3
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-3"
                  style={{ fontSize: 'clamp(16px,1.4vw,20px)' }}
                >
                  {op.title}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {op.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              {tFooter('groupLabel')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,46px)' }}
            >
              {t('cta.title')}
            </h2>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('cta.button')}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
