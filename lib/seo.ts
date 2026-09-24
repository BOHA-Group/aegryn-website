import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

const BASE_URL = 'https://aegryn.com'

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

/* OG locale codes per language */
const OG_LOCALE: Record<string, string> = {
  fr: 'fr_FR', en: 'en_GB', de: 'de_DE',
  it: 'it_IT', es: 'es_ES', nl: 'nl_NL',
}

const BASE_KEYWORDS = [
  // Brand
  'Aegryn', 'aegryn.com', 'Engineered to Last', 'Swiss Tech',
  // Core business — cabinet de conseil intégré, valeur & cycle de vie
  'cabinet de conseil intégré', 'integrated advisory group', 'integrated advisory firm',
  'cabinet conseil tech suisse', 'cabinet conseil valorisation', 'Swiss advisory group',
  'digital assets', 'actifs numériques', 'valorisation entreprise', 'organisation value',
  'valeur entreprise tech', 'cycle de vie entreprise', 'organisation lifecycle',
  'Aegryn Valoriser', 'valoriser son entreprise', 'certification valeur entreprise',
  'lancement structuration entreprise', 'croissance mise à l\'échelle', 'restructuration pivot',
  'croissance externe', 'transmission entreprise', 'préparer transmission entreprise',
  'accompagnement dirigeant', 'entreprise transmissible', 'business transferability',
  // Certification & process
  'certification CIFSO', 'audit code indépendant', 'CIFSO tech audit',
  'séquestre institutionnel', 'séquestre bancaire institutionnel', 'Swiss escrow',
  'closing tech sécurisé', 'NDA confidentialité entreprise', 'data room certifiée',
  'KYC certification', 'confidentialité dossier entreprise',
  // M&A advisory
  'M&A tech', 'mergers acquisitions technology', 'conseil M&A tech',
  'acquisition entreprise digitale', 'due diligence acquisition',
  'deal structuring', 'club deal acquisition', 'share deal', 'asset deal',
  'earnout', 'SPV co-investment', 'heads of terms tech',
  'buy-side advisory', 'sell-side advisory', 'post-merger integration', 'PMI tech',
  'vendor due diligence', 'vendor readiness', 'préparation cession entreprise',
  'acquisition SaaS', 'SaaS acquisition', 'acquisition entreprise tech',
  'family office tech acquisition', 'fund tech acquisition', 'croissance externe entreprise',
  // Valuation
  'SaaS valuation', 'valorisation SaaS', 'digital asset valuation',
  'valorisation actif numérique', 'ARR multiple', 'SaaS multiples Europe',
  'calcul valorisation SaaS', 'outil valorisation gratuit tech',
  'SaaS valuation tool free', 'SaaS valuation calculator',
  'valorisation entreprise Europe', 'company valuation Switzerland',
  'estimation valeur startup', 'multiples valorisation sectoriels',
  // Experts & network
  'M&A experts', 'expert network', 'réseau experts M&A', 'expert M&A tech',
  'due diligence tech', 'réseau experts certifiés', 'W&I insurance',
  'cybersecurity expert', 'AI audit', 'expert technique M&A',
  'expert conformité', 'expert valorisation', 'auditeur indépendant tech',
  // Advisory
  'cybersecurity', 'advisory', 'AI advisory', 'EU AI Act',
  'RGPD compliance', 'Swiss FADP', 'digital strategy',
  'board advisory', 'strategy advisory', 'conseil stratégique', 'conseil tech',
  'CTO as a service', 'DevSecOps', 'audit sécurité', 'security audit',
  'advisory M&A', 'conseil M&A', 'réseau experts', 'expert network alliance',
  'alliance partenaires', 'alliance partners tech', 'apporteur affaires tech',
  'Aegryn Advisory', 'Aegryn Alliance', 'partenariat Aegryn',
  'W&I insurance', 'warranty indemnity', 'assurance risques M&A',
  'séquestre structuré', 'structured escrow', 'financement croissance tech',
  'recrutement dirigeant', 'executive recruitment tech', 'talent tech suisse',
  // Compliance & governance
  'conformité NIS2', 'conformité DORA', 'gouvernance données', 'audit interne tech',
  'due diligence réglementaire', 'gestion risques entreprise', 'risques cyber entreprise',
  // Talent & organisation
  'talent organisation', 'dépendance fondateur', 'succession dirigeant',
  'rétention talents clés', 'transfert connaissance entreprise', 'structuration équipe dirigeante',
  'executive search tech', 'recrutement executive Europe', 'interim management tech',
  // Geography
  'Switzerland startup', 'Swiss holding', 'holding suisse tech',
  'Europe tech market', 'marché tech européen',
  'advisory M&A suisse', 'Swiss M&A advisory', 'certification tech Suisse',
  'groupe suisse tech', 'Swiss tech certification group',
  // Build — proprietary assets
  'subblink', 'neediu', 'primiom', 'movtoo', 'hobconnect',
  'actifs propriétaires Aegryn', 'proprietary digital assets', 'digital ecosystem',
  'ecosystem engineering', 'portefeuille actifs numériques',
  // Build — asset engineering (tiers)
  'conception actif numérique', 'asset engineering', 'custom code digital asset',
  'développement actif sur mesure', 'forfait fixe développement', 'fixed price digital build',
  'certification-ready SaaS', 'IP propriétaire développement', 'zéro dette technique',
  'build digital asset Switzerland', 'construire SaaS forfait fixe',
  // Grade & CIFSO
  'Aegryn Grade', 'asset grading', 'notation actif numérique',
  'grade SaaS', 'certification actif numérique', 'tech credit rating',
  'protocole CIFSO', 'CIFSO protocol', 'certification CIFSO obligatoire',
  'certification independante SaaS', 'audit certifié actif numérique', 'grade officiel SaaS',
  'valorisation illustrative SaaS', 'outil valorisation public', 'SaaS valuation light tool',
  // CIFSO 5000 & Valuation Index
  'CIFSO 5000', 'certification CIFSO 5000', 'CIFSO Valuation Index',
  'acte de propriété entreprise', 'ownership record organisation value',
  'valeur organisation certifiée', 'organisation value certification',
  'transmissibilité entreprise', 'business transferability audit',
  'benchmark valorisation Europe', 'European valuation benchmark',
  // AI sovereignty
  'souveraineté IA', 'AI sovereignty', 'exposition IA entreprise',
  'AI exposure assessment', 'dépendance fournisseurs IA', 'AI vendor risk',
  // Magazine
  'Aegryn Magazine', 'magazine tech fondateurs', 'magazine tech Europe', 'magazine startup',
  'magazine entrepreneurs tech', 'publication tech M&A', 'revue tech business',
  'Tech Money Deals People Life', 'magazine trimestriel tech', 'quarterly tech magazine',
  'magazine deals entrepreneurs', 'magazine acquisitions tech', 'magazine fondateurs européens',
  // Press — neediu
  'neediu Gala', 'paru dans Gala', 'Gala magazine neediu', 'neediu presse',
  'neediu app services domicile', 'neediu service à domicile', 'application services maison',
  'marketplace services domicile France', 'booking prestataire domicile',
  'aide ménagère app', 'jardinage domicile app', 'bricolage app', 'service à la personne digital',
  // Advisory pillars (renamed 2026)
  'Business Strategy and Innovation', 'Risk Management and Compliance', 'Technology and Sovereignty',
  'Talent and Organization', 'M&A Transactions and PMI',
  'conseil risque conformité', 'conseil talent organisation', 'NIS2 DORA AI Act conseil',
  'dépendance fondateur décote', 'plan de succession entreprise',
  // Workforce & AI jobs data
  'emploi IA', 'compétences IA 2026', 'écart de compétences', 'World Economic Forum Future of Jobs',
  'PwC Global AI Jobs Barometer', 'prime salariale IA', 'recrutement IA', 'formation compétences IA',
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

  return {
    title: { absolute: fullTitle },
    description,
    keywords: [...BASE_KEYWORDS, ...keywords],
    authors: [{ name: 'Aegryn', url: 'https://aegryn.com' }],
    creator: 'Aegryn',
    publisher: 'Aegryn',
    category: 'technology',
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
        'x-default': `${BASE_URL}/en${localizedPath(path, 'en')}`,
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
      site:        '@aegrynhq',
      creator:     '@aegrynhq',
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
    url:         `${BASE_URL}/images/brand/logo.svg`,
    width:       200,
    height:      50,
  },
  image:         `${BASE_URL}/og/default.jpg`,
  description:   'Aegryn is a Swiss integrated advisory group — cabinet de conseil intégré — and technology holding company. We certify the value and transferability of organisations through CIFSO 5000 — an evidence-backed ownership record audited on 5 dimensions: Code & Architecture, IP & Rights, Finance & Metrics, Security-Sovereignty & AI Exposure, Organisation-Talent & Succession — benchmarked by the Aegryn CIFSO Valuation Index. Aegryn accompanies organisations across their full lifecycle — launch, growth, restructuring, acquisition, transfer — through advisory, compliance, executive talent, asset engineering, expert network, confidential structured mandates and Aegryn Magazine. St-Sulpice (VD), Switzerland — serving Switzerland & Europe.',
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
    email:              'contact@boha-group.com',
    availableLanguage:  ['French', 'English', 'German', 'Italian', 'Spanish', 'Dutch'],
  },
  sameAs: [
    'https://www.linkedin.com/company/106273747/',
    'https://www.instagram.com/aegrynhq/',
    'https://www.tiktok.com/@aegrynhq',
    'https://www.youtube.com/@aegrynhq',
  ],
  knowsAbout: [
    'Digital Ecosystem Engineering',
    'Cybersecurity',
    'Artificial Intelligence',
    'SaaS',
    'Swiss Technology',
    'M&A Advisory',
    'CIFSO 5000 Certification Protocol',
    'Aegryn CIFSO Valuation Index',
    'AI Exposure & Sovereignty Assessment',
    'Organisation Value & Transferability',
    'Digital Asset Valuation',
    'Illustrative SaaS Valuation Tool',
    'Organisation Lifecycle Support',
    'Vendor Readiness & Transfer Preparation',
    'Confidential Mandate Structuring',
    'Due Diligence',
    'EU AI Act Compliance',
    'GDPR Compliance',
    'SaaS Acquisition',
    'Expert Network',
    'Asset Grading',
    'Asset Engineering',
    'Custom Digital Asset Development',
    'Certification-Ready Digital Assets',
    'Proprietary Asset Portfolio',
    'Tech Magazine Publishing',
    'Home Services Marketplace',
    'Digital Publishing',
    'Press Relations',
  ],
  mentions: [
    {
      '@type':       'Periodical',
      name:          'Aegryn Magazine',
      url:           `${BASE_URL}/fr/magazine`,
      description:   'Quarterly magazine for European tech founders and acquirers. Tech. Money. Deals. People. Life.',
      inLanguage:    'fr',
      publisher:     { '@type': 'Organization', name: 'Aegryn', url: BASE_URL },
    },
    {
      '@type':       'NewsArticle',
      name:          'neediu — Paru dans Gala, 27 novembre 2025',
      url:           `${BASE_URL}/fr/assets/neediu`,
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
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Valoriser',
          description: 'Value measurement, certification and realization across the organisation lifecycle: launch, growth, restructuring, acquisition, transfer. Europe & Switzerland.',
          url: `${BASE_URL}/en/valoriser`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Valuation — CIFSO Valuation Index',
          description: 'Public valuation entry point for digital assets, powered by the Aegryn CIFSO Valuation Index: market multiples per industry adjusted on the 5 audited CIFSO 5000 dimensions. Free access returns an illustrative wide range; full benchmarks (multiples, per-dimension data) via subscription. Not a substitute for official Aegryn certification.',
          url: `${BASE_URL}/en/valuation`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Grade — Certification CIFSO 5000',
          description: 'Independent certification of organisations and digital assets under the CIFSO 5000 protocol (5 audited dimensions: Code & Architecture, IP & Rights, Finance & Metrics, Security-Sovereignty & AI Exposure, Organisation-Talent & Succession). The certificate acts as an evidence-backed ownership and value record — like the papers of a watch. 5 immutable grades: AEG★, AAA, AA, A, B.',
          url: `${BASE_URL}/en/grade`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Expert Network',
          description: 'Curated network of M&A, legal, technical, compliance and cybersecurity experts supporting organisations at every lifecycle stage — certification, due diligence, mandates and remediation.',
          url: `${BASE_URL}/en/experts`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Advisory',
          description: 'Corporate advisory for tech founders, boards and investors across 5 pillars: Business Strategy & Innovation, Risk Management & Compliance (NIS2, DORA, EU AI Act), Technology & Sovereignty, Talent & Organization (succession, founder dependency), and M&A, Transactions & PMI. Switzerland & Europe.',
          url: `${BASE_URL}/en/advisory`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Build — Proprietary Assets',
          description: 'Aegryn designs and operates its own portfolio of digital assets: B2B SaaS, marketplaces, AI tools. Each asset is certified, documented and operated under real conditions.',
          url: `${BASE_URL}/en/assets`,
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Aegryn Asset Engineering',
          description: 'Custom digital asset design for individuals, entrepreneurs and institutions. Fixed price, custom code, full IP ownership, certification-ready in 10–16 weeks. Zero technical debt.',
          url: `${BASE_URL}/en/services/build`,
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
    { '@type': 'ListItem', position: 1,  name: 'Accueil',                       url: `${BASE_URL}/fr` },
    { '@type': 'ListItem', position: 2,  name: 'Valoriser',                     url: `${BASE_URL}/fr/valoriser` },
    { '@type': 'ListItem', position: 3,  name: 'Transmission & Cession',        url: `${BASE_URL}/fr/valoriser/transmission` },
    { '@type': 'ListItem', position: 4,  name: 'Acquisition & Croissance externe', url: `${BASE_URL}/fr/valoriser/acquisition` },
    { '@type': 'ListItem', position: 5,  name: 'Réseau d\'experts',             url: `${BASE_URL}/fr/network` },
    { '@type': 'ListItem', position: 6,  name: 'Portfolio',                     url: `${BASE_URL}/fr/portfolio` },
    { '@type': 'ListItem', position: 7,  name: 'CIFSO Valuation Index',         url: `${BASE_URL}/fr/valuation` },
    { '@type': 'ListItem', position: 8,  name: 'Certification CIFSO 5000',      url: `${BASE_URL}/fr/grade` },
    { '@type': 'ListItem', position: 9,  name: 'Brochure CIFSO 5000',           url: `${BASE_URL}/fr/grade/brochure` },
    { '@type': 'ListItem', position: 10, name: 'Soumettre une organisation',    url: `${BASE_URL}/fr/grade/submit` },
    { '@type': 'ListItem', position: 11, name: 'Vérifier un certificat',        url: `${BASE_URL}/fr/verify` },
    { '@type': 'ListItem', position: 12, name: 'Industries',                    url: `${BASE_URL}/fr/industries` },
    { '@type': 'ListItem', position: 13, name: 'Experts',                       url: `${BASE_URL}/fr/experts` },
    { '@type': 'ListItem', position: 14, name: 'Advisory',                      url: `${BASE_URL}/fr/advisory` },
    { '@type': 'ListItem', position: 15, name: 'Advisory — Stratégie & Innovation', url: `${BASE_URL}/fr/advisory/strategy` },
    { '@type': 'ListItem', position: 16, name: 'Advisory — Risque & Conformité', url: `${BASE_URL}/fr/advisory/risk-compliance` },
    { '@type': 'ListItem', position: 17, name: 'Advisory — Technologie & Souveraineté', url: `${BASE_URL}/fr/advisory/technology` },
    { '@type': 'ListItem', position: 18, name: 'Advisory — Talent & Organisation', url: `${BASE_URL}/fr/advisory/talent-organization` },
    { '@type': 'ListItem', position: 19, name: 'Advisory — M&A, Transactions & PMI', url: `${BASE_URL}/fr/advisory/ma` },
    { '@type': 'ListItem', position: 20, name: 'Alliances',                     url: `${BASE_URL}/fr/alliances` },
    { '@type': 'ListItem', position: 21, name: 'Talent',                        url: `${BASE_URL}/fr/talent` },
    { '@type': 'ListItem', position: 22, name: 'Actifs propriétaires',          url: `${BASE_URL}/fr/assets` },
    { '@type': 'ListItem', position: 23, name: 'Ce que nous construisons',      url: `${BASE_URL}/fr/ce-que-nous-construisons` },
    { '@type': 'ListItem', position: 24, name: 'Conception d\'actifs (Build)',  url: `${BASE_URL}/fr/services/build` },
    { '@type': 'ListItem', position: 25, name: 'Magazine',                      url: `${BASE_URL}/fr/magazine` },
    { '@type': 'ListItem', position: 26, name: 'Magazine — January 2027',       url: `${BASE_URL}/fr/magazine/issue-01` },
    { '@type': 'ListItem', position: 27, name: 'Blog',                          url: `${BASE_URL}/fr/blog` },
    { '@type': 'ListItem', position: 28, name: 'Emploi & Compétences',          url: `${BASE_URL}/fr/workforce` },
    { '@type': 'ListItem', position: 29, name: 'Investisseurs',                 url: `${BASE_URL}/fr/investisseurs` },
    { '@type': 'ListItem', position: 30, name: 'Carrière',                      url: `${BASE_URL}/fr/career` },
    { '@type': 'ListItem', position: 31, name: 'À propos',                      url: `${BASE_URL}/fr/a-propos` },
    { '@type': 'ListItem', position: 32, name: 'Contact',                       url: `${BASE_URL}/fr/contact` },
    { '@type': 'ListItem', position: 33, name: 'FAQ',                           url: `${BASE_URL}/fr/help/faq` },
    { '@type': 'ListItem', position: 34, name: 'Feuille de route',              url: `${BASE_URL}/fr/roadmap` },
    { '@type': 'ListItem', position: 35, name: 'Glossaire',                     url: `${BASE_URL}/fr/glossaire` },
  ],
}

export const aegrynWebSiteSchema = {
  '@context':   'https://schema.org',
  '@type':      'WebSite',
  '@id':        `${BASE_URL}/#website`,
  url:          BASE_URL,
  name:         'Aegryn',
  alternateName: ['Aegryn', 'Aegryn Swiss', 'Aegryn Advisory', 'Aegryn Valoriser', 'Aegryn Magazine', 'Aegryn Grade', 'Aegryn Valuation', 'Aegryn Talent', 'Aegryn Alliances', 'CIFSO 5000', 'CIFSO Valuation Index'],
  description:  'Aegryn — Swiss integrated advisory group. CIFSO 5000 certification (evidence-backed ownership and value record of organisations and their assets), CIFSO Valuation Index benchmarks, lifecycle support (Valoriser), advisory, compliance, executive talent, expert network, asset engineering, confidential structured mandates and Aegryn Magazine. Built to Last — keeping founders in control of their growth and their assets. Switzerland & Europe.',
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
      url: `${BASE_URL}/en/valoriser`,
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
