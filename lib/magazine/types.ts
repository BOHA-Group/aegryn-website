export type Pillar = 'build' | 'money' | 'ai' | 'people' | 'life'
export type CtaTarget = 'build' | 'grade' | 'auction' | 'advisory' | 'newsletter'
export type IssueStatus = 'draft' | 'published' | 'archived'
export type GradeCode = '★' | 'AAA' | 'AA' | 'A' | 'B'

export interface IssueStat {
  val: string
  label: string
}

export interface MagazineIssue {
  number: number
  slug: string
  title: string
  theme: string
  publishedAt: string
  coverStat: string
  coverStatLabel: string
  coverLine: string
  status: IssueStatus
  sections: IssueSection[]
}

export interface IssueSection {
  id: string
  label: string
  pillar: Pillar
}

export interface MagazineArticle {
  slug: string
  issue: number
  pillar: Pillar
  title: string
  excerpt: string
  readingTimeMinutes: number
  seoKeywords: string[]
  ctaTarget: CtaTarget
  ctaLabel: string
  publishedAt: string
}

export interface MultipleRow {
  sector: string
  median: string
  top: string
  src: string
}

export interface DealItem {
  title: string
  sector: string
  ticket: string
  multiple: string
  grade: GradeCode
  factors: string[]
}

export interface BuyerProfile {
  type: string
  examples: string
  ticket: string
  criteria: string[]
  gradeMin: GradeCode
}

export interface IssueData {
  coverStats: IssueStat[]
  multiples: MultipleRow[]
  deals: DealItem[]
  buyers: BuyerProfile[]
  indexMetrics: Array<{ val: string; label: string; note: string }>
  cifsExample: Array<{ dim: string; label: string; score: number }>
}
