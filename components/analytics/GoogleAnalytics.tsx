'use client'

import Script from 'next/script'
import { useCookieScriptConsent } from '@/hooks/useCookieScriptConsent'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim()

/**
 * Google Tag Manager : chargé seulement après l'accord « performance » du visiteur (Cookie-Script).
 * Tant qu'il n'a pas choisi, ou s'il refuse, aucune requête ne part vers Google (adresse IP comprise).
 * Les valeurs par défaut « denied » du Consent Mode v2 restent posées en ligne dans layout.tsx.
 */
export default function GoogleAnalytics() {
  const granted = useCookieScriptConsent('performance')
  if (!GTM_ID || !granted) return null

  return (
    <>
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
          if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'granted' });
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}
