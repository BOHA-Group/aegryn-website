import type { MagazineIssue } from '@/lib/magazine/types'

export const ISSUE_01: MagazineIssue = {
  number: 1,
  slug: 'issue-01',
  title: 'Built to Last.',
  theme: "The anatomy of enterprise assets that sell and those that don't.",
  publishedAt: '2027-01-01',
  coverStat: '€44.1B',
  coverStatLabel: 'European tech funding, H1 2026 · 1,740 deals',
  coverLine: 'Build. Certify. Value.',
  status: 'published',
  sections: [
    { id: 's-opening',     label: 'Opening',     pillar: 'build',  pageRange: 'p.04–12'  },
    { id: 's-tech-and-ai', label: 'Tech and AI', pillar: 'ai',     pageRange: 'p.13–28'  },
    { id: 's-build',       label: 'Build',       pillar: 'build',  pageRange: 'p.34–57'  },
    { id: 's-money',       label: 'Money',       pillar: 'money',  pageRange: 'p.61–82'  },
    { id: 's-portrait',    label: 'Portrait',    pillar: 'money',  pageRange: 'p.84–86'  },
    { id: 's-value',       label: 'Value',       pillar: 'money',  pageRange: 'p.94–110' },
    { id: 's-people',      label: 'People',      pillar: 'people', pageRange: 'p.111–122'},
    { id: 's-life',        label: 'Life',        pillar: 'life',   pageRange: 'p.124–133'},
    { id: 's-closing',     label: 'Closing',     pillar: 'build',  pageRange: 'p.134–136'},
  ],
}
