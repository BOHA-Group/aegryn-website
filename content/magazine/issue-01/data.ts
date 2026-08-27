import type { IssueData } from '@/lib/magazine/types'

export const DATA_01: IssueData = {
  coverStats: [
    { val: '2,698',  label: 'SaaS deals completed in 2025 — a record.' },
    { val: '+40%',   label: 'EU SaaS M&A volume growth since 2023.' },
    { val: '€14.2B', label: 'Transaction volume Europe 2025.' },
  ],

  multiples: [
    { sector: 'AI-native SaaS',     median: '6–12x ARR', top: '15x+',  src: 'SaaS Capital Index Q2 2026' },
    { sector: 'Cybersecurity',      median: '6–14x ARR', top: '45x',   src: 'SaaS Capital Index Q2 2026' },
    { sector: 'Vertical SaaS',      median: '5–9x ARR',  top: '12x',   src: 'SaaS Capital Index Q2 2026' },
    { sector: 'RegTech / LegalTech',median: '6–12x ARR', top: '12x',   src: 'SaaS Capital Index Q2 2026' },
    { sector: 'HealthTech',         median: '4–8x ARR',  top: '10x',   src: 'SaaS Capital Index Q2 2026' },
    { sector: 'FinTech / Payments', median: '4–6x ARR',  top: '8x',    src: 'SaaS Capital Index Q2 2026' },
    { sector: 'EdTech / Compliance',median: '3–6x ARR',  top: '8x',    src: 'SaaS Capital Index Q2 2026' },
    { sector: 'Marketplace',        median: '2–5x ARR',  top: '7x',    src: 'SaaS Capital Index Q2 2026' },
    { sector: 'PropTech',           median: '2–4x ARR',  top: '6x',    src: 'SaaS Capital Index Q2 2026' },
    { sector: 'Horizontal SaaS',    median: '3–4x ARR',  top: '5x',    src: 'SaaS Capital Index Q2 2026' },
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
    { val: '< 25%', label: 'CIFS acceptance rate',            note: 'Fewer than 1 in 4 submitted assets reaches Full Grade' },
    { val: '+28%',  label: 'Price premium — certified',        note: 'vs comparable uncertified assets — H1 2025–H1 2026'    },
    { val: '−38%',  label: 'Time-to-close reduction',          note: 'For certified assets vs equivalent uncertified'        },
    { val: '11w',   label: 'Pre-Grade to Grade A — avg time',  note: 'With standard preparation effort'                     },
    { val: '8%',    label: 'Auction Ready (top tier)',         note: 'Of submissions reach Auction Ready status'             },
    { val: 'SaaS/AI', label: 'Leading vertical — submissions', note: 'Followed by FinTech 22%, LegalTech 18%, PropTech 11%'  },
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
  { year: '2021', EU: 6.5, US: 8.0 },
  { year: '2022', EU: 5.2, US: 6.4 },
  { year: '2023', EU: 4.4, US: 5.3 },
  { year: '2024', EU: 4.0, US: 4.7 },
  { year: '2025', EU: 3.9, US: 4.4 },
  { year: '2026', EU: 3.8, US: 4.1 },
]

export const gradeDistributionData = [
  { grade: 'Auction Ready', pct: 8,  color: '#2EAF7D' },
  { grade: 'Grade A',       pct: 17, color: '#4A90D9' },
  { grade: 'Grade B',       pct: 31, color: '#9BA8B0' },
  { grade: 'Pre-Grade',     pct: 44, color: '#D4820A' },
]
