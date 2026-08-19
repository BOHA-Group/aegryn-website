'use client'

/**
 * Deal Watch — Aegryn Magazine, January 2027 Edition
 * "Transactions That Shaped the European Tech Landscape — H1 2026"
 */

import { useRef } from 'react'
import { useFadeUp } from './shared'

interface Deal {
  title:    string
  sector:   string
  ticket:   string
  multiple: string
  grade:    string
  factors:  string[]
}

const deals: Deal[] = [
  {
    title:    'team.blue × Windsor.ai',
    sector:   'AI Analytics · Switzerland · Q1 2026',
    ticket:   'Undisclosed (est. 8–15M€)',
    multiple: 'Est. 7–10x ARR',
    grade:    'AA',
    factors: [
      'AI-native product with proprietary client dataset',
      'Strong NRR (>130%) across mid-market clients',
      'Clean IP stack — no open-source licensing conflict',
    ],
  },
  {
    title:    'Hg × OneStream',
    sector:   'Finance SaaS · UK/EU · Q1 2026',
    ticket:   'Upper mid-market ($1B+)',
    multiple: 'Est. 12–15x ARR',
    grade:    'AAA',
    factors: [
      'Category leader in financial performance management',
      'Mission-critical embedding across enterprise accounts',
      'Proven PE-grade financial documentation',
    ],
  },
  {
    title:    'Undisclosed — B2B LegalTech',
    sector:   'LegalTech · France · Q2 2026',
    ticket:   'Est. 2–5M€',
    multiple: 'Est. 4.5x ARR',
    grade:    'A',
    factors: [
      'Contract automation with verifiable accuracy metrics',
      'Recurring revenue from law firms under annual subscription',
      'RGPD-compliant architecture documented at submission',
    ],
  },
  {
    title:    'Undisclosed — HR Automation SaaS',
    sector:   'HR Tech · Germany · Q1 2026',
    ticket:   'Est. 1–3M€',
    multiple: 'Est. 3.8x ARR',
    grade:    'A',
    factors: [
      'Strong founder-to-team transition plan in place',
      'Payroll integration with SAP creates switching costs',
      'Clean cap table — single founder, no convertibles',
    ],
  },
  {
    title:    'Undisclosed — HealthTech Platform',
    sector:   'HealthTech · Netherlands · Q2 2026',
    ticket:   'Est. 5–12M€',
    multiple: 'Est. 5.2x ARR',
    grade:    'AA',
    factors: [
      'CE-marked medical device software (IEC 62304)',
      'Hospital network with multi-year contracts',
      'ISO 27001 certified — S-dimension pre-validated',
    ],
  },
]

interface Props {
  disclaimer: string
}

export function DealWatch({ disclaimer }: Props) {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.deal-item', ref)

  return (
    <section id="s-deals" ref={ref} className="bg-magazine-white px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8 deal-item">Deal Watch</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px] deal-item">
        Transactions That Shaped the European Tech Landscape — H1 2026
      </h2>

      <div className="space-y-6">
        {deals.map(deal => (
          <div key={deal.title} className="deal-item border-l-2 border-magazine-accent pl-8 py-6 bg-magazine-ivory">
            <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-2">{deal.sector}</p>
            <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-2">{deal.title}</h3>
            <div className="flex flex-wrap gap-x-8 gap-y-1 mb-4">
              <p className="text-body-mag text-magazine-black/60">{deal.ticket}</p>
              <p className="text-body-mag text-magazine-black/60">{deal.multiple}</p>
              <p className="text-label-mag text-magazine-accent uppercase tracking-[0.1em] font-semibold">
                Est. Grade {deal.grade}
              </p>
            </div>
            <ul className="space-y-1">
              {deal.factors.map(f => (
                <li key={f} className="flex items-start gap-3 text-body-mag text-magazine-black/65">
                  <span className="mt-2 w-1 h-1 rounded-full bg-magazine-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="text-label-mag text-magazine-black/30 italic mt-10 max-w-prose leading-[1.7]">
        {disclaimer}
      </p>
    </section>
  )
}
