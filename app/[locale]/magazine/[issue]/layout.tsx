'use client'

import type { ReactNode }  from 'react'
import { useParams }       from 'next/navigation'
import { MagazineNav }     from '@/components/magazine/MagazineNav'
import { useReadingProgress } from '@/components/magazine/hooks/useReadingProgress'
import { ISSUE_01 }        from '@/content/magazine/issue-01/meta'
import type { IssueSection } from '@/lib/magazine/types'

function getSections(slug: string): IssueSection[] {
  switch (slug) {
    case 'issue-01': return ISSUE_01.sections
    default: return []
  }
}

function IssueLayoutInner({ children, issueSlug }: { children: ReactNode; issueSlug: string }) {
  const sections = getSections(issueSlug)
  const progress = useReadingProgress()

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-0.5 bg-magazine-accent transition-all duration-150"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Reading progress"
      />

      {/* Scrollspy nav — only shown on issue pages (not article sub-pages) */}
      {sections.length > 0 && <MagazineNav sections={sections} />}

      {children}
    </>
  )
}

export default function IssueLayout({ children }: { children: ReactNode }) {
  const params = useParams()
  const issueSlug = typeof params.issue === 'string' ? params.issue : ''

  return <IssueLayoutInner issueSlug={issueSlug}>{children}</IssueLayoutInner>
}
