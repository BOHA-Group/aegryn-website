import type { Metadata } from 'next'
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

export function generateMetadata(): Metadata {
const isProd = process.env.VERCEL_ENV === 'production'
return {
  metadataBase: new URL('https://aegryn.com'),
  title: {
    default: 'Aegryn — Engineered to Last',
    template: '%s | Aegryn',
  },
  description: 'Aegryn is the Swiss organisation-value platform. CIFSO 5000 certification — the evidence-backed ownership and value record of an organisation and its assets — CIFSO Valuation Index benchmarks, certified digital-asset transactions, advisory, asset engineering and executive talent. St-Sulpice (VD), Switzerland — serving Europe. Built to Last.',
  keywords: [
    'Aegryn', 'Swiss Tech', 'digital assets', 'actifs numériques',
    'digital asset transaction', 'cession tech structurée', 'transact platform', 'M&A tech platform',
    'buy tech company', 'sell tech company', 'SaaS acquisition', 'SaaS for sale',
    'céder SaaS', 'cession SaaS Europe', 'vendre SaaS', 'SaaS exit Europe',
    'M&A tech', 'mergers acquisitions technology', 'cession entreprise numérique',
    'SaaS valuation', 'valorisation SaaS', 'ARR multiple',
    'certification CIFSO', 'CIFSO 5000', 'CIFSO Valuation Index',
    'souveraineté IA', 'AI sovereignty', 'transmissibilité entreprise',
    'séquestre suisse M&A', 'Swiss escrow M&A',
    'M&A experts', 'expert network', 'due diligence tech', 'W&I insurance',
    'cybersecurity', 'AI', 'EU AI Act', 'advisory', 'RGPD compliance',
    'Switzerland startup', 'Swiss holding', 'holding suisse tech',
    'plateforme M&A suisse', 'Swiss M&A platform',
    'ecosystem engineering', 'subblink', 'neediu', 'primiom', 'movtoo', 'hobconnect',
    'Aegryn Grade', 'asset grading', 'tech credit rating', 'Engineered to Last',
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
    description: 'Swiss organisation-value platform. CIFSO 5000 certification, CIFSO Valuation Index, certified digital-asset transactions — Built to Last.',
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
    description: 'Swiss organisation-value platform. CIFSO 5000 certification & Valuation Index.',
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

  /* html/body sont rendus par le root layout (app/layout.tsx) — jamais ici.
     Le script Consent Mode reste inline en premier pour s'exécuter avant GTM ;
     les JSON-LD en body sont valides pour les crawlers. */
  return (
    <>
      {/* Consent Mode v2 — DOIT être inline et exécuté
          avant tout script GTM/GA4/Cookie-Script.
          Garantit que les defaults "denied" sont lus par GTM dès son init. */}
      <script
        suppressHydrationWarning
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
        id="ld-org"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />
      <script
        id="ld-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynWebSiteSchema) }}
      />
      <script
        id="ld-sitenav"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynSiteNavigationSchema) }}
      />
      <NextIntlClientProvider messages={messages}>
        <LenisProvider>
          <a
            href="#main"
            className="rounded-lg sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-ag-navy px-4 py-2 text-sm font-bold text-white"
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
          {/* Désactivé en dev local et sur les previews Vercel pour ne pas gêner les tests — reste actif en production */}
          {process.env.VERCEL_ENV === 'production' && (
            <Script
              id="cookie-script"
              src="https://cdn.cookie-script.com/s/95c60815b4306b9e3350caa17fee93a8.js"
              strategy="afterInteractive"
            />
          )}
        </LenisProvider>
      </NextIntlClientProvider>
    </>
  )
}
