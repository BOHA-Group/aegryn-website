import type { IssueData } from '@/lib/magazine/types'

export const DATA_01: IssueData = {
  coverStats: [
    { val: '2,698',  label: 'SaaS deals completed in 2025 — a record.' },
    { val: '+40%',   label: 'EU SaaS M&A volume growth since 2023.' },
    { val: '€14.2B', label: 'Transaction volume Europe 2025.' },
  ],

  multiples: [
    { sector: 'AI-native SaaS',   median: '8–15x ARR', top: '>30x (outliers)',  src: 'Aventis Q2 2026' },
    { sector: 'FinTech',          median: '5.1x ARR',  top: '8.2x',             src: 'Aventis Q2 2026' },
    { sector: 'HealthTech',       median: '4.8x ARR',  top: '7.5x',             src: 'Aventis Q2 2026' },
    { sector: 'LegalTech',        median: '4.2x ARR',  top: '6.8x',             src: 'Aventis Q2 2026' },
    { sector: 'SaaS B2B generic', median: '3.1x ARR',  top: '5.5x',             src: 'SEG 2026'        },
    { sector: 'Marketplace',      median: '2.8x ARR',  top: '4.5x',             src: 'Aventis Q2 2026' },
  ],

  deals: [
    {
      title:    'team.blue × Windsor.ai',
      sector:   'AI Analytics · Switzerland · Q1 2026',
      ticket:   'Undisclosed (est. 8–15M€)',
      multiple: 'Est. 7–10x ARR',
      grade:    'AA',
      factors: [
        'AI-native product with proprietary client dataset',
        'Strong NRR (>130%) across mid-market clients',
        'Clean IP stack — no open-source licensing conflict',
      ],
    },
    {
      title:    'Hg × OneStream',
      sector:   'Finance SaaS · UK/EU · Q1 2026',
      ticket:   'Upper mid-market ($1B+)',
      multiple: 'Est. 12–15x ARR',
      grade:    'AAA',
      factors: [
        'Category leader in financial performance management',
        'Mission-critical embedding across enterprise accounts',
        'Proven PE-grade financial documentation',
      ],
    },
    {
      title:    'Undisclosed — B2B LegalTech',
      sector:   'LegalTech · France · Q2 2026',
      ticket:   'Est. 2–5M€',
      multiple: 'Est. 4.5x ARR',
      grade:    'A',
      factors: [
        'Contract automation with verifiable accuracy metrics',
        'Recurring revenue from law firms under annual subscription',
        'RGPD-compliant architecture documented at submission',
      ],
    },
    {
      title:    'Undisclosed — HR Automation SaaS',
      sector:   'HR Tech · Germany · Q1 2026',
      ticket:   'Est. 1–3M€',
      multiple: 'Est. 3.8x ARR',
      grade:    'A',
      factors: [
        'Strong founder-to-team transition plan in place',
        'Payroll integration with SAP creates switching costs',
        'Clean cap table — single founder, no convertibles',
      ],
    },
    {
      title:    'Undisclosed — HealthTech Platform',
      sector:   'HealthTech · Netherlands · Q2 2026',
      ticket:   'Est. 5–12M€',
      multiple: 'Est. 5.2x ARR',
      grade:    'AA',
      factors: [
        'CE-marked medical device software (IEC 62304)',
        'Hospital network with multi-year contracts',
        'ISO 27001 certified — S-dimension pre-validated',
      ],
    },
  ],

  buyers: [
    {
      type:     'PE Lower Mid-Market',
      examples: 'Hg, MBO Partenaires, Chequers',
      ticket:   '2–15M€ EV',
      criteria: [
        'Recurring revenue with high NRR',
        'Scalable without founder dependency',
        'Existing team and processes in place',
      ],
      gradeMin: 'AA',
    },
    {
      type:     'Search Fund / ETA',
      examples: 'Independent operators, ETA programs',
      ticket:   '300K–3M€',
      criteria: [
        'Founder ready to exit cleanly',
        'Documented processes and playbooks',
        'Predictable, stable revenue stream',
      ],
      gradeMin: 'A',
    },
    {
      type:     'Strategic Acquirer',
      examples: 'SaaS platforms, tech consolidators',
      ticket:   '500K–10M€',
      criteria: [
        'Defensible IP with no licensing conflicts',
        'Technology complementary to existing product',
        'No ongoing litigation or IP dispute',
      ],
      gradeMin: 'A',
    },
    {
      type:     'Family Office',
      examples: 'Direct investors, UHNW family offices',
      ticket:   '1–20M€ EV',
      criteria: [
        'Cashflow-positive with 10+ year horizon',
        'Discreet, structured process',
        'Minimal founder involvement post-close',
      ],
      gradeMin: 'A',
    },
  ],

  indexMetrics: [
    { val: '< 25%', label: 'Certification acceptance rate', note: 'Across all submitted assets'          },
    { val: '4',     label: 'Active certification dimensions', note: 'C · I · F · S (25 pts each)'       },
    { val: '100',   label: 'Maximum certification score',    note: 'Perfect score — theoretical baseline' },
  ],

  cifsExample: [
    { dim: 'C', label: 'Code integrity',        score: 22 },
    { dim: 'I', label: 'IP ownership',          score: 19 },
    { dim: 'F', label: 'Financial reliability', score: 21 },
    { dim: 'S', label: 'Security posture',      score: 18 },
  ],
}

/* ── Chart data ──────────────────────────────────────────── */
export const dealVolumeData = [
  { q: 'Q1 23', v: 420 }, { q: 'Q2 23', v: 445 },
  { q: 'Q3 23', v: 480 }, { q: 'Q4 23', v: 510 },
  { q: 'Q1 24', v: 490 }, { q: 'Q2 24', v: 520 },
  { q: 'Q3 24', v: 560 }, { q: 'Q4 24', v: 580 },
  { q: 'Q1 25', v: 610 }, { q: 'Q2 25', v: 650 },
  { q: 'Q3 25', v: 746 }, { q: 'Q4 25', v: 692 },
  { q: 'Q1 26', v: 620 },
]

export const multiplesChartData = [
  { year: '2021', EU: 7.2,  US: 9.8  },
  { year: '2022', EU: 4.8,  US: 6.5  },
  { year: '2023', EU: 3.4,  US: 4.9  },
  { year: '2024', EU: 3.8,  US: 5.4  },
  { year: '2025', EU: 4.2,  US: 5.8  },
  { year: '2026', EU: 4.7,  US: 6.1  },
]

export const gradeDistributionData = [
  { grade: 'AEG ★', pct: 5,  color: '#2EAF7D' },
  { grade: 'AAA',   pct: 12, color: '#C9A84C' },
  { grade: 'AA',    pct: 27, color: '#9BA8B0' },
  { grade: 'A',     pct: 32, color: '#4A90D9' },
  { grade: 'B',     pct: 17, color: '#D4820A' },
]
