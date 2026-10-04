import Image from 'next/image'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { NewsletterSubscribeForm } from '@/components/newsletter/NewsletterSubscribeForm'
import { AdvisoryDiagnostic } from './AdvisoryDiagnostic'
import { LIFECYCLE_LABELS } from '@/content/advisory'
import type { AdvisoryPageContent } from '@/content/advisory/types'

interface Props {
  content: AdvisoryPageContent
  locale:  string
}

const SECTION  = 'max-w-7xl mx-auto px-6 md:px-12'
const LABEL    = 'font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-apex-ink'
const H2       = 'font-sans font-bold text-ag-navy tracking-[-0.02em] leading-[1.1]'
const BTN_PRI  = 'rounded-lg inline-flex items-center gap-3 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex/90 transition-colors'
const BTN_SEC  = 'rounded-lg inline-flex items-center gap-3 border border-white/30 text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-white/10 transition-colors'

/**
 * Gabarit des pages métiers ACCOMPAGNER, version 2.
 * Ordre : constat sourcé · résultats · situations rattachées aux cycles ·
 * services et cadre nommé · lectures par taille et secteur · scénario et
 * limites de l'IA · auto-diagnostic · perspectives · contact et newsletter.
 */
export function AdvisoryPillarPage({ content: c, locale }: Props) {
  const cycleLabels = LIFECYCLE_LABELS[locale] ?? LIFECYCLE_LABELS.fr
  const L = (href: string) => `/${locale}${href}`
  const contactHref = L(`/contact?subject=${c.cta.subject}`)

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ag-navy border-b border-ag-border">
        <Image
          src={c.image}
          alt={c.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/70 via-ag-navy/60 to-ag-navy/95" />
        <div className={`${SECTION} relative pt-36 pb-24`}>
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/60 inline-block" />
            {c.eyebrow}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.08] max-w-4xl mb-8"
            style={{ fontSize: 'clamp(34px,4.6vw,64px)' }}
          >
            {c.h1}
          </h1>
          <p className="text-[16px] text-white/70 leading-relaxed max-w-2xl mb-10">{c.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={contactHref} className={BTN_PRI}>{c.cta.primary} <ArrowUpRight size={14} /></Link>
            {c.cta.secondary && <Link href={contactHref} className={BTN_SEC}>{c.cta.secondary}</Link>}
          </div>
        </div>
      </section>

      {/* ── Constat ── */}
      <section className="bg-ag-white border-b border-ag-border">
        <div className={`${SECTION} py-20`}>
          <p className={`${LABEL} mb-6`}>{c.observation.title}</p>
          <div className="grid md:grid-cols-3 gap-px bg-ag-border border border-ag-border mb-12">
            {c.observation.cards.map((s, i) => (
              <div key={i} className="bg-white p-7 flex flex-col">
                <p className="font-sans font-bold text-ag-navy tabular-nums tracking-[-0.03em] leading-none mb-4" style={{ fontSize: 'clamp(30px,3.4vw,46px)' }}>
                  {s.value}
                </p>
                <p className="text-[13px] text-ag-black leading-relaxed flex-1">{s.label}</p>
                <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.14em] text-ag-gray-light mt-5">{s.source}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12">
            <div className="space-y-5">
              {c.observation.paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] text-ag-gray leading-[1.8]">{p}</p>
              ))}
              <p className="text-[12px] text-ag-gray-light leading-relaxed pt-2">{c.observation.sources}</p>
            </div>
            <div className="border-l-2 border-ag-apex pl-7 self-start">
              <p className={`${LABEL} mb-3`}>Ce que cela change</p>
              <p className="font-sans font-semibold text-[18px] text-ag-navy leading-[1.5]">{c.observation.change}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ce que vous obtenez ── */}
      <section className="bg-ag-navy text-white border-b border-ag-border">
        <div className={`${SECTION} py-16`}>
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-apex mb-8">{c.outcomes.title}</p>
          <div className="grid md:grid-cols-3 gap-10">
            {c.outcomes.items.map((o, i) => (
              <div key={i} className="flex gap-5">
                <span className="font-sans font-bold text-[13px] text-ag-apex tabular-nums shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-sans font-semibold text-[18px] leading-[1.45] tracking-[-0.01em]">{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Situations ── */}
      <section className="bg-ag-cream border-b border-ag-border">
        <div className={`${SECTION} py-20`}>
          <h2 className={`${H2} text-[30px] md:text-[36px] mb-12 max-w-2xl`}>{c.situations.title}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {c.situations.items.map((s, i) => (
              <article key={i} className="bg-white border border-ag-border p-7 flex flex-col gap-5">
                <p className="font-sans font-bold text-[20px] text-ag-navy leading-[1.3] tracking-[-0.01em]">« {s.quote} »</p>
                <dl className="grid grid-cols-[92px_1fr] gap-x-4 gap-y-3 text-[13.5px]">
                  <dt className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light pt-1">Décision</dt>
                  <dd className="text-ag-black leading-relaxed">{s.decision}</dd>
                  <dt className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light pt-1">Livrable</dt>
                  <dd className="text-ag-gray leading-relaxed">{s.deliverable}</dd>
                  {s.format && (
                    <>
                      <dt className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-ag-gray-light pt-1">Format</dt>
                      <dd className="text-ag-gray leading-relaxed">{s.format}</dd>
                    </>
                  )}
                </dl>
                <div className="mt-auto pt-4 border-t border-ag-border flex flex-wrap gap-x-5 gap-y-2">
                  {s.cycles.map(cy => (
                    <Link key={cy} href={L(`/valoriser/${cy}`)} className="inline-flex items-center gap-1.5 font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-apex-ink hover:text-ag-navy transition-colors">
                      Cycle · {cycleLabels[cy]} <ArrowRight size={10} />
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services + Cadre ── */}
      <section className="bg-ag-white border-b border-ag-border">
        <div className={`${SECTION} py-20 grid lg:grid-cols-[1fr_1.5fr] gap-16`}>
          <div>
            <p className={`${LABEL} mb-6`}>{c.services.title}</p>
            <ul className="divide-y divide-ag-border border-t border-b border-ag-border">
              {c.services.items.map((s, i) => (
                <li key={i} className="py-4 flex items-start gap-4">
                  <span className="font-sans font-semibold text-[11px] text-ag-gray-light tabular-nums pt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-sans font-semibold text-[15px] text-ag-navy leading-snug">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ag-cream border border-ag-border p-8 md:p-10">
            <p className={`${LABEL} mb-3`}>Notre cadre</p>
            <h2 className={`${H2} text-[28px] md:text-[32px] mb-4`}>{c.framework.name}</h2>
            <p className="text-[14px] text-ag-gray leading-relaxed mb-8">{c.framework.intro}</p>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
              {c.framework.axes.map((a, i) => (
                <div key={i} className="border-l-2 border-ag-apex/40 pl-4">
                  <p className="font-sans font-semibold text-[15px] text-ag-navy mb-1">{a.label}</p>
                  <p className="text-[13px] text-ag-gray leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ag-border pt-5">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">Livrable</p>
              <p className="text-[14px] text-ag-black leading-relaxed">{c.framework.deliverable}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Taille + Secteur ── */}
      <section className="bg-ag-cream border-b border-ag-border">
        <div className={`${SECTION} py-20`}>
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <p className={`${LABEL} mb-6`}>{c.bySize.title}</p>
              <div className="space-y-6">
                {c.bySize.items.map((s, i) => (
                  <div key={i} className="bg-white border border-ag-border p-7">
                    <p className="font-sans font-bold text-[16px] text-ag-navy mb-2">{s.label}</p>
                    <p className="text-[14px] text-ag-gray leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className={`${LABEL} mb-6`}>{c.bySector.title}</p>
              <ul className="divide-y divide-ag-border border-t border-b border-ag-border">
                {c.bySector.items.map((s, i) => (
                  <li key={i} className="py-5">
                    <p className="font-sans font-semibold text-[14px] text-ag-navy mb-1">{s.cluster}</p>
                    <p className="text-[13.5px] text-ag-gray leading-relaxed">{s.desc}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scénario + IA ── */}
      <section className="bg-ag-white border-b border-ag-border">
        <div className={`${SECTION} py-20 grid lg:grid-cols-2 gap-12`}>
          <div className="border border-ag-border p-8 md:p-10">
            <p className={`${LABEL} mb-4`}>{c.scenario.tag}</p>
            <p className="text-[15px] text-ag-black leading-[1.8]">{c.scenario.text}</p>
          </div>
          <div className="bg-ag-navy text-white p-8 md:p-10">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-apex mb-4">{c.ai.title}</p>
            <p className="text-[15px] text-white/80 leading-[1.8]">{c.ai.text}</p>
            {c.ai.legal && <p className="text-[12px] text-white/50 leading-relaxed mt-5 pt-5 border-t border-white/10">{c.ai.legal}</p>}
          </div>
        </div>
      </section>

      {/* ── Retour d'expérience d'opérateur / complément ── */}
      {(c.operator || c.complement) && (
        <section className="bg-ag-cream border-b border-ag-border">
          <div className={`${SECTION} py-14 grid lg:grid-cols-2 gap-12`}>
            {c.operator && (
              <div>
                <p className={`${LABEL} mb-3`}>{c.operator.title}</p>
                <p className="text-[14px] text-ag-gray leading-relaxed">{c.operator.text}</p>
              </div>
            )}
            {c.complement && (
              <div>
                <p className={`${LABEL} mb-3`}>{c.complement.title}</p>
                <p className="text-[14px] text-ag-gray leading-relaxed">{c.complement.text}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Auto-diagnostic ── */}
      <section className="bg-ag-white border-b border-ag-border">
        <div className={`${SECTION} py-20`}>
          <AdvisoryDiagnostic
            title={c.diagnostic.title}
            intro={c.diagnostic.intro}
            questions={c.diagnostic.questions}
            levels={c.diagnostic.levels}
            privacy={c.diagnostic.privacy}
            ctaLabel={c.cta.primary}
            ctaHref={contactHref}
          />
        </div>
      </section>

      {/* ── Perspectives + périmètre ── */}
      <section className="bg-ag-cream border-b border-ag-border">
        <div className={`${SECTION} py-16 grid lg:grid-cols-2 gap-12`}>
          {c.perspectives.items.length > 0 && (
            <div>
              <p className={`${LABEL} mb-5`}>{c.perspectives.title}</p>
              <ul className="divide-y divide-ag-border border-t border-b border-ag-border">
                {c.perspectives.items.map((p, i) => (
                  <li key={i}>
                    <Link href={L(p.href)} className="py-4 flex items-center justify-between gap-6 group">
                      <span className="font-sans font-semibold text-[15px] text-ag-navy group-hover:text-ag-apex-ink transition-colors">{p.title}</span>
                      <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-gray-light shrink-0 flex items-center gap-2">
                        {p.kind === 'magazine' ? 'Magazine' : 'Article'} <ArrowUpRight size={11} />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <p className={`${LABEL} mb-5`}>Ce que cette page ne couvre pas</p>
            <ul className="divide-y divide-ag-border border-t border-b border-ag-border">
              {c.scope.map((s, i) => (
                <li key={i}>
                  <Link href={L(s.href)} className="py-4 flex items-center justify-between gap-6 group">
                    <span className="text-[14px] text-ag-gray group-hover:text-ag-navy transition-colors">{s.label}</span>
                    <ArrowRight size={12} className="text-ag-gray-light shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CTA + newsletter ── */}
      <section className="bg-ag-navy text-white">
        <div className={`${SECTION} py-20 grid lg:grid-cols-[1.3fr_1fr] gap-14 items-start`}>
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-apex mb-5">Échange de cadrage confidentiel</p>
            <h2 className="font-sans font-bold text-[30px] md:text-[38px] tracking-[-0.02em] leading-[1.1] mb-6 max-w-xl">{c.cta.primary}.</h2>
            <p className="text-[15px] text-white/65 leading-relaxed max-w-lg mb-8">
              Trente minutes avec un expert du réseau, nommé et responsable de son périmètre. Pas d’engagement à ce stade ; les conditions sont transmises après cadrage.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={contactHref} className={BTN_PRI}>{c.cta.primary} <ArrowUpRight size={14} /></Link>
              {c.cta.secondary && <Link href={contactHref} className={BTN_SEC}>{c.cta.secondary}</Link>}
            </div>
          </div>
          <div className="border border-white/15 p-7">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-apex mb-3">Newsletter · Built to Last</p>
            <p className="text-[14px] text-white/65 leading-relaxed mb-6">Analyses de marché, cycles de vie des organisations, retours d’expérience. Une lettre, pas de prospection.</p>
            <NewsletterSubscribeForm locale={locale} />
          </div>
        </div>
      </section>
    </main>
  )
}
