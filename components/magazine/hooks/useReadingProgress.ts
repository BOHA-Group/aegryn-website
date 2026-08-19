'use client'

import { useEffect, useState } from 'react'

/**
 * Returns a number 0–100 representing reading progress on the page.
 * Useful for a progress bar in the issue layout.
 */
export function useReadingProgress(): number {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const el = document.documentElement
      const scrollTop = el.scrollTop || document.body.scrollTop
      const scrollHeight = el.scrollHeight - el.clientHeight
      if (scrollHeight <= 0) { setProgress(100); return }
      const pct = Math.min(100, Math.round((scrollTop / scrollHeight) * 100))
      setProgress(pct)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return progress
}
