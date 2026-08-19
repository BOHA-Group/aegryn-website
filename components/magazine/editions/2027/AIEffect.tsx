'use client'

/**
 * The AI Effect — Aegryn Magazine, January 2027 Edition
 * "Artificial Intelligence and the Recomposition of Tech Value"
 */

import { useRef } from 'react'
import { useFadeUp } from './shared'

const attrs = [
  { code: 'I-16', title: 'Proprietary data',    body: 'Datasets that cannot be replicated — the foundation of durable AI value.' },
  { code: 'F-49', title: 'Contractual moat',    body: 'Long-term contracts (>24 months) that prove deep client embedding.' },
  { code: 'S-42', title: 'EU AI Act ready',     body: 'Compliance with Articles 9–15 — increasingly a buyer prerequisite.' },
  { code: 'F-14', title: 'NRR > 120%',          body: 'Net Revenue Retention above 120% demonstrates genuine product-market fit.' },
]

export function AIEffect() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.ai-item', ref)

  return (
    <section id="s-ai" ref={ref} className="bg-magazine-black px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-8 ai-item">The AI Effect</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-16 max-w-[800px] ai-item">
        Artificial Intelligence and the Recomposition of Tech Value
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        {[
          { val: '72%',   label: 'of SaaS M&A targets reference AI (2025)' },
          { val: '12.5x', label: 'median EV/Revenue for AI-native SaaS' },
        ].map(s => (
          <div key={s.val} className="ai-item">
            <p
              className="font-sans font-bold text-magazine-white tabular-nums"
              style={{ fontSize: 'clamp(52px,7vw,96px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontWeight: 800 }}
            >
              {s.val}
            </p>
            <p className="text-body-mag text-magazine-white/50 mt-4">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-20">
        {attrs.map(a => (
          <div key={a.code} className="ai-item border-l-2 border-magazine-accent pl-6 py-2" style={{ background: '#1A1A1A' }}>
            <p className="text-label-mag text-magazine-accent uppercase tracking-[0.12em] mb-2">{a.code}</p>
            <p className="text-h2-mag font-sans font-semibold text-magazine-white mb-2">{a.title}</p>
            <p className="text-body-mag text-magazine-white/55">{a.body}</p>
          </div>
        ))}
      </div>

      <div className="max-w-prose ai-item border-t border-magazine-white/10 pt-12">
        <h3 className="text-h2-mag font-sans font-semibold text-magazine-white mb-6">The Commoditisation Trap</h3>
        <p className="text-body-mag text-magazine-white/65 leading-[1.75]">
          The test: can a competitor rebuild this with Claude or GPT in two weeks? If yes, the asset has no certifiable moat. This is what we observe in approximately 40% of submitted assets — products built on thin wrappers around public LLMs, without proprietary data, contractual depth, or technical differentiation. The IA valuation premium is real. It is also fragile for assets that cannot pass this test.
        </p>
      </div>
    </section>
  )
}
