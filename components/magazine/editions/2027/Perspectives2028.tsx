'use client'

/**
 * Perspectives 2027 — Aegryn Magazine, January 2027 Edition
 * "What the Next 12 Months Look Like"
 *
 * (NB: section title is "Perspectives 2027" — forward-looking from Jan 2027)
 */

import { useRef } from 'react'
import { useFadeUp } from './shared'

interface Force {
  num:    string
  title:  string
  body:   string
  impact: string
}

const forces: Force[] = [
  {
    num:   '01',
    title: 'The EU AI Act Enters Into Force',
    body:  'Assets not compliant with the EU AI Act — particularly high-risk systems — will face a structural devaluation. Assets that can demonstrate compliance (CIFS S-42) will command a verifiable premium. This creates the first regulatory certification arbitrage in European tech M&A history.',
    impact: 'Non-compliant AI assets: est. −20 to −30% valuation impact',
  },
  {
    num:   '02',
    title: 'The Founder Succession Wave',
    body:  'More than 3.5 million European SMEs are currently without a successor. The tech segment — particularly bootstrapped SaaS companies founded between 2008 and 2016 — is entering its peak succession window. This will drive significant deal volume in the 300K–3M€ segment, precisely where AEGRYN operates.',
    impact: 'Largest deal volume growth expected in LMM tech — H2 2026 to 2028',
  },
  {
    num:   '03',
    title: 'PE Dry Powder Reaches Record Levels',
    body:  'European private equity funds are sitting on record undeployed capital. Deal pace must accelerate. Certified, transaction-ready assets will move faster and attract more competitive offers. The advantage for sellers who have prepared in advance — including through CIFS certification — will be measurable.',
    impact: 'Certified assets expected to transact 40–60 days faster than uncertified',
  },
]

export function Perspectives2028() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.force-item', ref)

  return (
    <section id="s-outlook" ref={ref} className="bg-magazine-black px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-8 force-item">Perspectives 2027</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-20 max-w-[720px] force-item">
        What the Next 12 Months Look Like
      </h2>

      <div className="space-y-0">
        {forces.map((f, i) => (
          <div
            key={f.num}
            className={`force-item py-16 ${i < forces.length - 1 ? 'border-b border-magazine-white/10' : ''}`}
          >
            <p
              className="font-sans font-bold text-magazine-white/15 mb-4 tabular-nums"
              style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
            >
              {f.num}
            </p>
            <h3 className="text-h2-mag font-sans font-semibold text-magazine-white mb-6 max-w-[600px]">{f.title}</h3>
            <p className="text-body-mag text-magazine-white/60 leading-[1.75] max-w-prose mb-6">{f.body}</p>
            <p className="text-label-mag text-magazine-accent uppercase tracking-[0.1em]">{f.impact}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
