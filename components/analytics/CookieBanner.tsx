import Script from 'next/script'

const COOKIE_SCRIPT_ID = '95c60815b4306b9e3350caa17fee93a8'

export default function CookieBanner() {
  return (
    <Script
      id="cookie-script"
      src={`//cdn.cookie-script.com/s/${COOKIE_SCRIPT_ID}.js`}
      strategy="afterInteractive"
      charSet="UTF-8"
    />
  )
}
