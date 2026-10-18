/**
 * Mise en œuvre de la page Technologie et Souveraineté : reprend, hors hero, l'ancienne page
 * « Solutions sur mesure » (/services/build), désormais fusionnée ici (contenu, animations, images).
 */
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Check, X } from 'lucide-react'
import { VisionTypewriter } from '@/components/sections/VisionTypewriter'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { IMPLEMENT_UI, type Lang } from '@/content/advisory/implement'


export async function BuildImplementation({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'build_service' })
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as Lang

  const marketComparisonAgency  = t.raw('marketComparison.agencyItems') as string[]
  const marketComparisonAegryn  = t.raw('marketComparison.aegrynItems') as string[]
  const marketComparisonProcess = t.raw('marketComparison.processItems') as string[]
  const processSteps            = t.raw('process.steps')                as { num: string; title: string; desc: string }[]

  const domainItems             = t.raw('domainsSection.domains')       as { num: string; badge: string; title: string; desc: string }[]
  const sovereigntyPillars      = t.raw('sovereigntySection.pillars')   as { key: string; title: string; desc: string }[]
  const formatCards             = t.raw('formatsSection.cards')         as { key: string; badge: string; subtitle: string; title: string; desc: string }[]

  return (
    <div id="mettre-en-oeuvre" className="scroll-mt-32">
      <section className="bg-ag-white pb-4 pt-24">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{IMPLEMENT_UI.label[lang]}</p>
          <h2 className="max-w-3xl font-sans font-bold leading-[1.15] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{IMPLEMENT_UI.lead[lang]}</h2>
        </div>
      </section>

      {/* ── Section 1b : Conviction, format « Notre vision » ───────────── */}
      <section className="border-b border-ag-border bg-ag-off-white/80">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid md:grid-cols-[280px_1fr]">
            <div className="py-16 md:pr-16 flex items-start">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('builtToLast.label')}</p>
            </div>
            <div className="py-16 md:px-16">
              <VisionTypewriter
                segments={t.raw('builtToLast.segments') as { t: string; bold?: boolean }[]}
                endVhFraction={0.9}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1c : 3 formats de mission ──────────────────────────── */}
      <section id="formats-mission" className="scroll-mt-32 border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('formatsSection.label')}</p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('formatsSection.title')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl mb-14">
            {t('formatsSection.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {formatCards.map((card, _i) => (
              <div key={card.key} className={`rounded-2xl p-8 flex flex-col gap-4 ${
                card.key === 'btl' ? 'bg-ag-navy' : 'bg-ag-white border border-ag-border'
              }`}>
                <div className="flex items-center gap-3">
                  <span className={`font-mono text-[10px] tracking-[0.24em] uppercase font-bold px-2 py-0.5 border ${
                    card.key === 'btl'
                      ? 'border-ag-apex/40 bg-ag-apex/10 text-ag-apex-ink'
                      : 'border-ag-border bg-ag-off-white text-ag-gray'
                  }`}>
                    {card.badge}
                  </span>
                </div>
                <p className={`font-mono text-[10px] tracking-[0.14em] uppercase ${
                  card.key === 'btl' ? 'text-white/70' : 'text-ag-gray-light'
                }`}>
                  {card.subtitle}
                </p>
                <h3 className={`font-sans font-bold text-[16px] leading-snug ${
                  card.key === 'btl' ? 'text-white' : 'text-ag-black'
                }`}>
                  {card.title}
                </h3>
                <p className={`font-sans text-[15px] leading-relaxed flex-1 ${
                  card.key === 'btl' ? 'text-white/70' : 'text-ag-gray'
                }`}>
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section : Domaines logiciels ───────────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('domainsSection.label')}</p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('domainsSection.title')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-14">
            {t('domainsSection.desc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {domainItems.map((item) => (
              <div key={item.num} className="rounded-2xl bg-ag-white border border-ag-border p-8 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] tracking-[0.22em] text-ag-apex-ink">{item.num}</span>
                  <span className="rounded-lg inline-flex font-mono text-[10px] tracking-[0.18em] uppercase px-2 py-0.5 border border-ag-navy/20 bg-ag-navy/5 text-ag-navy">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-ag-black text-[16px] leading-snug">{item.title}</h3>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed flex-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 1d : Sovereignty by Architecture ──────────────────── */}
      <section id="souverainete" className="scroll-mt-32 border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('sovereigntySection.label')}</p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-4"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('sovereigntySection.title')}
          </h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-4">
            {t('sovereigntySection.desc')}
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ag-gray-light mb-14">
            <a href={t('sovereigntySection.sourceUrl')} target="_blank" rel="noopener noreferrer" className="hover:text-ag-apex-ink transition-colors">
              {t('sovereigntySection.source')} ↗
            </a>
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {sovereigntyPillars.map((pillar) => (
              <div key={pillar.key} className="rounded-2xl bg-ag-white border border-ag-border p-8 flex flex-col gap-3">
                <h3 className="font-sans font-bold text-ag-black text-[15px] leading-snug">{pillar.title}</h3>
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed flex-1">{pillar.desc}</p>
              </div>
            ))}
          </div>
          <p className="font-sans text-[15px] text-ag-gray-light leading-relaxed border-l-2 border-ag-apex pl-4 max-w-2xl">
            {t('sovereigntySection.stackLine')}
          </p>
        </ScrollReveal>
      </section>

      {/* ── Section 3 : Comparaison marché ───────────────────────────── */}
      <section className="border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('marketComparison.label')}</p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-14 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('marketComparison.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Carte agences — fond blanc */}
            <div className="rounded-2xl bg-ag-white border border-ag-border p-8 md:p-10 flex flex-col gap-6">
              <h3
                className="font-sans font-bold text-ag-black tracking-[-0.025em] leading-[1.08]"
                style={{ fontSize: 'clamp(22px,2.4vw,34px)' }}
              >
                {t('marketComparison.agencyCol')}
              </h3>
              <ul className="flex flex-col gap-5">
                {marketComparisonAgency.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 font-sans text-[15px] text-ag-gray leading-relaxed">
                    <X size={14} className="mt-1 shrink-0 text-ag-gray-light" strokeWidth={2} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            {/* Carte Aegryn — fond navy */}
            <div className="rounded-2xl bg-ag-navy p-8 md:p-10 flex flex-col gap-6">
              <h3
                className="font-sans font-bold text-white tracking-[-0.025em] leading-[1.08]"
                style={{ fontSize: 'clamp(22px,2.4vw,34px)' }}
              >
                {t('marketComparison.aegrynCol')}
              </h3>
              <ul className="flex flex-col gap-5">
                {marketComparisonAegryn.map((item, i) => (
                  <li key={i} className="flex flex-col gap-1">
                    <p className="font-sans text-[15px] text-white leading-relaxed flex items-start gap-3">
                      <Check size={14} className="mt-1 shrink-0 text-ag-apex" strokeWidth={2.5} />
                      {item}
                    </p>
                    <p className="font-mono text-[11px] tracking-[0.08em] text-white/70 pl-[26px]">
                      {marketComparisonProcess[i]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 6 : Process ──────────────────────────────────────── */}
      <section id="methode-projet" className="scroll-mt-32 border-b border-ag-border">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-4"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('process.label')}</p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-12 whitespace-pre-line"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('process.title')}
          </h2>

          {/* 5 cards en ligne — scroll horizontal sur mobile */}
          <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
            <div className="flex gap-0 min-w-[1100px] xl:min-w-0">
              {processSteps.map((step, i) => (
                <div key={step.num} className="flex items-stretch flex-1">
                  {/* Card */}
                  <div className="flex-1 flex flex-col gap-3 rounded-2xl border border-ag-border bg-ag-white p-5 hover:bg-ag-off-white transition-colors">
                    {/* Numéro */}
                    <span className="font-mono text-[10px] tracking-[0.28em] text-ag-apex-ink">
                      {step.num}
                    </span>
                    {/* Titre */}
                    <h3 className="font-sans font-bold text-ag-black text-[13px] leading-snug">
                      {step.title}
                    </h3>
                    {/* Description */}
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed flex-1">
                      {step.desc}
                    </p>
                  </div>
                  {/* Connecteur → entre les étapes (sauf la dernière) */}
                  {i < processSteps.length - 1 && (
                    <div className="flex items-center justify-center w-6 shrink-0">
                      <svg width="16" height="10" viewBox="0 0 16 10" fill="none" className="text-ag-border">
                        <path d="M0 5H13M10 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── Section 9 : CTA final ────────────────────────────────────── */}
      <section className="bg-ag-navy">
        <ScrollReveal className="max-w-7xl mx-auto px-6 md:px-12 py-24 md:py-32 text-center flex flex-col items-center gap-8">
          <h2
            className="font-sans font-bold text-white tracking-[-0.02em] leading-tight"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('cta.title')}
          </h2>
          <p className="font-sans text-[15px] text-white/70 leading-relaxed max-w-xl">
            {t('cta.desc')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-2">
            <Link
              href="/contact"
              className="rounded-lg font-mono text-[11px] tracking-[0.18em] uppercase bg-ag-apex text-ag-navy font-semibold px-8 py-3.5 hover:bg-ag-apex/90 transition-colors"
            >
              {t('cta.primary')} →
            </Link>
            <Link
              href="/assets"
              className="rounded-lg font-mono text-[11px] tracking-[0.18em] uppercase border border-white/30 text-white px-8 py-3.5 hover:border-white hover:bg-white/5 transition-colors"
            >
              {t('cta.secondary')}
            </Link>
          </div>
        </ScrollReveal>
      </section>

    </div>
  )
}
