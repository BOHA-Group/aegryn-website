'use client'

/**
 * Buyer Landscape — Aegryn Magazine, January 2027 Edition
 * "Who Is Buying European Tech in 2026"
 */

import { useRef } from 'react'
import { useFadeUp } from './shared'

interface Buyer {
  num:    string
  title:  string
  ticket: string
  seeks:  string[]
  signal: string
}

const buyers: Buyer[] = [
  {
    num: '01', title: 'PE Lower Mid-Market',
    ticket: 'Target: 2–15M€ EV',
    seeks: [
      'Recurring revenue with high NRR',
      'Scalable without founder dependency',
      'Existing team and processes in place',
    ],
    signal: 'CIFS grade AA or above significantly accelerates their process.',
  },
  {
    num: '02', title: 'Search Fund & ETA',
    ticket: 'Target: 300K–3M€',
    seeks: [
      'Founder ready to exit cleanly',
      'Documented processes and playbooks',
      'Predictable, stable revenue stream',
    ],
    signal: 'The buyer most likely to value a certified asset at a premium.',
  },
  {
    num: '03', title: 'Strategic Acquirer',
    ticket: 'Target: 500K–10M€',
    seeks: [
      'Defensible IP with no licensing conflicts (I-14, I-24)',
      'Technology complementary to existing product',
      'No ongoing litigation or IP dispute',
    ],
    signal: 'IP certification (CIFS I-dimension) is their primary filter.',
  },
  {
    num: '04', title: 'Family Office',
    ticket: 'Target: 1–20M€ EV',
    seeks: [
      'Cashflow-positive with 10+ year horizon',
      'Discreet, structured process',
      'Minimal founder involvement post-close',
    ],
    signal: "Growing rapidly as direct buyers. AEGRYN's core Transact audience.",
  },
]

export function BuyerLandscape() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.buyer-item', ref)

  return (
    <section id="s-buyers" ref={ref} className="bg-magazine-ivory px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8 buyer-item">The Buyer Landscape</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px] buyer-item">
        Who Is Buying European Tech in 2026
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        {buyers.map(b => (
          <div key={b.num} className="buyer-item">
            <p
              className="font-sans font-bold text-magazine-accent"
              style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
            >
              {b.num}
            </p>
            <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mt-4 mb-2">{b.title}</h3>
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.1em] mb-6">{b.ticket}</p>
            <ul className="space-y-2 mb-6">
              {b.seeks.map(s => (
                <li key={s} className="flex items-start gap-3 text-body-mag text-magazine-black/70">
                  <span className="mt-2.5 w-1 h-1 rounded-full bg-magazine-black/40 shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
            <p className="text-body-mag text-magazine-black/50 italic">{b.signal}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
