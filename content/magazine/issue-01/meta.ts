import type { MagazineIssue } from '@/lib/magazine/types'

export const ISSUE_01: MagazineIssue = {
  number: 1,
  slug: 'issue-01',
  title: 'Built to Last.',
  theme: "The anatomy of a tech asset that sells and one that doesn't.",
  publishedAt: '2027-01-01',
  coverStat: '€262B',
  coverStatLabel: 'EU M&A volume — Q2 2026 · 3,315 transactions',
  coverLine: 'Build. Certify. Transact.',
  status: 'published',
  sections: [
    { id: 's-flipbook',    label: 'Flipbook',           pillar: 'build', pageRange: '102 p.'   },
    { id: 's-editorial',   label: 'Editorial',          pillar: 'build', pageRange: 'p.07–11'  },
    { id: 's-market',      label: 'Tech & AI',          pillar: 'ai',    pageRange: 'p.13–25'  },
    { id: 's-ai',          label: 'Build',              pillar: 'build', pageRange: 'p.26–49'  },
    { id: 's-perspective', label: 'Money',              pillar: 'money', pageRange: 'p.50–65'  },
    { id: 's-transaction', label: 'Transaction',        pillar: 'money', pageRange: 'p.66–83'  },
    { id: 's-buyers',      label: 'People',             pillar: 'build', pageRange: 'p.84–91'  },
    { id: 's-outlook',     label: 'Life',               pillar: 'build', pageRange: 'p.92–101' },
    { id: 's-index',       label: 'AEGRYN Index',       pillar: 'build', pageRange: 'p.95–102' },
    { id: 's-people',      label: 'Portraits',          pillar: 'build', pageRange: 'p.84–91'  },
    { id: 's-life',        label: 'Closing',            pillar: 'build', pageRange: 'p.100–102'},
  ],
}
