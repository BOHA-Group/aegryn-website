import { notFound, redirect } from 'next/navigation'
import { getTranslations }    from 'next-intl/server'
import type { Metadata }      from 'next'
import type { MagazineIssue } from '@/lib/magazine/types'
import { canAccessIssue }     from '@/lib/magazineAccess'

import { ISSUE_01 }        from '@/content/magazine/issue-01/meta'
import { TOC_01 }          from '@/content/magazine/issue-01/toc'

import { MagazineNav }       from '@/components/magazine/MagazineNav'
import { AegrynCtaBlock }    from '@/components/magazine/AegrynCtaBlock'
import { IssueViewerTabs } from '@/components/magazine/IssueViewerTabs'

/* ── Issue registry ─────────────────────────────────────── */
function getIssue(slug: string): MagazineIssue | null {
  switch (slug) {
    case 'issue-01': return ISSUE_01
    default: return null
  }
}

type Props = { params: Promise<{ locale: string; issue: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, issue: issueSlug } = await params
  const issue = getIssue(issueSlug)
  if (!issue) return {}

  const title       = `${issue.title} | Aegryn Magazine`
  const description = issue.theme

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/magazine/${issue.slug}`,
      languages: {
        fr: `/fr/magazine/${issue.slug}`,
        en: `/en/magazine/${issue.slug}`,
        de: `/de/magazine/${issue.slug}`,
        es: `/es/magazine/${issue.slug}`,
        it: `/it/magazine/${issue.slug}`,
        nl: `/nl/magazine/${issue.slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type:          'article',
      publishedTime: `${issue.publishedAt}T00:00:00Z`,
      authors:       ['AEGRYN'],
    },
  }
}

export default async function IssuePage({ params }: Props) {
  const { locale, issue: issueSlug } = await params
  const issue = getIssue(issueSlug)
  if (!issue) notFound()

  /* ── Gate d'accès : public > early_access (cookie de déverrouillage) > preview > verrouillé ──
     Une issue non publique n'est accessible que via le lien d'accès anticipé envoyé
     par email (48h avant), ou depuis un environnement non-production (relecture interne). */
  const pad = String(issue.number).padStart(2, '0')
  if (!(await canAccessIssue(pad))) redirect(`/${locale}/magazine`)

  const t    = await getTranslations({ locale, namespace: 'magazine.report' })
  const tHub = await getTranslations({ locale, namespace: 'magazine.hub' })

  /* ── Nav : sections et articles exactement tels que dans le flipbook / web edition ── */
  const navSections = issue.sections.map(s => {
    const toc = TOC_01.find(t => t.id === s.id)
    return {
      ...s,
      pageRange: toc?.pageRange ?? s.pageRange,
      articles: toc?.articles.map(a => ({ slug: a.anchor, anchor: a.anchor, title: a.title, page: a.page })) ?? [],
    }
  })

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':    'https://schema.org',
            '@type':       'Report',
            name:          `Aegryn Magazine - ${issue.title}`,
            description:   issue.theme,
            author:        { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            publisher:     { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            datePublished: issue.publishedAt,
            inLanguage:    locale,
            url:           `https://aegryn.com/${locale}/magazine/${issue.slug}`,
          }),
        }}
      />

      {/* ── Layout 2 colonnes : sidebar fixe + contenu scrollable ── */}
      <div className="relative">
        <h1 className="sr-only">{`Aegryn Magazine - ${issue.title}`}</h1>
        {/* Sidebar Barnes verticale fixe */}
        <MagazineNav
          sections={navSections}
          issueNumber={issue.number}
          issueTitle={issue.title}
          issueSubtitle="January 2027"
          locale={locale}
          issueSlug={issue.slug}
          labelContents={tHub('navTableOfContents')}
          labelDownload={tHub('navDownloadPdf')}
        />

        {/* Contenu principal décalé de 240px sur desktop */}
        <main className="lg:ml-[240px] bg-magazine-ivory">

        {/* ── Flipbook (magazine a feuilleter) + Web Edition (meme contenu, article par article).
              La barre laterale MagazineNav navigue dans la web edition. Aucun contenu texte
              duplique en dehors de ces deux vues. ── */}
        {issue.slug === 'issue-01' && (
          <section id="s-flipbook">
            <IssueViewerTabs
              flipbookSrc="/api/magazine/issue-01/aegryn-magazine-issue-01_1.html"
              webSrc="/api/magazine/issue-01/aegryn-magazine-issue-01_web.html"
              issueLabel="January 2027 | Built to Last"
            />
          </section>
        )}

        {/* ── CTA ── */}
        <AegrynCtaBlock
          title={t('ctaTitle')}
          sub={t('ctaSub')}
          line={t('ctaLine')}
          ctaEstimate={t('ctaEstimate')}
          ctaGrade={t('ctaGrade')}
        />
        </main>
      </div>
    </>
  )
}
