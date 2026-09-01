import { getTranslations } from 'next-intl/server'
import Link                from 'next/link'
import { ArrowUpRight }    from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata }   from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Careers | Advisory & Digital Ecosystem Experts | Aegryn',
    description: 'Join Aegryn, a Swiss Tech Asset Builder seeking senior advisory talents in Data, AI and Cybersecurity to structure durable digital ecosystems.',
    path: '/career',
    locale,
  })
}

const CRAFTS = ['advisory', 'tech', 'build', 'intelligence'] as const
const VALUES = ['precision', 'durability', 'sovereignty', 'trust'] as const

export default async function CareerPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'career' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.18] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* About Aegryn */}
      <section className="border-b border-ag-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
                {t('about.label')}
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1]"
                style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
              >
                {t('about.title')}
              </h2>
            </div>
            <div>
              <p className="text-[15px] text-ag-gray leading-relaxed">
                {t('about.desc')}
              </p>
              <p className="mt-6 font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-apex">
                {t('about.tagline')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our crafts */}
      <section className="border-b border-ag-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-4">
            {t('crafts.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-16"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('crafts.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-0 border-t border-ag-border">
            {CRAFTS.map((key) => (
              <div key={key} className="border-b sm:border-b-0 sm:border-r last:border-r-0 border-ag-border py-10 px-8 first:pl-0 last:pr-0">
                <div className="w-8 h-px bg-ag-apex mb-6" />
                <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                  {t(`crafts.items.${key}.title`)}
                </h3>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {t(`crafts.items.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-ag-border py-24 bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-4">
            {t('values.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-16"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('values.title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-px bg-ag-border">
            {VALUES.map((key) => (
              <div key={key} className="bg-ag-off-white p-10">
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[0.04em] uppercase mb-3">
                  {t(`values.items.${key}.title`)}
                </h3>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {t(`values.items.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No open positions — spontaneous application */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              {t('openings.label')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(22px,2.5vw,38px)' }}
            >
              {t('openings.title')}
            </h2>
            <p className="mt-4 text-[14px] text-white/60 leading-relaxed max-w-lg">
              {t('openings.desc')}
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('openings.cta')}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
