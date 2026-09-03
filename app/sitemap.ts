import type { MetadataRoute } from 'next'
import { ARTICLES } from '@/data/articles'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
const LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const

const STATIC_ROUTES = [
  // ── Core ─────────────────────────────────────────────────────────────────────
  { path: '',                                    priority: 1.0,  changeFrequency: 'weekly'  as const },
  { path: '/about',                              priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/contact',                            priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/blog',                               priority: 0.8,  changeFrequency: 'weekly'  as const },
  { path: '/roadmap',                            priority: 0.5,  changeFrequency: 'monthly' as const },
  { path: '/career',                             priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/alliances',                          priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/glossaire',                          priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Transact ─────────────────────────────────────────────────────────────────
  { path: '/transact',                           priority: 1.0,  changeFrequency: 'weekly'  as const },
  { path: '/transact/catalog',                   priority: 1.0,  changeFrequency: 'daily'   as const },
  { path: '/transact/sessions',                  priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/transact/mandate',                   priority: 1.0,  changeFrequency: 'monthly' as const },
  { path: '/transact/sell',                      priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/how-to-sell',               priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/how-to-buy',                priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/how-it-works',              priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/submit',                    priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/buyers',                    priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/bid-models',                priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/transact/results',                   priority: 0.7,  changeFrequency: 'weekly'  as const },
  // ── Grade ─────────────────────────────────────────────────────────────────────
  { path: '/grade',                              priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/grade/methodology',                  priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/grade/grading-system',               priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/grade/partners',                     priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/grade/submit',                       priority: 0.8,  changeFrequency: 'monthly' as const },
  // ── Valuation ─────────────────────────────────────────────────────────────────
  { path: '/valuation',                          priority: 0.9,  changeFrequency: 'monthly' as const },
  // ── Advisory ──────────────────────────────────────────────────────────────────
  { path: '/advisory',                           priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/advisory/technology',                priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/advisory/strategy',                  priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/advisory/ma',                        priority: 0.8,  changeFrequency: 'monthly' as const },
  // ── Talent ────────────────────────────────────────────────────────────────────
  { path: '/talent',                             priority: 0.9,  changeFrequency: 'weekly'  as const },
  // ── Network ───────────────────────────────────────────────────────────────────
  { path: '/network',                            priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Assets (portfolio) ────────────────────────────────────────────────────────
  { path: '/assets',                             priority: 0.8,  changeFrequency: 'weekly'  as const },
  // ── Services ──────────────────────────────────────────────────────────────────
  { path: '/services/acquisition-support',       priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/services/build',                     priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Magazine ──────────────────────────────────────────────────────────────────
  { path: '/magazine',                           priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/magazine/issue-01/cover',            priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/magazine/issue-01/web',              priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/magazine/issue-01/flipbook',         priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/magazine/report',                    priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/magazine/report/2027',               priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/magazine/report/2027/pdf',           priority: 0.5,  changeFrequency: 'yearly'  as const },
  { path: '/sitemap',                            priority: 0.4,  changeFrequency: 'monthly' as const },
  // ── Help / FAQ ────────────────────────────────────────────────────────────────
  { path: '/help/faq',                           priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Legal ─────────────────────────────────────────────────────────────────────
  { path: '/terms/use',                          priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/terms/cgv',                          priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/terms/ai-usage',                     priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/privacy',                            priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/security',                           priority: 0.4,  changeFrequency: 'monthly' as const },
  { path: '/data-protection-notice-neediu',      priority: 0.2,  changeFrequency: 'yearly'  as const },
]

// Slugs localisés — what-we-build
const WHAT_WE_BUILD_SLUG: Record<string, string> = {
  fr: '/ce-que-nous-construisons',
  en: '/what-we-build',
  de: '/was-wir-bauen',
  es: '/lo-que-construimos',
  it: '/cosa-costruiamo',
  nl: '/wat-we-bouwen',
}

// Slugs localisés — experts/network
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

  // Routes statiques × 6 locales
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

  // /what-we-build — slugs localisés
  const wwbAlternates: Record<string, string> = {}
  for (const locale of LOCALES) {
    wwbAlternates[locale] = `${BASE}/${locale}${WHAT_WE_BUILD_SLUG[locale]}`
  }
  wwbAlternates['x-default'] = `${BASE}/fr${WHAT_WE_BUILD_SLUG['fr']}`
  for (const locale of LOCALES) {
    entries.push({
      url:             `${BASE}/${locale}${WHAT_WE_BUILD_SLUG[locale]}`,
      lastModified:    now,
      changeFrequency: 'monthly' as const,
      priority:        0.8,
      alternates:      { languages: wwbAlternates },
    })
  }

  // /experts — slugs localisés
  const expertsAlternates: Record<string, string> = {}
  for (const locale of LOCALES) {
    expertsAlternates[locale] = `${BASE}/${locale}${EXPERTS_SLUG[locale]}`
  }
  expertsAlternates['x-default'] = `${BASE}/fr/experts`
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
    articleAlternates['x-default'] = `${BASE}/fr/blog/${article.slug}`

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
