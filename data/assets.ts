export interface AegrynAsset {
  id:              string
  name:            string
  slug:            string
  url:             string | null
  badge:           string
  tagline:         string
  description:     string
  category:        'ai' | 'lifestyle' | 'transactions'
  status:          'live' | 'beta' | 'dev' | 'not_started'
  featured:        boolean
  grade:           AssetGrade
  gradeCode:       string | undefined
  tier:              1 | 2
  auctionEligible:   boolean
  showOnHomepage?:   boolean
  internalOnly?:     boolean
}

export type AssetGrade    = 'star' | 'aaa' | 'aa' | 'a' | 'b' | 'pending' | 'refused'

export const AEGRYN_ASSETS: AegrynAsset[] = [

  // ── AI & PROTOCOLES ──────────────────────────────────────────
  {
    id:               'subblink',
    name:             'Subblink',
    slug:             'subblink',
    url:              'https://subblink.boha-group.com' as string | null,
    badge:            'B2B — SaaS',
    tagline:          'Analyse contractuelle par IA',
    description:      "Analyse vos risques contractuels en quelques secondes grâce à l'IA, calibrée pour le droit suisse et européen. Pour particuliers, indépendants et PME.",
    category:         'ai',
    status:           'live' as const,
    featured:         true,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
    auctionEligible:  true,
  },
  {
    id:               'kryv',
    name:             'KRYV Protocol',
    slug:             'kryv',
    url:              null as string | null,
    badge:            'Protocole — Blockchain',
    tagline:          'Certification d\'intégrité du code IA',
    description:      "Protocole blockchain de certification de l'intégrité du code IA. Le SSL du code artificiel — chaque déploiement, immuablement scellé.",
    category:         'ai',
    status:           'beta' as const,
    featured:         false,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
    auctionEligible:  false,
    internalOnly:     true,
  },

  // ── SERVICES & LIFESTYLE ─────────────────────────────────────
  {
    id:               'neediu',
    name:             'Neediu',
    slug:             'neediu',
    url:              null as string | null,
    badge:            'B2C — Marketplace',
    tagline:          'Services à domicile, mise en relation intelligente',
    description:      'Connecte les particuliers aux meilleurs prestataires de services de proximité en Europe.',
    category:         'lifestyle',
    status:           'dev' as const,
    featured:         true,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
    auctionEligible:  false,
  },
  {
    id:               'movtoo',
    name:             'Movtoo',
    slug:             'movtoo',
    url:              null as string | null,
    badge:            'B2C — Livraison',
    tagline:          'Livraison à la demande en temps réel',
    description:      "Plateforme de livraison immédiate pilotée par l'intelligence artificielle.",
    category:         'lifestyle',
    status:           'not_started' as const,
    featured:         false,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             2 as const,
    auctionEligible:  false,
  },

  // ── TRANSACTIONS & RÉSEAU ─────────────────────────────────────
  {
    id:               'primiom',
    name:             'Primiom',
    slug:             'primiom',
    url:              null as string | null,
    badge:            'B2C — Immobilier',
    tagline:          'Transactions immobilières assistées par l\'IA',
    description:      "Réinvente la transaction immobilière grâce à des outils d'analyse et de décision basés sur l'IA.",
    category:         'transactions',
    status:           'not_started' as const,
    featured:         false,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             2 as const,
    auctionEligible:  false,
  },
  {
    id:               'hobconnect',
    name:             'Hobconnect',
    slug:             'hobconnect',
    url:              null as string | null,
    badge:            'B2C — Social',
    tagline:          'Réseau social centré sur les passions partagées',
    description:      'Crée des communautés autour des centres d\'intérêt et des passions communes.',
    category:         'transactions',
    status:           'not_started' as const,
    featured:         false,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             2 as const,
    auctionEligible:  false,
  },

]

export type Asset         = AegrynAsset
export type AssetCategory = AegrynAsset['category']
export type AssetStatus   = AegrynAsset['status']

export const ASSET_CATEGORIES = {
  ai:           { label: 'AI & Protocoles',       en: 'AI & Protocols' },
  lifestyle:    { label: 'Services & Lifestyle',  en: 'Services & Lifestyle' },
  transactions: { label: 'Transactions & Réseau', en: 'Transactions & Network' },
} as const
