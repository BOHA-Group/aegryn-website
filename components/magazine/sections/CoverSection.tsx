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
 * Cover section — style Salford / magazine print cover.
 * Dark background, AEGRYN massive, accent tagline, theme text.
 */
export function CoverSection({ issue, stats, ctaScroll }: Props) {
  const ref      = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useCoverReveal(ref, titleRef)

  const date      = new Date(issue.publishedAt)
  const formatted = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }).toUpperCase()
  const issueNum  = `ISSUE ${String(issue.number).padStart(2, '0')}`

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col justify-between px-8 md:px-14 py-10 overflow-hidden"
      style={{ background: '#0A0A0A' }}
    >
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, rgba(46,175,125,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── Top bar ── */}
      <div className="cover-meta relative z-10 flex items-start justify-between">
        <p
          className="font-mono tracking-[0.22em] uppercase text-white/40"
          style={{ fontSize: '10px' }}
        >
          {formatted}
        </p>
        <div className="text-right">
          <p className="font-mono tracking-[0.18em] uppercase text-[#2EAF7D] font-bold" style={{ fontSize: '10px' }}>
            Special Edition
          </p>
          <p className="font-mono tracking-[0.18em] uppercase text-[#2EAF7D] font-bold" style={{ fontSize: '10px' }}>
            {issueNum}
          </p>
        </div>
      </div>

      {/* ── Main title block ── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
        {/* AEGRYN massive — Salford-style */}
        <h1
          ref={titleRef}
          className="font-sans font-bold text-white leading-none"
          style={{ fontSize: 'clamp(72px,14vw,180px)', letterSpacing: '-0.04em', lineHeight: 0.86 }}
        >
          Aegryn
        </h1>

        <p
          className="cover-meta font-mono tracking-[0.18em] uppercase text-white/35 mt-3"
          style={{ fontSize: '11px' }}
        >
          Magazine
        </p>

        {/* ── Exclusive block — left aligned like Salford ── */}
        <div className="cover-meta mt-10 md:mt-16 max-w-[240px]">
          <p
            className="font-sans font-bold text-[#2EAF7D] uppercase tracking-[0.06em] mb-2"
            style={{ fontSize: '13px' }}
          >
            Exclusive
          </p>
          <div className="w-12 h-[2px] bg-[#2EAF7D] mb-3" />
          <p className="font-sans font-bold text-white/60 uppercase leading-snug" style={{ fontSize: '11px', letterSpacing: '0.04em' }}>
            {issue.coverLine}
          </p>
        </div>
      </div>

      {/* ── Bottom block ── */}
      <div className="cover-meta relative z-10">
        {/* Tagline massive accent — like "STRATEGIES FOR BUSINESS RESILIENCE" */}
        <p
          className="font-sans font-bold text-[#2EAF7D] uppercase leading-none mb-5"
          style={{ fontSize: 'clamp(26px,4.5vw,52px)', letterSpacing: '-0.01em', lineHeight: 1 }}
        >
          {issue.title}
        </p>

        {/* Theme text — like the body copy at bottom of Salford cover */}
        <p
          className="font-sans uppercase text-white/50 leading-snug max-w-[640px]"
          style={{ fontSize: '11px', letterSpacing: '0.06em' }}
        >
          {issue.theme}
        </p>

        {/* Scroll CTA */}
        <button
          onClick={() => {
            const firstSection = issue.sections[0]
            if (firstSection) document.getElementById(firstSection.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="mt-8 flex items-center gap-2 font-mono text-[9px] tracking-[0.2em] uppercase text-white/30 hover:text-white/70 transition-colors"
          aria-label={ctaScroll}
        >
          {ctaScroll} <ArrowDown size={11} />
        </button>
      </div>
    </section>
  )
}
