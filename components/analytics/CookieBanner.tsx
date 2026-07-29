import Script from 'next/script'

const COOKIE_SCRIPT_ID = '95c60815b4306b9e3350caa17fee93a8'

/**
 * CookieScript — afterInteractive.
 * La conformité RGPD est assurée par GA4 Consent Mode v2 (défaut "denied")
 * déclaré dans GoogleAnalytics.tsx via gtag('consent','default',...).
 * CookieScript s'exécute en premier dans la file afterInteractive (root layout)
 * avant GA/Stripe qui sont dans [locale]/layout.tsx.
 * beforeInteractive modifiait le DOM avant l'hydratation React → NotFoundError crash.
 */
export default function CookieBanner() {
  return (
    <Script
      id="cookie-script"
      src={`https://cdn.cookie-script.com/s/${COOKIE_SCRIPT_ID}.js`}
      strategy="afterInteractive"
      charSet="UTF-8"
    />
  )
}
