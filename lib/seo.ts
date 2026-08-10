import type { Metadata } from 'next'

const BASE_URL = 'https://aegryn.com'

/* OG locale codes per language */
const OG_LOCALE: Record<string, string> = {
  fr: 'fr_FR', en: 'en_GB', de: 'de_DE',
  it: 'it_IT', es: 'es_ES', nl: 'nl_NL',
}

const BASE_KEYWORDS = [
  // Brand
  'Aegryn', 'aegryn.com', 'Engineered to Last', 'Swiss Tech', 'BOHA-Group',
  // Core business
  'digital assets', 'actifs numériques', 'digital asset auction', 'enchère tech',
  'auction platform', 'tech auction', 'vente aux enchères technologie',
  'buy tech company', 'sell tech company', 'acheter entreprise tech', 'vendre entreprise tech',
  'SaaS acquisition', 'acquisition SaaS', 'SaaS marketplace', 'SaaS for sale',
  // Seller funnel
  'céder SaaS', 'cession SaaS Europe', 'vendre SaaS', 'vendre entreprise SaaS',
  'funnel cédant', 'céder entreprise numérique', 'mandat cession tech',
  'comment vendre entreprise tech', 'vente SaaS structurée', 'plateforme cession tech Europe',
  'how to sell SaaS', 'sell SaaS Europe', 'SaaS exit Europe', 'SaaS exit strategy',
  // Buyer funnel
  'acheteur tech qualifié', 'pré-qualification acheteur', 'acquérir SaaS',
  'acheter SaaS Europe', 'deal flow tech Europe', 'acquisition SaaS structurée',
  'family office tech acquisition', 'fund SaaS acquisition', 'buy SaaS business Europe',
  // Certification & process
  'certification CIFS', 'audit code indépendant', 'CIFS tech audit',
  'séquestre suisse M&A', 'séquestre bancaire institutionnel', 'Swiss escrow M&A',
  'closing tech sécurisé', 'NDA cession tech', 'data room cession',
  // M&A
  'M&A tech', 'mergers acquisitions technology', 'cession entreprise numérique',
  'acquisition entreprise digitale', 'transaction tech Europe',
  'deal structuring', 'club deal acquisition', 'share deal', 'asset deal',
  'earnout', 'SPV co-investment', 'heads of terms tech',
  // Valuation
  'SaaS valuation', 'valorisation SaaS', 'digital asset valuation',
  'valorisation actif numérique', 'ARR multiple', 'SaaS multiples Europe',
  'calcul valorisation SaaS', 'outil valorisation gratuit tech',
  'SaaS valuation tool free', 'SaaS valuation calculator',
  // Experts
  'M&A experts', 'expert network', 'réseau experts M&A', 'expert M&A tech',
  'due diligence tech', 'transactional experts', 'W&I insurance',
  'cybersecurity expert', 'AI audit', 'expert technique M&A',
  // Advisory
  'cybersecurity', 'advisory', 'AI advisory', 'EU AI Act',
  'RGPD compliance', 'Swiss FADP', 'digital strategy',
  // Geography
  'Switzerland startup', 'Swiss holding', 'holding suisse tech',
  'Europe tech market', 'marché tech européen',
  'plateforme M&A suisse', 'Swiss M&A platform', 'cession tech Suisse',
  // Products
  'Subblink', 'Neediu', 'Primiom', 'Movtoo', 'Hobconnect',
  'ecosystem engineering', 'digital ecosystem',
  // Grade
  'Aegryn Grade', 'asset grading', 'notation actif numérique',
  'grade SaaS', 'certification actif numérique', 'tech credit rating',
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
      index:  process.env.VERCEL_ENV === 'production',
      follow: process.env.VERCEL_ENV === 'production',
      googleBot: {
        index:               process.env.VERCEL_ENV === 'production',
        follow:              process.env.VERCEL_ENV === 'production',
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
      'geo.region':    'CH-VD',
      'geo.placename': 'St-Sulpice, Switzerland',
      'geo.position':  '46.5147;6.5600',
      'ICBM':          '46.5147, 6.5600',
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
  legalName:     'BOHA-Group Sàrl',
  url:           BASE_URL,
  logo: {
    '@type':     'ImageObject',
    url:         `${BASE_URL}/images/aegryn-logo.svg`,
    width:       200,
    height:      50,
  },
  image:         `${BASE_URL}/og/default.jpg`,
  description:   'Aegryn is a Swiss technology holding company that designs, funds, and operates proprietary digital ecosystems across SaaS, AI, real estate, mobility, and social platforms. Headquartered in Switzerland, Aegryn builds long-lasting digital assets engineered to last.',
  slogan:        'Engineered to Last',
  foundingDate:  '2023',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
  address: {
    '@type':           'PostalAddress',
    addressLocality:   'St-Sulpice',
    addressRegion:     'VD',
    addressCountry:    'CH',
    postalCode:        '1025',
  },
  contactPoint: {
    '@type':            'ContactPoint',
    contactType:        'customer support',
    email:              'contact@boha-group.com',
    availableLanguage:  ['French', 'English', 'German', 'Italian', 'Spanish', 'Dutch'],
  },
  sameAs: [
    'https://www.linkedin.com/company/106273747/',
    'https://www.instagram.com/boha_group/',
    'https://www.tiktok.com/@aegryn.auction',
    'https://www.youtube.com/@aegryn.auction',
    'https://www.facebook.com/BOHA-Group',
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
    'M&A Advisory',
    'Digital Asset Valuation',
    'Tech Asset Auction',
    'Due Diligence',
    'EU AI Act Compliance',
    'GDPR Compliance',
    'SaaS Acquisition',
    'Expert Network',
    'Asset Grading',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Aegryn Services',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Auction',
          description: 'Structured auction platform for buying and selling digital tech assets (SaaS, B2C, infrastructure) in Europe. €100K–€50M range.',
          url: `${BASE_URL}/en/auction`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Valuation',
          description: 'Free instant preliminary valuation of digital assets using proprietary SaaS scoring models benchmarked against European comparable transactions.',
          url: `${BASE_URL}/en/valuation`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Grade',
          description: 'Proprietary grading methodology for digital assets, equivalent to a credit rating for tech companies. 5 grades: AEG★, AAA, AA, A, B.',
          url: `${BASE_URL}/en/grade`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Expert Network',
          description: 'Curated network of M&A, legal, technical and cybersecurity experts for due diligence and transaction support.',
          url: `${BASE_URL}/en/experts`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Advisory',
          description: 'Institutional-grade cybersecurity, AI audit (EU AI Act), and digital strategy advisory for enterprises.',
          url: `${BASE_URL}/en/advisory`,
        },
      },
    ],
  },
}

export const aegrynSiteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Aegryn Site Navigation',
  itemListElement: [
    { '@type': 'ListItem', position: 1,  name: 'Accueil',              url: `${BASE_URL}/fr` },
    { '@type': 'ListItem', position: 2,  name: 'Aegryn Auction',       url: `${BASE_URL}/fr/auction` },
    { '@type': 'ListItem', position: 3,  name: 'Céder un actif',       url: `${BASE_URL}/fr/auction/sell` },
    { '@type': 'ListItem', position: 4,  name: 'Accès acheteurs',      url: `${BASE_URL}/fr/auction/buyers` },
    { '@type': 'ListItem', position: 5,  name: 'Comment ça marche',    url: `${BASE_URL}/fr/auction/how-it-works` },
    { '@type': 'ListItem', position: 6,  name: 'Catalogue',            url: `${BASE_URL}/fr/auction/catalog` },
    { '@type': 'ListItem', position: 7,  name: 'Valorisation',         url: `${BASE_URL}/fr/valuation` },
    { '@type': 'ListItem', position: 8,  name: 'Aegryn Grade',         url: `${BASE_URL}/fr/grade` },
    { '@type': 'ListItem', position: 9,  name: 'Experts',              url: `${BASE_URL}/fr/experts` },
    { '@type': 'ListItem', position: 10, name: 'Advisory',             url: `${BASE_URL}/fr/advisory` },
    { '@type': 'ListItem', position: 11, name: 'Blog',                 url: `${BASE_URL}/fr/blog` },
    { '@type': 'ListItem', position: 12, name: 'Contact',              url: `${BASE_URL}/fr/contact` },
  ],
}

export const aegrynWebSiteSchema = {
  '@context':   'https://schema.org',
  '@type':      'WebSite',
  '@id':        `${BASE_URL}/#website`,
  url:          BASE_URL,
  name:         'Aegryn',
  alternateName: ['Aegryn', 'Aegryn Swiss', 'Aegryn Advisory', 'Aegryn Auction'],
  description:  'Aegryn — Swiss technology holding and M&A auction platform. Buy and sell digital tech assets (SaaS, B2C, infrastructure) in Europe. Free valuation, proprietary grading, curated expert network, cybersecurity and AI advisory. Engineered to Last.',
  publisher:    { '@id': `${BASE_URL}/#organization` },
  inLanguage:   ['fr', 'en', 'de', 'it', 'es', 'nl'],
  potentialAction: {
    '@type':       'SearchAction',
    target:        { '@type': 'EntryPoint', urlTemplate: `${BASE_URL}/en/search?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

/* ── Auction-specific JSON-LD ───────────────────────────────────── */

export function generateAuctionSchema({
  name,
  description,
  url,
  startDate,
  endDate,
}: {
  name: string
  description: string
  url: string
  startDate?: string
  endDate?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${url}#event`,
    name,
    description,
    url,
    organizer: { '@id': `${BASE_URL}/#organization` },
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'VirtualLocation',
      url: `${BASE_URL}/en/auction`,
    },
    ...(startDate ? { startDate } : {}),
    ...(endDate   ? { endDate }   : {}),
  }
}

/* ── FAQ JSON-LD ───────────────────────────────────────────────── */

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  }
}

/* ── Service JSON-LD ───────────────────────────────────────────── */

export function generateServiceSchema({
  name,
  description,
  url,
  serviceType,
  areaServed = 'Europe',
}: {
  name: string
  description: string
  url: string
  serviceType: string
  areaServed?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${url}#service`,
    name,
    description,
    url,
    serviceType,
    areaServed,
    provider: { '@id': `${BASE_URL}/#organization` },
  }
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
