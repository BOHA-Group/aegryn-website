import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { NewsletterSubscribeForm } from '@/components/newsletter/NewsletterSubscribeForm'
import { AdvisoryDiagnostic } from './AdvisoryDiagnostic'
import { LIFECYCLE_LABELS, ADVISORY_UI } from '@/content/advisory'
import { PAGE_ACTIONS, getAction } from '@/content/advisory/actions'
import { ADVISORY_BLUR } from '@/content/advisory/blur'
import { routing } from '@/i18n/routing'
import type { AdvisoryPageContent } from '@/content/advisory/types'

interface Props {
  content: AdvisoryPageContent
  locale:  string
}

/* Styles alignés sur les pages /valoriser et /industries */
const LABEL   = 'font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light'
const LABEL_G = 'font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex'
const H2      = 'font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1]'
const CARD    = 'rounded-2xl bg-ag-white border border-ag-border'
const BTN_PRI = 'rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors'
const BTN_SEC = 'rounded-lg inline-flex items-center gap-2 border border-white/60 bg-white/10 text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-white hover:text-ag-navy transition-all'

/**
 * Gabarit des pages métiers ACCOMPAGNER, version 2.
 * Ordre : constat sourcé · résultats · situations rattachées aux cycles ·
 * services et cadre nommé · lectures par taille et secteur · scénario et
 * limites de l'IA · auto-diagnostic · perspectives · contact et newsletter.
 */
export function AdvisoryPillarPage({ content: c, locale }: Props) {
  const cycleLabels = LIFECYCLE_LABELS[locale] ?? LIFECYCLE_LABELS.fr
  const ui = ADVISORY_UI[locale] ?? ADVISORY_UI.fr
  const L = (href: string) => `/${locale}${href}`
  const pageActions = PAGE_ACTIONS[c.cta.metier]
  const echangeDef  = getAction(locale, c.cta.metier, pageActions.echange)
  const actionDef   = getAction(locale, c.cta.metier, pageActions.action)
  const contactSlugs = routing.pathnames['/contact'] as Record<string, string>
  const contactPath  = contactSlugs[locale] ?? '/contact'
  const hrefFor = (action: string) => L(`${contactPath}?metier=${c.cta.metier}&action=${action}`)
  const contactHref = hrefFor(pageActions.echange)

  /* JSON-LD : service de conseil + fil d'Ariane, pour le référencement */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: c.eyebrow,
        description: c.meta.description,
        serviceType: c.eyebrow,
        provider: { '@type': 'Organization', name: 'Aegryn', url: 'https://aegryn.com' },
        areaServed: [{ '@type': 'Country', name: 'Switzerland' }, { '@type': 'Place', name: 'Europe' }],
        audience: { '@type': 'BusinessAudience', name: 'SMEs and mid-caps, EUR 10M to 300M' },
        url: `https://aegryn.com/${locale}${c.path}`,
        inLanguage: locale,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: c.services.title,
          itemListElement: c.services.items.map(name => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name } })),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Aegryn', item: `https://aegryn.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: 'Advisory', item: `https://aegryn.com/${locale}/advisory` },
          { '@type': 'ListItem', position: 3, name: c.eyebrow, item: `https://aegryn.com/${locale}${c.path}` },
        ],
      },
    ],
  }

  return (
    <main className="bg-ag-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ag-navy pt-36 pb-24 px-6 md:px-12">
        <Image
          src={c.image}
          alt={c.imageAlt}
          fill
          priority
          fetchPriority="high"
          quality={70}
          sizes="100vw"
          placeholder={ADVISORY_BLUR[c.image] ? 'blur' : 'empty'}
          blurDataURL={ADVISORY_BLUR[c.image]}
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/70 via-ag-navy/60 to-ag-navy/95" />
        <div className="relative max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {c.eyebrow}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-4xl mb-6"
            style={{ fontSize: 'clamp(34px,4.6vw,64px)' }}
          >
            {c.h1}
          </h1>
          <p className="font-sans text-[15px] text-white/60 max-w-2xl leading-relaxed mb-10">{c.subtitle}</p>
          <div className="flex flex-wrap gap-3">
            {echangeDef && <Link href={contactHref} className={BTN_PRI}>{echangeDef.label} <ArrowUpRight size={12} /></Link>}
            {actionDef && <Link href={hrefFor(pageActions.action)} className={BTN_SEC}>{actionDef.label}</Link>}
          </div>
        </div>
      </section>

      {/* ── Constat ── */}
      <section className="py-24 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className={`${LABEL} mb-8`}>{c.observation.title}</p>
          <div className="grid md:grid-cols-3 gap-6 mb-14">
            {c.observation.cards.map((s, i) => (
              <div key={i} className={`${CARD} p-8 flex flex-col`}>
                <p className="font-sans font-bold text-ag-black tabular-nums tracking-[-0.03em] leading-none mb-4" style={{ fontSize: 'clamp(30px,3.4vw,46px)' }}>
                  {s.value}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">{s.label}</p>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ag-gray-light mt-6">{s.source}</p>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12">
            <div className="space-y-5">
              {c.observation.paragraphs.map((p, i) => (
                <p key={i} className="font-sans text-[15px] text-ag-gray leading-[1.8]">{p}</p>
              ))}
              <p className="font-sans text-[12px] text-ag-gray-light leading-relaxed pt-2">{c.observation.sources}</p>
            </div>
            <div className="rounded-2xl bg-ag-off-white border border-ag-border p-8 self-start">
              <p className={`${LABEL} mb-4`}>{ui.change}</p>
              <p className="font-sans font-semibold text-[18px] text-ag-black leading-[1.5] tracking-[-0.01em]">{c.observation.change}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Ce que vous obtenez ── */}
      <section className="bg-ag-navy py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className={`${LABEL_G} mb-10`}>{c.outcomes.title}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {c.outcomes.items.map((o, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 flex gap-5">
                <span className="font-mono text-[11px] text-ag-apex tabular-nums shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
                <p className="font-sans font-semibold text-[17px] text-white leading-[1.45] tracking-[-0.01em]">{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Situations ── */}
      <section className="py-24 px-6 md:px-12 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className={`${LABEL} mb-4`}>{ui.sixSituations}</p>
            <h2 className={`${H2} text-[30px] md:text-[38px]`}>{c.situations.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.situations.items.map((s, i) => (
              <article key={i} className="group rounded-2xl bg-ag-white border border-ag-border overflow-hidden flex flex-col hover:border-ag-navy/40 transition-colors">
                {/* Visuel + situation, format /industries */}
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
                  <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.22em] text-white/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="font-sans font-bold text-white text-[18px] leading-[1.3] tracking-[-0.01em]">« {s.quote} »</p>
                  </div>
                </div>
                {/* Décision / livrable / format */}
                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-apex-ink mb-1.5">{ui.decision}</p>
                    <p className="font-sans text-[13.5px] text-ag-black leading-relaxed">{s.decision}</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1.5">{ui.deliverable}</p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{s.deliverable}</p>
                  </div>
                  {s.format && (
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ag-gray-light">{s.format}</p>
                  )}
                  <div className="mt-auto pt-4 border-t border-ag-border flex flex-wrap gap-2">
                    {s.cycles.map(cy => (
                      <Link
                        key={cy}
                        href={L(`/valoriser/${cy}`)}
                        className="rounded-full inline-flex items-center gap-1.5 border border-ag-border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ag-navy hover:border-ag-navy hover:bg-ag-navy hover:text-white transition-colors"
                      >
                        {cycleLabels[cy]} <ArrowRight size={9} />
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services + Cadre ── */}
      <section className="py-24 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12">
          <div>
            <p className={`${LABEL} mb-8`}>{c.services.title}</p>
            <ul className="flex flex-col gap-3">
              {c.services.items.map((s, i) => (
                <li key={i} className={`${CARD} px-6 py-4 flex items-start gap-4`}>
                  <span className="font-mono text-[10px] text-ag-apex-ink tabular-nums pt-1 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-sans font-semibold text-[14px] text-ag-black leading-snug tracking-[-0.01em]">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-ag-off-white border border-ag-border p-8 md:p-10">
            <p className={`${LABEL} mb-4`}>{ui.ourFramework}</p>
            <h2 className={`${H2} text-[26px] md:text-[32px] mb-4`}>{c.framework.name}</h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-8">{c.framework.intro}</p>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {c.framework.axes.map((a, i) => (
                <div key={i} className={`${CARD} p-5`}>
                  <p className="font-sans font-semibold text-[14px] text-ag-black mb-1">{a.label}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-ag-border pt-5">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-2">{ui.deliverable}</p>
              <p className="font-sans text-[14px] text-ag-black leading-relaxed">{c.framework.deliverable}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Taille + Secteur ── */}
      <section className="py-24 px-6 md:px-12 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          <div>
            <p className={`${LABEL} mb-8`}>{c.bySize.title}</p>
            <div className="flex flex-col gap-4">
              {c.bySize.items.map((s, i) => (
                <div key={i} className={`${CARD} p-8`}>
                  <p className="font-sans font-bold text-[16px] text-ag-black mb-2 tracking-[-0.01em]">{s.label}</p>
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className={`${LABEL} mb-8`}>{c.bySector.title}</p>
            <div className={`${CARD} divide-y divide-ag-border`}>
              {c.bySector.items.map((s, i) => (
                <div key={i} className="px-6 py-5">
                  <p className="font-sans font-semibold text-[14px] text-ag-black mb-1">{s.cluster}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Scénario + IA ── */}
      <section className="py-24 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className={`${CARD} p-8 md:p-10`}>
            <p className={`${LABEL} mb-4`}>{c.scenario.tag}</p>
            <p className="font-sans text-[15px] text-ag-black leading-[1.8]">{c.scenario.text}</p>
          </div>
          <div className="rounded-2xl bg-ag-navy p-8 md:p-10">
            <p className={`${LABEL_G} mb-4`}>{c.ai.title}</p>
            <p className="font-sans text-[15px] text-white/80 leading-[1.8]">{c.ai.text}</p>
            {c.ai.legal && <p className="font-sans text-[12px] text-white/50 leading-relaxed mt-5 pt-5 border-t border-white/10">{c.ai.legal}</p>}
          </div>
        </div>
      </section>

      {/* ── Retour d'expérience d'opérateur / complément ── */}
      {(c.operator || c.complement) && (
        <section className="pb-24 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
            {c.operator && (
              <div className={`${CARD} p-8`}>
                <p className={`${LABEL} mb-3`}>{c.operator.title}</p>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{c.operator.text}</p>
              </div>
            )}
            {c.complement && (
              <div className={`${CARD} p-8`}>
                <p className={`${LABEL} mb-3`}>{c.complement.title}</p>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{c.complement.text}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Auto-diagnostic ── */}
      <section className="py-24 px-6 md:px-12 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <AdvisoryDiagnostic
            title={c.diagnostic.title}
            intro={c.diagnostic.intro}
            questions={c.diagnostic.questions}
            levels={c.diagnostic.levels}
            privacy={c.diagnostic.privacy}
            ctaLabel={echangeDef?.label ?? ''}
            ctaHref={contactHref}
            locale={locale}
          />
        </div>
      </section>

      {/* ── Perspectives + périmètre ── */}
      <section className="py-20 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12">
          {c.perspectives.items.length > 0 && (
            <div>
              <p className={`${LABEL} mb-6`}>{c.perspectives.title}</p>
              <div className="flex flex-col gap-3">
                {c.perspectives.items.map((p, i) => (
                  <Link key={i} href={L(p.href)} className={`${CARD} group px-6 py-5 flex items-center justify-between gap-6 hover:border-ag-navy/40 transition-colors`}>
                    <span className="font-sans font-semibold text-[15px] text-ag-black group-hover:text-ag-navy transition-colors">{p.title}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ag-gray-light shrink-0 flex items-center gap-2">
                      {p.kind === 'magazine' ? ui.magazine : ui.article} <ArrowUpRight size={11} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div>
            <p className={`${LABEL} mb-6`}>{ui.notCovered}</p>
            <div className="flex flex-col gap-3">
              {c.scope.map((s, i) => (
                <Link key={i} href={L(s.href)} className={`${CARD} group px-6 py-5 flex items-center justify-between gap-6 hover:border-ag-navy/40 transition-colors`}>
                  <span className="font-sans text-[14px] text-ag-gray group-hover:text-ag-black transition-colors">{s.label}</span>
                  <ArrowRight size={12} className="text-ag-gray-light shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA + newsletter ── */}
      <section className="bg-ag-navy py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.3fr_1fr] gap-12 items-start">
          <div>
            <p className={`${LABEL_G} mb-6`}>{ui.ctaEyebrow}</p>
            <h2 className="font-sans font-bold text-white text-[30px] md:text-[38px] tracking-[-0.02em] leading-[1.1] mb-6 max-w-xl">{echangeDef?.label}.</h2>
            <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-lg mb-10">
              {ui.ctaBody}
            </p>
            <div className="flex flex-wrap gap-3">
              {echangeDef && <Link href={contactHref} className={BTN_PRI}>{echangeDef.label} <ArrowUpRight size={12} /></Link>}
              {actionDef && <Link href={hrefFor(pageActions.action)} className={BTN_SEC}>{actionDef.label}</Link>}
            </div>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-8">
            <p className={`${LABEL_G} mb-3`}>{ui.newsletterLabel}</p>
            <p className="font-sans text-[14px] text-white/60 leading-relaxed mb-6">{ui.newsletterBody}</p>
            <NewsletterSubscribeForm locale={locale} />
          </div>
        </div>
      </section>
    </main>
  )
}
