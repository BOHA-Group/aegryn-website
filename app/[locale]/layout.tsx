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
import { aegrynOrganizationSchema, aegrynWebSiteSchema, aegrynSiteNavigationSchema, socialImageUrl } from '@/lib/seo'
import '@/styles/globals.css'
import { BoutiqueAudioProvider } from '@/components/boutique/BoutiqueAudio'

export function generateMetadata(): Metadata {
const isProd = process.env.VERCEL_ENV === 'production'
return {
  metadataBase: new URL('https://aegryn.com'),
  title: {
    default: 'Aegryn, Swiss firm of entrepreneurs | Advisory and signature projects',
    template: '%s | Aegryn',
  },
  description: 'Aegryn is a Swiss firm of entrepreneurs: eight advisory disciplines for leaders of SMEs and mid-sized companies, and La Boutique for a limited number of signature projects. Frame, deliver, accompany, select, stay informed. Rare by selection. Discreet by principle. St-Sulpice (VD), Switzerland, open to the world.',
  keywords: [
    'Aegryn', 'cabinet d\'entrepreneurs', 'firm of entrepreneurs', 'boutique entrepreneuriale', 'La Boutique Aegryn',
    'projets signature', 'signature projects', 'cabinet de conseil intégré', 'integrated advisory firm',
    'cadrer réaliser accompagner', 'frame deliver accompany', 'conseil PME ETI Suisse', 'Swiss advisory firm',
    'stratégie d\'entreprise', 'gestion des risques et conformité', 'finance et performance',
    'technologie et souveraineté', 'excellence opérationnelle', 'talent et organisation',
    'pilotage de projets et de programmes', 'M&A PMI', 'certification CIFSO 5000', 'CIFSO Valuation Index',
    'NIS2', 'DORA', 'EU AI Act', 'souveraineté IA', 'Aegryn Magazine', 'Switzerland', 'Europe',
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
    title:       'Aegryn, Swiss firm of entrepreneurs',
    description: 'Eight advisory disciplines and La Boutique for signature projects. Frame, deliver, accompany, select, stay informed. Rare by selection. Discreet by principle.',
    url:         'https://aegryn.com',
    siteName:    'Aegryn',
    images:      [{ url: socialImageUrl('Aegryn, Swiss firm of entrepreneurs'), width: 1200, height: 630, alt: 'Aegryn, Swiss firm of entrepreneurs' }],
    locale:      'fr_FR',
    type:        'website',
  },
  twitter: {
    card:    'summary_large_image',
    site:    '@aegrynhq',
    creator: '@aegrynhq',
    title:   'Aegryn, Swiss firm of entrepreneurs',
    description: 'Eight advisory disciplines and La Boutique for signature projects. Rare by selection. Discreet by principle.',
    images:  [socialImageUrl('Aegryn, Swiss firm of entrepreneurs')],
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
        <BoutiqueAudioProvider locale={locale}>
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
        </BoutiqueAudioProvider>
      </NextIntlClientProvider>
    </>
  )
}
