'use client'

import { useEffect, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft, Check, TrendingUp, Shield, Award, Users, FileCheck,
  Briefcase, Landmark, Building2, Handshake, PiggyBank, Network,
  BadgeCheck, FileText, Map, Megaphone, Globe, Calendar, RefreshCw, GitBranch, Scale,
  UserCheck, Eye, Ban, SplitSquareHorizontal,
} from 'lucide-react'

/* ── Images dédiées à la brochure (aucune réutilisée ailleurs sur le site) ── */
const IMG = {
  cover:      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2400&auto=format&fit=crop',
  purpose:    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=1600&auto=format&fit=crop',
  audience:   'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1600&auto=format&fit=crop',
  value:      'https://images.unsplash.com/photo-1553484771-371a605b060b?q=80&w=1600&auto=format&fit=crop',
  process:    'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1600&auto=format&fit=crop',
  results:    'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1600&auto=format&fit=crop',
  auditors:   'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1600&auto=format&fit=crop',
  closing:    'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop',
}

type Cifs      = { code: string; name: string; full: string; weight: string; desc: string; criteria: string[] }
type Grade     = { grade: string; label: string; range: string; color: string; rarity: string; profile: string }
type Step      = { num: string; title: string; desc: string; inputs: string; outputs: string; outcomes: string }
type Item      = { title: string; desc: string }
type Stat      = { value: string; label: string }
type Phase     = { phase: string; title: string; desc: string }
type Row       = { standard: string; object: string; question: string }
type Block     = { title: string; desc: string }

const PROFILE_ICONS  = [Briefcase, Users, PiggyBank, Handshake, Landmark, Building2]
const BENEFIT_ICONS  = [BadgeCheck, TrendingUp, FileCheck, Map, Megaphone, Network]
const DELIVER_ICONS  = [Award, FileText, Map, Megaphone, Globe]
const AUDITOR_ICONS  = [UserCheck, Eye, Ban, SplitSquareHorizontal]

/* ── Page A4 simulée ── */
function Page({ n, total, label, children, dark = false, className = '' }: {
  n: number; total: number; label: string; children: ReactNode; dark?: boolean; className?: string
}) {
  return (
    <article
      className={`brochure-page relative mx-auto w-full max-w-[900px] bg-white shadow-[0_2px_24px_rgba(0,0,0,0.08)] border border-ag-border print:shadow-none print:border-0 ${dark ? 'bg-ag-navy text-white' : ''} ${className}`}
     
    >
      <div className="brochure-sheet relative min-h-[1272px]">
        <div className="px-5 sm:px-10 md:px-20 print:px-20 pt-16 pb-24 h-full">{children}</div>
        <footer className={`absolute bottom-0 left-0 right-0 px-5 sm:px-10 md:px-20 print:px-20 py-6 flex items-center justify-between font-mono text-[10px] tracking-[0.18em] uppercase ${dark ? 'text-white/40 border-t border-white/10' : 'text-ag-gray-light border-t border-ag-border'}`}>
          <span>CERTIFICATION CIFSO 5000. AEGRYN.</span>
          <span>{label} {n} / {total}</span>
        </footer>
      </div>
    </article>
  )
}

function SectionHead({ num, title, lead }: { num: string; title: string; lead: string }) {
  return (
    <header className="mb-10">
      <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-gray-light mb-3">{num}</p>
      <h2 className="font-sans font-bold text-ag-black text-[32px] md:text-[38px] print:text-[38px] tracking-[-0.03em] leading-[1.08] mb-5">{title}</h2>
      <p className="font-sans text-[17px] text-ag-black/80 leading-relaxed border-l-4 border-ag-apex pl-5">{lead}</p>
    </header>
  )
}

function Figure({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl ${className}`}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 900px) 100vw, 900px" />
    </div>
  )
}

export function CifsoBrochure() {
  const locale = useLocale()
  const b   = useTranslations('brochure')
  const gs  = useTranslations('gradingSystem')
  const gi  = useTranslations('grade.index')
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('print') !== '1') return
    const id = window.setTimeout(() => window.print(), 800)
    return () => window.clearTimeout(id)
  }, [searchParams])

  const cifs      = gs.raw('cifs')      as Cifs[]
  const grades    = gs.raw('grades')    as Grade[]
  const steps     = gs.raw('process')   as Step[]

  const toc        = b.raw('toc')            as string[]
  const stats      = b.raw('s1Stats')        as Stat[]
  const profiles   = b.raw('s2Profiles')     as Item[]
  const benefits   = b.raw('s3Benefits')     as Item[]
  const phases     = b.raw('s7Phases')       as Phase[]
  const delivers   = b.raw('s8Deliverables') as Item[]
  const validity   = b.raw('s9Validity')     as Block
  const renewal    = b.raw('s9Renewal')      as Block
  const versioning = b.raw('s9Versioning')   as Block
  const contest    = b.raw('s9Contest')      as Block
  const auditors   = b.raw('s10Auditors')    as Item[]
  const rows       = b.raw('s11Rows')        as Row[]
  const finalSteps = b.raw('s12Steps')       as string[]

  const TOTAL = 15
  const pageLabel = b('pageLabel')
  const num = (i: number) => String(i).padStart(2, '0')

  return (
    <main className="min-h-screen bg-[#e9ebee] print:bg-white">
      {/* Toolbar */}
      <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur border-b border-ag-border z-50 print:hidden">
        <div className="max-w-[900px] mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${locale}/grade`} className="inline-flex items-center gap-2 text-ag-gray hover:text-ag-black transition-colors text-sm">
            <ArrowLeft size={16} />
            {gi('wpNavBack')}
          </Link>
          {/* Bouton imprimer / télécharger masqué le temps de fiabiliser le PDF sur tous les navigateurs */}
        </div>
      </div>

      <div className="pt-28 pb-24 px-4 md:px-8 print:px-8 flex flex-col gap-8 print:pt-0 print:pb-0 print:gap-0 print:px-0">

        {/* ── COUVERTURE ── */}
        <article className="brochure-page relative mx-auto w-full max-w-[900px] overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.12)] print:shadow-none">
         <div className="brochure-sheet relative min-h-[1272px] overflow-hidden">
          <Image src={IMG.cover} alt="" fill priority className="object-cover" sizes="900px" />
          {/* Bandeau bas opaque pour un contraste garanti */}
          <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ag-navy via-ag-navy/95 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between px-5 sm:px-10 md:px-20 print:px-20 py-16">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-white text-[18px] tracking-[0.12em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">AEGRYN</span>
              <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-white bg-ag-navy/80 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                {b('docType')}
              </span>
            </div>
            <div>
              <div className="w-16 h-1 bg-ag-apex mb-8" />
              <h1 className="font-sans font-bold text-white text-[clamp(52px,8vw,88px)] leading-[0.95] tracking-[-0.04em] whitespace-pre-line mb-8">
                {b('coverTitle')}
              </h1>
              <p className="font-sans text-white/90 text-[18px] md:text-[20px] print:text-[20px] leading-relaxed max-w-xl mb-14">
                {b('coverSubtitle')}
              </p>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/60">{b('coverIssuer')}</p>
            </div>
          </div>
         </div>
        </article>

        {/* ── SOMMAIRE ── */}
        <Page n={2} total={TOTAL} label={pageLabel}>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-gray-light mb-3">CIFSO 5000</p>
          <h2 className="font-sans font-bold text-ag-black text-[38px] tracking-[-0.03em] mb-14">{b('tocTitle')}</h2>
          <ol className="flex flex-col">
            {toc.map((title, i) => {
              const page = [3, 4, 5, 6, 8, 9, 11, 12, 13, 14, 14, 15][i]
              return (
                <li key={i} className="flex items-baseline gap-5 py-4 border-b border-ag-border last:border-0">
                  <span className="font-mono text-[12px] text-ag-apex font-bold w-8 shrink-0">{num(i + 1)}</span>
                  <span className="font-sans text-[16px] text-ag-black flex-1">{title}</span>
                  <span className="flex-1 border-b border-dotted border-ag-border translate-y-[-4px]" />
                  <span className="font-mono text-[12px] text-ag-gray">{page}</span>
                </li>
              )
            })}
          </ol>
          <div className="mt-14 grid grid-cols-4 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="border border-ag-border rounded-xl p-5 text-center">
                <p className="font-sans font-bold text-ag-navy text-[34px] leading-none mb-2">{s.value}</p>
                <p className="font-sans text-[12px] text-ag-gray leading-snug">{s.label}</p>
              </div>
            ))}
          </div>
        </Page>

        {/* ── 01 À QUOI ÇA SERT ── */}
        <Page n={3} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(1)} title={b('s1Title')} lead={b('s1Lead')} />
          <Figure src={IMG.purpose} alt="" className="aspect-[21/9] mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-8">
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed">{b('s1P1')}</p>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed">{b('s1P2')}</p>
          </div>
          <div className="mt-10 rounded-xl bg-ag-navy p-8">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-3">{gs('whyTitle')}</p>
            <p className="font-sans text-white text-[15px] leading-relaxed">{gs('whyDesc')}</p>
          </div>
        </Page>

        {/* ── 02 À QUI ── */}
        <Page n={4} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(2)} title={b('s2Title')} lead={b('s2Lead')} />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] print:grid-cols-[1fr_1.4fr] gap-8 items-start">
            <Figure src={IMG.audience} alt="" className="aspect-[3/4]" />
            <div className="grid grid-cols-1 gap-4">
              {profiles.map((p, i) => {
                const Icon = PROFILE_ICONS[i] ?? Users
                return (
                  <div key={p.title} className="flex gap-4 p-4 rounded-xl border border-ag-border">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-ag-navy flex items-center justify-center">
                      <Icon size={18} className="text-ag-apex" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-ag-black text-[15px] mb-1">{p.title}</h3>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </Page>

        {/* ── 03 PLUS-VALUE ── */}
        <Page n={5} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(3)} title={b('s3Title')} lead={b('s3Lead')} />
          <Figure src={IMG.value} alt="" className="aspect-[21/8] mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-10 gap-y-8">
            {benefits.map((it, i) => {
              const Icon = BENEFIT_ICONS[i] ?? Check
              return (
                <div key={it.title} className="flex gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-lg bg-ag-apex/15 flex items-center justify-center">
                    <Icon size={16} className="text-ag-navy" />
                  </div>
                  <div>
                    <h3 className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{it.title}</h3>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{it.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </Page>

        {/* ── 04 CINQ DIMENSIONS (2 pages) ── */}
        <Page n={6} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(4)} title={b('s4Title')} lead={b('s4Lead')} />
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-8">{gs('cifsDesc')}</p>
          <div className="flex flex-col gap-5">
            {cifs.slice(0, 3).map((d) => <DimensionCard key={d.code} d={d} weightLabel={b('s4Weight')} criteriaLabel={b('s4Criteria')} />)}
          </div>
        </Page>
        <Page n={7} total={TOTAL} label={pageLabel}>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">{num(4)}. {b('s4Title')}</p>
          <div className="flex flex-col gap-5">
            {cifs.slice(3).map((d) => <DimensionCard key={d.code} d={d} weightLabel={b('s4Weight')} criteriaLabel={b('s4Criteria')} />)}
          </div>
          <div className="mt-8 flex items-stretch rounded-xl overflow-hidden border border-ag-border">
            {cifs.map((d) => (
              <div key={d.code} className="flex-1 p-4 text-center border-r border-ag-border last:border-0">
                <p className="font-sans font-bold text-ag-navy text-[22px] leading-none mb-1">{d.code}</p>
                <p className="font-mono text-[10px] text-ag-gray tracking-[0.1em]">{d.weight}</p>
              </div>
            ))}
          </div>
        </Page>

        {/* ── 05 GRADES ── */}
        <Page n={8} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(5)} title={b('s5Title')} lead={b('s5Lead')} />
          <div className="flex h-2 rounded-full overflow-hidden mb-8">
            {grades.map((g) => <div key={g.grade} className="flex-1" style={{ backgroundColor: g.color }} />)}
          </div>
          <div className="overflow-x-auto -mx-5 sm:-mx-10 md:mx-0 px-5 sm:px-10 md:px-0">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b-2 border-ag-navy">
                {[b('s5ColGrade'), b('s5ColRange'), b('s5ColRarity'), b('s5ColProfile')].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray py-3 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => (
                <tr key={g.grade} className="border-b border-ag-border align-top">
                  <td className="py-4 pr-4">
                    <span className="inline-flex items-center justify-center min-w-[56px] h-9 px-3 rounded-lg font-mono font-bold text-white text-[13px]" style={{ backgroundColor: g.color }}>
                      {g.grade}
                    </span>
                    <p className="font-sans font-semibold text-ag-black text-[13px] mt-2">{g.label}</p>
                  </td>
                  <td className="py-4 pr-4 font-mono text-[12px] text-ag-black whitespace-nowrap">{g.range}</td>
                  <td className="py-4 pr-4 font-sans text-[12px] text-ag-gray">{g.rarity}</td>
                  <td className="py-4 font-sans text-[13px] text-ag-gray leading-relaxed">{g.profile}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </Page>

        {/* ── 06 PROCESSUS (2 pages) ── */}
        <Page n={9} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(6)} title={b('s6Title')} lead={b('s6Lead')} />
          <Figure src={IMG.process} alt="" className="aspect-[21/8] mb-8" />
          <div className="flex flex-col gap-4">
            {steps.slice(0, 3).map((s) => <StepCard key={s.num} s={s} labels={[gs('processInputs'), gs('processOutputs'), gs('processOutcomes')]} />)}
          </div>
        </Page>
        <Page n={10} total={TOTAL} label={pageLabel}>
          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">{num(6)}. {b('s6Title')}</p>
          <div className="flex flex-col gap-4">
            {steps.slice(3).map((s) => <StepCard key={s.num} s={s} labels={[gs('processInputs'), gs('processOutputs'), gs('processOutcomes')]} />)}
          </div>
        </Page>

        {/* ── 07 PLANNING ── */}
        <Page n={11} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(7)} title={b('s7Title')} lead={b('s7Lead')} />
          <div className="relative pl-8 border-l-2 border-ag-navy/15 flex flex-col gap-8 mt-4">
            {phases.map((p, i) => (
              <div key={p.phase} className="relative">
                <span className="absolute -left-[41px] top-1 w-5 h-5 rounded-full bg-ag-apex border-4 border-white shadow" />
                <div className="flex items-center gap-3 mb-2">
                  <Calendar size={14} className="text-ag-navy" />
                  <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ag-navy font-semibold">{p.phase}</span>
                  <span className="font-mono text-[10px] text-ag-gray-light">{num(i + 1)}</span>
                </div>
                <h3 className="font-sans font-semibold text-ag-black text-[17px] mb-1.5">{p.title}</h3>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-xl">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4">
            <div className="rounded-xl bg-ag-navy p-6">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">{gi('processLabel')}</p>
              <p className="font-sans font-bold text-white text-[28px] leading-tight">{gi('processDuration')}</p>
            </div>
            <div className="rounded-xl border border-ag-border p-6">
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{b('s7Note')}</p>
            </div>
          </div>
        </Page>

        {/* ── 08 RÉSULTATS ── */}
        <Page n={12} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(8)} title={b('s8Title')} lead={b('s8Lead')} />
          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] print:grid-cols-[1.4fr_1fr] gap-8 items-start">
            <div className="flex flex-col gap-4">
              {delivers.map((d, i) => {
                const Icon = DELIVER_ICONS[i] ?? FileText
                return (
                  <div key={d.title} className="flex gap-4 p-4 rounded-xl border border-ag-border">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-ag-apex/15 flex items-center justify-center">
                      <Icon size={18} className="text-ag-navy" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-ag-black text-[15px] mb-1">{d.title}</h3>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{d.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
            <Figure src={IMG.results} alt="" className="aspect-[3/4]" />
          </div>
        </Page>

        {/* ── 09 VALIDITÉ ── */}
        <Page n={13} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(9)} title={b('s9Title')} lead={validity.desc} />
          <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-5">
            {[
              { ...validity,   Icon: Calendar },
              { ...renewal,    Icon: RefreshCw },
              { ...versioning, Icon: GitBranch },
              { ...contest,    Icon: Scale },
            ].map(({ title, desc, Icon }) => (
              <div key={title} className="rounded-xl border border-ag-border p-6">
                <div className="w-10 h-10 rounded-lg bg-ag-navy flex items-center justify-center mb-4">
                  <Icon size={18} className="text-ag-apex" />
                </div>
                <h3 className="font-sans font-semibold text-ag-black text-[16px] mb-2">{title}</h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Page>

        {/* ── 10 AUDITEURS + 11 POSITIONNEMENT ── */}
        <Page n={14} total={TOTAL} label={pageLabel}>
          <SectionHead num={num(10)} title={b('s10Title')} lead={b('s10Lead')} />
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr] print:grid-cols-[1fr_1.5fr] gap-8 items-start mb-14">
            <Figure src={IMG.auditors} alt="" className="aspect-[3/4]" />
            <div className="flex flex-col gap-4">
              {auditors.map((a, i) => {
                const Icon = AUDITOR_ICONS[i] ?? Shield
                return (
                  <div key={a.title} className="flex gap-4">
                    <div className="shrink-0 w-9 h-9 rounded-lg bg-ag-navy flex items-center justify-center">
                      <Icon size={16} className="text-ag-apex" />
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-ag-black text-[15px] mb-1">{a.title}</h3>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{a.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-gray-light mb-3">{num(11)}</p>
          <h2 className="font-sans font-bold text-ag-black text-[26px] tracking-[-0.03em] mb-3">{b('s11Title')}</h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-6">{b('s11Lead')}</p>
          <div className="overflow-x-auto -mx-5 sm:-mx-10 md:mx-0 px-5 sm:px-10 md:px-0">
          <table className="w-full min-w-[520px] border-collapse">
            <thead>
              <tr className="border-b-2 border-ag-navy">
                {[b('s11ColStandard'), b('s11ColObject'), b('s11ColQuestion')].map((h) => (
                  <th key={h} className="text-left font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray py-2.5 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const last = i === rows.length - 1
                return (
                  <tr key={r.standard} className={`border-b border-ag-border ${last ? 'bg-ag-apex/10' : ''}`}>
                    <td className={`py-3 pr-4 font-sans text-[13px] ${last ? 'font-bold text-ag-navy' : 'font-semibold text-ag-black'}`}>{r.standard}</td>
                    <td className="py-3 pr-4 font-sans text-[13px] text-ag-gray">{r.object}</td>
                    <td className="py-3 font-sans text-[13px] text-ag-gray">{r.question}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
          <p className="font-sans text-[12px] text-ag-gray leading-relaxed mt-4 italic">{b('s11Note')}</p>
        </Page>

        {/* ── 12 ENGAGER ── */}
        <article className="brochure-page relative mx-auto w-full max-w-[900px] overflow-hidden bg-ag-navy shadow-[0_2px_24px_rgba(0,0,0,0.12)] print:shadow-none">
         <div className="brochure-sheet relative min-h-[1272px] overflow-hidden">
          <div className="relative h-[42%] min-h-[520px]">
            <Image src={IMG.closing} alt="" fill className="object-cover" sizes="900px" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ag-navy/30 to-ag-navy" />
          </div>
          <div className="px-5 sm:px-10 md:px-20 print:px-20 pb-28 -mt-24 relative">
            <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-apex mb-3">{num(12)}</p>
            <h2 className="font-sans font-bold text-white text-[42px] tracking-[-0.03em] leading-[1.05] mb-4">{b('s12Title')}</h2>
            <p className="font-sans text-white/80 text-[17px] leading-relaxed max-w-xl mb-12">{b('s12Lead')}</p>
            <ol className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 mb-12">
              {finalSteps.map((s, i) => (
                <li key={s} className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/5 p-5">
                  <span className="shrink-0 w-9 h-9 rounded-full bg-ag-apex text-ag-navy font-mono font-bold text-[13px] flex items-center justify-center">{i + 1}</span>
                  <span className="font-sans text-white text-[14px]">{s}</span>
                </li>
              ))}
            </ol>
            <div className="flex flex-col sm:flex-row gap-4 print:hidden">
              <Link href={`/${locale}/grade/submit`} className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[12px] tracking-[0.14em] uppercase px-8 py-4 rounded-xl hover:bg-ag-apex/90 transition-colors">
                {b('s12Primary')}
              </Link>
              <Link href={`/${locale}/contact`} className="inline-flex items-center justify-center gap-2 border border-white/30 text-white hover:border-white hover:bg-white/10 font-sans font-semibold text-[12px] tracking-[0.14em] uppercase px-8 py-4 rounded-xl transition-all">
                {b('s12Secondary')}
              </Link>
            </div>
          </div>
          <footer className="absolute bottom-0 left-0 right-0 px-5 sm:px-10 md:px-20 print:px-20 py-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">
            <span>{b('footerIssuer')}</span>
          </footer>
         </div>
        </article>
      </div>
    </main>
  )
}

function DimensionCard({ d, weightLabel, criteriaLabel }: { d: Cifs; weightLabel: string; criteriaLabel: string }) {
  return (
    <div className="rounded-xl border border-ag-border p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-ag-navy flex items-center justify-center shrink-0">
            <span className="font-sans font-bold text-ag-apex text-[22px] leading-none">{d.code}</span>
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mb-0.5">{d.name}</p>
            <h3 className="font-sans font-semibold text-ag-black text-[16px]">{d.full}</h3>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-gray-light">{weightLabel}</p>
          <p className="font-mono text-[14px] font-bold text-ag-navy">{d.weight}</p>
        </div>
      </div>
      <p className="font-sans text-[13px] text-ag-gray leading-relaxed mb-4">{d.desc}</p>
      <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-gray-light mb-2">{criteriaLabel}</p>
      <ul className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-x-6 gap-y-1.5">
        {d.criteria.map((c) => (
          <li key={c} className="flex items-start gap-2 font-sans text-[12px] text-ag-black/80">
            <Check size={12} className="text-ag-apex mt-1 shrink-0" />{c}
          </li>
        ))}
      </ul>
    </div>
  )
}

function StepCard({ s, labels }: { s: Step; labels: [string, string, string] | string[] }) {
  return (
    <div className="rounded-xl border border-ag-border p-5">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-11 h-11 rounded-lg bg-ag-apex flex items-center justify-center">
          <span className="font-mono font-bold text-ag-navy text-[14px]">{s.num}</span>
        </div>
        <div>
          <h3 className="font-sans font-semibold text-ag-black text-[16px] mb-1">{s.title}</h3>
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{s.desc}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 print:grid-cols-3 gap-4 pt-4 border-t border-ag-border">
        {[s.inputs, s.outputs, s.outcomes].map((v, i) => (
          <div key={i}>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-navy font-semibold mb-1">{labels[i]}</p>
            <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{v}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
