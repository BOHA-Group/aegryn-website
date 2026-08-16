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
  const t = await getTranslations({ locale, namespace: 'intelligence.report.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  { canonical: `/${locale}/intelligence/report` },
  }
}

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

      {/* ── HERO COVER — full-bleed dark panel, Barnes-style ── */}
      <section className="bg-magazine-black pt-24 pb-0">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px]">

          {/* Top bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-12">
            <span className="font-mono text-[10px] tracking-[0.30em] uppercase text-white/30">
              AEGRYN Intelligence
            </span>
            <span className="font-mono text-[10px] tracking-[0.20em] uppercase text-white/20">
              Annual Publication
            </span>
          </div>

          {/* Main title block */}
          <div className="grid md:grid-cols-[1fr_auto] gap-12 items-end pb-16">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-accent mb-8">
                {t('edition2026')}
              </p>
              <h1
                className="font-sans font-bold text-white leading-[0.92] mb-8"
                style={{ fontSize: 'clamp(48px,7vw,96px)', letterSpacing: '-0.03em' }}
              >
                {t('title')}<br />
                <span className="text-white/30">{t('subtitle')}</span>
              </h1>
              <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/40 italic">
                &ldquo;{t('tagline')}&rdquo;
              </p>
            </div>

            {/* Cover thumbnail */}
            <div className="shrink-0 hidden md:block">
              <div className="w-[220px] h-[300px] border border-white/10 bg-white/[0.03] flex flex-col justify-between p-7 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-magazine-accent/5 to-transparent pointer-events-none" />
                <div>
                  <p className="font-mono text-[8px] tracking-[0.25em] uppercase text-white/20 mb-1">First Edition</p>
                  <div className="w-6 h-px bg-magazine-accent mb-4" />
                </div>
                <div>
                  <p
                    className="font-sans font-bold text-white leading-[0.9]"
                    style={{ fontSize: 28, letterSpacing: '-0.02em' }}
                  >
                    The<br />AEGRYN<br />2026
                  </p>
                  <p className="font-mono text-[8px] tracking-[0.15em] uppercase text-white/25 mt-4">
                    European Tech M&A
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA strip — sits at the bottom of the dark section */}
          <div className="border-t border-white/10 py-6 flex flex-wrap items-center gap-4">
            <Link
              href={`/${locale}/intelligence/report/2026`}
              className="inline-flex items-center gap-2 bg-magazine-accent text-magazine-black font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 hover:bg-magazine-accent/90 transition-colors font-semibold"
            >
              {t('readOnline')} <ArrowUpRight size={12} />
            </Link>
            <Link
              href={`/${locale}/intelligence/report/2026/pdf`}
              className="inline-flex items-center gap-2 border border-white/20 text-white/70 font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 hover:border-white/50 hover:text-white transition-all"
            >
              {t('downloadPdf')} <ArrowUpRight size={12} />
            </Link>
            <Link
              href={`/${locale}/intelligence/subscribe`}
              className="inline-flex items-center gap-2 border border-white/10 text-white/40 font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 hover:border-white/30 hover:text-white/70 transition-all ml-auto"
            >
              {t('subscribe')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── EDITION DETAILS — ivory band ── */}
      <section className="bg-magazine-ivory border-b border-magazine-black/8">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px]">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-magazine-black/10">
            {[
              { label: 'Format',    value: 'Annual · Digital + Print' },
              { label: 'Sections', value: '8 chapters' },
              { label: 'Data',     value: 'SEG · Aventis · Synergy AI' },
              { label: 'Edition',  value: 'Autumn 2026' },
            ].map(({ label, value }) => (
              <div key={label} className="px-8 py-7 first:pl-0 last:pr-0">
                <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-magazine-black/30 mb-1">{label}</p>
                <p className="font-sans text-[13px] font-semibold text-magazine-black">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ISSUE DESCRIPTION ── */}
      <section className="bg-magazine-white border-b border-magazine-black/8">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-20">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16 items-start">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-accent mb-3">
                {t('edition2026')}
              </p>
              <h2
                className="font-sans font-bold text-magazine-black leading-[1.05]"
                style={{ fontSize: 'clamp(28px,3.5vw,48px)', letterSpacing: '-0.02em' }}
              >
                The State of<br />European Tech M&A
              </h2>
            </div>
            <div className="pt-1">
              <p className="text-body-mag text-magazine-black/60 leading-[1.75] mb-8 max-w-prose">
                First edition. 8 sections. Data from SEG, Aventis Advisors, and Synergy AI. Our certification protocol, deal analysis, buyer landscape, and perspectives for 2027 — in one reference document.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-magazine-black/8">
                {[
                  { n: '01', label: 'Marché M&A' },
                  { n: '02', label: 'Certification CIFS' },
                  { n: '03', label: 'Analyse deals' },
                  { n: '04', label: 'Perspectives 2027' },
                ].map(({ n, label }) => (
                  <div key={n} className="bg-magazine-white px-5 py-4">
                    <p className="font-mono text-[9px] text-magazine-accent font-bold mb-1">{n}</p>
                    <p className="font-sans text-[12px] text-magazine-black/60">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NEXT EDITION TEASER ── */}
      <section className="bg-magazine-ivory border-b border-magazine-black/8">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-magazine-black/25 mb-1">
              Next edition
            </p>
            <p className="font-sans text-[15px] text-magazine-black/40 font-medium">
              Autumn 2027 — En préparation
            </p>
          </div>
          <Link
            href={`/${locale}/intelligence/subscribe`}
            className="inline-flex items-center gap-2 border border-magazine-black/15 text-magazine-black/50 font-mono text-[10px] uppercase tracking-[0.18em] px-5 py-2.5 hover:border-magazine-black/40 hover:text-magazine-black transition-all whitespace-nowrap"
          >
            {t('subscribe')} <ArrowUpRight size={11} />
          </Link>
        </div>
      </section>

      {/* ── PRESS — ils parlent de nous ── */}
      <section className="bg-magazine-white">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-24">

          <div className="flex items-end justify-between mb-16 border-b border-magazine-black/10 pb-8">
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-magazine-black/30 mb-3">
                {tp('label')}
              </p>
              <h2
                className="font-sans font-bold text-magazine-black"
                style={{ fontSize: 'clamp(26px,3.5vw,48px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                {tp('title')}
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-px bg-magazine-black/8">

            {/* Village de la Justice — subblink */}
            <article className="bg-magazine-white p-10 flex flex-col gap-8">
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
                <h3 className="font-sans font-bold text-magazine-black text-[20px] leading-snug tracking-[-0.01em] mb-5">
                  {tp('subblink.title')}
                </h3>
                <p className="text-[15px] text-magazine-black/55 leading-[1.8] italic border-l-2 border-magazine-accent pl-5 mb-4">
                  {tp('subblink.excerpt')}
                </p>
                <p className="font-mono text-[11px] text-magazine-black/35 leading-relaxed">
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

            {/* Gala — neediu */}
            <article className="bg-magazine-ivory p-10 flex flex-col gap-8">
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
                <h3 className="font-sans font-bold text-magazine-black text-[20px] leading-snug tracking-[-0.01em] mb-5">
                  {tp('neediu.title')}
                </h3>
                <p className="text-[15px] text-magazine-black/55 leading-[1.8] italic border-l-2 border-magazine-accent pl-5 mb-4">
                  {tp('neediu.excerpt')}
                </p>
                <p className="font-mono text-[11px] text-magazine-black/35 leading-relaxed">
                  {tp('neediu.context')}
                </p>
              </div>
              <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-magazine-black/25 self-start">
                {tp('videoAvailable')}
              </span>
            </article>

          </div>
        </div>
      </section>

    </main>
  )
}
