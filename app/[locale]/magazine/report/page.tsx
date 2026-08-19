import Link              from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { ArrowUpRight, ExternalLink } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.report.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  { canonical: `/${locale}/magazine/report` },
  }
}

/* ─── sommaire éditorial édition 2027 ─────────────────────────────────────── */
const SOMMAIRE = [
  {
    section: 'Tech M&A Market',
    title: 'The State of European Tech M&A 2027',
    excerpt: 'Volumes, multiples, geographies. H1–H2 2026 data. SEG, Aventis, Synergy AI.',
    anchor: '#s-market',
  },
  {
    section: 'CIFS Certification',
    title: 'The CIFS Protocol — Code, IP, Finance, Security',
    excerpt: 'Our certification methodology explained. Four dimensions, one objective grade.',
    anchor: '#s-perspective',
  },
  {
    section: 'Deal Watch',
    title: 'Five Transactions Analysed Under the CIFS Lens',
    excerpt: 'H1 2026 notable deals: what worked, estimated grade, lessons for sellers.',
    anchor: '#s-deals',
  },
  {
    section: 'Buyer Landscape',
    title: 'Who Is Buying European Tech in 2027',
    excerpt: 'PE, search funds, family offices — their real criteria and appetite for certified assets.',
    anchor: '#s-buyers',
  },
]

export default async function ReportIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'magazine.report' })
  const tp = await getTranslations({ locale, namespace: 'magazine.press' })

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
                First Edition — January 2027
              </p>
              <h1
                className="font-sans font-bold text-white leading-[0.90] mb-10"
                style={{ fontSize: 'clamp(52px,7.5vw,108px)', letterSpacing: '-0.035em' }}
              >
                Aegryn Magazine<br />
                <span className="text-white/25">{t('subtitle')}</span>
              </h1>
              <p className="font-mono text-[12px] tracking-[0.20em] uppercase text-white/35 italic mb-12">
                &ldquo;{t('tagline')}&rdquo;
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/${locale}/magazine/report/2027`}
                  className="inline-flex items-center gap-2 bg-magazine-accent text-magazine-black font-mono text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 hover:bg-magazine-accent/90 transition-colors font-semibold"
                >
                  {t('readOnline')} <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/${locale}/magazine/report/2027/pdf`}
                  className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-mono text-[11px] uppercase tracking-[0.18em] px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
                >
                  {t('downloadPdf')} <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>

            {/* Couverture grand format — Barnes style */}
            <div className="shrink-0 hidden md:block self-end">
              <div className="w-[280px] h-[380px] relative overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-magazine-black/90 flex flex-col justify-between p-8 z-20">
                  <div>
                    <p className="font-mono text-[8px] tracking-[0.30em] uppercase text-white/20 mb-2">
                      First Edition
                    </p>
                    <div className="w-8 h-px bg-magazine-accent mb-1" />
                  </div>
                  <div>
                    <p
                      className="font-sans font-bold text-white leading-[0.88] mb-5"
                      style={{ fontSize: 36, letterSpacing: '-0.03em' }}
                    >
                      Aegryn<br />Magazine<br />
                      <span className="text-white/30">2027</span>
                    </p>
                    <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-white/20 mb-3">
                      European Tech M&A<br />Intelligence
                    </p>
                    <div className="inline-block border border-magazine-accent/40 px-2.5 py-1">
                      <span className="font-mono text-[8px] tracking-[0.12em] text-magazine-accent">
                        January 2027
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
              { label: 'Format',     value: 'Annual · Digital + Print' },
              { label: 'Sections',   value: '8 chapters' },
              { label: 'Data',       value: 'SEG · Aventis · Synergy AI' },
              { label: 'Publication', value: 'January 2027' },
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
          ÉDITION — Barnes single-issue style
          Une seule édition, mise en valeur comme Barnes
          présente son édition annuelle flagship
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-magazine-ivory border-b border-magazine-black/8">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-20">

          <div className="flex items-end justify-between mb-12 border-b border-magazine-black/10 pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-black/30 mb-3">
                Aegryn Magazine
              </p>
              <h2
                className="font-sans font-bold text-magazine-black"
                style={{ fontSize: 'clamp(26px,3vw,42px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                First Edition
              </h2>
            </div>
            <Link
              href={`/${locale}/magazine/subscribe`}
              className="hidden md:inline-flex items-center gap-2 border border-magazine-black/15 text-magazine-black/50 font-mono text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 hover:border-magazine-black/40 hover:text-magazine-black transition-all whitespace-nowrap"
            >
              {t('subscribe')} <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* Carte unique — pleine largeur, style Barnes flagship */}
          <div className="grid md:grid-cols-[2fr_3fr] gap-0 border border-magazine-black/10">

            {/* Colonne cover */}
            <div className="bg-magazine-black flex flex-col justify-between p-10 md:p-14 min-h-[420px]">
              <div>
                <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-magazine-accent mb-3">
                  N°01 · January 2027
                </p>
                <div className="w-10 h-px bg-magazine-accent mb-8" />
              </div>
              <div>
                <p
                  className="font-sans font-bold text-white leading-[0.88] mb-6"
                  style={{ fontSize: 'clamp(40px,5vw,72px)', letterSpacing: '-0.03em' }}
                >
                  Aegryn<br />Magazine
                </p>
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/30 mb-6">
                  European Tech M&A Intelligence
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-magazine-accent border border-magazine-accent/30 px-2.5 py-1">
                    Annual · Digital
                  </span>
                  <span className="font-mono text-[8px] tracking-[0.12em] uppercase text-white/30 border border-white/10 px-2.5 py-1">
                    First Edition
                  </span>
                </div>
              </div>
            </div>

            {/* Colonne metadata + CTA */}
            <div className="bg-magazine-white flex flex-col justify-between p-10 md:p-14">
              <div>
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-magazine-black/30 mb-6">
                  Au programme
                </p>
                <ul className="space-y-4">
                  {[
                    'The State of European Tech M&A — 2026 Data',
                    'The AI Effect on Asset Valuations',
                    'The AEGRYN Perspective — CIFS Protocol',
                    'Deal Watch H1 2026 — 5 Transactions Analysed',
                    'Who Is Buying European Tech in 2027',
                    'Perspectives 2027 — Three Forces Reshaping the Market',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[13px] text-magazine-black/65 font-sans leading-snug">
                      <span className="mt-1.5 w-1 h-1 bg-magazine-accent shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-10 border-t border-magazine-black/8 mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${locale}/magazine/report/2027`}
                  className="inline-flex items-center gap-2 bg-magazine-black text-white font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 hover:bg-magazine-black/80 transition-colors"
                >
                  {t('readOnline')} <ArrowUpRight size={11} />
                </Link>
                <Link
                  href={`/${locale}/magazine/report/2027/pdf`}
                  className="inline-flex items-center gap-2 border border-magazine-black/15 text-magazine-black/60 font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 hover:border-magazine-black/40 hover:text-magazine-black transition-all"
                >
                  {t('downloadPdf')} <ArrowUpRight size={11} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SOMMAIRE ÉDITORIAL — grille articles
      ══════════════════════════════════════════════════════════ */}
      <section className="bg-magazine-white border-b border-magazine-black/8">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-24">

          <div className="flex items-end justify-between mb-14 border-b border-magazine-black/10 pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-black/30 mb-3">
                First Edition — Au sommaire
              </p>
              <h2
                className="font-sans font-bold text-magazine-black"
                style={{ fontSize: 'clamp(26px,3vw,42px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                The State of European Tech M&A
              </h2>
            </div>
            <Link
              href={`/${locale}/magazine/report/2027`}
              className="hidden md:inline-flex items-center gap-2 bg-magazine-black text-white font-mono text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 hover:bg-magazine-black/80 transition-colors whitespace-nowrap"
            >
              {t('readOnline')} <ArrowUpRight size={11} />
            </Link>
          </div>

          {/* Grille articles — 2 cols sur md, 4 sur xl */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-px bg-magazine-black/8">
            {SOMMAIRE.map((item) => (
              <article key={item.title} className="bg-magazine-white group flex flex-col">
                {/* Visuel placeholder typographique */}
                <div className="relative aspect-[4/3] bg-magazine-ivory overflow-hidden flex items-end p-5">
                  <span className="font-mono text-[9px] text-magazine-black/20 uppercase tracking-[0.15em]">
                    {item.section}
                  </span>
                  <div className="absolute top-4 left-4 z-10">
                    <span className="font-mono text-[8px] tracking-[0.20em] uppercase text-magazine-black/50 bg-magazine-white/85 px-2 py-1">
                      {item.section}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-7 flex flex-col flex-1 gap-3">
                  <h3 className="font-sans font-bold text-magazine-black text-[17px] leading-snug tracking-[-0.01em]">
                    {item.title}
                  </h3>
                  <p className="font-sans text-[13px] text-magazine-black/55 leading-[1.7] flex-1">
                    {item.excerpt}
                  </p>
                  <Link
                    href={`/${locale}/magazine/report/2027${item.anchor}`}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-magazine-black border-b border-magazine-black/20 pb-0.5 hover:border-magazine-black transition-colors self-start mt-2"
                  >
                    Read <ArrowUpRight size={10} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
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
