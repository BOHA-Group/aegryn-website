import type { MetadataRoute } from 'next'
import { ARTICLES } from '@/data/articles'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const

const STATIC_ROUTES = [
  // ── Core ────────────────────────────────────────────────────────────────
  { path: '',                                   priority: 1.0,  changeFrequency: 'weekly'  as const },
  { path: '/about',                             priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/contact',                           priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/blog',                              priority: 0.8,  changeFrequency: 'weekly'  as const },
  { path: '/roadmap',                           priority: 0.5,  changeFrequency: 'monthly' as const },
  { path: '/career',                            priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/alliances',                         priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/glossaire',                         priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Auction ─────────────────────────────────────────────────────────────
  { path: '/auction',                           priority: 1.0,  changeFrequency: 'weekly'  as const },
  { path: '/auction/catalog',                   priority: 1.0,  changeFrequency: 'daily'   as const },
  { path: '/auction/sessions',                  priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/auction/how-to-sell',               priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/auction/how-to-buy',                priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/auction/bid-models',                priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/auction/results',                   priority: 0.7,  changeFrequency: 'weekly'  as const },
  // ── Grade ────────────────────────────────────────────────────────────────
  { path: '/grade',                             priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/grade/methodology',                 priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/grade/grading-system',              priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/grade/partners',                    priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/grade/submit',                      priority: 0.8,  changeFrequency: 'monthly' as const },
  // ── Valuation ────────────────────────────────────────────────────────────
  { path: '/valuation',                         priority: 0.9,  changeFrequency: 'monthly' as const },
  // ── Advisory ─────────────────────────────────────────────────────────────
  { path: '/advisory',                          priority: 0.9,  changeFrequency: 'monthly' as const },
  // ── Assets ───────────────────────────────────────────────────────────────
  { path: '/assets',                            priority: 0.8,  changeFrequency: 'weekly'  as const },
  // ── Services ─────────────────────────────────────────────────────────────
  { path: '/services/acquisition-support',      priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/services/build',                    priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Help / FAQ ────────────────────────────────────────────────────────────
  { path: '/help/faq',                          priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Legal ─────────────────────────────────────────────────────────────────
  { path: '/terms/use',                         priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/terms/cgv',                         priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/privacy',                           priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/security',                          priority: 0.4,  changeFrequency: 'monthly' as const },
]

const WHAT_WE_BUILD_SLUG: Record<string, string> = {
  fr: '/ce-que-nous-construisons',
  en: '/what-we-build',
  de: '/was-wir-bauen',
  es: '/lo-que-construimos',
  it: '/cosa-costruiamo',
  nl: '/wat-we-bouwen',
}

const EXPERTS_SLUG: Record<string, string> = {
  fr: '/experts',
  en: '/experts',
  de: '/experten',
  es: '/expertos',
  it: '/esperti',
  nl: '/experts',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  for (const route of STATIC_ROUTES) {
    const alternates: Record<string, string> = {}
    for (const locale of LOCALES) {
      alternates[locale] = `${BASE}/${locale}${route.path}`
    }
    alternates['x-default'] = `${BASE}/en${route.path}`

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

  // /what-we-build — slugs localisés
  const wwbAlternates: Record<string, string> = {}
  for (const locale of LOCALES) {
    wwbAlternates[locale] = `${BASE}/${locale}${WHAT_WE_BUILD_SLUG[locale]}`
  }
  wwbAlternates['x-default'] = `${BASE}/en/what-we-build`
  for (const locale of LOCALES) {
    entries.push({
      url:             `${BASE}/${locale}${WHAT_WE_BUILD_SLUG[locale]}`,
      lastModified:    now,
      changeFrequency: 'monthly' as const,
      priority:        0.8,
      alternates:      { languages: wwbAlternates },
    })
  }

  // /experts — slugs localisés (fr+en+nl: /experts, de: /experten, es: /expertos, it: /esperti)
  const expertsAlternates: Record<string, string> = {}
  for (const locale of LOCALES) {
    expertsAlternates[locale] = `${BASE}/${locale}${EXPERTS_SLUG[locale]}`
  }
  expertsAlternates['x-default'] = `${BASE}/en/experts`
  for (const locale of LOCALES) {
    entries.push({
      url:             `${BASE}/${locale}${EXPERTS_SLUG[locale]}`,
      lastModified:    now,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
      alternates:      { languages: expertsAlternates },
    })
  }

  // Blog articles — all 6 locales with hreflang alternates
  for (const article of ARTICLES) {
    const articleAlternates: Record<string, string> = {}
    for (const locale of LOCALES) {
      articleAlternates[locale] = `${BASE}/${locale}/blog/${article.slug}`
    }
    articleAlternates['x-default'] = `${BASE}/en/blog/${article.slug}`

    for (const locale of LOCALES) {
      entries.push({
        url:             `${BASE}/${locale}/blog/${article.slug}`,
        lastModified:    new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority:        article.featured ? 0.8 : 0.7,
        alternates:      { languages: articleAlternates },
      })
    }
  }

  return entries
}
