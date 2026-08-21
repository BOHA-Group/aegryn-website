'use client'

import { useState, useEffect } from 'react'
import type { IssueSection, MagazineArticle } from '@/lib/magazine/types'

interface SectionWithArticles extends IssueSection {
  articles?: MagazineArticle[]
}

interface Props {
  sections: SectionWithArticles[]
  issueNumber?: number
  issueTitle?: string
  issueSubtitle?: string
}

/**
 * Barnes-style vertical sidebar nav — fixed left, always visible.
 * Logo + issue info at top, AU SOMMAIRE, sections with scrollspy, PDF link at bottom.
 */
export function MagazineNav({
  sections,
  issueNumber = 1,
  issueTitle = 'Built to Last',
  issueSubtitle,
}: Props) {
  const [active, setActive]       = useState<string>('')
  const [expanded, setExpanded]   = useState<string | null>(null)

  useEffect(() => {
    const ids = sections.map(s => s.id)
    const observers: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-15% 0px -65% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [sections])

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const issueNum = `N°${String(issueNumber).padStart(2, '0')}`

  return (
    <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-[240px] bg-magazine-white border-r border-magazine-black/8 z-40 overflow-y-auto">

      {/* ── Brand header ── */}
      <div className="px-6 pt-8 pb-6 border-b border-magazine-black/8">
        <p className="font-sans font-bold text-magazine-black text-[15px] tracking-[0.04em] leading-none">
          AEGRYN
        </p>
        <p className="font-mono text-[9px] tracking-[0.16em] uppercase text-magazine-accent mt-0.5">
          Magazine
        </p>
        <p className="font-mono text-[9px] tracking-[0.12em] text-magazine-black/40 mt-3">
          {issueNum} — {issueSubtitle ?? issueTitle}
        </p>
      </div>

      {/* ── Sommaire label ── */}
      <div className="px-6 pt-5 pb-3">
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-magazine-black/20" />
          Au Sommaire
        </p>
      </div>

      {/* ── Section list ── */}
      <nav className="flex-1 px-3 pb-4">
        {sections.map(s => {
          const isActive   = active === s.id
          const isExpanded = expanded === s.id
          const hasArticles = s.articles && s.articles.length > 0

          return (
            <div key={s.id}>
              <button
                onClick={() => {
                  scrollTo(s.id)
                  if (hasArticles) setExpanded(isExpanded ? null : s.id)
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-left transition-colors rounded-sm group ${
                  isActive
                    ? 'text-magazine-accent'
                    : 'text-magazine-black/65 hover:text-magazine-black'
                }`}
              >
                <span className="font-sans text-[13px] font-medium leading-snug">
                  {s.label}
                </span>
                {hasArticles && (
                  <span className={`font-mono text-[11px] transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''} ${isActive ? 'text-magazine-accent' : 'text-magazine-black/25'}`}>
                    −
                  </span>
                )}
              </button>

              {/* Sub-articles */}
              {hasArticles && isExpanded && (
                <div className="ml-3 mb-1 border-l border-magazine-black/10 pl-3">
                  {s.articles!.map(a => (
                    <button
                      key={a.slug}
                      onClick={() => scrollTo(s.id)}
                      className="w-full text-left py-1.5 text-[11px] text-magazine-black/45 hover:text-magazine-black transition-colors leading-snug"
                    >
                      {a.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* ── PDF download ── */}
      <div className="px-6 py-5 border-t border-magazine-black/8">
        <a
          href="/api/magazine/issue-01/cover"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-mono text-[9px] tracking-[0.18em] uppercase text-magazine-black/40 hover:text-magazine-accent transition-colors"
        >
          <span className="inline-block w-4 h-px bg-current" />
          Télécharger PDF
        </a>
      </div>
    </aside>
  )
}
