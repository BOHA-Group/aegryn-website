import type { Metadata }         from 'next'
import { getTranslations }        from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Link }                   from '@/i18n/navigation'
import { ArrowUpRight, ShieldCheck, BarChart3, FileText, Users, Lock, Landmark } from 'lucide-react'
import ReadinessScore             from './ReadinessScore'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.sell.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/sell',
    locale,
    keywords: [
      'vendre entreprise tech', 'cession SaaS', 'exit startup',
      'mandat cession actif numérique', 'vente confidentielle', 'transaction tech suisse',
      'sell SaaS Europe', 'exit planning', 'M&A tech',
    ],
  })
}

export default async function TransactionSellPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.sell' })
  // locale resolved above for getTranslations

  const STEPS = [
    {
      num:   '01',
      icon:  <BarChart3 size={20} className="text-ag-apex" />,
      title: t('steps.s1.title'),
      desc:  t('steps.s1.desc'),
      cta:   { label: t('steps.s1.cta'), href: '/valuation' },
    },
    {
      num:   '02',
      icon:  <FileText size={20} className="text-ag-apex" />,
      title: t('steps.s2.title'),
      desc:  t('steps.s2.desc'),
      cta:   null,
    },
    {
      num:   '03',
      icon:  <ShieldCheck size={20} className="text-ag-apex" />,
      title: t('steps.s3.title'),
      desc:  t('steps.s3.desc'),
      cta:   { label: t('steps.s3.cta'), href: '/transact/submit' },
    },
  ]

  const GUARANTEES = [
    {
      icon:  <Lock size={16} className="text-ag-apex shrink-0 mt-0.5" />,
      title: t('guarantees.g1.title'),
      desc:  t('guarantees.g1.desc'),
    },
    {
      icon:  <Users size={16} className="text-ag-apex shrink-0 mt-0.5" />,
      title: t('guarantees.g2.title'),
      desc:  t('guarantees.g2.desc'),
    },
    {
      icon:  <Landmark size={16} className="text-ag-apex shrink-0 mt-0.5" />,
      title: t('guarantees.g3.title'),
      desc:  t('guarantees.g3.desc'),
    },
    {
      icon:  <ShieldCheck size={16} className="text-ag-apex shrink-0 mt-0.5" />,
      title: t('guarantees.g4.title'),
      desc:  t('guarantees.g4.desc'),
    },
  ]

  return (
    <main className="bg-ag-white">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl mb-10">
            {t('hero.desc')}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/valuation"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('hero.ctaValuation')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/transact/submit"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:border-white/70 transition-colors"
            >
              {t('hero.ctaMandat')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Parcours 3 étapes ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('steps.label')}
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-16 max-w-lg">
            {t('steps.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-ag-border divide-y md:divide-y-0 md:divide-x divide-ag-border mb-20">
            {STEPS.map(({ num, icon, title, desc, cta }) => (
              <div key={num} className="p-10 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
                  {icon}
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-ag-black text-[18px] leading-snug tracking-[-0.02em] mb-2">
                    {title}
                  </h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
                {cta && (
                  <Link
                    href={cta.href as '/valuation' | '/transact/submit'}
                    className="inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] uppercase tracking-[0.14em] text-ag-navy hover:text-ag-apex transition-colors mt-auto"
                  >
                    {cta.label} <ArrowUpRight size={11} />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* ── Readiness Score ── */}
          <div className="max-w-2xl">
            <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
              {t('steps.step2Label')}
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-8">
              {t('steps.step2Title')}
            </h2>
            <ReadinessScore />
          </div>
        </div>
      </section>

      {/* ── Garanties ── */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-3 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('guarantees.label')}
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] mb-12">
            {t('guarantees.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {GUARANTEES.map(({ icon, title, desc }) => (
              <div key={title} className="border border-ag-border bg-ag-white p-7 flex gap-4">
                {icon}
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[14px] mb-1">{title}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] mb-2">
              {t('cta.title')}
            </h2>
            <p className="font-sans text-[14px] text-ag-gray">
              {t('cta.desc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/transact/submit"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-navy-mid transition-colors"
            >
              {t('cta.ctaMandat')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:border-ag-black transition-colors"
            >
              {t('cta.ctaAdvisor')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
