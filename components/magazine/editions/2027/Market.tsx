'use client'

/**
 * The Market — Aegryn Magazine, January 2027 Edition
 * "European Tech M&A — The 2026 Numbers"
 */

import { useRef } from 'react'
import { StatHero } from '../../StatHero'
import { DealVolumeChart, MultiplesChart } from '../../charts/2027'
import { useFadeUp } from './shared'

const multiples = [
  { sector: 'AI-native SaaS',   median: '8–15x ARR', top: '>30x (outliers)',  src: 'Aventis Q2 2026' },
  { sector: 'FinTech',          median: '5.1x ARR',  top: '8.2x',             src: 'Aventis Q2 2026' },
  { sector: 'HealthTech',       median: '4.8x ARR',  top: '7.5x',             src: 'Aventis Q2 2026' },
  { sector: 'LegalTech',        median: '4.2x ARR',  top: '6.8x',             src: 'Aventis Q2 2026' },
  { sector: 'SaaS B2B generic', median: '3.1x ARR',  top: '5.5x',             src: 'SEG 2026'        },
  { sector: 'Marketplace',      median: '2.8x ARR',  top: '4.5x',             src: 'Aventis Q2 2026' },
]

export function Market() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.market-text', ref)

  return (
    <section id="s-market" ref={ref} className="bg-magazine-white">
      <StatHero
        value="2,698"
        text="SaaS M&A transactions completed in 2025 — a record."
        source="Software Equity Group, 2026"
      />

      <div className="px-6 md:px-[120px] py-20">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6 market-text">The Market</p>
        <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-4 market-text">
          European Tech M&amp;A — The 2026 Numbers
        </h2>

        {/* Volume chart */}
        <div className="mt-16 market-text">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-4">
            EU SaaS deal volume by quarter — 2023–2026 (est.)
          </p>
          <DealVolumeChart />
          <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-3">
            Source — Software Equity Group · Aventis Advisors · Synergy AI
          </p>
        </div>

        {/* Multiples table */}
        <div className="mt-20 market-text overflow-x-auto">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-6">
            EV/ARR Multiples by vertical — 2026
          </p>
          <table className="w-full text-body-mag">
            <thead>
              <tr className="border-b border-magazine-black/10">
                {['Sector', 'Median multiple', 'Top quartile', 'Source'].map(h => (
                  <th key={h} className="text-left text-label-mag uppercase tracking-[0.1em] text-magazine-black/40 pb-4 pr-8 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {multiples.map((row, i) => (
                <tr
                  key={row.sector}
                  className={`border-b border-magazine-black/5 ${i % 2 === 0 ? 'bg-magazine-ivory' : 'bg-magazine-white'}`}
                >
                  <td className="py-4 pr-8 font-semibold text-magazine-black">{row.sector}</td>
                  <td className="py-4 pr-8 text-magazine-accent font-semibold">{row.median}</td>
                  <td className="py-4 pr-8 text-magazine-black/60">{row.top}</td>
                  <td className="py-4 text-magazine-black/40 text-label-mag uppercase tracking-[0.08em]">{row.src}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EU vs US Multiples */}
        <div className="mt-20 market-text">
          <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-4">
            Median EV/ARR — Europe vs United States, 2021–2026
          </p>
          <MultiplesChart />
          <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-3">
            Source — SEG SaaS Report 2026 · Aventis Advisors Q2 2026
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-label-mag uppercase tracking-[0.1em]">
            <span className="flex items-center gap-2 text-magazine-black/50">
              <span className="inline-block w-6 h-0.5 bg-[#2EAF7D]" /> Europe: 3.1x → 4.7x ARR
            </span>
            <span className="flex items-center gap-2 text-magazine-black/50">
              <span
                className="inline-block w-6 h-0.5 bg-[#4A90D9] opacity-70"
                style={{ backgroundImage: 'repeating-linear-gradient(90deg,#4A90D9 0,#4A90D9 4px,transparent 4px,transparent 7px)' }}
              />
              US: 4.9x → 6.1x ARR
            </span>
            <span className="flex items-center gap-2 text-magazine-accent font-semibold">
              Gap narrowed from −40% to −23% since 2023
            </span>
          </div>
        </div>

        {/* The European Discount */}
        <div className="mt-20 max-w-prose market-text">
          <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
            The European Discount — and Why It's Narrowing
          </h3>
          <p className="text-body-mag text-magazine-black/70 leading-[1.75]">
            European SaaS companies trade at a 15–25% discount vs US peers. The gap has narrowed from 30–40% in 2020 — driven by increasing US buyer appetite for European SaaS and the maturation of European growth equity. The remaining discount reflects structural factors: a less standardised advisory ecosystem, fewer certifiable due diligence frameworks, and a cultural reluctance around price transparency. These are solvable problems.
          </p>
          <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em] mt-4">
            Source — Synergy AI 2026
          </p>
        </div>
      </div>
    </section>
  )
}
