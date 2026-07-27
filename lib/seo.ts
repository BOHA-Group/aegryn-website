import type { Metadata } from 'next'

const BASE_URL = 'https://aegryn.com'

/* OG locale codes per language */
const OG_LOCALE: Record<string, string> = {
  fr: 'fr_FR', en: 'en_GB', de: 'de_DE',
  it: 'it_IT', es: 'es_ES', nl: 'nl_NL',
}

const BASE_KEYWORDS = [
  'Aegryn', 'Swiss Tech', 'digital assets', 'actifs numériques',
  'ecosystem engineering', 'Switzerland startup', 'SaaS', 'AI',
  'cybersecurity', 'advisory', 'Engineered to Last',
  'M&A experts', 'expert network', 'réseau experts M&A',
  'due diligence tech', 'transactional experts', 'W&I insurance',
]

export function generateAegrynMetadata({
  title,
  description,
  path = '',
  locale = 'fr',
  image = '/og/default.jpg',
  keywords = [],
  breadcrumb,
}: {
  title: string
  description: string
  path?: string
  locale?: string
  image?: string
  keywords?: string[]
  breadcrumb?: Array<{ name: string; url: string }>
}): Metadata {
  const url  = `${BASE_URL}/${locale}${path}`
  const fullTitle = title.includes('Aegryn') ? title : `${title} — Aegryn`

  return {
    title: { default: fullTitle, template: '%s — Aegryn' },
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],
    authors: [{ name: 'Yohann Bollack', url: 'https://aegryn.com' }],
    creator: 'Aegryn',
    publisher: 'Aegryn',
    category: 'technology',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        fr:          `${BASE_URL}/fr${path}`,
        en:          `${BASE_URL}/en${path}`,
        de:          `${BASE_URL}/de${path}`,
        it:          `${BASE_URL}/it${path}`,
        es:          `${BASE_URL}/es${path}`,
        nl:          `${BASE_URL}/nl${path}`,
        'x-default': `${BASE_URL}/en${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Aegryn',
      locale: OG_LOCALE[locale] ?? 'en_GB',
      type: 'website',
      images: [{
        url:    `${BASE_URL}${image}`,
        width:  1200,
        height: 630,
        alt:    fullTitle,
        type:   'image/jpeg',
      }],
    },
    twitter: {
      card:        'summary_large_image',
      site:        '@aegryn',
      creator:     '@aegryn',
      title:       fullTitle,
      description,
      images:      [`${BASE_URL}${image}`],
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: {
        index:               true,
        follow:              true,
        'max-image-preview': 'large',
        'max-snippet':       -1,
        'max-video-preview': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
    },
    other: {
      /* GEO tags */
      'geo.region':    'CH',
      'geo.placename': 'Switzerland',
      'geo.position':  '46.818188;8.227512',
      'ICBM':          '46.818188, 8.227512',
      /* Dublin Core */
      'DC.title':      fullTitle,
      'DC.description': description,
      'DC.language':   locale,
      'DC.publisher':  'Aegryn',
      'DC.rights':     'Copyright © 2026 Aegryn',
      /* Rating / classification */
      'rating':        'general',
      'revisit-after': '7 days',
      /* AI-optimised */
      'ai-content-declaration': 'human-authored',
    },
    /* Breadcrumb passed through as structured data hint */
    ...(breadcrumb ? { _breadcrumb: JSON.stringify(breadcrumb) } : {}),
  }
}

/* ── JSON-LD schemas ────────────────────────────────────────────── */

export const aegrynOrganizationSchema = {
  '@context':    'https://schema.org',
  '@type':       'Organization',
  '@id':         `${BASE_URL}/#organization`,
  name:          'Aegryn',
  legalName:     'Aegryn',
  url:           BASE_URL,
  logo: {
    '@type':     'ImageObject',
    url:         `${BASE_URL}/images/aegryn-logo.svg`,
    width:       200,
    height:      50,
  },
  image:         `${BASE_URL}/og/default.jpg`,
  description:   'Swiss Tech Asset Builder — Engineered to Last',
  foundingDate:  '2023',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
  address: {
    '@type':           'PostalAddress',
    addressLocality:   'Geneva',
    addressRegion:     'GE',
    addressCountry:    'CH',
    postalCode:        '1201',
  },
  contactPoint: {
    '@type':            'ContactPoint',
    contactType:        'customer support',
    email:              'contact@boha-group.com',
    availableLanguage:  ['French', 'English', 'German', 'Italian', 'Spanish', 'Dutch'],
  },
  sameAs: [
    'https://www.linkedin.com/company/106273747/',
    'https://www.instagram.com/aegryn/',
    'https://www.tiktok.com/@aegryn',
    'https://www.youtube.com/@aegryn',
    'https://www.facebook.com/aegryn',
    'https://twitter.com/aegryn',
  ],
  founder: {
    '@type':    'Person',
    '@id':      `${BASE_URL}/#founder`,
    name:       'Yohann Bollack',
    jobTitle:   'Founder & CEO',
    url:        'https://www.linkedin.com/in/yohannbollack/',
    worksFor:   { '@id': `${BASE_URL}/#organization` },
  },
  knowsAbout: [
    'Digital Ecosystem Engineering',
    'Cybersecurity',
    'Artificial Intelligence',
    'SaaS',
    'Swiss Technology',
  ],
}

export const aegrynWebSiteSchema = {
  '@context':   'https://schema.org',
  '@type':      'WebSite',
  '@id':        `${BASE_URL}/#website`,
  url:          BASE_URL,
  name:         'Aegryn',
  description:  'Swiss Tech Asset Builder — Engineered to Last',
  publisher:    { '@id': `${BASE_URL}/#organization` },
  inLanguage:   ['fr', 'en', 'de', 'it', 'es', 'nl'],
  potentialAction: {
    '@type':       'SearchAction',
    target:        { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/en/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export function generateWebPageSchema({
  name,
  description,
  url,
  breadcrumbs = [],
}: {
  name: string
  description: string
  url: string
  breadcrumbs?: Array<{ name: string; url: string }>
}) {
  const schema: Record<string, unknown> = {
    '@context':   'https://schema.org',
    '@type':      'WebPage',
    '@id':        `${url}#webpage`,
    url,
    name,
    description,
    isPartOf:     { '@id': `${BASE_URL}/#website` },
    publisher:    { '@id': `${BASE_URL}/#organization` },
    inLanguage:   url.includes('/fr/') ? 'fr'
                : url.includes('/de/') ? 'de'
                : url.includes('/it/') ? 'it'
                : url.includes('/es/') ? 'es'
                : url.includes('/nl/') ? 'nl'
                : 'en',
  }

  if (breadcrumbs.length > 0) {
    schema.breadcrumb = {
      '@type':           'BreadcrumbList',
      itemListElement:   breadcrumbs.map((item, i) => ({
        '@type':    'ListItem',
        position:   i + 1,
        name:       item.name,
        item:       item.url,
      })),
    }
  }

  return schema
}
