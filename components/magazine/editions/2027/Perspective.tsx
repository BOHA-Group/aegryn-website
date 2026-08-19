'use client'

/**
 * The AEGRYN Perspective — Aegryn Magazine, January 2027 Edition
 * "What We See From the Certification Table"
 */

import { useRef } from 'react'
import { GradeDistributionChart } from '../../charts/2027'
import { useFadeUp, CifsBars } from './shared'

const refusals = [
  { code: 'F-11a', label: 'ARR declared without Stripe or billing access' },
  { code: 'I-21',  label: 'Software rights not formally assigned to the entity' },
  { code: 'F-42',  label: 'Founder dependency exceeding 60% of revenue' },
  { code: 'S-16',  label: 'No pentest conducted in the past 18 months' },
  { code: 'I-27',  label: 'No legal basis for personal data transfer (GDPR)' },
]

const buyerProfiles = [
  {
    profile: 'PE Fund',
    focus: 'F-42 · F-11 · F-22',
    items: [
      'ARR certified with billing access (F-11a)',
      'Founder dependency <40% of revenue (F-42)',
      'Net Revenue Retention >110% (F-22)',
      'Clean cap table, no conversion instruments',
      'Auditable financial model with actuals',
    ],
    signal: 'Will not engage without certified financials.',
  },
  {
    profile: 'Search Fund / ETA',
    focus: 'Management · TRS · Earnout',
    items: [
      'Founder committed to transition period',
      'Management team operational without founder',
      'Documented SOPs and customer playbooks',
      'SDE (Seller Discretionary Earnings) clearly stated',
      'Earnout structure acceptable if SaaS metrics solid',
    ],
    signal: 'Most likely to pay a premium for CIFS certification.',
  },
  {
    profile: 'Strategic Acquirer',
    focus: 'I-14 · C-43 · I-24',
    items: [
      'All IP formally assigned to the entity (I-21)',
      'No open-source licence conflicts (I-14)',
      'No ongoing litigation or IP dispute',
      "Tech complementary to acquirer's stack (C-43)",
      'GDPR data transfer basis documented (I-27)',
    ],
    signal: 'IP certification (I-dimension) is their primary filter.',
  },
] as const

export function Perspective() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.persp-item', ref)

  return (
    <section id="s-perspective" ref={ref} className="bg-magazine-ivory px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8 persp-item">
        The AEGRYN Perspective
      </p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px] persp-item">
        What We See From the Certification Table
      </h2>

      {/* CIFS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-20 persp-item">
        <div>
          <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-6">
            Not a Valuation. A Certification.
          </h3>
          <p className="text-body-mag text-magazine-black/70 leading-[1.75] mb-6">
            The CIFS protocol covers four dimensions: <strong>C</strong>ode integrity, <strong>I</strong>P ownership, <strong>F</strong>inancial reliability, and <strong>S</strong>ecurity posture. Each dimension is scored on a 25-point scale. A certified asset achieves a minimum threshold across all four — not just the average.
          </p>
          <p className="text-body-mag text-magazine-black/70 leading-[1.75]">
            Unlike a CIM or an information memorandum, the CIFS certification is auditable, signed, and tied to a specific state of the asset at a specific date. It is what makes closing faster and dispute risk lower.
          </p>
          <p className="text-body-mag text-magazine-black/50 leading-[1.75] mt-4 italic">
            Less than 25% of submitted assets pass the certification threshold.
          </p>
        </div>
        <CifsBars />
      </div>

      {/* Grade distribution */}
      <div className="mb-20 persp-item">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-4">
          AEGRYN Certification Index — Edition 1, January 2027
        </p>
        <GradeDistributionChart />
        <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.08em] mt-3">
          Based on asset submissions since launch. Data will deepen with each annual edition.
        </p>
      </div>

      {/* Top 5 refusals */}
      <div className="persp-item">
        <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-10">
          Top 5 Reasons Assets Are Not Certified
        </h3>
        <div className="space-y-0">
          {refusals.map((r, i) => (
            <div key={r.code} className="flex items-start gap-8 py-6 border-b border-magazine-black/10">
              <span
                className="font-sans font-bold text-magazine-black/20 tabular-nums shrink-0"
                style={{ fontSize: 'clamp(32px,4vw,56px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}
              >
                0{i + 1}
              </span>
              <div className="pt-1">
                <p className="text-label-mag text-magazine-accent uppercase tracking-[0.12em] mb-1">{r.code}</p>
                <p className="text-h2-mag font-sans font-semibold text-magazine-black">{r.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Buyer's Checklist */}
      <div className="persp-item mt-24">
        <h3 className="text-h2-mag font-sans font-semibold text-magazine-black mb-4">
          The Buyer's Checklist — January 2027 Edition
        </h3>
        <p className="text-body-mag text-magazine-black/50 max-w-prose mb-12 leading-[1.75]">
          What buyers actually scrutinise first — by profile. Understanding their lens is the first step to positioning an asset correctly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-magazine-black/10">
          {buyerProfiles.map(b => (
            <div key={b.profile} className="p-8 md:p-10 border-b md:border-b-0 md:border-r border-magazine-black/10 last:border-0 flex flex-col gap-6">
              <div>
                <p className="text-label-mag text-magazine-accent uppercase tracking-[0.14em] mb-1">{b.focus}</p>
                <h4 className="text-h2-mag font-sans font-semibold text-magazine-black">{b.profile}</h4>
              </div>
              <ul className="flex flex-col gap-3">
                {b.items.map(item => (
                  <li key={item} className="flex items-start gap-3 text-body-mag text-magazine-black/65">
                    <span className="mt-2.5 w-1 h-1 rounded-full bg-magazine-accent shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="text-label-mag text-magazine-black/35 italic mt-auto pt-4 border-t border-magazine-black/8 leading-relaxed">
                {b.signal}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
