'use client'

import { useState, useEffect } from 'react'
import type { IssueSection } from '@/lib/magazine/types'

interface Props {
  sections: IssueSection[]
}

/**
 * Scrollspy navigation for magazine issues.
 * Generic replacement for ReportNav2027 — no year/report reference.
 */
export function MagazineNav({ sections }: Props) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const ids = sections.map(s => s.id)
    const observers: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [sections])

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
      {sections.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={e => {
            e.preventDefault()
            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="group flex items-center gap-2.5"
          aria-label={s.label}
        >
          <span className={`block w-5 h-px transition-all duration-300 ${
            active === s.id ? 'bg-magazine-accent w-7' : 'bg-white/25 group-hover:bg-white/50'
          }`} />
          <span className={`text-[9px] font-mono uppercase tracking-[0.16em] transition-all duration-300 whitespace-nowrap ${
            active === s.id ? 'text-magazine-accent opacity-100' : 'text-white/0 group-hover:text-white/50'
          }`}>
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  )
}
