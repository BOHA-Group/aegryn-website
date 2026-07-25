import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://static.cloudflareinsights.com https://vercel.live",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https: https://www.google-analytics.com",
  "media-src 'self' blob:",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://vitals.vercel-insights.com https://cloudflareinsights.com https://vercel.live wss: wss://ws-us3.pusher.com",
  "frame-src https://vercel.live",
  "frame-ancestors 'self' https://vercel.live https://*.vercel.app https://vercel.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ')

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control',        value: 'on' },
  { key: 'X-Frame-Options',               value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options',        value: 'nosniff' },
  { key: 'X-XSS-Protection',              value: '1; mode=block' },
  { key: 'Referrer-Policy',               value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security',     value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Permissions-Policy',            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
  { key: 'Content-Security-Policy',       value: CSP },
  { key: 'X-Robots-Tag',                  value: 'index, follow, max-image-preview:large, max-snippet:-1' },
  { key: 'Cross-Origin-Opener-Policy',    value: 'same-origin-allow-popups' },
  { key: 'Cross-Origin-Resource-Policy',  value: 'same-origin' },
  { key: 'Cross-Origin-Embedder-Policy',  value: 'unsafe-none' },
]

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  turbopack: {
    root: __dirname,
  },
  async redirects() {
    return [
      { source: '/:locale/grow-with-us',             destination: '/:locale/alliances',              permanent: true },
      { source: '/:locale/auction/session',          destination: '/:locale/auction/sessions',        permanent: true },
      { source: '/:locale/what-we-build',             destination: '/:locale/assets',                 permanent: true },
      { source: '/what-we-build',                     destination: '/assets',                         permanent: true },
      { source: '/grow-with-us',                      destination: '/alliances',                      permanent: true },
      { source: '/:locale/auction/assessment-days',   destination: '/:locale/auction/sessions',        permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/_next/static/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/fonts/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      {
        source: '/images/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
      },
      {
        source: '/audio/(.*)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=86400' }],
      },
      {
        source: '/manifest.webmanifest',
        headers: [{ key: 'Content-Type', value: 'application/manifest+json' }],
      },
    ]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 86400,
  },
  compress: true,
  poweredByHeader: false,
}

export default withNextIntl(nextConfig)
