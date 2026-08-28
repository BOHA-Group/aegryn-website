import { getTranslations }   from 'next-intl/server'
import type { Metadata }     from 'next'
import { IssueCard }           from '@/components/magazine/IssueCard'
import { IssueMiniCard }       from '@/components/magazine/IssueMiniCard'
import { NewsletterBlock }     from '@/components/magazine/NewsletterBlock'
import { PrintWishlistForm }   from '@/components/magazine/PrintWishlistForm'
import { ISSUE_01 }            from '@/content/magazine/issue-01/meta'
import { ISSUE_02 }            from '@/content/magazine/issue-02/meta'
import { ISSUE_03 }            from '@/content/magazine/issue-03/meta'
import { ISSUE_04 }            from '@/content/magazine/issue-04/meta'
import { createServiceClient } from '@/lib/supabase'

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

const ALL_ISSUES = [ISSUE_01, ISSUE_02, ISSUE_03, ISSUE_04]

async function getMagazineFlags(): Promise<Record<string, boolean>> {
  try {
    const supa = createServiceClient()
    const { data } = await supa.from('site_settings').select('key, value').like('key', 'magazine_%')
    const flags: Record<string, boolean> = {}
    for (const row of (data ?? [])) {
      flags[row.key] = row.value === true || row.value === 'true'
    }
    return flags
  } catch {
    return {}
  }
}

export default async function MagazineHubPage({ params }: Props) {
  const { locale } = await params
  const isPreview = process.env.VERCEL_ENV !== 'production'
  const INTEREST_KEYS = ['market', 'techAi', 'build', 'transaction', 'buyers', 'outlook', 'index', 'people', 'life'] as const
  const [tHub, tSub, flags] = await Promise.all([
    getTranslations({ locale, namespace: 'magazine.hub' }),
    getTranslations({ locale, namespace: 'magazine.subscribe' }),
    getMagazineFlags(),
  ])
  const labelsRaw = tSub.raw('interests')     as Record<string, string>
  const descsRaw  = tSub.raw('interestsDesc') as Record<string, string>
  const interests = INTEREST_KEYS.map(key => ({
    key,
    label: labelsRaw[key] ?? key,
    desc:  descsRaw[key]  ?? '',
  }))

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

      {/* ── Issues ── */}
      <div className="border-t border-magazine-black/10">
        {(() => {
          const featuredIssue = ALL_ISSUES.find(
            i => flags[`magazine_issue_${String(i.number).padStart(2,'0')}_featured`] ?? false
          ) ?? ALL_ISSUES[0]
          const pad = (n: number) => String(n).padStart(2,'0')

          return (
            <>
              {/* Hero — issue à la une */}
              <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-16">
                <IssueCard
                  issue={featuredIssue}
                  locale={locale}
                  labelSpecial={tHub('cardSpecialEdition')}
                  labelReadOnline={tHub('readOnline')}
                  labelDownloadPdf={tHub('downloadPdf')}
                  labelSubscribe={tHub('subscribe')}
                  labelComingSoon={tHub('comingSoon')}
                  isPublic={flags[`magazine_issue_${pad(featuredIssue.number)}_public`] ?? false}
                  isPreview={isPreview}
                />
              </div>

              {/* Carousel — toutes les issues, featured active au centre */}
              <div className="border-t border-magazine-black/8 bg-magazine-cream">
                <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-14">
                  <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30 mb-8">
                    {tHub('allIssuesLabel')}
                  </p>
                  <div className="flex items-end gap-5 overflow-x-auto pb-2">
                    {ALL_ISSUES.map(issue => (
                      <IssueMiniCard
                        key={issue.slug}
                        issue={issue}
                        locale={locale}
                        active={issue.slug === featuredIssue.slug}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )
        })()}
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
                href="mailto:media@boha-group.com?subject=Aegryn Magazine"
                className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] uppercase text-magazine-black/60 border border-magazine-black/20 px-5 py-3 hover:border-magazine-accent hover:text-magazine-accent transition-colors"
              >
                {tHub('contactEditCta')}
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* ── Wishlist édition papier (inline) ── */}
      <div className="border-t border-magazine-black/8 bg-magazine-ivory" id="wishlist">
        <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-24">
          <div className="grid md:grid-cols-[2fr_3fr] gap-16 items-start">

            {/* Intro */}
            <div className="md:sticky md:top-32">
              <p className="font-mono text-[8px] tracking-[0.24em] uppercase text-magazine-accent mb-6">
                {tSub('wishlistSectionLabel')}
              </p>
              <h2
                className="font-sans font-bold text-magazine-black mb-6"
                style={{ fontSize: 'clamp(24px,3.5vw,44px)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
              >
                {tSub('wishlistTitle')}
              </h2>
              <p className="text-sm text-magazine-black/60 leading-[1.75] mb-6">
                {tSub('wishlistDesc')}
              </p>
              <p className="text-[11px] text-magazine-black/35 leading-relaxed">
                {tSub('disclaimer')}
              </p>
            </div>

            {/* Formulaire */}
            <div className="bg-magazine-white border border-magazine-black/10 p-8">
              <PrintWishlistForm
                civilityLabel={tSub('civilityLabel')}
                civilityM={tSub('civilityM')}
                civilityMme={tSub('civilityMme')}
                firstNamePlaceholder={tSub('firstNamePlaceholder')}
                lastNamePlaceholder={tSub('lastNamePlaceholder')}
                emailPlaceholder={tSub('emailPlaceholder')}
                phonePlaceholder={tSub('phonePlaceholder')}
                companyPlaceholder={tSub('companyPlaceholder')}
                addressLabel={tSub('addressLabel')}
                addressPlaceholder={tSub('addressPlaceholder')}
                postalCodePlaceholder={tSub('postalCodePlaceholder')}
                cityPlaceholder={tSub('cityPlaceholder')}
                countryPlaceholder={tSub('countryPlaceholder')}
                interestsLabel={tSub('interestsLabel')}
                interests={interests}
                rgpdLabel={tSub('rgpdLabel')}
                legalNotice={tSub('legalNotice')}
                cta={tSub('cta')}
                successMsg={tSub('success')}
                errorMsg={tSub('error')}
                clientNote={tSub('clientNote')}
              />
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
