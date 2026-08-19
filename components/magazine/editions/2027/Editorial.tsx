'use client'

/**
 * Editorial — Aegryn Magazine, January 2027 Edition
 * "Why Europe's Tech Market Needs a Standard"
 */

import { useRef } from 'react'
import { useFadeUp } from './shared'

export function Editorial() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.editorial-body > *', ref)

  return (
    <section id="s-editorial" ref={ref} className="bg-magazine-ivory px-6 md:px-[120px] py-32">
      <div className="max-w-prose mx-auto editorial-body">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Editorial</p>
        <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-4">
          Why Europe's Tech Market Needs a Standard
        </h2>
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-12">
          The Founding Team — AEGRYN
        </p>
        {[
          `We have spent years building, auditing, and structuring digital assets — and observing the same gap: the absence of a standardised, independent reference that both sides of a tech transaction could equally trust. Sellers operate without a certified baseline. Buyers make decisions on unverified information. The market, for all its sophistication, runs on opacity.`,
          `In 2026, the European SaaS M&A market reached its highest recorded volume. AI is fundamentally recomposing how tech value is defined and priced. European buyers are finally asserting themselves in a market long dominated by North American capital. Yet fragmentation and opacity persist — particularly for the 100K–5M€ segment, which represents the majority of deals by volume and the least served segment in terms of infrastructure.`,
          `The European discount — 15 to 25% below comparable US multiples — has narrowed, but has not disappeared. Part of the explanation is structural: a less mature advisory ecosystem, fewer standardised due diligence frameworks, and a cultural reluctance around price transparency. AEGRYN exists to change that.`,
          `The CIFS certification protocol — covering Code integrity, IP ownership, Financial reliability, and Security posture — provides both sides of a transaction with a shared, auditable language. The Grade is not a valuation. It is a certification of transactability: a verified statement that an asset has been prepared, structured, and documented to a standard that makes closing possible.`,
          `This report is not a commissioned market study. It is our reading of the market — drawn from our data, our protocol, our point of view. Each year, as our certification database grows, the data will become more ours. This first edition establishes the baseline. Everything that follows will build on it.`,
        ].map((p, i) => (
          <p key={i} className="text-body-mag text-magazine-black/75 mb-6 leading-[1.75]">{p}</p>
        ))}
      </div>
    </section>
  )
}
