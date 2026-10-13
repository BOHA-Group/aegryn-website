import type { LocaleText } from '@/data/industries'

/**
 * Cycle de vie d'un projet, norme Aegryn.
 * Chaque savoir-faire mobilisé sur une fiche est rattaché à une phase :
 *   0 CADRER      — intention, concept, faisabilité, business plan      (Accompagner · Stratégie)
 *   1 CONCEVOIR   — marque, positionnement, expérience                  (Accompagner · Construire)
 *   2 CONSTRUIRE  — développement, architecture, souveraineté           (Construire · Technologie)
 *   3 LANCER      — mise en marché, croissance                          (Franchir)
 *   4 TRANSMETTRE — structuration, cession, pérennité                   (Franchir · M&A)
 */
export const SKILL_PHASES: { key: string; name: LocaleText }[] = [
  {
    key: 'frame',
    name: {
      fr: 'Cadrer', en: 'Frame', de: 'Rahmen setzen', es: 'Encuadrar', it: 'Inquadrare', nl: 'Kaderen',
    },
  },
  {
    key: 'design',
    name: {
      fr: 'Concevoir', en: 'Design', de: 'Konzipieren', es: 'Concebir', it: 'Progettare', nl: 'Ontwerpen',
    },
  },
  {
    key: 'build',
    name: {
      fr: 'Construire', en: 'Build', de: 'Umsetzen', es: 'Construir', it: 'Costruire', nl: 'Bouwen',
    },
  },
  {
    key: 'launch',
    name: {
      fr: 'Lancer', en: 'Launch', de: 'Einführen', es: 'Lanzar', it: 'Lanciare', nl: 'Lanceren',
    },
  },
  {
    key: 'handover',
    name: {
      fr: 'Transmettre', en: 'Hand over', de: 'Übergeben', es: 'Transmitir', it: 'Trasmettere', nl: 'Overdragen',
    },
  },
]

export interface AegrynAsset {
  id:              string
  name:            string
  slug:            string
  url:             string | null
  image?:          string
  badge:           string
  tagline:         string
  description:     string
  category:        'ai' | 'lifestyle' | 'transactions'
  /** Rattachement à un sous-secteur des pages /industries (sectors[index] de l'industrie) */
  industrySector?: { industry: string; sectorIndex: number }
  /** Secteurs /industries où la capacité du projet se transpose (mini-covers page détail) */
  transposeSectors?: { industry: string; sectorIndex: number }[]
  /** Phase SKILL_PHASES de chaque entrée `skills` i18n, même ordre */
  skillPhases?:    number[]
  status:          'live' | 'beta' | 'dev' | 'not_started'
  featured:        boolean
  grade:           AssetGrade
  gradeCode:       string | undefined
  tier:              1 | 2
  ownership:       'core' | 'portfolio'
  transactionEligible:   boolean
  showOnHomepage?:   boolean
  internalOnly?:     boolean
  namePublic?:       boolean
}

export type AssetGrade    = 'star' | 'aaa' | 'aa' | 'a' | 'b' | 'pending' | 'refused'

export const Aegryn_ASSETS: AegrynAsset[] = [

  // ── AI & PROTOCOLES ──────────────────────────────────────────
  {
    id:               'subblink',
    name:             'subblink',
    slug:             'subblink',
    url:              'https://subblink.com' as string | null,
    badge:            'B2B — SaaS',
    tagline:          'Analyse contractuelle par IA',
    description:      "Analyse tous vos contrats en quelques secondes grâce à une IA calibrée pour le droit suisse et européen. Risques, clauses critiques, obligations cachées — tout identifié en langage clair.",
    category:         'ai',
    industrySector:   { industry: 'tech-innovation-secteur-public', sectorIndex: 0 },
    status:           'live' as const,
    featured:         true,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
    ownership:        'core' as const,
    transactionEligible:  false,
  },
  // ── SERVICES & LIFESTYLE ─────────────────────────────────────
  {
    id:               'neediu',
    name:             'neediu',
    slug:             'neediu',
    url:              null as string | null,
    image:            '/images/portfolio/neediu.jpg',
    namePublic:       true,
    badge:            'B2C — Marketplace',
    tagline:          'Services à domicile, mise en relation intelligente',
    description:      'Connecte particuliers et professionnels aux meilleurs prestataires de services à domicile, basé sur la localisation et les avis vérifiés.',
    category:         'lifestyle',
    industrySector:   { industry: 'commerce-services-experience-client', sectorIndex: 0 },
    transposeSectors: [
      { industry: 'finance-capital', sectorIndex: 0 },
      { industry: 'sante-sciences-de-la-vie', sectorIndex: 0 },
      { industry: 'commerce-services-experience-client', sectorIndex: 0 },
      { industry: 'tech-innovation-secteur-public', sectorIndex: 2 },
    ],
    skillPhases:      [0, 0, 0, 1, 1, 2, 3],
    status:           'dev' as const,
    featured:         true,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
    ownership:        'portfolio' as const,
    transactionEligible:  false,
  },
  {
    id:               'movtoo',
    name:             'movtoo',
    slug:             'movtoo',
    url:              null as string | null,
    image:            '/images/portfolio/movtoo.jpg',
    badge:            'B2C — Transport',
    tagline:          'Transport à la demande, zones urbaines denses',
    description:      "Plateforme de transport immédiat pilotée par l'IA. Courses, colis, déménagement — dispatch en temps réel pour particuliers et professionnels.",
    category:         'lifestyle',
    industrySector:   { industry: 'industrie-energie-infrastructure', sectorIndex: 5 },
    transposeSectors: [
      { industry: 'industrie-energie-infrastructure', sectorIndex: 2 },
      { industry: 'commerce-services-experience-client', sectorIndex: 0 },
      { industry: 'sante-sciences-de-la-vie', sectorIndex: 0 },
      { industry: 'tech-innovation-secteur-public', sectorIndex: 2 },
    ],
    skillPhases:      [0, 0],
    status:           'not_started' as const,
    featured:         false,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             2 as const,
    ownership:        'portfolio' as const,
    transactionEligible:  false,
  },

  // ── TRANSACTIONS & RÉSEAU ─────────────────────────────────────
  {
    id:               'primiom',
    name:             'primiom',
    slug:             'primiom',
    url:              null as string | null,
    image:            '/images/portfolio/primiom.jpg',
    badge:            'B2C — Immobilier',
    tagline:          'Transaction immobilière centrée sur le vendeur',
    description:      "Réinvente la transaction immobilière en plaçant le vendeur au cœur du processus. Estimation, analyse de marché et accompagnement personnalisé de A à Z.",
    category:         'transactions',
    industrySector:   { industry: 'finance-capital', sectorIndex: 2 },
    transposeSectors: [
      { industry: 'finance-capital', sectorIndex: 2 },
      { industry: 'industrie-energie-infrastructure', sectorIndex: 3 },
      { industry: 'finance-capital', sectorIndex: 3 },
    ],
    skillPhases:      [0, 0],
    status:           'not_started' as const,
    featured:         false,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             2 as const,
    ownership:        'portfolio' as const,
    transactionEligible:  false,
  },
  {
    id:               'hobconnect',
    name:             'hobconnect',
    slug:             'hobconnect',
    url:              null as string | null,
    image:            '/images/portfolio/hobconnect.jpg',
    badge:            'B2C — Social',
    tagline:          'Réseau social centré sur les passions partagées',
    description:      "Crée des communautés authentiques autour des passions partagées, sans algorithme publicitaire. Pour particuliers, professionnels, créateurs et associations.",
    category:         'transactions',
    industrySector:   { industry: 'commerce-services-experience-client', sectorIndex: 3 },
    transposeSectors: [
      { industry: 'commerce-services-experience-client', sectorIndex: 0 },
      { industry: 'sante-sciences-de-la-vie', sectorIndex: 0 },
      { industry: 'tech-innovation-secteur-public', sectorIndex: 2 },
    ],
    skillPhases:      [0, 0],
    status:           'not_started' as const,
    featured:         false,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             2 as const,
    ownership:        'portfolio' as const,
    transactionEligible:  false,
  },

]

export type Asset         = AegrynAsset
export type AssetCategory = AegrynAsset['category']
export type AssetStatus   = AegrynAsset['status']

export const ASSET_CATEGORIES = {
  ai:           { label: 'AI & Protocoles',       en: 'AI & Protocols' },
  lifestyle:    { label: 'Services & Lifestyle',  en: 'Services & Lifestyle' },
  transactions: { label: 'Marchés & Communautés', en: 'Markets & Communities' },
} as const
