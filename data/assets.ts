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
  status:          'live' | 'beta' | 'pilot' | 'dev' | 'not_started'
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
    image:            '/images/portfolio/neediu-roomservice.jpg',
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
    skillPhases:      [0, 0, 0, 0, 1, 1, 1, 2, 3],
    status:           'pilot' as const,
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
    status:           'pilot' as const,
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
    status:           'dev' as const,
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
    image:            '/images/portfolio/hobconnect-vinyl.jpg',
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
  {
    id:               'heritix',
    name:             'heritix',
    slug:             'heritix',
    url:              null as string | null,
    image:            '/images/portfolio/heritix-vault.jpg',
    badge:            'B2C · B2B — LegalTech',
    tagline:          'Coffre numérique de succession, transmission sécurisée',
    description:      "Centralise et transmet, au bon moment et aux bonnes personnes, les informations sensibles laissées par une personne : comptes, documents, accès et messages personnels. Sécurité de bout en bout, contrôle d'accès multi-parties, exécution conditionnelle.",
    category:         'ai',
    industrySector:   { industry: 'finance-capital', sectorIndex: 3 },
    transposeSectors: [
      { industry: 'finance-capital', sectorIndex: 0 },
      { industry: 'finance-capital', sectorIndex: 3 },
      { industry: 'sante-sciences-de-la-vie', sectorIndex: 0 },
      { industry: 'tech-innovation-secteur-public', sectorIndex: 2 },
    ],
    skillPhases:      [0, 0, 0, 0, 1, 1, 1, 2, 3],
    status:           'dev' as const,
    featured:         true,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
    ownership:        'portfolio' as const,
    transactionEligible:  false,
  },
  {
    id:               'chrosium',
    name:             'chrosium',
    slug:             'chrosium',
    url:              null as string | null,
    image:            '/images/portfolio/chrosium-sunscreen-m.jpg',
    badge:            'B2C — Cosmétique D2C',
    tagline:          "Indicateur d'application solaire, protection visible en temps réel",
    description:      "Associe une formule SPF 50+ clean-label à un indicateur d'application propriétaire : parents et enfants voient où la protection a été posée, avant qu'elle ne s'estompe une fois la zone sécurisée.",
    category:         'lifestyle',
    industrySector:   { industry: 'sante-sciences-de-la-vie', sectorIndex: 0 },
    transposeSectors: [
      { industry: 'sante-sciences-de-la-vie', sectorIndex: 0 },
      { industry: 'sante-sciences-de-la-vie', sectorIndex: 1 },
      { industry: 'commerce-services-experience-client', sectorIndex: 1 },
      { industry: 'commerce-services-experience-client', sectorIndex: 0 },
    ],
    skillPhases:      [0, 0, 1, 1, 1, 1, 1, 3],
    status:           'dev' as const,
    featured:         true,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
    ownership:        'portfolio' as const,
    transactionEligible:  false,
  },
  {
    id:               'insertdry',
    name:             'insertdry',
    slug:             'insertdry',
    url:              null as string | null,
    image:            '/images/portfolio/insertdry-dryfood.jpg',
    badge:            'B2B · B2C — Électroménager',
    tagline:          'Cave alimentaire tropicale à déshumidification active',
    description:      "Unité de conservation d'aliments secs pensée pour les marchés tropicaux : régulation ciblée de 16 à 22 °C, hygrométrie maintenue sous 45 %, formats compact et encastrable.",
    category:         'lifestyle',
    industrySector:   { industry: 'industrie-energie-infrastructure', sectorIndex: 1 },
    transposeSectors: [
      { industry: 'industrie-energie-infrastructure', sectorIndex: 1 },
      { industry: 'industrie-energie-infrastructure', sectorIndex: 6 },
      { industry: 'commerce-services-experience-client', sectorIndex: 0 },
      { industry: 'commerce-services-experience-client', sectorIndex: 1 },
    ],
    skillPhases:      [0, 0, 0, 1, 1, 1, 2, 2, 3],
    status:           'not_started' as const,
    featured:         true,
    grade:            'pending' as const,
    gradeCode:        undefined,
    tier:             1 as const,
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

/** Chemin public d'une fiche : les projets vivent dans La Boutique, subblink reste un actif propriétaire du cabinet. */
export const assetPath = (slug: string) => (slug === 'subblink' ? `/assets/${slug}` : `/boutique/projets/${slug}`)
