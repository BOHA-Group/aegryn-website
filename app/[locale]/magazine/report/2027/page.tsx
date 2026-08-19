import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import {
  ReportNav2027,
  Cover,
  Editorial,
  Market,
  AIEffect,
  Perspective,
  DealWatch,
  BuyerLandscape,
  Perspectives2028,
  AegrynIndex,
  CTA,
} from '@/components/magazine/editions/2027'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.report.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates: {
      canonical: `/${locale}/magazine/report/2027`,
      languages: {
        fr: '/fr/magazine/report/2027',
        en: '/en/magazine/report/2027',
        de: '/de/magazine/report/2027',
        es: '/es/magazine/report/2027',
        it: '/it/magazine/report/2027',
        nl: '/nl/magazine/report/2027',
      },
    },
    openGraph: {
      title:         t('title'),
      description:   t('description'),
      type:          'article',
      publishedTime: '2027-01-01T00:00:00Z',
      authors:       ['AEGRYN'],
    },
  }
}

export default async function Report2027Page({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.report' })

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context':    'https://schema.org',
            '@type':       'Report',
            name:          'Aegryn Magazine — First Edition, January 2027 — The State of European Tech M&A',
            description:   t('meta.description'),
            author:        { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            publisher:     { '@type': 'Organization', name: 'AEGRYN', url: 'https://aegryn.com' },
            datePublished: '2027-01-01',
            inLanguage:    'en',
            url:           `https://aegryn.com/${locale}/magazine/report/2027`,
          }),
        }}
      />

      <main>
        <ReportNav2027 />
        <Cover            ctaScroll={t('scrollDown')} />
        <Editorial />
        <Market />
        <AIEffect />
        <Perspective />
        <DealWatch        disclaimer={t('disclaimer')} />
        <BuyerLandscape />
        <Perspectives2028 />
        <AegrynIndex      indexNote={t('indexNote')} />
        <CTA
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
