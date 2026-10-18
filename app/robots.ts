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

  const privateAreas = ['/api/', '/admin/', '/client/', '/*/client/', '/nda/', '/*/nda/', '/*/annuaire']
  const aiCrawlers = [
    'GPTBot', 'ChatGPT-User', 'OAI-SearchBot',
    'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai',
    'PerplexityBot', 'Perplexity-User',
    'Google-Extended', 'Applebot', 'Applebot-Extended',
    'Googlebot', 'Bingbot', 'DuckDuckBot', 'YouBot', 'MistralAI-User', 'cohere-ai',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/api/og', '/llms.txt', '/llms-full.txt', '/llms-updated.txt'],
        disallow: privateAreas,
      },
      /* Explicit allow for major search and AI crawlers, mêmes zones privées exclues */
      {
        userAgent: aiCrawlers,
        allow: ['/', '/api/og', '/llms.txt', '/llms-full.txt', '/llms-updated.txt'],
        disallow: privateAreas,
      },
    ],
    sitemap: [`${base}/sitemap.xml`],
    host:    base,
  }
}
