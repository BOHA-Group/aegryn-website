'use client'

import { useState, useEffect, useRef } from 'react'
import type { IssueSection, MagazineArticle } from '@/lib/magazine/types'

interface SectionWithArticles extends IssueSection {
  articles?: MagazineArticle[]
}

interface Props {
  sections: SectionWithArticles[]
  issueLabel?: string
}

/**
 * Barnes-style sticky horizontal nav for magazine issues.
 * Scrollspy active state + article dropdown per section.
 */
export function MagazineNav({ sections, issueLabel = 'Issue 01 — Built to Last' }: Props) {
  const [active, setActive]     = useState<string>('')
  const [open, setOpen]         = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const ids = sections.map(s => s.id)
    const observers: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-20% 0px -70% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [sections])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setOpen(null)
  }

  function handleMouseEnter(id: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpen(id)
  }

  function handleMouseLeave() {
    closeTimer.current = setTimeout(() => setOpen(null), 180)
  }

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-magazine-white/95 backdrop-blur-sm border-b border-magazine-black/10 shadow-[0_1px_0_rgba(0,0,0,0.04)]'
          : 'bg-magazine-ivory border-b border-magazine-black/8'
      }`}
    >
      <div className="flex items-center justify-between px-6 md:px-[80px]">

        {/* ── Issue label ── */}
        <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-magazine-black/35 shrink-0 py-4 pr-8 border-r border-magazine-black/8 hidden md:block">
          {issueLabel}
        </span>

        {/* ── Section links ── */}
        <div className="flex items-stretch overflow-x-auto scrollbar-none flex-1">
          {sections.map(s => {
            const isActive = active === s.id
            const isOpen   = open === s.id
            const hasItems = s.articles && s.articles.length > 0

            return (
              <div
                key={s.id}
                className="relative shrink-0"
                onMouseEnter={() => hasItems ? handleMouseEnter(s.id) : undefined}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => scrollTo(s.id)}
                  className={`flex items-center gap-1.5 py-4 px-4 font-mono text-[9px] tracking-[0.18em] uppercase transition-colors whitespace-nowrap border-b-2 ${
                    isActive
                      ? 'text-magazine-black border-magazine-accent'
                      : 'text-magazine-black/40 border-transparent hover:text-magazine-black/80 hover:border-magazine-black/20'
                  }`}
                >
                  {s.label}
                  {hasItems && (
                    <span className={`block w-1 h-1 rounded-full transition-colors ${isActive ? 'bg-magazine-accent' : 'bg-magazine-black/20'}`} />
                  )}
                </button>

                {/* Dropdown */}
                {hasItems && isOpen && (
                  <div
                    className="absolute top-full left-0 min-w-[260px] bg-magazine-white border border-magazine-black/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-2 z-50"
                    onMouseEnter={() => handleMouseEnter(s.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {s.articles!.map(a => (
                      <button
                        key={a.slug}
                        onClick={() => scrollTo(s.id)}
                        className="w-full text-left px-5 py-3 hover:bg-magazine-ivory transition-colors group"
                      >
                        <span className="block font-mono text-[8px] tracking-[0.2em] uppercase text-magazine-accent mb-0.5">
                          {s.label}
                        </span>
                        <span className="block font-sans text-[12px] font-semibold text-magazine-black group-hover:text-magazine-accent transition-colors leading-snug">
                          {a.title}
                        </span>
                        <span className="block font-mono text-[8px] text-magazine-black/30 mt-0.5">
                          {a.readingTimeMinutes} min read
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* ── PDF download ── */}
        <a
          href="/api/magazine/issue-01/cover"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 ml-4 font-mono text-[9px] tracking-[0.18em] uppercase text-magazine-accent border border-magazine-accent/30 px-4 py-2 hover:bg-magazine-accent hover:text-white transition-colors hidden md:inline-flex items-center gap-2 my-3"
        >
          PDF ↗
        </a>
      </div>
    </nav>
  )
}
