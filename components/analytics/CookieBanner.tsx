import Script from 'next/script'

const COOKIE_SCRIPT_ID = '95c60815b4306b9e3350caa17fee93a8'

/**
 * CookieScript — DOIT être chargé en beforeInteractive.
 * Cela bloque Stripe, GA, Meta Pixel et tout autre script tiers
 * tant que le consentement RGPD n'est pas donné.
 * strategy="afterInteractive" ou "lazyOnload" laisserait passer
 * des cookies avant consentement → violation RGPD.
 *
 * IMPORTANT : ce composant doit être rendu dans app/layout.tsx (root layout)
 * car beforeInteractive n'est supporté qu'au niveau du document racine
 * dans Next.js App Router.
 */
export default function CookieBanner() {
  return (
    <Script
      id="cookie-script"
      src={`https://cdn.cookie-script.com/s/${COOKIE_SCRIPT_ID}.js`}
      strategy="beforeInteractive"
      charSet="UTF-8"
    />
  )
}
