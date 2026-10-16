import type { ComponentProps } from 'react'
import type { Link } from '@/i18n/navigation'

export type LinkHref = ComponentProps<typeof Link>['href']
export type DropdownKey = 'craft' | 'solutions' | 'thinking' | 'who' | 'boutique' | null
export type NavLink = { labelKey: string; href: LinkHref; muted?: boolean }

/* Nos métiers : Cadrer et réaliser, huit métiers sous un seul titre (deux colonnes, ordre de lecture ligne par ligne) */
export const CRAFT_METIERS: NavLink[] = [
  { labelKey: 'craftSupportStrategy',        href: '/advisory/strategy' as LinkHref },
  { labelKey: 'craftSupportRiskCompliance',  href: '/advisory/risk-compliance' as LinkHref },
  { labelKey: 'craftFinance',                href: '/advisory/finance-performance' as LinkHref },
  { labelKey: 'craftSupportTechnology',      href: '/advisory/technology' as LinkHref },
  { labelKey: 'craftOperations',             href: '/advisory/operations-excellence' as LinkHref },
  { labelKey: 'craftSupportTalentOrg',       href: '/advisory/talent-organization' as LinkHref },
  { labelKey: 'craftProgram',                href: '/advisory/project-program-management' as LinkHref },
  { labelKey: 'craftSupportMA',              href: '/advisory/ma' as LinkHref },
]

/* Nos métiers : Par situation (cinq cycles de vie) */
export const CRAFT_TRANSACT_CYCLES: NavLink[] = [
  { labelKey: 'craftTransactLancement',       href: '/accompagner/lancement' as LinkHref },
  { labelKey: 'craftTransactCroissance',      href: '/accompagner/croissance' as LinkHref },
  { labelKey: 'craftTransactRestructuration', href: '/accompagner/restructuration' as LinkHref },
  { labelKey: 'craftTransactBuy',             href: '/accompagner/acquisition' as LinkHref },
  { labelKey: 'craftTransactSell',            href: '/accompagner/transmission' as LinkHref },
]

/* Nos publications : magazine (les éditions à venir sont grisées mais restent cliquables) */
export const THINKING_MAGAZINE_LINKS: NavLink[] = [
  { labelKey: 'thinkingMagazineIssues',   href: '/magazine' },
  { labelKey: 'thinkingMagazineIssue02',  href: '/magazine', muted: true },
  { labelKey: 'thinkingMagazineIssue03',  href: '/magazine', muted: true },
  { labelKey: 'thinkingMagazineIssue04',  href: '/magazine', muted: true },
]

/* Nos publications : notre regard sur le marché */
export const THINKING_MARKET_LINKS: NavLink[] = [
  { labelKey: 'thinkingMarketArticles',   href: '/blog' },
  { labelKey: 'thinkingMarketWorkforce',  href: '/workforce' as LinkHref },
  { labelKey: 'thinkingMarketFAQ',        href: '/help/faq' as LinkHref },
]
export const NEWSLETTER_HREF = 'https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7449391102052257793'

/* Qui sommes-nous : le groupe, les industries, nous rejoindre */
export const WHO_GROUP_LINKS: NavLink[] = [
  { labelKey: 'whoAbout',     href: '/about' },
  { labelKey: 'whoCulture',   href: '/culture' as LinkHref },
  { labelKey: 'whoFounder',   href: { pathname: '/about', hash: 'fondateur' } as LinkHref },
  { labelKey: 'whoContact',   href: '/contact' },
]
export const WHO_JOIN_LINKS: NavLink[] = [
  { labelKey: 'whoCareers',   href: '/career' },
  { labelKey: 'whoAlliances', href: '/alliances' },
  { labelKey: 'craftSupportNetworkNew', href: '/experts' as LinkHref },
  { labelKey: 'craftSupportInvestors',  href: '/investisseurs' as LinkHref },
  { labelKey: 'craftTransactAuditors',  href: '/audit' as LinkHref },
]
export const INDUSTRY_CLUSTERS: { slug: string; labelKey: string }[] = [
  { slug: 'finance-capital',                     labelKey: 'clusterFinance'   },
  { slug: 'sante-sciences-de-la-vie',            labelKey: 'clusterSante'     },
  { slug: 'industrie-energie-infrastructure',    labelKey: 'clusterIndustrie' },
  { slug: 'commerce-services-experience-client', labelKey: 'clusterCommerce'  },
  { slug: 'tech-innovation-secteur-public',      labelKey: 'clusterTech'      },
]

/* La Boutique : découvrir / passer à l'action */
export const BOUTIQUE_DISCOVER_LINKS: NavLink[] = [
  { labelKey: 'boutiqueConcept',  href: '/boutique' },
  { labelKey: 'boutiqueProjects', href: '/boutique/projets' as LinkHref },
  { labelKey: 'boutiqueForWho',   href: { pathname: '/boutique', hash: 'pour-qui' } as LinkHref },
  { labelKey: 'boutiqueKnowHow',  href: { pathname: '/boutique', hash: 'savoir-faire' } as LinkHref },
]
export const BOUTIQUE_SUBMIT_HREF = { pathname: '/contact', query: { subject: 'project' } } as LinkHref
