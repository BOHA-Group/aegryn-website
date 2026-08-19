'use client'

/**
 * AEGRYN Index — Aegryn Magazine, January 2027 Edition
 * "Edition 1 — Proprietary Certification Data"
 */

import { useRef } from 'react'
import { useFadeUp } from './shared'

interface Props {
  indexNote: string
}

const metrics = [
  { val: '< 25%', label: 'Certification acceptance rate', note: 'Across all submitted assets'         },
  { val: '4',     label: 'Active certification dimensions', note: 'C · I · F · S (25 pts each)'      },
  { val: '100',   label: 'Maximum certification score',   note: 'Perfect score — theoretical baseline' },
]

export function AegrynIndex({ indexNote }: Props) {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.index-item', ref)

  return (
    <section id="s-index" ref={ref} className="bg-magazine-ivory px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8 index-item">
        The AEGRYN Index
      </p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-4 index-item">
        Edition 1 — Proprietary Certification Data
      </h2>
      <p className="text-body-mag text-magazine-black/50 max-w-prose mb-16 index-item italic">
        {indexNote}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:divide-x divide-magazine-black/10 index-item">
        {metrics.map(m => (
          <div key={m.label} className="py-10 px-8 first:pl-0 last:pr-0">
            <p
              className="font-sans font-bold text-magazine-black tabular-nums"
              style={{ fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
            >
              {m.val}
            </p>
            <p className="text-body-mag text-magazine-black/70 mt-3 font-semibold">{m.label}</p>
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.08em] mt-1">{m.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
