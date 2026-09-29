'use client'

import type { ReactNode }  from 'react'
import { useReadingProgress } from '@/components/magazine/hooks/useReadingProgress'

function IssueLayoutInner({ children }: { children: ReactNode }) {
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

      {/* La barre laterale est rendue par la page issue elle-meme (MagazineNav
          alimente par le sommaire du flipbook). Pas de doublon ici. */}
      {children}
    </>
  )
}

export default function IssueLayout({ children }: { children: ReactNode }) {
  return <IssueLayoutInner>{children}</IssueLayoutInner>
}
