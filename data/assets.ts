export const AEGRYN_ASSETS = [

  // ── AI & PROTOCOLES ──────────────────────────────────────────
  {
    id:          'subblink',
    name:        'Subblink',
    slug:        'subblink',
    url:         'https://subblink.app',
    badge:       'B2B — SaaS',
    tagline:     'Analyse contractuelle par IA',
    description: "Analyse vos contrats en quelques secondes grâce à l'IA, calibrée pour le droit suisse et français. Pour freelances, consultants et PME.",
    category:    'ai',
    status:      'live' as const,
    featured:    true,
  },
  {
    id:          'kryv',
    name:        'KRYV Protocol',
    slug:        'kryv',
    url:         'https://aegryn.com/kryv',
    badge:       'Protocole — Blockchain',
    tagline:     'Certification d\'intégrité du code IA',
    description: "Protocole blockchain de certification de l'intégrité du code IA. Le SSL du code artificiel — chaque déploiement, immuablement scellé.",
    category:    'ai',
    status:      'beta' as const,
    featured:    false,
  },

  // ── SERVICES & LIFESTYLE ─────────────────────────────────────
  {
    id:          'neediu',
    name:        'Neediu',
    slug:        'neediu',
    url:         'https://neediu.com',
    badge:       'B2C — Marketplace',
    tagline:     'Services à domicile, mise en relation intelligente',
    description: 'Connecte les particuliers aux meilleurs prestataires de services à domicile en région parisienne.',
    category:    'lifestyle',
    status:      'beta' as const,
    featured:    true,
  },
  {
    id:          'movtoo',
    name:        'Movtoo',
    slug:        'movtoo',
    url:         'https://movtoo.com',
    badge:       'B2C — Livraison',
    tagline:     'Livraison à la demande en temps réel',
    description: "Plateforme de livraison immédiate pilotée par l'intelligence artificielle.",
    category:    'lifestyle',
    status:      'dev' as const,
    featured:    false,
  },

  // ── TRANSACTIONS & RÉSEAU ─────────────────────────────────────
  {
    id:          'primiom',
    name:        'Primiom',
    slug:        'primiom',
    url:         'https://primiom.com',
    badge:       'B2C — Immobilier',
    tagline:     'Transactions immobilières assistées par l\'IA',
    description: "Réinvente la transaction immobilière grâce à des outils d'analyse et de décision basés sur l'IA.",
    category:    'transactions',
    status:      'dev' as const,
    featured:    false,
  },
  {
    id:          'hobconnect',
    name:        'Hobconnect',
    slug:        'hobconnect',
    url:         'https://hobconnect.com',
    badge:       'B2C — Social',
    tagline:     'Réseau social centré sur les passions partagées',
    description: 'Crée des communautés autour des centres d\'intérêt et des passions communes.',
    category:    'transactions',
    status:      'dev' as const,
    featured:    false,
  },

] as const

export type Asset         = typeof AEGRYN_ASSETS[number]
export type AssetCategory = Asset['category']
export type AssetStatus   = Asset['status']

export const ASSET_CATEGORIES = {
  ai:           { label: 'AI & Protocoles',       en: 'AI & Protocols' },
  lifestyle:    { label: 'Services & Lifestyle',  en: 'Services & Lifestyle' },
  transactions: { label: 'Transactions & Réseau', en: 'Transactions & Network' },
} as const
