const BASE = 'https://aegryn.com'

export function organizationJsonLd() {
  return {
    '@context':    'https://schema.org',
    '@type':       'Organization',
    '@id':         `${BASE}/#organization`,
    name:          'Aegryn',
    legalName:     'Aegryn',
    url:           BASE,
    logo:          `${BASE}/images/aegryn-logo.png`,
    foundingDate:  '2024',
    foundingLocation: {
      '@type':          'Place',
      addressCountry:   'CH',
      addressLocality:  'Zurich',
    },
    sameAs: [
      'https://www.linkedin.com/company/106273747/',
    ],
    contactPoint: {
      '@type':            'ContactPoint',
      email:              'contact@boha-group.com',
      contactType:        'customer service',
      availableLanguage:  ['French', 'English', 'German', 'Italian', 'Spanish', 'Dutch'],
    },
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type':    'WebSite',
    '@id':      `${BASE}/#website`,
    url:        BASE,
    name:       'Aegryn',
    description: 'Certified tech asset transactions in Europe — Grade system, Auction, Advisory.',
    publisher: { '@id': `${BASE}/#organization` },
    inLanguage: ['fr', 'en', 'de', 'it', 'es', 'nl'],
    potentialAction: {
      '@type':       'SearchAction',
      target:        `${BASE}/blog?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function serviceJsonLd({
  name,
  description,
  url,
  serviceType,
}: {
  name:        string
  description: string
  url:         string
  serviceType: string
}) {
  return {
    '@context':   'https://schema.org',
    '@type':      'Service',
    name,
    description,
    url,
    serviceType,
    provider: { '@id': `${BASE}/#organization` },
    areaServed: {
      '@type': 'GeoShape',
      name:    'Europe',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context':        'https://schema.org',
    '@type':           'BreadcrumbList',
    itemListElement:   items.map((item, i) => ({
      '@type':   'ListItem',
      position:  i + 1,
      name:      item.name,
      item:      item.url,
    })),
  }
}
