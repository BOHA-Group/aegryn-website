'use client'

/**
 * Cover — Aegryn Magazine, January 2027 Edition
 * "The State of European Tech M&A"
 */

import { useRef } from 'react'
import { ArrowDown } from 'lucide-react'
import { useCoverReveal } from './shared'

interface Props {
  ctaScroll: string
}

export function Cover({ ctaScroll }: Props) {
  const ref      = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useCoverReveal(ref, titleRef)

  return (
    <section
      ref={ref}
      className="min-h-screen bg-magazine-black flex flex-col justify-between px-6 md:px-[120px] py-16 overflow-hidden"
    >
      <div className="cover-meta flex items-center justify-between">
        <p className="text-label-mag text-magazine-white/50 uppercase tracking-[0.2em]">
          Aegryn Magazine · First Edition · January 2027
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
          The State<br />
          of European<br />
          Tech M&amp;A
        </h1>

        <div className="cover-meta mt-10 w-20 h-px bg-magazine-accent" />

        <div className="cover-meta mt-10 flex flex-wrap gap-x-16 gap-y-8">
          {[
            { val: '2,698',  label: 'SaaS deals completed in 2025 — a record.' },
            { val: '+40%',   label: 'EU SaaS M&A volume growth since 2023.' },
            { val: '€14.2B', label: 'Transaction volume Europe 2025.' },
          ].map(s => (
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
          Annual Report — Certified by AEGRYN — Switzerland
        </p>
        <button
          onClick={() => document.getElementById('s-editorial')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex items-center gap-2 text-label-mag text-magazine-white/50 hover:text-magazine-white transition-colors uppercase tracking-[0.12em]"
          aria-label={ctaScroll}
        >
          {ctaScroll} <ArrowDown size={13} />
        </button>
      </div>
    </section>
  )
}
