'use client'

import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import type { MagazineIssue, IssueStat } from '@/lib/magazine/types'
import { useCoverReveal } from '../hooks/useCoverReveal'

interface Props {
  issue:     MagazineIssue
  stats:     IssueStat[]
  ctaScroll: string
}

/**
 * Cover section template — data-driven, no hardcoded content.
 */
export function CoverSection({ issue, stats, ctaScroll }: Props) {
  const ref      = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useCoverReveal(ref, titleRef)

  const date = new Date(issue.publishedAt)
  const formatted = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <section
      ref={ref}
      className="min-h-screen bg-magazine-black flex flex-col justify-between px-6 md:px-[120px] py-16 overflow-hidden"
    >
      <div className="cover-meta flex items-center justify-between">
        <p className="text-label-mag text-magazine-white/50 uppercase tracking-[0.2em]">
          Aegryn Magazine · Issue {String(issue.number).padStart(2, '0')} · {formatted}
        </p>
        <span className="text-label-mag text-magazine-accent uppercase tracking-[0.15em]">
          Annual Report
        </span>
      </div>

      <div className="flex-1 flex flex-col justify-center py-20">
        <h1
          ref={titleRef}
          className="font-sans text-magazine-white"
          style={{ fontSize: 'clamp(52px,9vw,120px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontWeight: 800 }}
        >
          {issue.title}
        </h1>

        <div className="cover-meta mt-10 w-20 h-px bg-magazine-accent" />

        <div className="cover-meta mt-10 flex flex-wrap gap-x-16 gap-y-8">
          {stats.map(s => (
            <div key={s.val}>
              <p
                className="font-sans font-bold text-magazine-white tabular-nums"
                style={{ fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1, letterSpacing: '-0.03em' }}
              >
                {s.val}
              </p>
              <p className="text-label-mag text-magazine-white/40 mt-2 max-w-[220px]">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="cover-meta flex items-center justify-between">
        <p className="text-label-mag text-magazine-white/30 uppercase tracking-[0.12em]">
          {issue.theme} — Certified by AEGRYN — Switzerland
        </p>
        <button
          onClick={() => {
            const firstSection = issue.sections[0]
            if (firstSection) document.getElementById(firstSection.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex items-center gap-2 text-label-mag text-magazine-white/50 hover:text-magazine-white transition-colors uppercase tracking-[0.12em]"
          aria-label={ctaScroll}
        >
          {ctaScroll} <ArrowDown size={13} />
        </button>
      </div>
    </section>
  )
}
