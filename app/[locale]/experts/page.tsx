import type { Metadata }  from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import ExpertsContent from './ExpertsContent'

const BASE = 'https://aegryn.com'
const EXPERTS_SLUG: Record<string, string> = {
  fr: '/experts',
  en: '/experts',
  de: '/experten',
  es: '/expertos',
  it: '/esperti',
  nl: '/experts',
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experts' })
  const slug = EXPERTS_SLUG[locale] ?? '/experts'
  const base = generateAegrynMetadata({
    title:       t('meta.title'),
    description: t('meta.desc'),
    path:        slug,
    locale,
    keywords:    ['réseau experts M&A', 'M&A expert network', 'due diligence tech', 'W&I insurance'],
  })
  return {
    ...base,
    alternates: {
      canonical:  `${BASE}/${locale}${slug}`,
      languages: {
        fr:          `${BASE}/fr/experts`,
        en:          `${BASE}/en/experts`,
        de:          `${BASE}/de/experten`,
        es:          `${BASE}/es/expertos`,
        it:          `${BASE}/it/esperti`,
        nl:          `${BASE}/nl/experts`,
        'x-default': `${BASE}/en/experts`,
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
