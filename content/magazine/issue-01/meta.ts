import type { MagazineIssue } from '@/lib/magazine/types'

export const ISSUE_01: MagazineIssue = {
  number: 1,
  slug: 'issue-01',
  title: 'Built to Last',
  theme: 'What separates the tech assets that transact from those that disappear',
  publishedAt: '2027-01-01',
  coverStat: '€262B',
  coverStatLabel: 'EU M&A volume — Q2 2026 · 3,315 transactions',
  coverLine: 'Build to last. Certify to transact.',
  status: 'published',
  sections: [
    { id: 's-flipbook',    label: 'Flipbook',       pillar: 'build'  },
    { id: 's-editorial',   label: 'Editorial',      pillar: 'build'  },
    { id: 's-build',       label: 'Build',          pillar: 'build'  },
    { id: 's-money',       label: 'Money',          pillar: 'money'  },
    { id: 's-transaction', label: 'Transaction',    pillar: 'money'  },
    { id: 's-index',       label: 'AEGRYN Index',   pillar: 'build'  },
    { id: 's-tech',        label: 'Tech & AI',      pillar: 'ai'     },
    { id: 's-people',      label: 'People',         pillar: 'people' },
    { id: 's-life',        label: 'Life',           pillar: 'people' },
  ],
}
