import type { Metadata } from 'next'

const BASE_URL = 'https://aegryn.com'

export function generateAegrynMetadata({
  title,
  description,
  path = '',
  locale = 'fr',
  image = '/og/default.jpg',
}: {
  title: string
  description: string
  path?: string
  locale?: string
  image?: string
}): Metadata {
  const url = `${BASE_URL}/${locale}${path}`
  const fullTitle = `${title} — Aegryn`

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages: {
        fr: `${BASE_URL}/fr${path}`,
        en: `${BASE_URL}/en${path}`,
        de: `${BASE_URL}/de${path}`,
        it: `${BASE_URL}/it${path}`,
        es: `${BASE_URL}/es${path}`,
        nl: `${BASE_URL}/nl${path}`,
        'x-default': `${BASE_URL}/fr${path}`,
      },
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: 'Aegryn',
      locale: locale === 'fr' ? 'fr_FR' : `${locale}_${locale.toUpperCase()}`,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export const aegrynOrganizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://aegryn.com/#organization',
  name: 'Aegryn Sàrl',
  url: 'https://aegryn.com',
  logo: 'https://aegryn.com/images/aegryn-logo.svg',
  description: 'Swiss Tech Asset Builder — Engineered to Last',
  foundingDate: '2023',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Suisse',
    addressCountry: 'CH',
  },
  sameAs: ['https://www.linkedin.com/company/aegryn'],
  founder: {
    '@type': 'Person',
    name: 'Yohann Bollack',
    jobTitle: 'Founder & CEO',
  },
}
