import type { MetadataRoute } from 'next'

const BASE = 'https://aegryn.com'
const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const

const STATIC_ROUTES = [
  { path: '',                                   priority: 1.0,  changeFrequency: 'weekly'  as const },
  { path: '/about',                             priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/advisory',                          priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/assets',                            priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/discover',                          priority: 0.8,  changeFrequency: 'weekly'  as const },
  { path: '/contact',                           priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/grade',                             priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/grade/methodology',                 priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/grade/partners',                    priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/auction',                           priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/auction/catalog',                   priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/auction/how-to-sell',               priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/auction/how-to-buy',                priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/auction/sessions',                  priority: 0.8,  changeFrequency: 'weekly'  as const },
  { path: '/auction/bid-models',                priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/auction/results',                   priority: 0.6,  changeFrequency: 'weekly'  as const },
  { path: '/grade/submit',                      priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/valuation',                         priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/services/acquisition-support',      priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/alliances',                          priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/career',                            priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/terms/use',                         priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/terms/cgv',                         priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/privacy',                           priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/security',                          priority: 0.4,  changeFrequency: 'monthly' as const },
  { path: '/help/faq',                          priority: 0.6,  changeFrequency: 'monthly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const route of STATIC_ROUTES) {
    const alternates: Record<string, string> = {}
    for (const locale of LOCALES) {
      alternates[locale] = `${BASE}/${locale}${route.path}`
    }
    alternates['x-default'] = `${BASE}/fr${route.path}`

    for (const locale of LOCALES) {
      entries.push({
        url:              `${BASE}/${locale}${route.path}`,
        lastModified:     now,
        changeFrequency:  route.changeFrequency,
        priority:         route.priority,
        alternates:       { languages: alternates },
      })
    }
  }

  return entries
}
