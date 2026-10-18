import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://aegryn.com'
export function socialImageUrl(title: string, image = '/og/default.jpg') {
  const query = new URLSearchParams({ title: title.replace(/\s*\|\s*Aegryn$/, ''), image })
  return `${BASE_URL}/api/og?${query}`
}

/* Chemin interne → chemin public localisé (pathnames next-intl).
   Accepte aussi un chemin déjà localisé (résolu via la table inverse). */
const PATHNAMES = routing.pathnames as Record<string, string | Record<string, string>>
const LOCALIZED_TO_INTERNAL: Record<string, string> = {}
for (const [internal, entry] of Object.entries(PATHNAMES)) {
  if (typeof entry === 'object') {
    for (const localized of Object.values(entry)) LOCALIZED_TO_INTERNAL[localized] = internal
  }
}
function localizedPath(path: string, locale: string): string {
  const internal = LOCALIZED_TO_INTERNAL[path] ?? path
  const entry = PATHNAMES[internal]
  return entry && typeof entry === 'object' ? (entry[locale] ?? path) : path
}

export const pageUrl = (path: string, locale: string) => `${BASE_URL}/${locale}${localizedPath(path, locale)}`

/* OG locale codes per language */
const OG_LOCALE: Record<string, string> = {
  fr: 'fr_FR', en: 'en_GB', de: 'de_DE',
  it: 'it_IT', es: 'es_ES', nl: 'nl_NL',
}

const BASE_KEYWORDS = [
  // Marque et positionnement
  'Aegryn', 'aegryn.com', 'cabinet d\'entrepreneurs', 'firm of entrepreneurs', 'boutique entrepreneuriale',
  'architecte de projets emblématiques', 'cabinet de conseil intégré', 'integrated advisory firm',
  'Swiss advisory firm', 'cabinet conseil Suisse', 'conseil PME ETI Suisse',
  'Rare par sélection', 'Discret par principe', 'Rare by selection', 'Discreet by principle',
  // Méthode et cinq façons d'agir
  'cadrer réaliser accompagner', 'frame deliver accompany', 'sélectionner les talents', 'Aegryn Magazine',
  // La Boutique
  'La Boutique Aegryn', 'projets signature', 'signature projects', 'projets emblématiques',
  // Huit métiers
  'stratégie d\'entreprise et innovation', 'gestion des risques et conformité', 'finance et performance',
  'technologie et souveraineté', 'opérations et excellence opérationnelle', 'talent et organisation',
  'pilotage de projets et de programmes', 'M&A transactions et PMI',
  'corporate strategy and innovation', 'risk management and compliance', 'finance and performance',
  'technology and sovereignty', 'operations and operational excellence', 'talent and organisation',
  'project and programme management', 'M&A and post-merger integration',
  // Cycle de vie
  'cycle de vie entreprise', 'organisation lifecycle', 'lancement et structuration', 'croissance et mise à l\'échelle',
  'restructuration et pivot', 'acquisition et croissance externe', 'transmission d\'entreprise',
  'préparation transmission entreprise', 'dirigeant PME', 'dirigeant ETI',
  // Certification, valorisation, confidentialité
  'certification CIFSO 5000', 'CIFSO Valuation Index', 'protocole CIFSO', 'CIFSO protocol',
  'valorisation entreprise', 'valorisation SaaS', 'transmissibilité entreprise', 'data room certifiée',
  'NDA mutuel numérique', 'confidentialité dossier entreprise', 'due diligence tech',
  // Réglementaire et souveraineté
  'NIS2', 'DORA', 'EU AI Act', 'RGPD', 'Swiss FADP', 'souveraineté IA', 'AI sovereignty', 'conformité réglementaire',
  // Talent et réseau
  'executive search tech', 'sélection de profils dirigeants', 'réseau d\'experts', 'expert network', 'alliances partenaires',
  // Actifs propriétaires
  'actifs propriétaires', 'proprietary digital assets', 'subblink', 'neediu', 'primiom', 'movtoo', 'hobconnect',
  // Magazine
  'Tech Money Deals People Life', 'magazine entrepreneurs', 'magazine tech Europe',
  // Géographie
  'Switzerland', 'St-Sulpice Vaud', 'Suisse romande', 'Europe',
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
  const url  = `${BASE_URL}/${locale}${localizedPath(path, locale)}`
  const fullTitle = title.includes('Aegryn') ? title : `${title} | Aegryn`
  const socialImage = socialImageUrl(title, image)

  return {
    title: { absolute: fullTitle },
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],
    authors: [{ name: 'Aegryn', url: 'https://aegryn.com' }],
    creator: 'Aegryn',
    publisher: 'Aegryn',
    category: 'business',
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        fr:          `${BASE_URL}/fr${localizedPath(path, 'fr')}`,
        en:          `${BASE_URL}/en${localizedPath(path, 'en')}`,
        de:          `${BASE_URL}/de${localizedPath(path, 'de')}`,
        it:          `${BASE_URL}/it${localizedPath(path, 'it')}`,
        es:          `${BASE_URL}/es${localizedPath(path, 'es')}`,
        nl:          `${BASE_URL}/nl${localizedPath(path, 'nl')}`,
        'x-default': `${BASE_URL}/fr${localizedPath(path, 'fr')}`,
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
        url:    socialImage,
        width:  1200,
        height: 630,
        alt:    fullTitle,
        type:   'image/png',
      }],
    },
    twitter: {
      card:        'summary_large_image',
      site:        '@aegrynhq',
      creator:     '@aegrynhq',
      title:       fullTitle,
      description,
      images:      [socialImage],
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
      /* AI-optimised */
      'ai-content-declaration': 'human-authored',
    },
    /* Breadcrumb passed through as structured data hint */
    ...(breadcrumb ? { _breadcrumb: JSON.stringify(breadcrumb) } : {}),
  }
}

/* ── JSON-LD schemas ────────────────────────────────────────────── */

const en = (path: string) => `${BASE_URL}/en${localizedPath(path, 'en')}`
const fr = (path: string) => `${BASE_URL}/fr${localizedPath(path, 'fr')}`

const offer = (name: string, description: string, url: string) => ({
  '@type': 'Offer',
  itemOffered: { '@type': 'Service', name, description, url, provider: { '@id': `${BASE_URL}/#organization` } },
})

const ADVISORY_DISCIPLINES: Array<[string, string, string]> = [
  ['Business Strategy and Innovation', 'Growth strategy, innovation, board advisory and decision frameworks for SME and mid-cap leaders.', '/advisory/strategy'],
  ['Risk Management and Compliance', 'Regulatory exposure, NIS2, DORA, EU AI Act, GDPR and Swiss FADP, incident readiness and audit preparation.', '/advisory/risk-compliance'],
  ['Finance and Performance', 'Financial steering, performance, financing readiness and value creation.', '/advisory/finance-performance'],
  ['Technology and Sovereignty', 'Cybersecurity, AI audit, cloud independence, architecture and reversibility of technology choices.', '/advisory/technology'],
  ['Operations and Operational Excellence', 'Operating model, process performance, supply chain and operational excellence.', '/advisory/operations-excellence'],
  ['Talent and Organization', 'Organisation design, founder dependency, succession planning and selection of key profiles.', '/advisory/talent-organization'],
  ['Project and Programme Management', 'Steering of projects and programmes from governance to acceptance, coordinating specialist experts.', '/advisory/project-program-management'],
  ['M&A, Transactions and PMI', 'Acquisition and transfer preparation, due diligence reading and post-merger integration. Financial execution of transactions is entrusted to accredited partners.', '/advisory/ma'],
]

export const aegrynOrganizationSchema = {
  '@context':    'https://schema.org',
  '@type':       ['Organization', 'ProfessionalService'],
  '@id':         `${BASE_URL}/#organization`,
  name:          'Aegryn',
  legalName:     'Aegryn',
  url:           BASE_URL,
  logo: {
    '@type':     'ImageObject',
    url:         `${BASE_URL}/images/brand/logo.svg`,
    width:       200,
    height:      50,
  },
  image:         `${BASE_URL}/og/default.jpg`,
  description:   'Aegryn is a Swiss firm of entrepreneurs: an integrated advisory and delivery firm for leaders of SMEs and mid-sized companies, and La Boutique, an entrepreneurial boutique for a limited number of signature projects. Eight disciplines and five ways of working: frame, deliver, accompany, select, stay informed. A named contact, a limited number of engagements, a reply within two working days. Specialist experts are coordinated when a subject requires it. Rare by selection. Discreet by principle. Anchored in Switzerland, open to the world.',
  slogan:        'Rare by selection. Discreet by principle.',
  foundingDate:  '2023',
  numberOfEmployees: { '@type': 'QuantitativeValue', value: 5 },
  address: {
    '@type':           'PostalAddress',
    addressLocality:   'St-Sulpice',
    addressRegion:     'VD',
    addressCountry:    'CH',
    postalCode:        '1025',
  },
  geo: {
    '@type':    'GeoCoordinates',
    latitude:   46.5147,
    longitude:  6.5600,
  },
  areaServed: [
    { '@type': 'Country', name: 'Switzerland' },
    { '@type': 'Place',   name: 'Europe' },
  ],
  contactPoint: {
    '@type':            'ContactPoint',
    contactType:        'customer support',
    telephone:          '+41 24 539 18 81',
    email:              'contact@boha-group.com',
    availableLanguage:  ['French', 'English', 'German', 'Italian', 'Spanish', 'Dutch'],
  },
  sameAs: [
    'https://www.linkedin.com/company/106273747/',
    'https://www.instagram.com/aegrynhq/',
    'https://www.facebook.com/aegrynhq',
    'https://www.tiktok.com/@aegrynhq',
    'https://www.youtube.com/@aegrynhq',
  ],
  knowsAbout: [
    'Business Strategy and Innovation',
    'Risk Management and Compliance',
    'Finance and Performance',
    'Technology and Sovereignty',
    'Operations and Operational Excellence',
    'Talent and Organization',
    'Project and Programme Management',
    'M&A, Transactions and Post-Merger Integration',
    'Organisation Lifecycle Support',
    'Signature Projects',
    'Cybersecurity',
    'Artificial Intelligence Sovereignty',
    'EU AI Act, NIS2, DORA and GDPR Compliance',
    'CIFSO 5000 Certification Protocol',
    'Aegryn CIFSO Valuation Index',
    'Organisation Value and Transferability',
    'Digital Asset Valuation',
    'Vendor Readiness and Transfer Preparation',
    'Executive Profile Selection',
    'Expert Network',
    'Proprietary Digital Assets',
    'Tech Magazine Publishing',
  ],
  mentions: [
    {
      '@type':       'Periodical',
      name:          'Aegryn Magazine',
      url:           `${BASE_URL}/fr/magazine`,
      description:   'Quarterly magazine for European tech founders and acquirers. Tech. Money. Deals. People. Life.',
      inLanguage:    'en',
      publisher:     { '@type': 'Organization', name: 'Aegryn', url: BASE_URL },
    },
    {
      '@type':       'NewsArticle',
      name:          'neediu, paru dans Gala, 27 novembre 2025',
      url:           `${BASE_URL}/fr/boutique/projets/neediu`,
      datePublished: '2025-11-27',
      isPartOf:      { '@type': 'Periodical', name: 'Gala', issn: '1163-5053' },
      about:         { '@type': 'SoftwareApplication', name: 'neediu', applicationCategory: 'LifestyleApplication' },
    },
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Aegryn Services',
    itemListElement: [
      {
        '@type': 'OfferCatalog',
        name: 'Aegryn Advisory, eight disciplines',
        url: en('/advisory'),
        itemListElement: ADVISORY_DISCIPLINES.map(([name, description, path]) => offer(name, description, en(path))),
      },
      offer('Frame: Cadrer', 'Frame decisions and projects on documented grounds: strategy, risks, finance, technology, operations, talent and M&A for leaders of SMEs and mid-sized companies.', en('/advisory')),
      offer('Deliver: Réaliser', 'Steer projects and programmes from governance to acceptance, coordinating specialist experts. Aegryn does not itself perform heavy industrial production.', en('/advisory/project-program-management')),
      offer('Accompany: Accompagner', 'Accompaniment across the organisation lifecycle: launch, growth, restructuring, acquisition and transfer. Switzerland and Europe.', `${BASE_URL}/en#accompagner`),
      offer('Select: Sélectionner', 'Selection of executive and transition profiles: CTO, CISO, Head of AI, VP Engineering, Head of Data, Head of Product. Confidential search, pre-qualified candidates.', en('/talent')),
      offer('Stay informed: S\u2019informer', 'Aegryn Magazine, articles and workforce market data, published for leaders and entrepreneurs.', en('/magazine')),
      offer('La Boutique', 'An entrepreneurial boutique that frames, delivers and accompanies a limited number of signature projects for entrepreneurs, investors and family offices, institutions and large groups, industrials and brands.', en('/boutique')),
      offer('Aegryn Grade: CIFSO 5000 certification', 'Independent certification of organisations and digital assets under the CIFSO 5000 protocol (5 audited dimensions: Code and Architecture, IP and Rights, Finance and Metrics, Security, Sovereignty and AI Exposure, Organisation, Talent and Succession). 5 immutable grades: AEG, AAA, AA, A, B.', en('/grade')),
      offer('Aegryn CIFSO Valuation Index', 'Public valuation entry point powered by the Aegryn CIFSO Valuation Index: market multiples per industry adjusted on the 5 audited CIFSO 5000 dimensions. The free estimate is illustrative and does not replace official certification.', en('/valuation')),
      offer('Aegryn Expert Network', 'Curated network of independent experts coordinated by Aegryn: the eight advisory disciplines, Board Advisory, Executive Search, and the trades of signature projects (design, engineering, manufacturing, logistics, distribution, legal and intellectual property).', en('/experts')),
      offer('Proprietary assets', 'Digital assets designed and operated by Aegryn: Subblink, neediu, Primiom, Movtoo, Hobconnect.', en('/assets')),
    ],
  },
}

const NAVIGATION: Array<[string, string]> = [
  ['Accueil', `${BASE_URL}/fr`],
  ['La Boutique', fr('/boutique')],
  ['Projets signature', fr('/boutique/projets')],
  ['Nos huit métiers', fr('/advisory')],
  ['Stratégie d\u2019entreprise et Innovation', fr('/advisory/strategy')],
  ['Gestion des Risques et Conformité', fr('/advisory/risk-compliance')],
  ['Finance et Performance', fr('/advisory/finance-performance')],
  ['Technologie et Souveraineté', fr('/advisory/technology')],
  ['Opérations et Excellence opérationnelle', fr('/advisory/operations-excellence')],
  ['Talent et Organisation', fr('/advisory/talent-organization')],
  ['Pilotage de projets et de programmes', fr('/advisory/project-program-management')],
  ['M&A, Transactions et PMI', fr('/advisory/ma')],
  ['Accompagner chaque cycle', `${BASE_URL}/fr#accompagner`],
  ['Lancement & Structuration', fr('/accompagner/lancement')],
  ['Croissance & Mise à l\u2019échelle', fr('/accompagner/croissance')],
  ['Restructuration & Pivot', fr('/accompagner/restructuration')],
  ['Acquisition & Croissance externe', fr('/accompagner/acquisition')],
  ['Transmission & Cession', fr('/accompagner/transmission')],
  ['Sélectionner un profil', fr('/talent')],
  ['Talent, Entreprises', fr('/talent/entreprises')],
  ['Talent, Candidats', fr('/talent/candidats')],
  ['Industries', fr('/industries')],
  ['Réseau d\u2019experts', fr('/experts')],
  ['Alliances', fr('/alliances')],
  ['Actifs propriétaires', fr('/assets')],
  ['CIFSO Valuation Index', fr('/valuation')],
  ['Certification CIFSO 5000', fr('/grade')],
  ['Brochure CIFSO 5000', fr('/grade/brochure')],
  ['Soumettre une organisation', fr('/grade/submit')],
  ['Auditeurs indépendants', fr('/audit')],
  ['Vérifier un certificat', fr('/verify')],
  ['Magazine', fr('/magazine')],
  ['Magazine, édition de janvier 2027', fr('/magazine/issue-01')],
  ['Blog', fr('/blog')],
  ['Emploi & Compétences', fr('/workforce')],
  ['Culture et valeurs', fr('/culture')],
  ['À propos', fr('/about')],
  ['Investisseurs', fr('/investisseurs')],
  ['Carrière', fr('/career')],
  ['Contact', fr('/contact')],
  ['FAQ', fr('/help/faq')],
  ['Feuille de route', fr('/roadmap')],
]

export const aegrynSiteNavigationSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Aegryn Site Navigation',
  itemListElement: NAVIGATION.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, url })),
}

export const aegrynWebSiteSchema = {
  '@context':   'https://schema.org',
  '@type':      'WebSite',
  '@id':        `${BASE_URL}/#website`,
  url:          BASE_URL,
  name:         'Aegryn',
  alternateName: ['Aegryn', 'Aegryn Swiss', 'Aegryn Advisory', 'La Boutique Aegryn', 'Aegryn Magazine', 'Aegryn Grade', 'Aegryn Talent', 'Aegryn Alliances', 'CIFSO 5000', 'CIFSO Valuation Index'],
  description:  'Aegryn, Swiss firm of entrepreneurs: frame, deliver, accompany, select, stay informed. Eight disciplines for leaders of SMEs and mid-sized companies, and La Boutique for a limited number of signature projects. Rare by selection. Discreet by principle.',
  publisher:    { '@id': `${BASE_URL}/#organization` },
  inLanguage:   ['fr', 'en', 'de', 'it', 'es', 'nl'],
}

/* ── Transaction-specific JSON-LD ───────────────────────────────────── */

export function generateTransactionSchema({
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
      url: `${BASE_URL}/en#accompagner`,
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

/* ── BlogPosting JSON-LD (articles /blog/[slug]) ─────────────────── */

export function generateArticleSchema({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  image,
  locale,
  articleSection,
  keywords = [],
}: {
  headline: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
  image?: string
  locale: string
  articleSection?: string
  keywords?: string[]
}) {
  return {
    '@context':      'https://schema.org',
    '@type':         'BlogPosting',
    '@id':           `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline,
    description,
    url,
    image:           [image ? (image.startsWith('http') ? image : `${BASE_URL}${image}`) : `${BASE_URL}/og/blog-default.png`],
    datePublished:   new Date(datePublished).toISOString(),
    dateModified:    new Date(dateModified ?? datePublished).toISOString(),
    inLanguage:      locale,
    ...(articleSection ? { articleSection } : {}),
    ...(keywords.length ? { keywords: keywords.join(', ') } : {}),
    author: {
      '@type': 'Organization',
      name:    'Aegryn',
      url:     BASE_URL,
      '@id':   `${BASE_URL}/#organization`,
    },
    publisher: { '@id': `${BASE_URL}/#organization` },
    isPartOf:  { '@id': `${BASE_URL}/#website` },
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
