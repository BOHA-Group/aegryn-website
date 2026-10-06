import type { Metadata }  from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import ExpertsContent from './ExpertsContent'

const BASE = 'https://aegryn.com'
const ANNUAIRE_SLUG: Record<string, string> = {
  fr: '/annuaire',
  en: '/annuaire',
  de: '/annuaire',
  es: '/annuaire',
  it: '/annuaire',
  nl: '/annuaire',
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experts' })
  const slug = ANNUAIRE_SLUG[locale] ?? '/annuaire'
  const base = generateAegrynMetadata({
    title:       t('meta.title'),
    description: t('meta.desc'),
    path:        slug,
    locale,
    keywords:    ['réseau experts M&A', 'M&A expert network', 'due diligence tech'],
  })
  return {
    ...base,
    alternates: {
      canonical:  `${BASE}/${locale}${slug}`,
      languages: {
        fr:          `${BASE}/fr/annuaire`,
        en:          `${BASE}/en/annuaire`,
        de:          `${BASE}/de/annuaire`,
        es:          `${BASE}/es/annuaire`,
        it:          `${BASE}/it/annuaire`,
        nl:          `${BASE}/nl/annuaire`,
        'x-default': `${BASE}/en/annuaire`,
      },
    },
  }
}

export default function ExpertsPage() {
  return (
    <Suspense>
      <ExpertsContent />
    </Suspense>
  )
}
