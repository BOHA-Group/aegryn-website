import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, AlertTriangle, BarChart2, TrendingUp } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import PartnersSection from '@/components/sections/PartnersSection'

type Props = { params: Promise<{ locale: string }> }

const PROBLEM_ICONS = [AlertTriangle, BarChart2, TrendingUp] as const
const ROLE_LETTERS = ['A', 'B', 'C'] as const

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'investisseurs' })
  return generateAegrynMetadata({
    title: t('metaTitle'),
    description: t('metaDesc'),
    path: '/investisseurs',
    locale,
    keywords: [
      'operating partner fonds', 'family office operating partner', 'value creation post-acquisition',
      'screening deal flow technique', 'préparation exit organisation', 'operating partner suisse',
      'fonds investissement PME', 'portfolio company value creation', 'M&A value creation',
    ],
  })
}

export default async function InvestisseursPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'investisseurs' })
  const problems = t.raw('problems.items') as string[]
  const roles    = t.raw('roles.items') as { title: string; desc: string }[]
  const alignment = t.raw('alignment.items') as string[]

  return (
    <main className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex-ink mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('eyebrow')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,64px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-2xl mb-4 leading-relaxed">
            {t('line1')}
          </p>
          <p className="font-sans text-[16px] text-white/55 max-w-2xl mb-12 leading-relaxed">
            {t('line2')}
          </p>
          <Link
            href={{ pathname: '/contact', query: { subject: 'investisseurs' } }}
            className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* Nos partenaires — institutions & financeurs */}
      <PartnersSection
        label={t('partners.label')}
        badge={t('partners.badge')}
        title={t('partners.title')}
        desc={t('partners.desc')}
        note={t('partners.note')}
      />

      {/* Section 1 — Le problème */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">
            {t('problems.label')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {problems.map((text, i) => {
              const Icon = PROBLEM_ICONS[i] ?? AlertTriangle
              return (
                <div key={i} className="bg-ag-white p-10 flex flex-col gap-6">
                  <div className="w-10 h-10 border border-ag-apex/30 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-ag-apex-ink" />
                  </div>
                  <p className="font-sans text-[15px] text-ag-dark leading-relaxed">{text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Section 2 — Nos 3 rôles */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
            {t('roles.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-16 max-w-2xl"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('roles.title')}
          </h2>
          <div className="flex flex-col gap-px bg-ag-border border border-ag-border">
            {roles.map(({ title, desc }, i) => (
              <div key={i} className="bg-ag-white p-10 grid grid-cols-1 lg:grid-cols-[80px_1fr] gap-8 items-start">
                <div className="w-12 h-12 bg-ag-navy flex items-center justify-center shrink-0">
                  <span className="font-sans font-bold text-ag-apex-ink text-[18px]">{ROLE_LETTERS[i]}</span>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-ag-black text-[18px] leading-snug tracking-[-0.02em] mb-3">
                    {title}
                  </h3>
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — Banques & financiers (apporteurs d'affaires) */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5">
              {t('banks.label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05]"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('banks.title')}
            </h2>
          </div>
          <div>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-8">
              {t('banks.desc')}
            </p>
            <Link
              href={'/alliances?type=apporteur#candidature' as never}
              className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-ag-apex hover:text-ag-navy transition-colors"
            >
              {t('banks.cta')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Section 4 — Modèle d'engagement */}
      <section className="py-24 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5">
              {t('alignment.label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-6"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('alignment.title')}
            </h2>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-md">
              {t('alignment.desc')}
            </p>
          </div>
          <div className="bg-ag-navy p-12 flex flex-col gap-6">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex">
              {t('alignment.label')}
            </p>
            {alignment.map((item) => (
              <div key={item} className="flex items-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full bg-ag-apex shrink-0 mt-2" />
                <p className="font-sans text-[14px] text-white/75 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/60 mb-3">
              {t('final.label')}
            </p>
            <p className="font-sans font-bold text-white text-[22px] max-w-md leading-snug">
              {t('final.title')}
            </p>
            <p className="font-sans text-[14px] text-white/55 mt-3 max-w-md leading-relaxed">
              {t('final.desc')}
            </p>
          </div>
          <Link
            href={{ pathname: '/contact', query: { subject: 'investisseurs' } }}
            className="rounded-lg shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('final.cta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

    </main>
  )
}
