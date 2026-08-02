import Script from 'next/script'

const COOKIE_SCRIPT_ID = '95c60815b4306b9e3350caa17fee93a8'

/**
 * CookieScript — afterInteractive.
 * Se charge dès que la page est interactive (après hydratation React).
 * Le crash hydration NotFoundError est résolu via dangerouslySetInnerHTML
 * + useLayoutEffect sur les composants GSAP — lazyOnload n'est plus nécessaire.
 * La conformité RGPD est maintenue via GA4 Consent Mode v2 (défaut "denied" inline dans <head>).
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
