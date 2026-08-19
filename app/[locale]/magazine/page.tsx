import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { IssueCard }       from '@/components/magazine/IssueCard'
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
    <main className="min-h-screen bg-magazine-ivory">
      <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-32">

        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">
          AEGRYN
        </p>
        <h1
          className="font-sans font-bold text-magazine-black mb-6"
          style={{ fontSize: 'clamp(40px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {tHub('title')}
        </h1>
        <p className="text-body-mag text-magazine-black/60 max-w-prose mb-16">
          {tHub('desc')}
        </p>

        <div className="border-t border-magazine-black/10 pt-12 space-y-8">
          {ALL_ISSUES.map(issue => (
            <IssueCard key={issue.slug} issue={issue} />
          ))}
        </div>

      </div>
    </main>
  )
}
