export type ArticleCategory = 'market' | 'seller' | 'buyer' | 'certification' | 'strategy'

export interface Article {
  slug:        string
  category:    ArticleCategory
  date:        string
  readMin:     number
  title:       { fr: string; en: string }
  excerpt:     { fr: string; en: string }
  featured:    boolean
}

export const ARTICLES: Article[] = [
  {
    slug:     'marche-ma-tech-europe-q3-2026',
    category: 'market',
    date:     '2026-06-15',
    readMin:  7,
    featured: true,
    title: {
      fr: 'État du marché M&A tech Europe — Q3 2026',
      en: 'European Tech M&A Market — Q3 2026 Report',
    },
    excerpt: {
      fr: 'Analyse des volumes de transactions, multiples de valorisation et tendances sectorielles sur le marché européen des actifs tech. SaaS B2B en tête avec un multiple médian de 3,1x ARR.',
      en: 'Analysis of transaction volumes, valuation multiples and sector trends in the European tech asset market. B2B SaaS leads with a median multiple of 3.1x ARR.',
    },
  },
  {
    slug:     '5-erreurs-valorisation-saas',
    category: 'seller',
    date:     '2026-05-28',
    readMin:  5,
    featured: true,
    title: {
      fr: 'Les 5 erreurs qui font chuter la valorisation de votre SaaS',
      en: 'The 5 mistakes that destroy your SaaS valuation',
    },
    excerpt: {
      fr: 'Les erreurs les plus fréquentes identifiées lors des certifications AEGRYN — et comment les corriger avant de soumettre votre actif.',
      en: 'The most common mistakes identified during AEGRYN certifications — and how to fix them before submitting your asset.',
    },
  },
  {
    slug:     'actif-tech-certifiable',
    category: 'certification',
    date:     '2026-05-10',
    readMin:  6,
    featured: true,
    title: {
      fr: 'Qu\'est-ce qu\'un actif tech vraiment certifiable ?',
      en: 'What makes a tech asset truly certifiable?',
    },
    excerpt: {
      fr: 'Les critères objectifs qui distinguent un actif certifiable d\'un actif qui nécessite un plan de remédiation préalable selon le protocole AEGRYN Grade.',
      en: 'The objective criteria that distinguish a certifiable asset from one requiring a remediation plan, according to the AEGRYN Grade protocol.',
    },
  },
  {
    slug:     'due-diligence-acquereur-checklist',
    category: 'buyer',
    date:     '2026-04-22',
    readMin:  8,
    featured: false,
    title: {
      fr: 'Due diligence acquéreur : la checklist complète',
      en: 'Buyer due diligence: the complete checklist',
    },
    excerpt: {
      fr: 'Ce que tout acquéreur sérieux doit vérifier avant de faire une offre sur un actif tech. Checklist en 40 points couvrant code, infrastructure, finance et stratégie.',
      en: 'What every serious buyer must verify before making an offer on a tech asset. 40-point checklist covering code, infrastructure, finance and strategy.',
    },
  },
  {
    slug:     'multiples-valorisation-saas-europe-2026',
    category: 'market',
    date:     '2026-04-05',
    readMin:  6,
    featured: false,
    title: {
      fr: 'Multiples de valorisation SaaS en Europe — Baromètre 2026',
      en: 'SaaS Valuation Multiples in Europe — 2026 Barometer',
    },
    excerpt: {
      fr: 'Panorama des multiples ARR et EBITDA observés sur le marché européen des actifs SaaS en 2025–2026. Comparaison par verticale, taille et statut.',
      en: 'Overview of ARR and EBITDA multiples observed on the European SaaS asset market in 2025–2026. Comparison by vertical, size and status.',
    },
  },
  {
    slug:     'escrow-institutionnel-transactions-tech',
    category: 'strategy',
    date:     '2026-03-18',
    readMin:  4,
    featured: false,
    title: {
      fr: 'Pourquoi l\'escrow institutionnel est non-négociable dans les transactions tech',
      en: 'Why institutional escrow is non-negotiable in tech transactions',
    },
    excerpt: {
      fr: 'Un escrow mal structuré est la première cause d\'échec de closing en M&A tech. Tour d\'horizon des mécanismes et des acteurs recommandés en Europe.',
      en: 'A poorly structured escrow is the leading cause of closing failure in tech M&A. Overview of mechanisms and recommended providers in Europe.',
    },
  },
]

export const ARTICLE_CATEGORIES: Record<ArticleCategory, { fr: string; en: string }> = {
  market:        { fr: 'Rapport marché',   en: 'Market report'   },
  seller:        { fr: 'Guide vendeur',    en: 'Seller guide'    },
  buyer:         { fr: 'Guide acquéreur',  en: 'Buyer guide'     },
  certification: { fr: 'Certification',   en: 'Certification'   },
  strategy:      { fr: 'Stratégie',        en: 'Strategy'        },
}
