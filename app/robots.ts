import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base         = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
  const isProduction = process.env.VERCEL_ENV === 'production'

  /* Sur les environnements non-production (preview, branch deploys, local)
   * on bloque tout crawl pour éviter l'indexation des URLs *.vercel.app */
  if (!isProduction) {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    }
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/client/'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host:    base,
  }
}
