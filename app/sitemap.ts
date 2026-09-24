import type { MetadataRoute } from 'next'
import { ARTICLES }    from '@/data/articles'
import { INDUSTRIES }  from '@/data/industries'
import { Aegryn_ASSETS } from '@/data/assets'
import { ARTICLES_01 } from '@/content/magazine/issue-01/articles'
import { routing }     from '@/i18n/routing'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
const LOCALES = routing.locales

/* Chemin interne → chemin public localisé (pathnames next-intl) */
const PATHNAMES = routing.pathnames as Record<string, string | Record<string, string>>
function lp(path: string, locale: string): string {
  const entry = PATHNAMES[path]
  return entry && typeof entry === 'object' ? (entry[locale] ?? path) : path
}

const STATIC_ROUTES = [
  // ── Core ─────────────────────────────────────────────────────────────────────
  { path: '',                                    priority: 1.0,  changeFrequency: 'weekly'  as const },
  { path: '/about',                              priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/contact',                            priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/blog',                               priority: 0.8,  changeFrequency: 'weekly'  as const },
  { path: '/workforce',                          priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/roadmap',                            priority: 0.5,  changeFrequency: 'monthly' as const },
  { path: '/career',                             priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/alliances',                          priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/investisseurs',                      priority: 0.6,  changeFrequency: 'monthly' as const },
  { path: '/glossaire',                          priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/sitemap',                            priority: 0.4,  changeFrequency: 'monthly' as const },
  { path: '/what-we-build',                      priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/experts',                            priority: 0.8,  changeFrequency: 'weekly'  as const },
  // ── Industries ───────────────────────────────────────────────────────────────
  { path: '/industries',                         priority: 0.8,  changeFrequency: 'monthly' as const },
  // ── Valoriser — cycles de vie ────────────────────────────────────────────────
  { path: '/valoriser',                          priority: 1.0,  changeFrequency: 'weekly'  as const },
  { path: '/valoriser/lancement',                priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/valoriser/croissance',               priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/valoriser/restructuration',          priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/valoriser/acquisition',              priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/valoriser/transmission',             priority: 0.9,  changeFrequency: 'monthly' as const },
  // ── Transact — outils & marketplace (inchangé) ──────────────────────────────
  { path: '/transact/sessions',                  priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/transact/mandate',                   priority: 1.0,  changeFrequency: 'monthly' as const },
  { path: '/transact/sell',                      priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/how-it-works',              priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/submit',                    priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/buyers',                    priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/transact/bid-models',                priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/transact/results',                   priority: 0.7,  changeFrequency: 'weekly'  as const },
  // ── Grade & Certification CIFSO 5000 ─────────────────────────────────────────
  { path: '/grade',                              priority: 1.0,  changeFrequency: 'monthly' as const },
  { path: '/grade/brochure',                     priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/verify',                             priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/grade/partners',                     priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/grade/submit',                       priority: 0.9,  changeFrequency: 'monthly' as const },
  // ── Valuation / CIFSO Valuation Index ────────────────────────────────────────
  { path: '/valuation',                          priority: 1.0,  changeFrequency: 'weekly'  as const },
  // ── Advisory ─────────────────────────────────────────────────────────────────
  { path: '/advisory',                           priority: 0.9,  changeFrequency: 'monthly' as const },
  { path: '/advisory/technology',                priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/advisory/strategy',                  priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/advisory/risk-compliance',           priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/advisory/talent-organization',       priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/advisory/ma',                        priority: 0.8,  changeFrequency: 'monthly' as const },
  // ── Talent ───────────────────────────────────────────────────────────────────
  { path: '/talent',                             priority: 0.9,  changeFrequency: 'weekly'  as const },
  // ── Network ──────────────────────────────────────────────────────────────────
  { path: '/network',                            priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Assets & Portfolio ───────────────────────────────────────────────────────
  { path: '/assets',                             priority: 0.8,  changeFrequency: 'weekly'  as const },
  { path: '/portfolio',                          priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Services ─────────────────────────────────────────────────────────────────
  { path: '/services/acquisition-support',       priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/services/build',                     priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Magazine ─────────────────────────────────────────────────────────────────
  { path: '/magazine',                           priority: 0.9,  changeFrequency: 'weekly'  as const },
  { path: '/magazine/issue-01',                  priority: 0.8,  changeFrequency: 'monthly' as const },
  { path: '/magazine/issue-01/cover',            priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/magazine/issue-01/web',              priority: 0.7,  changeFrequency: 'monthly' as const },
  { path: '/magazine/issue-01/flipbook',         priority: 0.6,  changeFrequency: 'monthly' as const },
  // ── Help / FAQ ───────────────────────────────────────────────────────────────
  { path: '/help/faq',                           priority: 0.7,  changeFrequency: 'monthly' as const },
  // ── Legal ────────────────────────────────────────────────────────────────────
  { path: '/terms/use',                          priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/terms/cgv',                          priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/terms/ai-usage',                     priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/privacy',                            priority: 0.3,  changeFrequency: 'yearly'  as const },
  { path: '/security',                           priority: 0.4,  changeFrequency: 'monthly' as const },
  { path: '/data-protection-notice-neediu',      priority: 0.2,  changeFrequency: 'yearly'  as const },
]

/* Exclus volontairement : /client/* (privé), /grade/submit/success (confirmation),
   /transact/teaser-preview (aperçu), /transact/lot/[slug] (noindex, accès NDA),
   /transact/catalog (redirige désormais systématiquement vers /transact — catalogue
   confidentiel, sélection après NDA), /verify/[code] (une URL par certificat),
   /magazine/report* (301 → /magazine/issue-01), /platform, /advisory/ai,
   /valuation/guide (routes inexistantes → 404).
   /magazine/issue-01/web est conservé : c'est l'édition web du magazine (lecture
   article par article), qui redirige vers son fichier HTML statique une fois
   l'accès public actif (canAccessIssue) — même logique que /cover et /flipbook. */

function pushLocalized(
  entries: MetadataRoute.Sitemap,
  internalPath: string,
  opts: { lastModified: Date; changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly'; priority: number },
) {
  const alternates: Record<string, string> = {}
  for (const locale of LOCALES) {
    alternates[locale] = `${BASE}/${locale}${lp(internalPath, locale)}`
  }
  alternates['x-default'] = `${BASE}/fr${lp(internalPath, 'fr')}`

  for (const locale of LOCALES) {
    entries.push({
      url:             `${BASE}/${locale}${lp(internalPath, locale)}`,
      lastModified:    opts.lastModified,
      changeFrequency: opts.changeFrequency,
      priority:        opts.priority,
      alternates:      { languages: alternates },
    })
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  // Routes statiques × 6 locales (slugs localisés via routing.pathnames)
  for (const route of STATIC_ROUTES) {
    pushLocalized(entries, route.path, {
      lastModified:    now,
      changeFrequency: route.changeFrequency,
      priority:        route.priority,
    })
  }

  // Industries × 6 locales
  for (const industry of INDUSTRIES) {
    pushLocalized(entries, `/industries/${industry.slug}`, {
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.7,
    })
  }

  // Actifs propriétaires × 6 locales
  for (const asset of Aegryn_ASSETS.filter(a => a.id !== 'kryv')) {
    pushLocalized(entries, `/assets/${asset.slug}`, {
      lastModified:    now,
      changeFrequency: 'monthly',
      priority:        0.7,
    })
  }

  // Articles du magazine (issue-01) × 6 locales
  for (const article of ARTICLES_01) {
    pushLocalized(entries, `/magazine/issue-01/${article.slug}`, {
      lastModified:    now,
      changeFrequency: 'yearly',
      priority:        0.6,
    })
  }

  // Articles de blog × 6 locales
  for (const article of ARTICLES) {
    pushLocalized(entries, `/blog/${article.slug}`, {
      lastModified:    new Date(article.date),
      changeFrequency: 'monthly',
      priority:        article.featured ? 0.8 : 0.7,
    })
  }

  return entries
}
