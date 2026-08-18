'use client'

import { useEffect, useRef, useState } from 'react'
import Link                  from 'next/link'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { gsap, SplitText }   from '@/lib/gsap'
import { StatHero }          from './StatHero'
import { DealVolumeChart, MultiplesChart, GradeDistributionChart } from './ReportCharts'

/* ── Types ──────────────────────────────────────────────── */
interface Deal {
  title:    string
  sector:   string
  ticket:   string
  multiple: string
  grade:    string
  factors:  string[]
}

interface Buyer {
  num:     string
  title:   string
  ticket:  string
  seeks:   string[]
  signal:  string
}

interface Force {
  num:    string
  title:  string
  body:   string
  impact: string
}

/* ── Section nav config ─────────────────────────────────── */
export const REPORT_SECTIONS = [
  { id: 's-editorial',    label: 'Editorial'        },
  { id: 's-market',       label: 'The Market'       },
  { id: 's-ai',           label: 'AI Effect'        },
  { id: 's-perspective',  label: 'Perspective'      },
  { id: 's-deals',        label: 'Deal Watch'       },
  { id: 's-buyers',       label: 'Buyer Landscape'  },
  { id: 's-outlook',      label: 'Perspectives 2027'},
  { id: 's-index',        label: 'AEGRYN Index'     },
] as const

/* ── Scrollspy nav ──────────────────────────────────────── */
export function ReportNav() {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const ids = REPORT_SECTIONS.map(s => s.id)
    const observers: IntersectionObserver[] = []

    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
      {REPORT_SECTIONS.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={e => {
            e.preventDefault()
            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="group flex items-center gap-2.5"
          aria-label={s.label}
        >
          <span className={`block w-5 h-px transition-all duration-300 ${
            active === s.id ? 'bg-magazine-accent w-7' : 'bg-white/25 group-hover:bg-white/50'
          }`} />
          <span className={`text-[9px] font-mono uppercase tracking-[0.16em] transition-all duration-300 whitespace-nowrap ${
            active === s.id ? 'text-magazine-accent opacity-100' : 'text-white/0 group-hover:text-white/50'
          }`}>
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  )
}

/* ── Scroll reveal hook ─────────────────────────────────── */
function useFadeUp(selector: string, triggerEl: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!triggerEl.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: triggerEl.current, start: 'top 80%', once: true },
        },
      )
    }, triggerEl)
    return () => ctx.revert()
  }, [selector, triggerEl])
}

/* ── Cover ──────────────────────────────────────────────── */
export function ReportCover({ ctaScroll }: { ctaScroll: string }) {
  const ref     = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!ref.current || !titleRef.current) return

    // SplitText sur le h1 — type 'lines' pour un reveal ligne par ligne
    const split = new SplitText(titleRef.current, { type: 'lines', linesClass: 'cover-line' })

    const ctx = gsap.context(() => {
      // Pattern B-like : chaque ligne monte depuis le bas (clip overflow)
      gsap.fromTo(
        split.lines,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.15 },
      )
      gsap.fromTo('.cover-meta',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.85 },
      )
    }, ref)

    return () => {
      split.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={ref}
      className="min-h-screen bg-magazine-black flex flex-col justify-between px-6 md:px-[120px] py-16 overflow-hidden"
    >
      <div className="cover-meta flex items-center justify-between">
        <p className="text-label-mag text-magazine-white/50 uppercase tracking-[0.2em]">
          The AEGRYN · First Edition · Autumn 2026
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
              <p className="font-sans font-bold text-magazine-white tabular-nums"
                style={{ fontSize: 'clamp(28px,4vw,48px)', lineHeight: 1, letterSpacing: '-0.03em' }}>
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

/* ── Editorial ──────────────────────────────────────────── */
export function ReportEditorial() {
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

/* ── The Market ─────────────────────────────────────────── */
export function ReportMarket() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.market-text', ref)

  const multiples = [
    { sector: 'AI-native SaaS',    median: '8–15x ARR', top: '>30x (outliers)',  src: 'Aventis Q2 2026' },
    { sector: 'FinTech',           median: '5.1x ARR',  top: '8.2x',             src: 'Aventis Q2 2026' },
    { sector: 'HealthTech',        median: '4.8x ARR',  top: '7.5x',             src: 'Aventis Q2 2026' },
    { sector: 'LegalTech',         median: '4.2x ARR',  top: '6.8x',             src: 'Aventis Q2 2026' },
    { sector: 'SaaS B2B generic',  median: '3.1x ARR',  top: '5.5x',             src: 'SEG 2026'        },
    { sector: 'Marketplace',       median: '2.8x ARR',  top: '4.5x',             src: 'Aventis Q2 2026' },
  ]

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
          European Tech M&A — The 2026 Numbers
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
              <span className="inline-block w-6 h-0.5 bg-[#4A90D9] opacity-70" style={{ backgroundImage: 'repeating-linear-gradient(90deg,#4A90D9 0,#4A90D9 4px,transparent 4px,transparent 7px)' }} /> US: 4.9x → 6.1x ARR
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

/* ── The AI Effect ──────────────────────────────────────── */
export function ReportAIEffect() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.ai-item', ref)

  const attrs = [
    { code: 'I-16', title: 'Proprietary data', body: 'Datasets that cannot be replicated — the foundation of durable AI value.' },
    { code: 'F-49', title: 'Contractual moat', body: 'Long-term contracts (>24 months) that prove deep client embedding.' },
    { code: 'S-42', title: 'EU AI Act ready', body: 'Compliance with Articles 9–15 — increasingly a buyer prerequisite.' },
    { code: 'F-14', title: 'NRR > 120%',       body: 'Net Revenue Retention above 120% demonstrates genuine product-market fit.' },
  ]

  return (
    <section id="s-ai" ref={ref} className="bg-magazine-black px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-8 ai-item">The AI Effect</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-16 max-w-[800px] ai-item">
        Artificial Intelligence and the Recomposition of Tech Value
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
        {[
          { val: '72%',  label: 'of SaaS M&A targets reference AI (2025)' },
          { val: '12.5x',label: 'median EV/Revenue for AI-native SaaS' },
        ].map(s => (
          <div key={s.val} className="ai-item">
            <p className="font-sans font-bold text-magazine-white tabular-nums"
              style={{ fontSize: 'clamp(52px,7vw,96px)', lineHeight: 0.92, letterSpacing: '-0.03em', fontWeight: 800 }}>
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

/* ── CIFS Bars — Pattern C scaleX 0→1 ──────────────────── */
const CIFS_DIMS = [
  { dim: 'C', label: 'Code integrity',       score: 22 },
  { dim: 'I', label: 'IP ownership',         score: 19 },
  { dim: 'F', label: 'Financial reliability', score: 21 },
  { dim: 'S', label: 'Security posture',      score: 18 },
] as const

function CifsBars() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const bars = containerRef.current.querySelectorAll<HTMLElement>('.cifs-bar-fill')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            once: true,
          },
        },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-4">
      {CIFS_DIMS.map(({ dim, label, score }) => {
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

/* ── AEGRYN Perspective ─────────────────────────────────── */
export function ReportPerspective() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.persp-item', ref)

  const refusals = [
    { code: 'F-11a', label: 'ARR declared without Stripe or billing access' },
    { code: 'I-21',  label: 'Software rights not formally assigned to the entity' },
    { code: 'F-42',  label: 'Founder dependency exceeding 60% of revenue' },
    { code: 'S-16',  label: 'No pentest conducted in the past 18 months' },
    { code: 'I-27',  label: 'No legal basis for personal data transfer (GDPR)' },
  ]

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
          AEGRYN Certification Index — Edition 1, 2026
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
              <span className="font-sans font-bold text-magazine-black/20 tabular-nums shrink-0"
                style={{ fontSize: 'clamp(32px,4vw,56px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>
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
          The Buyer's Checklist — 2026 Edition
        </h3>
        <p className="text-body-mag text-magazine-black/50 max-w-prose mb-12 leading-[1.75]">
          What buyers actually scrutinise first — by profile. Understanding their lens is the first step to positioning an asset correctly.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-magazine-black/10">
          {([
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
          ] as const).map(b => (
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

/* ── Deal Watch ─────────────────────────────────────────── */
export function ReportDealWatch({ disclaimer }: { disclaimer: string }) {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.deal-item', ref)

  const deals: Deal[] = [
    {
      title:    'team.blue × Windsor.ai',
      sector:   'AI Analytics · Switzerland · Q1 2026',
      ticket:   'Undisclosed (est. 8–15M€)',
      multiple: 'Est. 7–10x ARR',
      grade:    'AA',
      factors:  ['AI-native product with proprietary client dataset', 'Strong NRR (>130%) across mid-market clients', 'Clean IP stack — no open-source licensing conflict'],
    },
    {
      title:    'Hg × OneStream',
      sector:   'Finance SaaS · UK/EU · Q1 2026',
      ticket:   'Upper mid-market ($1B+)',
      multiple: 'Est. 12–15x ARR',
      grade:    'AAA',
      factors:  ['Category leader in financial performance management', 'Mission-critical embedding across enterprise accounts', 'Proven PE-grade financial documentation'],
    },
    {
      title:    'Undisclosed — B2B LegalTech',
      sector:   'LegalTech · France · Q2 2026',
      ticket:   'Est. 2–5M€',
      multiple: 'Est. 4.5x ARR',
      grade:    'A',
      factors:  ['Contract automation with verifiable accuracy metrics', 'Recurring revenue from law firms under annual subscription', 'RGPD-compliant architecture documented at submission'],
    },
    {
      title:    'Undisclosed — HR Automation SaaS',
      sector:   'HR Tech · Germany · Q1 2026',
      ticket:   'Est. 1–3M€',
      multiple: 'Est. 3.8x ARR',
      grade:    'A',
      factors:  ['Strong founder-to-team transition plan in place', 'Payroll integration with SAP creates switching costs', 'Clean cap table — single founder, no convertibles'],
    },
    {
      title:    'Undisclosed — HealthTech Platform',
      sector:   'HealthTech · Netherlands · Q2 2026',
      ticket:   'Est. 5–12M€',
      multiple: 'Est. 5.2x ARR',
      grade:    'AA',
      factors:  ['CE-marked medical device software (IEC 62304)', 'Hospital network with multi-year contracts', 'ISO 27001 certified — S-dimension pre-validated'],
    },
  ]

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

/* ── Buyer Landscape ────────────────────────────────────── */
export function ReportBuyerLandscape() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.buyer-item', ref)

  const buyers: Buyer[] = [
    {
      num: '01', title: 'PE Lower Mid-Market',
      ticket: 'Target: 2–15M€ EV',
      seeks: ['Recurring revenue with high NRR', 'Scalable without founder dependency', 'Existing team and processes in place'],
      signal: 'CIFS grade AA or above significantly accelerates their process.',
    },
    {
      num: '02', title: 'Search Fund & ETA',
      ticket: 'Target: 300K–3M€',
      seeks: ['Founder ready to exit cleanly', 'Documented processes and playbooks', 'Predictable, stable revenue stream'],
      signal: 'The buyer most likely to value a certified asset at a premium.',
    },
    {
      num: '03', title: 'Strategic Acquirer',
      ticket: 'Target: 500K–10M€',
      seeks: ['Defensible IP with no licensing conflicts (I-14, I-24)', 'Technology complementary to existing product', 'No ongoing litigation or IP dispute'],
      signal: 'IP certification (CIFS I-dimension) is their primary filter.',
    },
    {
      num: '04', title: 'Family Office',
      ticket: 'Target: 1–20M€ EV',
      seeks: ['Cashflow-positive with 10+ year horizon', 'Discreet, structured process', 'Minimal founder involvement post-close'],
      signal: "Growing rapidly as direct buyers. AEGRYN\u2019s core Transact audience.",
    },
  ]

  return (
    <section id="s-buyers" ref={ref} className="bg-magazine-ivory px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8 buyer-item">The Buyer Landscape</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px] buyer-item">
        Who Is Buying European Tech in 2026
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
        {buyers.map(b => (
          <div key={b.num} className="buyer-item">
            <p className="font-sans font-bold text-magazine-accent"
              style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>
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

/* ── Perspectives 2027 ──────────────────────────────────── */
export function ReportPerspectives() {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.force-item', ref)

  const forces: Force[] = [
    {
      num: '01',
      title: 'The EU AI Act Enters Into Force',
      body: 'Assets not compliant with the EU AI Act — particularly high-risk systems — will face a structural devaluation. Assets that can demonstrate compliance (CIFS S-42) will command a verifiable premium. This creates the first regulatory certification arbitrage in European tech M&A history.',
      impact: 'Non-compliant AI assets: est. −20 to −30% valuation impact',
    },
    {
      num: '02',
      title: 'The Founder Succession Wave',
      body: 'More than 3.5 million European SMEs are currently without a successor. The tech segment — particularly bootstrapped SaaS companies founded between 2008 and 2016 — is entering its peak succession window. This will drive significant deal volume in the 300K–3M€ segment, precisely where AEGRYN operates.',
      impact: 'Largest deal volume growth expected in LMM tech — H2 2026 to 2028',
    },
    {
      num: '03',
      title: 'PE Dry Powder Reaches Record Levels',
      body: 'European private equity funds are sitting on record undeployed capital. Deal pace must accelerate. Certified, transaction-ready assets will move faster and attract more competitive offers. The advantage for sellers who have prepared in advance — including through CIFS certification — will be measurable.',
      impact: 'Certified assets expected to transact 40–60 days faster than uncertified',
    },
  ]

  return (
    <section id="s-outlook" ref={ref} className="bg-magazine-black px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-8 force-item">Perspectives 2027</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-20 max-w-[720px] force-item">
        What the Next 12 Months Look Like
      </h2>

      <div className="space-y-0">
        {forces.map((f, i) => (
          <div key={f.num} className={`force-item py-16 ${i < forces.length - 1 ? 'border-b border-magazine-white/10' : ''}`}>
            <p className="font-sans font-bold text-magazine-white/15 mb-4 tabular-nums"
              style={{ fontSize: 'clamp(48px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>
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

/* ── AEGRYN Index ───────────────────────────────────────── */
export function ReportIndex({ indexNote }: { indexNote: string }) {
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
        {[
          { val: '< 25%', label: 'Certification acceptance rate', note: 'Across all submitted assets' },
          { val: '4',     label: 'Active certification dimensions', note: 'C · I · F · S (25 pts each)' },
          { val: '100',   label: 'Maximum certification score', note: 'Perfect score — theoretical baseline' },
        ].map(m => (
          <div key={m.label} className="py-10 px-8 first:pl-0 last:pr-0 sm:last:pr-0">
            <p className="font-sans font-bold text-magazine-black tabular-nums"
              style={{ fontSize: 'clamp(40px,5vw,72px)', lineHeight: 1, letterSpacing: '-0.03em', fontWeight: 800 }}>
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

/* ── CTA Final ──────────────────────────────────────────── */
export function ReportCTA({
  title, sub, line, ctaEstimate, ctaGrade,
}: {
  title: string; sub: string; line: string
  ctaEstimate: string; ctaGrade: string
}) {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.cta-item', ref)

  return (
    <section ref={ref} className="min-h-screen bg-magazine-black flex flex-col justify-center items-center px-6 text-center py-32">
      <h2 className="text-h1-mag font-sans font-bold text-magazine-white mb-4 cta-item max-w-[640px]">
        {title}
      </h2>
      <p className="text-h2-mag text-magazine-white/50 mb-12 cta-item">{sub}</p>

      <div className="flex flex-col sm:flex-row gap-4 cta-item">
        <Link
          href="/valuation"
          className="inline-flex items-center gap-2 bg-magazine-accent text-magazine-black font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-8 py-4 hover:bg-magazine-accent/90 transition-colors"
        >
          {ctaEstimate} <ArrowUpRight size={13} />
        </Link>
        <Link
          href="/grade"
          className="inline-flex items-center gap-2 border border-magazine-white/25 text-magazine-white font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-8 py-4 hover:border-magazine-white/60 transition-colors"
        >
          {ctaGrade} <ArrowUpRight size={13} />
        </Link>
      </div>

      <p className="text-label-mag text-magazine-white/25 uppercase tracking-[0.12em] mt-20 cta-item">{line}</p>
    </section>
  )
}
