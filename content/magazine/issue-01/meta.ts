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
    { id: 's-editorial',   label: 'Editorial',          pillar: 'build', pageRange: 'p.02–04'  },
    { id: 's-market',      label: 'The Market',         pillar: 'money', pageRange: 'p.05–14'  },
    { id: 's-ai',          label: 'Tech & AI',          pillar: 'ai',    pageRange: 'p.15–22'  },
    { id: 's-perspective', label: 'Build',              pillar: 'build', pageRange: 'p.23–32'  },
    { id: 's-transaction', label: 'Transaction',        pillar: 'money', pageRange: 'p.33–40'  },
    { id: 's-buyers',      label: 'Buyers',             pillar: 'money', pageRange: 'p.41–44'  },
    { id: 's-outlook',     label: 'Outlook 2027',       pillar: 'build', pageRange: 'p.45–50'  },
    { id: 's-index',       label: 'AEGRYN Index',       pillar: 'build', pageRange: 'p.51–54'  },
    { id: 's-people',      label: 'People',             pillar: 'build', pageRange: 'p.55–60'  },
    { id: 's-life',        label: 'Life',               pillar: 'build', pageRange: 'p.61–66'  },
  ],
}
