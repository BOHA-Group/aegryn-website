'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useFadeUp } from './hooks/useFadeUp'

interface Props {
  title:       string
  sub:         string
  line:        string
  ctaEstimate: string
  ctaGrade:    string
}

/**
 * Full-screen CTA block for the end of a magazine issue.
 * Replaces the old CTA.tsx component — no year/report reference.
 */
export function AegrynCtaBlock({ title, sub, line, ctaEstimate, ctaGrade }: Props) {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.cta-item', ref)

  return (
    <section ref={ref} className="min-h-screen bg-magazine-black flex flex-col justify-center items-center px-6 text-center py-32">
      <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-4 cta-item max-w-[640px]">
        {title}
      </h2>
      <p className="text-h2-mag text-magazine-white/50 mb-12 cta-item">{sub}</p>

      <div className="flex flex-col sm:flex-row gap-4 cta-item">
        <Link
          href="/valuation"
          className="inline-flex items-center gap-2 bg-magazine-accent text-magazine-black font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-8 py-4 hover:bg-magazine-accent/90 transition-colors"
        >
          {ctaEstimate} <ArrowUpRight size={13} />
        </Link>
        <Link
          href="/grade"
          className="inline-flex items-center gap-2 border border-magazine-white/25 text-magazine-white font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-8 py-4 hover:border-magazine-white/60 transition-colors"
        >
          {ctaGrade} <ArrowUpRight size={13} />
        </Link>
      </div>

      <p className="text-label-mag text-magazine-white/25 uppercase tracking-[0.12em] mt-20 cta-item">{line}</p>
    </section>
  )
}
