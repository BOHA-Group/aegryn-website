import type { Metadata } from 'next'
import localFont from 'next/font/local'
import Script from 'next/script'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import Nav,  { type NavUser } from '@/components/layout/Nav'
import Footer                 from '@/components/layout/Footer'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import LenisProvider from '@/components/providers/LenisProvider'
import { ScrollToTop } from '@/components/ui/ScrollToTop'
import GoogleAnalytics from '@/components/analytics/GoogleAnalytics'
import MetaPixel from '@/components/analytics/MetaPixel'
import { aegrynOrganizationSchema, aegrynWebSiteSchema, aegrynSiteNavigationSchema } from '@/lib/seo'
import '@/styles/globals.css'

const plusJakartaSans = localFont({
  src: [
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Light-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Regular-400.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Medium-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-Bold-700.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold-800.woff2',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
  fallback: ['system-ui', '-apple-system', 'sans-serif'],
})

export function generateMetadata(): Metadata {
const isProd = process.env.VERCEL_ENV === 'production'
return {
  metadataBase: new URL('https://aegryn.com'),
  title: {
    default: 'Aegryn — Engineered to Last',
    template: '%s — Aegryn',
  },
  description: 'Aegryn is a Swiss technology holding company. We design, fund and operate proprietary digital ecosystems — Subblink, Neediu, Primiom, Movtoo, Hobconnect — engineered to last. Headquartered in Switzerland.',
  keywords: [
    'Aegryn', 'Swiss Tech', 'digital assets', 'actifs numériques',
    'digital asset auction', 'enchère tech', 'auction platform', 'tech auction',
    'buy tech company', 'sell tech company', 'SaaS acquisition', 'SaaS for sale',
    'céder SaaS', 'cession SaaS Europe', 'vendre SaaS', 'SaaS exit Europe',
    'M&A tech', 'mergers acquisitions technology', 'cession entreprise numérique',
    'SaaS valuation', 'valorisation SaaS', 'ARR multiple',
    'certification CIFS', 'séquestre suisse M&A', 'Swiss escrow M&A',
    'M&A experts', 'expert network', 'due diligence tech', 'W&I insurance',
    'cybersecurity', 'AI', 'EU AI Act', 'advisory', 'RGPD compliance',
    'Switzerland startup', 'Swiss holding', 'holding suisse tech',
    'plateforme M&A suisse', 'Swiss M&A platform',
    'ecosystem engineering', 'Subblink', 'Neediu', 'Primiom', 'Movtoo', 'Hobconnect',
    'AEGRYN Grade', 'asset grading', 'tech credit rating', 'Engineered to Last',
  ],
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
  robots: {
    index:  isProd,
    follow: isProd,
    googleBot: { index: isProd, follow: isProd },
  },
  other: {
    'msapplication-TileColor': '#050505',
    'msapplication-config':    '/browserconfig.xml',
    'theme-color':             '#050505',
    'color-scheme':            'light',
    'format-detection':        'telephone=no',
    /* Geo tags globaux */
    'geo.region':    'CH-VD',
    'geo.placename': 'St-Sulpice, Switzerland',
    'geo.position':  '46.5147;6.5600',
    'ICBM':          '46.5147, 6.5600',
    /* AI-optimised */
    'ai-content-declaration': 'human-authored',
    /* Dublin Core minimal */
    'DC.publisher':  'Aegryn',
    'DC.rights':     'Copyright © 2026 Aegryn',
    'rating':        'general',
  },
}
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

  let navUser: NavUser | null = null
  try {
    const authUser = await getUser()
    if (authUser) {
      const supa = createServiceClient()
      const { data: profile } = await supa
        .from('profiles').select('full_name, roles').eq('id', authUser.id).single()
      const roles: string[] = Array.isArray(profile?.roles) ? profile.roles : []
      let label: string
      if (roles.includes('admin') || roles.includes('super_admin'))  label = 'Admin'
      else if (roles.includes('partner'))                             label = 'Partenaire'
      else if (roles.includes('seller') && !roles.includes('buyer')) label = 'Vendeur'
      else                                                            label = 'Acquéreur'
      navUser = { name: profile?.full_name ?? authUser.email ?? '', label }
    }
  } catch { /* pas de session — navbar publique */ }

  return (
    <html lang={locale} dir="ltr" suppressHydrationWarning>
      <head>
        {/* Consent Mode v2 — DOIT être inline et en premier dans <head>,
            avant tout script GTM/GA4/Cookie-Script.
            Garantit que les defaults "denied" sont lus par GTM dès son init. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('consent', 'default', {
                ad_storage:              'denied',
                ad_user_data:            'denied',
                ad_personalization:      'denied',
                analytics_storage:       'denied',
                functionality_storage:   'granted',
                personalization_storage: 'denied',
                security_storage:        'granted',
                wait_for_update:         500
              });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynWebSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynSiteNavigationSchema) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} font-sans bg-ag-white text-ag-dark antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <LenisProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-ag-navy px-4 py-2 text-sm font-bold text-white"
            >
              Skip to content
            </a>
            <Nav user={navUser} />
            <div id="main" className="pt-16">
              {children}
            </div>
            <Footer />
            <ScrollToTop />
            <GoogleAnalytics />
            <MetaPixel />
            {/* Cookie-Script — afterInteractive pour détecter dans le HTML et éviter crash hydration */}
            <Script
              id="cookie-script"
              src="https://cdn.cookie-script.com/s/95c60815b4306b9e3350caa17fee93a8.js"
              strategy="afterInteractive"
            />
          </LenisProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
