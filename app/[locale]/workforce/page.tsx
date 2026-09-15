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

      {/* ── Hero — même gabarit que la page /blog ─────────────────── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-10">
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

      {/* ── Chiffres 2025-2026 ─────────────────────────────────────── */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
            {t('marketData.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4 max-w-3xl"
            style={{ fontSize: 'clamp(24px,3vw,42px)' }}
          >
            {t('marketData.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('marketData.desc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-8 flex flex-col gap-3">
                <p
                  className="font-sans font-bold text-ag-apex-ink tracking-[-0.03em] leading-none"
                  style={{ fontSize: 'clamp(26px,2.8vw,38px)' }}
                >
                  {stat.value}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                  {stat.label}
                </p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-ag-gray-light">
                  {stat.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sur 100 collaborateurs ─────────────────────────────────── */}
      <section className="bg-ag-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
            {t('hundredWorkers.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4 max-w-3xl"
            style={{ fontSize: 'clamp(24px,3vw,42px)' }}
          >
            {t('hundredWorkers.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('hundredWorkers.desc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-ag-border border border-ag-border mb-4">
            {hwItems.map((item, i) => (
              <div key={i} className="bg-ag-off-white p-8">
                <p
                  className="font-sans font-bold text-ag-apex-ink tracking-[-0.03em] leading-none mb-3"
                  style={{ fontSize: 'clamp(26px,2.8vw,38px)' }}
                >
                  {item.value}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-ag-gray-light">
            {t('hundredWorkers.source')}
          </p>
        </div>
      </section>

      {/* ── Compétences en hausse / en recul ────────────────────────── */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
            {t('skillsRanking.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4 max-w-3xl"
            style={{ fontSize: 'clamp(24px,3vw,42px)' }}
          >
            {t('skillsRanking.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('skillsRanking.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border mb-4">
            <div className="bg-white p-8">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex mb-5">
                {t('skillsRanking.rising.title')}
              </p>
              <ul className="space-y-3">
                {rising.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 font-sans text-[14px] text-ag-gray leading-relaxed">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ag-apex rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-5">
                {t('skillsRanking.declining.title')}
              </p>
              <ul className="space-y-3">
                {declining.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 font-sans text-[14px] text-ag-gray leading-relaxed">
                    <span className="shrink-0 mt-1.5 w-1.5 h-1.5 bg-ag-gray-light rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-ag-gray-light">
            {t('skillsRanking.source')}
          </p>
        </div>
      </section>

      {/* ── Par nature de poste ──────────────────────────────────────── */}
      <section className="bg-ag-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
            {t('byRole.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4 max-w-3xl"
            style={{ fontSize: 'clamp(24px,3vw,42px)' }}
          >
            {t('byRole.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('byRole.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {roleItems.map((item, i) => (
              <div key={i} className="bg-ag-off-white p-8 flex flex-col gap-3">
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] leading-tight">
                  {item.title}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                  {item.desc}
                </p>
                <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-ag-gray-light">
                  {item.source}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Par secteur ──────────────────────────────────────────────── */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
            {t('industries.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4 max-w-3xl"
            style={{ fontSize: 'clamp(24px,3vw,42px)' }}
          >
            {t('industries.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('industries.desc')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border mb-4">
            {clusterItems.map((item, i) => (
              <div key={i} className="bg-white p-8 flex flex-col gap-3">
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] leading-tight">
                  {item.cluster}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <p className="font-mono text-[9px] tracking-[0.12em] uppercase text-ag-gray-light">
            {t('industries.sourceLine')}
          </p>
        </div>
      </section>

      {/* ── CIFSO ────────────────────────────────────────────────────── */}
      <section className="bg-ag-navy border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex/70 mb-4">
            {t('cifso.label')}
          </p>
          <h2
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] mb-8 max-w-2xl"
            style={{ fontSize: 'clamp(24px,3vw,38px)' }}
          >
            {t('cifso.title')}
          </h2>
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div className="space-y-4 border-l-2 border-ag-apex/40 pl-6">
              {t('cifso.body').split('\n\n').map((paragraph, i) => (
                <p key={i} className="font-sans text-[14px] text-white/60 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
            <div>
              <Link
                href={t('cifso.ctaHref')}
                className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 hover:bg-ag-apex/90 transition-colors"
              >
                {t('cifso.cta')} <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pour qui ces données comptent ───────────────────────────── */}
      <section className="bg-ag-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
            {t('forWho.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-12 max-w-3xl"
            style={{ fontSize: 'clamp(24px,3vw,42px)' }}
          >
            {t('forWho.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {forWhoItems.map((item, i) => (
              <div key={i} className="bg-ag-off-white p-8 flex flex-col gap-3">
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] leading-tight">
                  {item.title}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sources ──────────────────────────────────────────────────── */}
      <section className="bg-ag-off-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
            {t('sources.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4 max-w-3xl"
            style={{ fontSize: 'clamp(22px,2.6vw,34px)' }}
          >
            {t('sources.title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl">
            {t('sources.desc')}
          </p>
        </div>
      </section>

      {/* ── CTA final ────────────────────────────────────────────────── */}
      <section className="bg-ag-white border-t border-ag-border py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
          <div className="bg-ag-off-white p-10 flex flex-col gap-4">
            <p className="font-sans font-bold text-ag-black text-[18px] leading-snug">
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
          <div className="bg-ag-off-white p-10 flex flex-col gap-4">
            <p className="font-sans font-bold text-ag-black text-[18px] leading-snug">
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
