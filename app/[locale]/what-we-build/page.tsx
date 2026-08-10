import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { AssetGrid }     from '@/components/sections/AssetGrid'
import { AssetCarousel } from '@/components/sections/AssetCarousel'
import { StatementStrip } from '@/components/sections/StatementStrip'

const BASE = 'https://aegryn.com'
const WHAT_WE_BUILD_SLUG: Record<string, string> = {
  fr: '/ce-que-nous-construisons',
  en: '/what-we-build',
  de: '/was-wir-bauen',
  es: '/lo-que-construimos',
  it: '/cosa-costruiamo',
  nl: '/wat-we-bouwen',
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets' })
  const slug = WHAT_WE_BUILD_SLUG[locale] ?? '/what-we-build'
  const base = generateAegrynMetadata({
    title:       t('page.meta.title'),
    description: t('page.meta.desc'),
    path:        slug,
    locale,
    keywords:    ['Subblink', 'Neediu', 'Primiom', 'Movtoo', 'Hobconnect', 'Aegryn ecosystem', 'proprietary assets', 'Swiss tech'],
  })
  return {
    ...base,
    alternates: {
      canonical: `${BASE}/${locale}${slug}`,
      languages: {
        fr:          `${BASE}/fr/ce-que-nous-construisons`,
        en:          `${BASE}/en/what-we-build`,
        de:          `${BASE}/de/was-wir-bauen`,
        es:          `${BASE}/es/lo-que-construimos`,
        it:          `${BASE}/it/cosa-costruiamo`,
        nl:          `${BASE}/nl/wat-we-bouwen`,
        'x-default': `${BASE}/en/what-we-build`,
      },
    },
  }
}

export default async function WhatWeBuildPage({ params }: Props) {
  const { locale } = await params
  const tAdv = await getTranslations({ locale, namespace: 'advisory' })

  return (
    <>
      <AssetCarousel />
      <AssetGrid />
      <StatementStrip
        label="Aegryn Advisory"
        title={tAdv('hero.title')}
        cta={tAdv('cta')}
        href="/advisory"
      />
    </>
  )
}
