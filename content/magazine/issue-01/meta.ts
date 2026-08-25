import type { MagazineIssue } from '@/lib/magazine/types'

export const ISSUE_01: MagazineIssue = {
  number: 1,
  slug: 'issue-01',
  title: 'Built to Last',
  theme: 'What separates the tech assets that transact from those that disappear and what every European founder needs to know before the conversation starts.',
  publishedAt: '2027-01-01',
  coverStat: '€262B',
  coverStatLabel: 'EU M&A volume — Q2 2026 · 3,315 transactions',
  coverLine: 'Build to last. Certify to transact.',
  status: 'published',
  sections: [
    { id: 's-flipbook',    label: 'Flipbook',           pillar: 'build', pageRange: '60 p.'    },
    { id: 's-editorial',   label: 'Éditorial',           pillar: 'build', pageRange: 'p.02–04'  },
    { id: 's-ai',          label: 'Tech & IA',           pillar: 'ai',    pageRange: 'p.05–16'  },
    { id: 's-perspective', label: 'Build',               pillar: 'build', pageRange: 'p.17–26'  },
    { id: 's-market',      label: 'Money',               pillar: 'money', pageRange: 'p.27–34'  },
    { id: 's-transaction', label: 'Transaction',         pillar: 'money', pageRange: 'p.35–40'  },
    { id: 's-buyers',      label: 'Acquéreurs',          pillar: 'money', pageRange: 'p.41–44'  },
    { id: 's-outlook',     label: 'Perspectives 2027',   pillar: 'build', pageRange: 'p.45–52'  },
    { id: 's-index',       label: 'AEGRYN Index',        pillar: 'build', pageRange: 'p.53–56'  },
  ],
}
