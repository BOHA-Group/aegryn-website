import { getTranslations }   from 'next-intl/server'
import type { Metadata }      from 'next'
import {
  ReportNav,
  ReportCover,
  ReportEditorial,
  ReportMarket,
  ReportAIEffect,
  ReportPerspective,
  ReportDealWatch,
  ReportBuyerLandscape,
  ReportPerspectives,
  ReportIndex,
  ReportCTA,
} from '@/components/magazine/ReportClient'

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
    alternates: {
      canonical: `/${locale}/magazine/report/2026`,
      languages: {
        fr: '/fr/magazine/report/2026',
        en: '/en/magazine/report/2026',
        de: '/de/magazine/report/2026',
        es: '/es/magazine/report/2026',
        it: '/it/magazine/report/2026',
        nl: '/nl/magazine/report/2026',
      },
    },
    openGraph: {
      title:       t('title'),
      description: t('description'),
      type:        'article',
      publishedTime: '2027-01-01T00:00:00Z',
      authors:     ['AEGRYN'],
    },
  }
}

export default async function Report2026Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.report' })

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type':    'Report',
            name:       'Aegryn Magazine 2026 — European Tech M&A Intelligence',
            description: t('meta.description'),
            author:     { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            publisher:  { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            datePublished: '2027-01-01',
            inLanguage: 'en',
            url: `https://aegryn.com/${locale}/magazine/report/2026`,
          }),
        }}
      />

      <main>
        <ReportNav />
        <ReportCover    ctaScroll={t('scrollDown')} />
        <ReportEditorial />
        <ReportMarket />
        <ReportAIEffect />
        <ReportPerspective />
        <ReportDealWatch  disclaimer={t('disclaimer')} />
        <ReportBuyerLandscape />
        <ReportPerspectives />
        <ReportIndex      indexNote={t('indexNote')} />
        <ReportCTA
          title={t('ctaTitle')}
          sub={t('ctaSub')}
          line={t('ctaLine')}
          ctaEstimate={t('ctaEstimate')}
          ctaGrade={t('ctaGrade')}
        />
      </main>
    </>
  )
}
