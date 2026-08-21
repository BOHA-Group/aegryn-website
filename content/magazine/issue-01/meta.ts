import type { MagazineIssue } from '@/lib/magazine/types'

export const ISSUE_01: MagazineIssue = {
  number: 1,
  slug: 'issue-01',
  title: 'The State of European Tech M&A',
  theme: 'How a market found its standard',
  publishedAt: '2027-01-01',
  coverStat: '€14.2B',
  coverStatLabel: 'European tech M&A volume — 2025',
  coverLine: 'The market is ready. Are the founders?',
  status: 'published',
  sections: [
    { id: 's-viewer',      label: 'Read Issue',     pillar: 'build'  },
    { id: 's-editorial',   label: 'Editorial',      pillar: 'money'  },
    { id: 's-market',      label: 'The Market',     pillar: 'money'  },
    { id: 's-ai',          label: 'AI & Value',     pillar: 'ai'     },
    { id: 's-perspective', label: 'Perspective',    pillar: 'build'  },
    { id: 's-deals',       label: 'Deal Watch',     pillar: 'money'  },
    { id: 's-buyers',      label: 'Buyers',         pillar: 'people' },
    { id: 's-outlook',     label: 'Outlook 2027',   pillar: 'build'  },
    { id: 's-index',       label: 'AEGRYN Index',   pillar: 'build'  },
  ],
}
