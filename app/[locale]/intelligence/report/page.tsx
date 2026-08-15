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
  const th = await getTranslations({ locale, namespace: 'intelligence.hub' })
  const tp = await getTranslations({ locale, namespace: 'intelligence.press' })

  return (
    <main className="min-h-screen bg-magazine-white">
      <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-32">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">
          AEGRYN Intelligence
        </p>
        <h1
          className="font-sans font-bold text-magazine-black mb-12"
          style={{ fontSize: 'clamp(40px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {th('reportLabel')}
        </h1>

        {/* Edition 2026 */}
        <div className="border-t border-magazine-black/10 pt-12">
          <Link
            href={`./${locale}/intelligence/report/2026`}
            className="group flex flex-col md:flex-row md:items-start gap-8 hover:opacity-80 transition-opacity"
          >
            <div className="shrink-0">
              <div className="w-48 h-64 bg-magazine-black flex flex-col justify-between p-6">
                <p className="text-label-mag text-magazine-white/40 uppercase tracking-[0.15em]">First Edition</p>
                <div>
                  <p className="font-sans font-bold text-magazine-white leading-[0.92]"
                    style={{ fontSize: 'clamp(20px,2.5vw,28px)', letterSpacing: '-0.02em', fontWeight: 800 }}>
                    The<br />AEGRYN<br />2026
                  </p>
                  <div className="mt-4 w-8 h-px bg-magazine-accent" />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between py-2">
              <div>
                <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-3">
                  Autumn 2026 · Annual
                </p>
                <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-4">
                  The State of European Tech M&A
                </h2>
                <p className="text-body-mag text-magazine-black/60 max-w-prose leading-[1.75] mb-8">
                  First edition. 8 sections. Data from SEG, Aventis Advisors, and Synergy AI. Our certification protocol, deal analysis, buyer landscape, and perspectives for 2027 — in one reference document.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href={`/${locale}/intelligence/report/2026`}
                  className="inline-flex items-center gap-2 bg-magazine-black text-magazine-white font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-6 py-3.5 hover:bg-magazine-black/80 transition-colors"
                >
                  {t('readOnline')} <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/${locale}/intelligence/report/2026/pdf`}
                  className="inline-flex items-center gap-2 border border-magazine-black/20 text-magazine-black font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-6 py-3.5 hover:border-magazine-black/60 transition-colors"
                >
                  {t('downloadPdf')} <ArrowUpRight size={13} />
                </Link>
                <Link
                  href={`/${locale}/intelligence/subscribe`}
                  className="inline-flex items-center gap-2 border border-magazine-black/20 text-magazine-black font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-6 py-3.5 hover:border-magazine-black/60 transition-colors"
                >
                  {t('subscribe')} <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          </Link>
        </div>

        <p className="text-label-mag text-magazine-black/25 uppercase tracking-[0.1em] mt-24">
          Next edition — Autumn 2027
        </p>
      </div>

      {/* They talk about us */}
      <div className="border-t border-magazine-black/10 bg-magazine-ivory">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-24">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-4">
            {tp('label')}
          </p>
          <h2
            className="font-sans font-bold text-magazine-black mb-16"
            style={{ fontSize: 'clamp(26px,3.5vw,48px)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            {tp('title')}
          </h2>

          <div className="grid md:grid-cols-2 gap-px bg-magazine-black/10">

            {/* Village de la Justice — subblink */}
            <article className="bg-magazine-ivory p-10 flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-label-mag font-sans font-bold uppercase tracking-[0.14em] text-magazine-black/30">
                    Village de la Justice
                  </span>
                  <span className="w-1 h-1 rounded-full bg-magazine-black/20" />
                  <span className="text-label-mag text-magazine-accent uppercase tracking-[0.12em]">
                    Subblink
                  </span>
                </div>
                <h3 className="font-sans font-bold text-magazine-black text-[20px] leading-snug tracking-[-0.01em] mb-4">
                  {tp('subblink.title')}
                </h3>
                <p className="text-body-mag text-magazine-black/60 leading-[1.75] italic border-l-2 border-magazine-accent pl-5">
                  {tp('subblink.excerpt')}
                </p>
                <p className="text-label-mag text-magazine-black/40 mt-4 leading-relaxed">
                  {tp('subblink.context')}
                </p>
              </div>
              <a
                href="https://www.village-justice.com/articles/village-justice-vous-propose-faire-auditer-tous-vos-contrats-obtenir-score-des,57640.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-label-mag font-sans font-semibold uppercase tracking-[0.12em] text-magazine-black border-b border-magazine-black/20 pb-1 hover:border-magazine-black transition-colors self-start"
              >
                {tp('readArticle')} <ExternalLink size={11} />
              </a>
            </article>

            {/* Gala — neediu */}
            <article className="bg-magazine-ivory p-10 flex flex-col justify-between gap-8">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-label-mag font-sans font-bold uppercase tracking-[0.14em] text-magazine-black/30">
                    Gala
                  </span>
                  <span className="w-1 h-1 rounded-full bg-magazine-black/20" />
                  <span className="text-label-mag text-magazine-accent uppercase tracking-[0.12em]">
                    Neediu
                  </span>
                </div>
                <h3 className="font-sans font-bold text-magazine-black text-[20px] leading-snug tracking-[-0.01em] mb-4">
                  {tp('neediu.title')}
                </h3>
                <p className="text-body-mag text-magazine-black/60 leading-[1.75] italic border-l-2 border-magazine-accent pl-5">
                  {tp('neediu.excerpt')}
                </p>
                <p className="text-label-mag text-magazine-black/40 mt-4 leading-relaxed">
                  {tp('neediu.context')}
                </p>
              </div>
              <div className="inline-flex items-center gap-2 text-label-mag font-sans font-semibold uppercase tracking-[0.12em] text-magazine-black/30 self-start">
                {tp('videoAvailable')}
              </div>
            </article>

          </div>
        </div>
      </div>
    </main>
  )
}
