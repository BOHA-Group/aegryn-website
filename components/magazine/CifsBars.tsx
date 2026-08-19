'use client'

import { useRef, useEffect } from 'react'
import { gsap } from '@/lib/gsap'

interface CifsDim {
  dim:   string
  label: string
  score: number
}

interface Props {
  dims: CifsDim[]
}

/**
 * Animated CIFS dimension bars.
 * Extracted from editions/2027/shared.tsx.
 * Data is passed via props — no hardcoded defaults.
 */
export function CifsBars({ dims }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const bars = containerRef.current.querySelectorAll<HTMLElement>('.cifs-bar-fill')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 0.8, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
        },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-4">
      {dims.map(({ dim, label, score }) => {
        const pct = (score / 25) * 100
        return (
          <div key={dim}>
            <div className="flex justify-between text-label-mag uppercase tracking-[0.1em] mb-2">
              <span className="text-magazine-black font-semibold">{dim} — {label}</span>
              <span className="text-magazine-black/40">{score}/25</span>
            </div>
            <div className="h-1.5 bg-magazine-black/10 w-full">
              <div
                className="cifs-bar-fill h-1.5 bg-magazine-accent"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.08em] pt-2">
        Example — Illustrative certified asset
      </p>
    </div>
  )
}
