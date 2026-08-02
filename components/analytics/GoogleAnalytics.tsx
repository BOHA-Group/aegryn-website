import Script from 'next/script'

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID?.trim()

export default function GoogleAnalytics() {
  if (!GTM_ID) return null

  return (
    <>
      {/* GTM — consent default géré inline dans layout.tsx <head> (avant ce script) */}
      <Script id="gtm-init" strategy="lazyOnload">
        {`
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({'gtm.start': new Date().getTime(), event: 'gtm.js'});
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`}
        strategy="lazyOnload"
      />
    </>
  )
}
