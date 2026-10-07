import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import { AdvisoryDiagnostic } from '@/components/advisory/AdvisoryDiagnostic'
import { FRANCHIR_UI, METIER_HREF, METIER_LABELS, CYCLE_IMAGES } from '@/content/franchir/ui'
import { getCycleAction } from '@/content/franchir/actions'
import { routing } from '@/i18n/routing'
import type { CycleContent, MetierChip } from '@/content/franchir/types'

interface Props {
  content: CycleContent
  locale:  string
}

/* Styles alignés sur les pages ACCOMPAGNER (AdvisoryPillarPage) */
const LABEL   = 'font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light'
const LABEL_G = 'font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex'
const H2      = 'font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.1]'
const CARD    = 'rounded-2xl bg-ag-white border border-ag-border'
const BTN_PRI = 'rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors'
const BTN_SEC = 'rounded-lg inline-flex items-center gap-2 border border-white/60 bg-white/10 text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-white hover:text-ag-navy transition-all'
const BTN_WARN = 'rounded-lg inline-flex items-center gap-2 border border-ag-apex/60 text-ag-apex font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex hover:text-ag-navy transition-all'

function MetierChipLink({ m, labels, L }: { m: MetierChip; labels: Record<MetierChip, string>; L: (h: string) => string }) {
  return (
    <Link
      href={L(METIER_HREF[m])}
      className="rounded-full inline-flex items-center gap-1.5 border border-ag-border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ag-navy hover:border-ag-navy hover:bg-ag-navy hover:text-white transition-colors"
    >
      {labels[m]} <ArrowRight size={9} />
    </Link>
  )
}

/**
 * Gabarit des pages cycle de vie FRANCHIR (/franchir/*).
 * Ordre fixe : hero (H1, sous-titre, trois verbes) · constat sourcé ·
 * situations (decision, metier, livrable) · metiers · taille · secteur ·
 * scenario · limites de l'IA · auto-diagnostic · cycle suivant · CTAs.
 */
export function CyclePage({ content: c, locale }: Props) {
  const ui = FRANCHIR_UI[locale] ?? FRANCHIR_UI.fr
  const metierLabels = METIER_LABELS[locale] ?? METIER_LABELS.fr
  const L = (href: string) => `/${locale}${href}`
  const contactSlugs = routing.pathnames['/contact'] as Record<string, string>
  const contactPath  = contactSlugs[locale] ?? '/contact'
  const echangeHref  = L(`${contactPath}?cycle=${c.slug}&action=echange`)
  const echangeDef   = getCycleAction(locale, c.slug, 'echange')
  const urgenceDef   = c.urgency ? getCycleAction(locale, c.slug, 'urgence') : null

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
        audience: { '@type': 'BusinessAudience', name: 'Organisations, EUR 10M to 300M' },
        url: `https://aegryn.com/${locale}${c.path}`,
        inLanguage: locale,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Aegryn', item: `https://aegryn.com/${locale}` },
          { '@type': 'ListItem', position: 2, name: c.eyebrow.split('·')[0].trim(), item: `https://aegryn.com/${locale}#franchir` },
          { '@type': 'ListItem', position: 3, name: c.eyebrow, item: `https://aegryn.com/${locale}${c.path}` },
        ],
      },
    ],
  }

  return (
    <main className="bg-ag-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* ── 1. Hero : visuel, titre, sous-titre, trois verbes ── */}
      <section
        className="relative overflow-hidden bg-ag-navy pt-36 pb-32 px-6 md:px-12"
        style={{ minHeight: 'clamp(460px,50vw,620px)' }}
      >
        <Image
          src={CYCLE_IMAGES[c.slug].hero}
          alt={ui.heroAlt[c.slug]}
          fill
          priority
          fetchPriority="high"
          unoptimized
          sizes="100vw"
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
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {c.h1}
          </h1>
          <p className="font-sans text-[16px] text-white/60 max-w-2xl leading-relaxed mb-10">{c.subtitle}</p>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50">
            {ui.whatWeDo}&nbsp;&nbsp;·&nbsp;&nbsp;
            <span className="text-ag-apex">{c.verbs.join(' · ')}</span>
          </p>
        </div>
      </section>

      {/* ── 2. Constat chiffré et sourcé ── */}
      <section className="py-24 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className={`${LABEL} mb-8`}>{ui.finding}</p>
          <div className="rounded-2xl bg-ag-off-white border border-ag-border p-8 md:p-10 max-w-4xl">
            <p className="font-sans font-semibold text-[18px] md:text-[20px] text-ag-black leading-[1.55] tracking-[-0.01em] mb-6">{c.constat.text}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ag-gray-light">{c.constat.source}</p>
          </div>
        </div>
      </section>

      {/* ── 3. Situations : décision, métier, livrable ── */}
      <section className="py-24 px-6 md:px-12 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className={`${LABEL} mb-4`}>{ui.situationsTag}</p>
            <h2 className={`${H2}`} style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{c.situations.title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.situations.items.map((s, i) => (
              <article key={i} className="group rounded-2xl bg-ag-white border border-ag-border overflow-hidden flex flex-col hover:border-ag-navy/40 transition-colors">
                {/* Visuel + situation, format /advisory */}
                <div className="relative h-[200px] overflow-hidden">
                  <Image
                    src={s.image ?? CYCLE_IMAGES[c.slug].situations[i]}
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
                <div className="p-6 flex flex-col gap-4 flex-1">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-apex-ink mb-1.5">{ui.decision}</p>
                  <p className="font-sans text-[13.5px] text-ag-black leading-relaxed">{s.decision}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1.5">{ui.deliverable}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{s.deliverable}</p>
                </div>
                <div className="mt-auto pt-4 border-t border-ag-border">
                  <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-2.5">{ui.metierUsed}</p>
                  <div className="flex flex-wrap gap-2">
                    {s.metiers.map(m => (
                      <MetierChipLink key={m} m={m} labels={metierLabels} L={L} />
                    ))}
                  </div>
                </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Métiers mobilisés à ce cycle ── */}
      <section className="py-20 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className={`${LABEL} mb-8`}>{ui.metiersTitle}</p>
          <div className="flex flex-wrap gap-3 mb-4">
            {c.metiers.mobilized.map(m => (
              <Link key={m} href={L(METIER_HREF[m])}
                className="rounded-full inline-flex items-center gap-2 border border-ag-navy/30 bg-ag-navy text-white px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] hover:bg-ag-black transition-colors">
                <span aria-hidden>●</span> {metierLabels[m]} <ArrowRight size={9} />
              </Link>
            ))}
            {c.metiers.available.map(m => (
              <Link key={m} href={L(METIER_HREF[m])}
                className="rounded-full inline-flex items-center gap-2 border border-ag-border text-ag-navy px-4 py-2 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-ag-navy transition-colors">
                <span aria-hidden>○</span> {metierLabels[m]} <ArrowRight size={9} />
              </Link>
            ))}
          </div>
          <p className="font-sans text-[12px] text-ag-gray-light">
            ● {ui.mobilized}&nbsp;&nbsp;·&nbsp;&nbsp;○ {ui.available}
          </p>
        </div>
      </section>

      {/* ── 5 + 6. Selon la taille · Selon le secteur ── */}
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

      {/* ── 7 + 8. Scénario illustratif · limites de l'IA ── */}
      <section className="py-24 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-6">
          <div className={`${CARD} p-8 md:p-10`}>
            <p className={`${LABEL} mb-4`}>{c.scenario.tag}</p>
            <p className="font-sans text-[15px] text-ag-black leading-[1.8]">{c.scenario.text}</p>
          </div>
          <div className="rounded-2xl bg-ag-navy p-8 md:p-10">
            <p className={`${LABEL_G} mb-4`}>{c.ai.title}</p>
            <p className="font-sans text-[15px] text-white/80 leading-[1.8]">{c.ai.text}</p>
          </div>
        </div>
        {c.mandate && (
          <div className="max-w-7xl mx-auto mt-6">
            <p className="rounded-2xl border border-ag-border bg-ag-off-white px-6 py-4 font-sans text-[12.5px] text-ag-gray leading-relaxed">
              {c.mandate}
            </p>
          </div>
        )}
      </section>

      {/* ── 9. Auto-diagnostic ── */}
      <section id="diagnostic" className="py-24 px-6 md:px-12 bg-ag-off-white border-t border-ag-border scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <AdvisoryDiagnostic
            title={c.diagnostic.title}
            intro={c.diagnostic.intro}
            questions={c.diagnostic.questions}
            levels={c.diagnostic.levels}
            privacy={c.diagnostic.privacy}
            ctaLabel={echangeDef?.label ?? ui.ctaExchange}
            ctaHref={echangeHref}
            locale={locale}
          />
        </div>
      </section>

      {/* ── 10. Cycle suivant ── */}
      <section className="py-20 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className={`${LABEL} mb-6`}>{c.nextLabel}</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl">
            {c.next.map(n => (
              <Link key={n.slug} href={L(`/franchir/${n.slug}`)}
                className={`${CARD} group px-6 py-6 flex items-center justify-between gap-6 hover:border-ag-navy/40 transition-colors`}>
                <span className="font-sans font-semibold text-[15px] text-ag-black group-hover:text-ag-navy transition-colors">{n.label}</span>
                <ArrowUpRight size={13} className="text-ag-gray-light shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. CTAs ── */}
      <section className="bg-ag-navy py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className={`${LABEL_G} mb-6`}>{ui.ctaEyebrow}</p>
          <h2 className="font-sans font-bold text-white tracking-[-0.02em] leading-[1.1] mb-6 max-w-xl" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {echangeDef?.label ?? ui.ctaExchange}.
          </h2>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-lg mb-10">{ui.ctaBody}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={`${L(c.path)}#diagnostic`} className={BTN_SEC}>{ui.ctaDiagnostic}</Link>
            <Link href={echangeHref} className={BTN_PRI}>{echangeDef?.label ?? ui.ctaExchange} <ArrowUpRight size={12} /></Link>
            {urgenceDef && (
              <Link href={L(`${contactPath}?cycle=${c.slug}&action=urgence`)} className={BTN_WARN}>{urgenceDef.label}</Link>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
