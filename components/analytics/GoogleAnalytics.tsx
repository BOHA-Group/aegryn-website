'use client'

import Script from 'next/script'
import { useCookieConsent } from '@/hooks/useCookieConsent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function GoogleAnalytics() {
  const { status } = useCookieConsent()

  if (!GA_ID || status !== 'accepted') return null

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'granted',
            ad_storage: 'denied',
          });
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
