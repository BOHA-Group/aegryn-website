import { Link } from '@/i18n/navigation'
import { ArrowUpRight }          from 'lucide-react'
import { getTranslations }       from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import IndustriesSection         from '@/components/sections/IndustriesSection'
import type { Metadata }         from 'next'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { WaveReveal }   from '@/components/animations/WaveReveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'advisoryPage' })
  return generateAegrynMetadata({
    title: t('hero.metaTitle'),
    description: t('hero.metaDesc'),
    path: '/advisory',
    locale,
    keywords: [
      'cabinet de conseil tech Suisse',
      'advisory M&A Europe',
      'conseil stratégie technologie',
      'recrutement CTO Suisse',
      'headhunting tech Europe',
      'built to last entreprise',
      'tech advisory',
      'AI advisory',
      'cybersecurity consulting',
      'M&A advisory',
      'strategic consulting',
      'digital transformation',
      'European tech advisory',
      'Switzerland advisory',
    ],
  })
}

export default async function AdvisoryPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'advisoryPage' })

  const whoFor      = t.raw('whoFor.items')             as { title: string; desc: string }[]
  const experts     = t.raw('experts.items')            as { title: string; desc: string }[]
  const useCases    = t.raw('experts.useCases.items')   as { profile: string; desc: string }[]
  const stratItems  = t.raw('strategy.items')           as { num: string; title: string; desc: string }[]
  const riskItems   = t.raw('riskCompliance.items')     as { num: string; title: string; desc: string }[]
  const maPhases    = t.raw('ma.phases')                as { num: string; title: string; desc: string }[]

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex mb-8"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('hero.label')}</p>
          <WaveReveal delay={0.1}><h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('hero.title').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
          </h1></WaveReveal>
<ScrollReveal delay={0.25}>          <div className="max-w-xl mb-10 space-y-4">
            <p className="text-[16px] text-white/70 leading-relaxed">{t('hero.desc1')}</p>
            <p className="text-[15px] text-white/70 leading-relaxed">{t('hero.desc2')}</p>
          </div>
          <p className="font-sans font-normal italic text-[15px] text-white/70 leading-relaxed max-w-xl mb-10 border-l-2 border-ag-apex/30 pl-5">
            {t('hero.quote').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={t('hero.ctaHref') as never}
              className="rounded-lg inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex transition-colors"
            >
              {t('hero.cta')} <ArrowUpRight size={14} />
            </Link>
            <Link
              href={t('hero.cta2Href') as never}
              className="rounded-lg inline-flex items-center gap-3 border border-white/30 text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:border-ag-apex hover:text-ag-apex transition-colors"
            >
              {t('hero.cta2')} <ArrowUpRight size={14} />
            </Link>
            <Link
              href={t('hero.cta3Href') as never}
              className="rounded-lg inline-flex items-center gap-3 border border-white/10 text-white/70 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:border-white/30 hover:text-white transition-colors"
            >
              {t('hero.cta3')} <ArrowUpRight size={14} />
            </Link>
          </div></ScrollReveal>
        </div>
      </section>

      {/* ── Who is it for (5 profiles) ── */}
      <section className="bg-ag-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center py-4">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('whoFor.label')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
            {whoFor.map((item, i) => (
              <div key={i} className="py-12 px-6 first:pl-0 last:pr-0">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light mb-5">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-3"
                  style={{ fontSize: 'clamp(26px,3vw,44px)' }}
                >
                  {item.title}
                </h2>
                <p className="text-[15px] text-ag-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── BLOC A — Stratégie d'entreprise & Board Advisory ── */}
      <section className="bg-ag-off-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center pb-4 mb-14">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('strategy.label')}</p>
          </div>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-14">
            {t('strategy.intro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px">
            {stratItems.map((item) => (
              <div key={item.num} className="bg-ag-off-white p-8 hover:bg-white transition-colors">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex-ink mb-5">{item.num}</p>
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] leading-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] text-ag-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── BLOC A2 — Risque & Conformité ── */}
      <section className="bg-ag-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center pb-4 mb-14">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('riskCompliance.label')}</p>
          </div>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-14">
            {t('riskCompliance.intro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
            {riskItems.map((item) => (
              <div key={item.num} className="bg-ag-white p-8 hover:bg-ag-off-white transition-colors">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex-ink mb-5">{item.num}</p>
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] leading-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-[15px] text-ag-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── BLOC B — Advisory Tech ── */}
      <section className="bg-ag-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center pb-4 mb-12">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('experts.label')}</p>
          </div>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-12">
            {t('experts.intro')}
          </p>
          <div className="border border-ag-border">
            {Array.from({ length: Math.ceil(experts.length / 2) }, (_, row) => (
              <div key={row} className="grid grid-cols-1 md:grid-cols-2">
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
        </ScrollReveal>
      </section>

      {/* ── Use Cases accordéon ── */}
      <section className="bg-ag-off-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-14">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-8"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('experts.useCases.label')}</p>
          <div className="border-t">
            {useCases.map((uc, i) => (
              <details key={i} className="group">
                <summary className="flex items-center justify-between py-5 cursor-pointer list-none">
                  <span className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] group-open:text-ag-navy transition-colors">
                    {uc.profile}
                  </span>
                  <span className="font-sans text-[18px] text-ag-gray-light group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="pb-6 text-[15px] text-ag-gray leading-relaxed max-w-2xl">
                  {uc.desc}
                </p>
              </details>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Mid CTA ── */}
      <section className="bg-ag-navy/5">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="font-sans font-bold text-ag-navy text-[18px] tracking-[-0.01em]">
            {t('midCta.title')}
          </p>
          <Link
            href={t('midCta.href') as never}
            className="rounded-lg shrink-0 inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex hover:text-ag-navy transition-colors"
          >
            {t('midCta.cta')} <ArrowUpRight size={14} />
          </Link>
        </ScrollReveal>
      </section>

      {/* ── BLOC C — Advisory M&A ── */}
      <section className="bg-ag-off-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center pb-4 mb-14">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('ma.label')}</p>
          </div>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-14">
            {t('ma.intro')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px">
            {maPhases.map((phase) => (
              <div key={phase.num} className="bg-ag-off-white p-8 hover:bg-white transition-colors">
                <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex-ink mb-5">{phase.num}</p>
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] leading-tight mb-3">
                  {phase.title}
                </h3>
                <p className="text-[15px] text-ag-gray leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-[15px] text-ag-gray leading-relaxed max-w-2xl border-l-2 border-ag-apex/30 pl-5">
            {t('ma.fundsNote')}{' '}
            <Link href={t('ma.fundsHref') as never} className="underline underline-offset-2 hover:text-ag-navy transition-colors">
              {t('ma.fundsLink')} ↗
            </Link>
          </p>
        </ScrollReveal>
      </section>

      {/* ── BLOC D — Réseau d'experts ── */}
      <section className="bg-ag-navy">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex mb-6"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('network.label')}</p>
          <h2
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.2] max-w-2xl mb-8"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('network.title')}
          </h2>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-2xl mb-10 whitespace-pre-line">
            {t('network.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={t('network.cta1Href') as never}
              className="rounded-lg inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex transition-colors"
            >
              {t('network.cta1')} <ArrowUpRight size={14} />
            </Link>
            <Link
              href={t('network.cta2Href') as never}
              className="rounded-lg inline-flex items-center gap-3 border border-white/30 text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:border-ag-apex hover:text-ag-apex transition-colors"
            >
              {t('network.cta2')} <ArrowUpRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ── BLOC E — Industries (accordéon) ── */}
      <section className="bg-ag-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <div className="flex items-center pb-4 mb-10">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('industries.label')}</p>
          </div>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-10">
            {t('industries.intro')}
          </p>
          <IndustriesSection />
        </ScrollReveal>
      </section>

      {/* ── Approach CTA ── */}
      <section className="bg-ag-navy border-t border-white/10">
        <ScrollReveal className="mx-auto max-w-7xl px-6 md:px-12 py-20">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex mb-6"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('approach.label')}</p>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
            <div className="max-w-2xl">
              <h2
                className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.2] mb-6"
                style={{ fontSize: 'clamp(26px,3vw,44px)' }}
              >
                {t('approach.title')}
              </h2>
              <p className="text-[15px] text-white/70 leading-relaxed">
                {t('approach.desc')}
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-lg shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase bg-ag-apex text-ag-navy px-6 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('approach.cta')} <ArrowUpRight size={14} />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
