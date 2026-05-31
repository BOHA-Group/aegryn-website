import { getTranslations } from 'next-intl/server'
import Link                from 'next/link'
import { ArrowUpRight }    from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import CareerPositions     from '@/components/career/CareerPositions'
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

export const POSITIONS = [
  { title: 'Senior Advisor – Business Strategy',                         domainKey: 'strategy',     type: 'Advisory' },
  { title: 'Senior Advisor – Backend & Application Security',            domainKey: 'cyber',        type: 'Advisory' },
  { title: 'Senior Advisor – M&A, Fundraising & Capital Strategy',       domainKey: 'finance',      type: 'Advisory — Exception Track' },
  { title: 'Senior Advisor – Growth, Brand & Go-To-Market',              domainKey: 'growth',       type: 'Advisory' },
  { title: 'Senior Advisor – AI, Automation & Data Strategy',            domainKey: 'ai',           type: 'Advisory' },
  { title: 'Senior Advisor – Architecture & Digital Platforms',          domainKey: 'architecture', type: 'Advisory' },
  { title: 'Senior Advisor – UX, Design & User Experience',              domainKey: 'ux',           type: 'Advisory' },
  { title: 'Senior Advisor – Product, Platform & Innovation',            domainKey: 'product',      type: 'Advisory' },
] as const

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
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Positions with filter */}
      <CareerPositions
        positions={POSITIONS}
        positionsLabel={t('positions.label')}
        domainLabel={t('positions.domain')}
        typeLabel={t('positions.type')}
        applyLabel={t('apply')}
        spontaneousLabel={t('spontaneous')}
        allDomainsLabel={t('domains.all')}
        domainLabels={{
          strategy:     t('domains.strategy'),
          cyber:        t('domains.cyber'),
          finance:      t('domains.finance'),
          growth:       t('domains.growth'),
          ai:           t('domains.ai'),
          architecture: t('domains.architecture'),
          ux:           t('domains.ux'),
          product:      t('domains.product'),
        }}
      />

      {/* Statement */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              {t('statement.label')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,46px)' }}
            >
              {t('statement.title')}
            </h2>
          </div>
          <Link
            href="/advisory"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('statement.cta')}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
