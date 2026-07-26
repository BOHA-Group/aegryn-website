import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID

export default function GoogleAnalytics() {
  if (!GTM_ID) return null

  return (
    <>
      {/* Consent Mode v2 — defaults refusés avant tout chargement GTM.
          Cookie-Script met à jour ces valeurs via gtag('consent','update',...)
          quand l'utilisateur accepte ou refuse dans la bannière.
          GTM / GA4 respectent ces signaux automatiquement. */}
      <Script id="gtm-consent-defaults" strategy="beforeInteractive">
        {`
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
        `}
      </Script>

      {/* GTM — se charge après le consent default ci-dessus */}
      <Script id="gtm-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        strategy="afterInteractive"
      />
    </>
  )
}
