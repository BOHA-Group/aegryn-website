import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

type Stat = { value: string; label: string; source: string }
type NumberedItem = { value: string; label: string }
type RoleItem = { title: string; desc: string; source: string }
type ClusterItem = { cluster: string; desc: string }
type ReaderItem = { title: string; desc: string }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'workforce' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/workforce',
    locale,
    keywords: [
      'emploi IA',
      'compétences IA',
      'World Economic Forum Future of Jobs',
      'PwC Global AI Jobs Barometer',
      'écart de compétences',
      'salaires IA',
      'marché du travail 2026',
      'CIFSO 5000 Organisation Talent',
    ],
  })
}

export default async function WorkforcePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'workforce' })

  const stats       = t.raw('marketData.stats')          as Stat[]
  const hwItems      = t.raw('hundredWorkers.items')      as NumberedItem[]
  const rising       = t.raw('skillsRanking.rising.items')     as string[]
  const declining    = t.raw('skillsRanking.declining.items')  as string[]
  const roleItems    = t.raw('byRole.items')              as RoleItem[]
  const clusterItems = t.raw('industries.items')          as ClusterItem[]
  const forWhoItems  = t.raw('forWho.items')              as ReaderItem[]

  return (
    <main className="bg-ag-white">
      {/* Hero — même format que le hero article de blog */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-4">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.18] tracking-[-0.03em] mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(40px,5.5vw,72px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[15px] text-white/55 leading-relaxed mb-8 max-w-2xl">
            {t('hero.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={t('hero.cta1Href')}
              className="rounded-lg inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('hero.cta1')} <ArrowUpRight size={12} />
            </Link>
            <Link
              href={t('hero.cta2Href')}
              className="rounded-lg inline-flex items-center justify-center gap-2 border border-white/25 text-white font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 hover:border-ag-apex hover:text-ag-apex transition-colors"
            >
              {t('hero.cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* Corps — mêmes blocs que la page article (h2 border-t, p, stats grid, list, quote) */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Market data */}
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex">
            {t('marketData.label')}
          </p>
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug">
            {t('marketData.title')}
          </h2>
          <p className="font-sans text-[16px] text-ag-gray leading-[1.85]">
            {t('marketData.desc')}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {stats.map((stat, i) => (
              <div key={i} className="bg-ag-off-white p-6 flex flex-col gap-2">
                <p
                  className="font-sans font-bold text-ag-apex tracking-[-0.03em] leading-none"
                  style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}
                >
                  {stat.value}
                </p>
                <p className="font-sans text-[11px] text-ag-gray leading-snug flex-1">
                  {stat.label}
                </p>
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-ag-gray-light">
                  {stat.source}
                </p>
              </div>
            ))}
          </div>

          {/* 100 collaborateurs */}
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
            {t('hundredWorkers.title')}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
            {t('hundredWorkers.label')}
          </p>
          <p className="font-sans text-[16px] text-ag-gray leading-[1.85]">
            {t('hundredWorkers.desc')}
          </p>
          <div className="grid grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {hwItems.map((item, i) => (
              <div key={i} className="bg-ag-off-white p-6">
                <p
                  className="font-sans font-bold text-ag-apex tracking-[-0.03em] leading-none mb-2"
                  style={{ fontSize: 'clamp(22px,2.5vw,34px)' }}
                >
                  {item.value}
                </p>
                <p className="font-sans text-[11px] text-ag-gray leading-snug">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-ag-gray-light">
            {t('hundredWorkers.source')}
          </p>

          {/* Compétences en hausse / en recul */}
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
            {t('skillsRanking.title')}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
            {t('skillsRanking.label')}
          </p>
          <p className="font-sans text-[16px] text-ag-gray leading-[1.85]">
            {t('skillsRanking.desc')}
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex mb-4">
                {t('skillsRanking.rising.title')}
              </p>
              <ul className="space-y-3">
                {rising.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 font-sans text-[15px] text-ag-gray leading-relaxed">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ag-apex rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
                {t('skillsRanking.declining.title')}
              </p>
              <ul className="space-y-3">
                {declining.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 font-sans text-[15px] text-ag-gray leading-relaxed">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ag-gray-light rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-ag-gray-light">
            {t('skillsRanking.source')}
          </p>

          {/* Par nature de poste */}
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
            {t('byRole.title')}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
            {t('byRole.label')}
          </p>
          <p className="font-sans text-[16px] text-ag-gray leading-[1.85]">
            {t('byRole.desc')}
          </p>
          <div className="space-y-6">
            {roleItems.map((item, i) => (
              <div key={i} className="border-l-2 border-ag-apex/20 pl-6">
                <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.01em] leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-2">
                  {item.desc}
                </p>
                <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-ag-gray-light">
                  {item.source}
                </p>
              </div>
            ))}
          </div>

          {/* Par secteur */}
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
            {t('industries.title')}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
            {t('industries.label')}
          </p>
          <p className="font-sans text-[16px] text-ag-gray leading-[1.85]">
            {t('industries.desc')}
          </p>
          <div className="space-y-6">
            {clusterItems.map((item, i) => (
              <div key={i} className="border-l-2 border-ag-apex/20 pl-6">
                <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.01em] leading-snug mb-2">
                  {item.cluster}
                </h3>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-ag-gray-light">
            {t('industries.sourceLine')}
          </p>

          {/* CIFSO */}
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
            {t('cifso.title')}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
            {t('cifso.label')}
          </p>
          <blockquote className="border-l-2 border-ag-apex pl-6">
            {t('cifso.body').split('\n\n').map((paragraph, i) => (
              <p key={i} className="font-sans text-[16px] text-ag-gray leading-[1.85] mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </blockquote>
          <Link
            href={t('cifso.ctaHref')}
            className="inline-flex items-center gap-2 font-mono font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-navy hover:text-ag-black transition-colors"
          >
            {t('cifso.cta')} <ArrowUpRight size={12} />
          </Link>

          {/* Pour qui */}
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
            {t('forWho.title')}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
            {t('forWho.label')}
          </p>
          <div className="space-y-6">
            {forWhoItems.map((item, i) => (
              <div key={i} className="border-l-2 border-ag-apex/20 pl-6">
                <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.01em] leading-snug mb-2">
                  {item.title}
                </h3>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Sources */}
          <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] leading-snug pt-6 border-t border-ag-border">
            {t('sources.title')}
          </h2>
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
            {t('sources.label')}
          </p>
          <p className="font-sans text-[16px] text-ag-gray leading-[1.85]">
            {t('sources.desc')}
          </p>

        </div>
      </section>

      {/* CTA final — deux cartes, même format que le CTA newsletter/related de blog */}
      <section className="py-16 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
          <div className="bg-ag-white p-8 flex flex-col gap-4">
            <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug">
              {t('cta.employer.title')}
            </p>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
              {t('cta.employer.desc')}
            </p>
            <Link
              href={t('cta.employer.href')}
              className="rounded-lg inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-5 py-3 hover:bg-ag-navy-mid transition-colors self-start"
            >
              {t('cta.employer.cta')} <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="bg-ag-white p-8 flex flex-col gap-4">
            <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug">
              {t('cta.talent.title')}
            </p>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
              {t('cta.talent.desc')}
            </p>
            <Link
              href={t('cta.talent.href')}
              className="rounded-lg inline-flex items-center justify-center gap-2 border border-ag-border text-ag-gray font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-5 py-3 hover:border-ag-black hover:text-ag-black transition-all self-start"
            >
              {t('cta.talent.cta')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
