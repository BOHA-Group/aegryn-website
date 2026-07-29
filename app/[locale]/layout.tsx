import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import '@/styles/globals.css'


export const metadata: Metadata = {
  metadataBase: new URL('https://aegryn.com'),
  title: {
    default: 'Aegryn — Engineered to Last',
    template: '%s — Aegryn',
  },
  description: 'Aegryn is a Swiss technology holding company. We design, fund and operate proprietary digital ecosystems — Subblink, Neediu, Primiom, Movtoo, Hobconnect — engineered to last. Headquartered in Switzerland.',
  keywords: ['Aegryn', 'Swiss Tech', 'digital assets', 'ecosystem engineering', 'cybersecurity', 'AI', 'SaaS', 'Switzerland startup'],
  authors: [{ name: 'Yohann Bollack', url: 'https://aegryn.com' }],
  creator: 'Aegryn',
  publisher: 'Aegryn',
  icons: {
    icon: [
      { url: '/favicon.svg',        type: 'image/svg+xml' },
      { url: '/favicon-32x32.png',  sizes: '32x32',   type: 'image/png' },
      { url: '/favicon-180x180.png',sizes: '180x180', type: 'image/png' },
      { url: '/favicon-512x512.png',sizes: '512x512', type: 'image/png' },
    ],
    apple:   [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other:   [{ rel: 'mask-icon', url: '/favicon.svg', color: '#5ADDA4' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    title:       'Aegryn — Engineered to Last',
    description: 'Swiss Tech Asset Builder. Proprietary digital ecosystems engineered to last.',
    url:         'https://aegryn.com',
    siteName:    'Aegryn',
    images:      [{ url: '/og/default.jpg', width: 1200, height: 630, alt: 'Aegryn — Engineered to Last' }],
    locale:      'fr_FR',
    type:        'website',
  },
  twitter: {
    card:    'summary_large_image',
    site:    '@aegryn',
    creator: '@aegryn',
    title:   'Aegryn — Engineered to Last',
    description: 'Swiss Tech Asset Builder.',
    images:  ['/og/default.jpg'],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
  },
  other: {
    'msapplication-TileColor': '#050505',
    'msapplication-config':    '/browserconfig.xml',
    'theme-color':             '#050505',
    'color-scheme':            'light',
    'format-detection':        'telephone=no',
  },
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'fr' | 'en' | 'it' | 'es' | 'de' | 'nl')) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} dir="ltr">
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
