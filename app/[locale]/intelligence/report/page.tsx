import Link              from 'next/link'
import Image             from 'next/image'
import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'intelligence.report.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  { canonical: `/${locale}/intelligence/report` },
  }
}

/* ─── données statiques des éditions ──────────────────────────────────────── */
const EDITIONS = [
  {
    num:    '01',
    year:   '2026',
    season: 'Première édition',
    tag:    'Annual · Digital + Print',
    href:   '/intelligence/report/2026',
    image:  '/images/magazine/cover-2026.jpg',
    available: true,
  },
  {
    num:    '02',
    year:   '2027',
    season: 'Automne 2027',
    tag:    'En préparation',
    href:   '/intelligence/subscribe',
    image:  null,
    available: false,
  },
]

/* ─── sommaire éditorial de l'édition 2026 ────────────────────────────────── */
const SOMMAIRE = [
  {
    section: 'Marché M&A',
    articles: [
      {
        title: 'L\'état du marché tech européen',
        excerpt: 'Analyse des transactions 2024–2025 : volumes, secteurs, géographies. Données SEG, Aventis, Synergy AI.',
        image: '/images/magazine/article-market-2026.jpg',
        href: '/intelligence/report/2026',
      },
    ],
  },
  {
    section: 'Certification CIFS',
    articles: [
      {
        title: 'Le protocole CIFS — Code, IP, Finance, Sécurité',
        excerpt: 'Notre méthodologie de certification expliquée. Quatre dimensions, un grade objectif, reproductible, opposable.',
        image: '/images/magazine/article-cifs-2026.jpg',
        href: '/intelligence/report/2026',
      },
    ],
  },
  {
    section: 'Analyse de transactions',
    articles: [
      {
        title: 'Trois deals analysés sous le prisme CIFS',
        excerpt: 'SEG, Aventis, Synergy AI : ce qui a fonctionné, le grade estimé, et les enseignements pour les vendeurs.',
        image: '/images/magazine/article-deals-2026.jpg',
        href: '/intelligence/report/2026',
      },
    ],
  },
  {
    section: 'Perspectives 2027',
    articles: [
      {
        title: 'Ce que les acheteurs institutionnels attendent',
        excerpt: 'Family offices, corporates, fonds — leurs critères réels, leurs secteurs cibles, leur appétit pour le tech certifié.',
        image: '/images/magazine/article-buyers-2026.jpg',
        href: '/intelligence/report/2026',
      },
    ],
  },
]

export default async function ReportIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'intelligence.report' })
  const tp = await getTranslations({ locale, namespace: 'intelligence.press' })

  return (
    <main className="min-h-screen bg-magazine-white">

      {/* ══════════════════════════════════════════════════════════
          HERO — plein fond noir, cover large format
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-magazine-black pt-24 pb-0">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px]">

          {/* Bandeau supérieur */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-14">
            <span className="font-mono text-[10px] tracking-[0.30em] uppercase text-white/30">
              AEGRYN Intelligence
            </span>
            <span className="font-mono text-[10px] tracking-[0.20em] uppercase text-white/20">
              Annual Publication — European Tech M&A
            </span>
          </div>

          {/* Titre + couverture */}
          <div className="grid md:grid-cols-[1fr_auto] gap-16 items-end pb-0">
            <div className="pb-20">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-accent mb-10">
                {t('edition2026')}
              </p>
              <h1
                className="font-sans font-bold text-white leading-[0.90] mb-10"
                style={{ fontSize: 'clamp(52px,7.5vw,108px)', letterSpacing: '-0.035em' }}
              >
                {t('title')}<br />
                <span className="text-white/25">{t('subtitle')}</span>
              </h1>
              <p className="font-mono text-[12px] tracking-[0.20em] uppercase text-white/35 italic mb-12">
                &ldquo;{t('tagline')}&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/${locale}/intelligence/report/2026`}
                  className="inline-flex items-center gap-2 bg-magazine-accent text-magazine-black font-mono text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 hover:bg-magazine-accent/90 transition-colors font-semibold"
                >
                  {t('readOnline')} <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/${locale}/intelligence/report/2026/pdf`}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-mono text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
                >
                  {t('downloadPdf')} <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            {/* Couverture grand format */}
            <div className="shrink-0 hidden md:block self-end">
              <div className="w-[280px] h-[380px] relative overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-magazine-accent/8 via-transparent to-magazine-black/60 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-magazine-black/90 flex flex-col justify-between p-8 z-20">
                  <div>
                    <p className="font-mono text-[8px] tracking-[0.30em] uppercase text-white/20 mb-2">First Edition</p>
                    <div className="w-8 h-px bg-magazine-accent mb-1" />
                  </div>
                  <div>
                    <p
                      className="font-sans font-bold text-white leading-[0.88] mb-5"
                      style={{ fontSize: 36, letterSpacing: '-0.03em' }}
                    >
                      The<br />AEGRYN<br />2026
                    </p>
                    <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/20 mb-3">
                      European Tech M&A<br />Intelligence
                    </p>
                    <div className="inline-block border border-magazine-accent/40 px-2.5 py-1">
                      <span className="font-mono text-[8px] tracking-[0.12em] text-magazine-accent">
                        Annual · Digital + Print
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Méta-données édition */}
          <div className="border-t border-white/10 grid grid-cols-2 md:grid-cols-4">
            {[
              { label: 'Format',    value: 'Annual · Digital + Print' },
              { label: 'Sections', value: '8 chapitres' },
              { label: 'Données',  value: 'SEG · Aventis · Synergy AI' },
              { label: 'Édition',  value: 'Automne 2026' },
            ].map(({ label, value }) => (
              <div key={label} className="px-0 py-6 border-r border-white/10 last:border-0 first:pl-0 pl-8">
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/25 mb-1">{label}</p>
                <p className="font-sans text-[13px] font-medium text-white/60">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          GRILLE DES ÉDITIONS — style Barnes /magazines.html
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-magazine-ivory border-b border-magazine-black/8">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-20">

          <div className="flex items-end justify-between mb-12 border-b border-magazine-black/10 pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-black/30 mb-3">
                Nos éditions
              </p>
              <h2
                className="font-sans font-bold text-magazine-black"
                style={{ fontSize: 'clamp(26px,3vw,42px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                Tous les magazines
              </h2>
            </div>
            <Link
              href={`/${locale}/intelligence/subscribe`}
              className="hidden md:inline-flex items-center gap-2 border border-magazine-black/15 text-magazine-black/50 font-mono text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 hover:border-magazine-black/40 hover:text-magazine-black transition-all whitespace-nowrap"
            >
              {t('subscribe')} <ArrowUpRight size={11} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {EDITIONS.map((ed) => (
              <div key={ed.num} className="group flex flex-col gap-0">
                {/* Couverture */}
                <div className="relative aspect-[3/4] bg-magazine-black overflow-hidden border border-magazine-black/10">
                  {ed.image ? (
                    <Image
                      src={ed.image}
                      alt={`The AEGRYN Report ${ed.year}`}
                      fill
                      className="object-cover opacity-90 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col justify-between p-6">
                      <div>
                        <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-white/15 mb-2">
                          {ed.season}
                        </p>
                        <div className="w-5 h-px bg-white/10" />
                      </div>
                      <div>
                        <p
                          className="font-sans font-bold text-white/20 leading-[0.9]"
                          style={{ fontSize: 28, letterSpacing: '-0.025em' }}
                        >
                          The<br />AEGRYN<br />{ed.year}
                        </p>
                        <p className="font-mono text-[7px] tracking-[0.18em] uppercase text-white/12 mt-3">
                          En préparation
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Overlay numéro */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="font-mono text-[9px] tracking-[0.08em] text-white/30 bg-magazine-black/60 px-2 py-1">
                      N°{ed.num}
                    </span>
                  </div>
                </div>

                {/* Légende */}
                <div className="pt-4 pb-2 flex flex-col gap-1">
                  <p className="font-mono text-[9px] tracking-[0.20em] uppercase text-magazine-black/35">
                    {ed.tag}
                  </p>
                  <p className="font-sans font-semibold text-magazine-black text-[15px] leading-snug">
                    Édition {ed.year}
                  </p>
                </div>

                {/* CTA */}
                <Link
                  href={`/${locale}${ed.href}`}
                  className={`mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] border-b pb-0.5 transition-colors self-start ${
                    ed.available
                      ? 'text-magazine-black border-magazine-black/20 hover:border-magazine-black'
                      : 'text-magazine-black/25 border-magazine-black/10 pointer-events-none'
                  }`}
                >
                  {ed.available ? 'Explorer ce numéro' : 'En préparation'} {ed.available && <ArrowUpRight size={10} />}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SOMMAIRE ÉDITORIAL — grille articles avec catégories
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-magazine-white border-b border-magazine-black/8">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-24">

          <div className="flex items-end justify-between mb-14 border-b border-magazine-black/10 pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-black/30 mb-3">
                Édition 2026 — Au sommaire
              </p>
              <h2
                className="font-sans font-bold text-magazine-black"
                style={{ fontSize: 'clamp(26px,3vw,42px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                The State of European Tech M&A
              </h2>
            </div>
            <Link
              href={`/${locale}/intelligence/report/2026`}
              className="hidden md:inline-flex items-center gap-2 bg-magazine-black text-white font-mono text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 hover:bg-magazine-black/80 transition-colors whitespace-nowrap"
            >
              {t('readOnline')} <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* Grille articles — 2 cols sur md, 4 sur xl */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-magazine-black/8">
            {SOMMAIRE.flatMap((sec) =>
              sec.articles.map((article) => (
                <article key={article.title} className="bg-magazine-white group flex flex-col">
                  {/* Visuel article */}
                  <div className="relative aspect-[4/3] bg-magazine-ivory overflow-hidden">
                    {article.image ? (
                      <Image
                        src={article.image}
                        alt={article.title}
                        fill
                        className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-end p-5">
                        <span className="font-mono text-[9px] text-magazine-black/20 uppercase tracking-[0.15em]">
                          {sec.section}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="font-mono text-[8px] tracking-[0.20em] uppercase text-magazine-black/50 bg-magazine-white/85 px-2 py-1">
                        {sec.section}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-7 flex flex-col flex-1 gap-3">
                    <h3 className="font-sans font-bold text-magazine-black text-[17px] leading-snug tracking-[-0.01em]">
                      {article.title}
                    </h3>
                    <p className="font-sans text-[13px] text-magazine-black/55 leading-[1.7] flex-1">
                      {article.excerpt}
                    </p>
                    <Link
                      href={`/${locale}${article.href}`}
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-magazine-black border-b border-magazine-black/20 pb-0.5 hover:border-magazine-black transition-colors self-start mt-2"
                    >
                      Lire <ArrowUpRight size={10} />
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          TEASER PROCHAIN NUMÉRO
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-magazine-black border-b border-white/5">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-14 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-white/20 mb-2">
              Prochain numéro
            </p>
            <p className="font-sans font-semibold text-white/50 text-[17px] tracking-[-0.01em]">
              Édition 2027 — En préparation
            </p>
            <p className="font-sans text-[13px] text-white/30 mt-1">
              Soyez notifié dès la publication.
            </p>
          </div>
          <Link
            href={`/${locale}/intelligence/subscribe`}
            className="shrink-0 inline-flex items-center gap-2 border border-white/15 text-white/50 font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 hover:border-white/40 hover:text-white/80 transition-all whitespace-nowrap"
          >
            {t('subscribe')} <ArrowUpRight size={11} />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          PRESSE — ils parlent de nous
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-magazine-white">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-24">

          <div className="flex items-end justify-between mb-14 border-b border-magazine-black/10 pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-black/30 mb-3">
                {tp('label')}
              </p>
              <h2
                className="font-sans font-bold text-magazine-black"
                style={{ fontSize: 'clamp(26px,3vw,42px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                {tp('title')}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-magazine-black/8">

            {/* Village de la Justice — Subblink */}
            <article className="bg-magazine-white p-10 md:p-12 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-magazine-black/25 font-bold">
                  Village de la Justice
                </span>
                <span className="w-1 h-1 rounded-full bg-magazine-black/15" />
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-magazine-accent">
                  Subblink
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-sans font-bold text-magazine-black text-[21px] leading-snug tracking-[-0.015em] mb-6">
                  {tp('subblink.title')}
                </h3>
                <p className="text-[15px] text-magazine-black/55 leading-[1.85] italic border-l-2 border-magazine-accent pl-5 mb-5">
                  {tp('subblink.excerpt')}
                </p>
                <p className="font-mono text-[11px] text-magazine-black/30 leading-relaxed">
                  {tp('subblink.context')}
                </p>
              </div>
              <a
                href="https://www.village-justice.com/articles/village-justice-vous-propose-faire-auditer-tous-vos-contrats-obtenir-score-des,57640.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-magazine-black border-b border-magazine-black/20 pb-0.5 hover:border-magazine-black transition-colors self-start"
              >
                {tp('readArticle')} <ExternalLink size={10} />
              </a>
            </article>

            {/* Gala — Neediu */}
            <article className="bg-magazine-ivory p-10 md:p-12 flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-magazine-black/25 font-bold">
                  Gala
                </span>
                <span className="w-1 h-1 rounded-full bg-magazine-black/15" />
                <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-magazine-accent">
                  Neediu
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-sans font-bold text-magazine-black text-[21px] leading-snug tracking-[-0.015em] mb-6">
                  {tp('neediu.title')}
                </h3>
                <p className="text-[15px] text-magazine-black/55 leading-[1.85] italic border-l-2 border-magazine-accent pl-5 mb-5">
                  {tp('neediu.excerpt')}
                </p>
                <p className="font-mono text-[11px] text-magazine-black/30 leading-relaxed">
                  {tp('neediu.context')}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-magazine-black/20 self-start">
                {tp('videoAvailable')}
              </span>
            </article>

          </div>
        </div>
      </section>

    </main>
  )
}
