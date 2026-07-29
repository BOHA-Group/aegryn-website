import Script from 'next/script'

const COOKIE_SCRIPT_ID = '95c60815b4306b9e3350caa17fee93a8'

/**
 * CookieScript — lazyOnload.
 * Charge après l'événement load (post-hydratation React complète).
 * afterInteractive causait une race condition : CookieScript injectait son
 * banner div dans <body> pendant que React hydratait → NotFoundError crash
 * (React tente removeChild sur un nœud déplacé → exception DOM fatale).
 * lazyOnload garantit que React a terminé l'hydratation avant tout inject DOM.
 * La conformité RGPD est maintenue via GA4 Consent Mode v2 (défaut "denied").
 */
export default function CookieBanner() {
  return (
    <Script
      id="cookie-script"
      src={`https://cdn.cookie-script.com/s/${COOKIE_SCRIPT_ID}.js`}
      strategy="lazyOnload"
      charSet="UTF-8"
    />
  )
}
