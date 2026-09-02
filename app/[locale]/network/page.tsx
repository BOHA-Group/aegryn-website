import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { Suspense } from 'react'
import NetworkContent from './NetworkContent'

const BASE = 'https://aegryn.com'
const NETWORK_SLUG: Record<string, string> = {
  fr: '/reseau',
  en: '/network',
  de: '/netzwerk',
  es: '/red',
  it: '/rete',
  nl: '/netwerk',
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'network' })
  const slug = NETWORK_SLUG[locale] ?? '/network'
  const base = generateAegrynMetadata({
    title:       t('meta.title'),
    description: t('meta.desc'),
    path:        slug,
    locale,
    keywords:    ['réseau Aegryn', 'partenaires tech M&A', 'experts conseil stratégie', 'réseau conseil tech'],
  })
  return {
    ...base,
    alternates: {
      canonical: `${BASE}/${locale}${slug}`,
      languages: {
        fr:          `${BASE}/fr/reseau`,
        en:          `${BASE}/en/network`,
        de:          `${BASE}/de/netzwerk`,
        es:          `${BASE}/es/red`,
        it:          `${BASE}/it/rete`,
        nl:          `${BASE}/nl/netwerk`,
        'x-default': `${BASE}/en/network`,
      },
    },
  }
}

export default function NetworkPage() {
  return (
    <Suspense>
      <NetworkContent />
    </Suspense>
  )
}
