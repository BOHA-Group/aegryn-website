import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { IssueCard }       from '@/components/magazine/IssueCard'
import { NewsletterBlock } from '@/components/magazine/NewsletterBlock'
import { ISSUE_01 }        from '@/content/magazine/issue-01/meta'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.report.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  { canonical: `/${locale}/magazine` },
    openGraph:   { title: t('title'), description: t('description'), type: 'website' },
  }
}

const ALL_ISSUES = [ISSUE_01]

export default async function MagazineHubPage({ params }: Props) {
  const { locale } = await params
  const tHub = await getTranslations({ locale, namespace: 'magazine.hub' })

  return (
    <main className="min-h-screen bg-magazine-white">

      {/* ── Hero header ── */}
      <div className="max-w-magazine mx-auto px-6 md:px-[120px] pt-32 pb-20">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">
          AEGRYN
        </p>
        <div className="grid md:grid-cols-[3fr_2fr] gap-16 items-end">
          <div>
            <h1
              className="font-sans font-bold text-magazine-black mb-6"
              style={{ fontSize: 'clamp(40px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em' }}
            >
              {tHub('title')}
            </h1>
            <p className="text-body-mag text-magazine-black/60 max-w-prose leading-[1.75]">
              {tHub('desc')}
            </p>
          </div>
          {/* Fréquence / charte éditoriale */}
          <div className="space-y-4 border-l border-magazine-black/10 pl-10">
            {[
              { label: tHub('charteFreqLabel'), val: tHub('charteFreqVal') },
              { label: tHub('charteLangLabel'), val: tHub('charteLangVal') },
              { label: tHub('charteAccesLabel'), val: tHub('charteAccesVal') },
            ].map(r => (
              <div key={r.label}>
                <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-magazine-black/30">{r.label}</p>
                <p className="font-sans font-semibold text-magazine-black text-[13px]">{r.val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Issues list ── */}
      <div className="max-w-magazine mx-auto px-6 md:px-[120px] pb-24">
        <div className="border-t border-magazine-black/10 pt-12 space-y-8">
          {ALL_ISSUES.map(issue => (
            <IssueCard
              key={issue.slug}
              issue={issue}
              locale={locale}
              labelSpecial={tHub('cardSpecialEdition')}
              labelReadOnline={tHub('readOnline')}
              labelFlipbook={tHub('downloadPdf')}
              labelSubscribe={tHub('subscribe')}
              labelComingSoon={tHub('comingSoon')}
            />
          ))}
        </div>
      </div>

      {/* ── Prochains numéros ── */}
      <div className="border-t border-magazine-black/8 bg-magazine-white">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { issue: 'Issue 02', date: tHub('issue02Date'), theme: tHub('issue02Theme'), desc: tHub('issue02Desc') },
              { issue: 'Issue 03', date: tHub('issue03Date'), theme: tHub('issue03Theme'), desc: tHub('issue03Desc') },
              { issue: 'Issue 04', date: tHub('issue04Date'), theme: tHub('issue04Theme'), desc: tHub('issue04Desc') },
            ].map(n => (
              <div key={n.issue} className="border-l-2 border-magazine-black/10 pl-6 py-2">
                <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-magazine-black/30 mb-1">{n.issue} — {n.date}</p>
                <p className="font-sans font-semibold text-magazine-black text-[15px] mb-2">{n.theme}</p>
                <p className="text-label-mag text-magazine-black/50 leading-relaxed">{n.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Contact / Abonnement — style Barnes ivoire ── */}
      <div className="border-t border-magazine-black/8 bg-magazine-cream">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-24">
          <div className="grid md:grid-cols-[3fr_2fr] gap-16 items-start">

            {/* Texte éditorial */}
            <div>
              <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-magazine-accent mb-6">
                {tHub('contactLabel')}
              </p>
              <h2
                className="font-sans font-bold text-magazine-black mb-6"
                style={{ fontSize: 'clamp(28px,4vw,52px)', lineHeight: 1.08, letterSpacing: '-0.02em' }}
              >
                {tHub('subscribeTitle')}
              </h2>
              <p className="text-body-mag text-magazine-black/60 leading-[1.75] mb-8 max-w-prose">
                {tHub('subscribeBody')}
              </p>
              <div className="space-y-3 mb-10">
                {[
                  tHub('subscribeBullet1'),
                  tHub('subscribeBullet2'),
                  tHub('subscribeBullet3'),
                ].map(item => (
                  <div key={item} className="flex items-start gap-3">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-magazine-accent flex-shrink-0" />
                    <p className="text-label-mag text-magazine-black/60">{item}</p>
                  </div>
                ))}
              </div>
              <NewsletterBlock
                placeholder={tHub('subscribePlaceholder')}
                cta={tHub('subscribeCta')}
                successMsg={tHub('subscribeSuccess')}
                errorMsg={tHub('subscribeError')}
              />
            </div>

            {/* Contact direct */}
            <div className="border border-magazine-black/12 p-8 bg-magazine-white">
              <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-magazine-accent mb-6">
                {tHub('contactEditLabel')}
              </p>
              <p className="font-sans font-semibold text-magazine-black text-[15px] mb-4 leading-snug">
                {tHub('contactEditTitle')}
              </p>
              <p className="text-label-mag text-magazine-black/50 leading-relaxed mb-8">
                {tHub('contactEditBody')}
              </p>
              <a
                href="mailto:contact@boha-group.com?subject=Aegryn Magazine"
                className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] uppercase text-magazine-black/60 border border-magazine-black/20 px-5 py-3 hover:border-magazine-accent hover:text-magazine-accent transition-colors"
              >
                {tHub('contactEditCta')}
              </a>
              <div className="mt-8 pt-8 border-t border-magazine-black/8">
                <p className="font-mono text-[8px] tracking-[0.16em] uppercase text-magazine-black/30 mb-2">{tHub('cifsLabel')}</p>
                <p className="text-label-mag text-magazine-black/50 leading-relaxed mb-4">
                  {tHub('cifsBody')}
                </p>
                <a
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] uppercase bg-magazine-black text-magazine-white px-5 py-3 font-bold hover:bg-magazine-accent hover:text-magazine-black transition-colors"
                >
                  {tHub('cifsCta')}
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Footer mag ── */}
      <div className="border-t border-magazine-black/8 bg-magazine-white">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-8 flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-black/25">
            {tHub('footerLegal')}
          </p>
          <p className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-black/25">
            {tHub('footerCopyright')}
          </p>
        </div>
      </div>

    </main>
  )
}
