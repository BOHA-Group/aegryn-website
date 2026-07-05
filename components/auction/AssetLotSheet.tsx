'use client'

import { useState } from 'react'
import {
  ShieldCheck, TrendingUp, Globe2, Layers,
  Users, AlertTriangle, FileText,
  ChevronDown, ChevronUp,
} from 'lucide-react'
import type { LucideIcon }                                              from 'lucide-react'
import type { AssetLot, HeroStat, SummaryItem, BulletItem, TargetItem } from '@/types/auction'

const T = {
  ink:       '#0C0C0C',
  gold:      '#9C7A3C',
  goldLight: '#D9C9A3',
  grey900:   '#1A1A1A',
  grey600:   '#5C5C5C',
  grey300:   '#B8B8B8',
  paper:     '#FAF8F3',
  line:      '#D9D2C2',
}

const GRADE_COLORS: Record<string, string> = {
  '★':   '#5ADDA4',  // ag-grade-star — Apex Mint
  'AAA': '#C9A84C',  // ag-grade-aaa  — Gold
  'AA':  '#9BA8B0',  // ag-grade-aa   — Silver
  'A':   '#4A90D9',  // ag-grade-a    — Blue
  'B':   '#D4820A',  // ag-grade-b    — Amber
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-bold uppercase mb-2"
      style={{ color: T.gold, letterSpacing: '0.18em', fontFamily: 'Arial, sans-serif' }}>
      {children}
    </p>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SectionHeading({ numeral, title, icon: Icon }: {
  numeral?: string; title: string; icon?: LucideIcon
}) {
  return (
    <div className="flex items-baseline gap-3 pb-3 mb-5 border-b" style={{ borderColor: T.line }}>
      {numeral && (
        <span className="text-[13px] font-bold tracking-wider"
          style={{ color: T.gold, fontFamily: 'Arial, sans-serif' }}>
          {numeral}
        </span>
      )}
      {Icon && <Icon size={16} style={{ color: T.gold }} strokeWidth={1.75} />}
      <h2 className="text-[13px] font-bold uppercase"
        style={{ color: T.ink, letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>
        {title}
      </h2>
    </div>
  )
}

function Body({ children, emphasis = false, italic = false }: {
  children: React.ReactNode; emphasis?: boolean; italic?: boolean
}) {
  return (
    <p className="mb-4 leading-[1.7]" style={{
      fontFamily: "Georgia, 'Times New Roman', serif",
      fontSize: '16px',
      color: emphasis ? T.ink : T.grey900,
      fontWeight: emphasis ? 700 : 400,
      fontStyle: italic ? 'italic' : 'normal',
    }}>
      {children}
    </p>
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] italic mb-5"
      style={{ color: T.grey600, fontFamily: 'Arial, sans-serif' }}>
      {children}
    </p>
  )
}

function Bullet({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3 mb-3 leading-[1.6]">
      <span style={{ color: T.gold }} className="mt-[2px] select-none">—</span>
      <p className="text-[15px]" style={{ fontFamily: 'Arial, sans-serif', color: T.grey900 }}>
        {label && <span className="font-bold" style={{ color: T.ink }}>{label} </span>}
        {children}
      </p>
    </li>
  )
}

function SpecTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="mb-5 overflow-hidden rounded-sm border" style={{ borderColor: T.line }}>
      {rows.map(([label, value], i) => (
        <div key={label} className="grid grid-cols-[1fr_2fr] sm:grid-cols-[200px_1fr] gap-2 px-4 py-3 border-b last:border-b-0"
          style={{ backgroundColor: i % 2 === 0 ? T.paper : '#FFFFFF', borderColor: T.line }}>
          <span className="text-[12px] font-bold uppercase"
            style={{ color: T.grey600, fontFamily: 'Arial, sans-serif', letterSpacing: '0.02em' }}>
            {label}
          </span>
          <span className="text-[14px]" style={{ color: T.ink, fontFamily: 'Arial, sans-serif' }}>
            {value}
          </span>
        </div>
      ))}
    </div>
  )
}

function StatBlock({ stats }: { stats: HeroStat[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6">
      {stats.map((s) => (
        <div key={s.label}>
          <div className="text-[28px] sm:text-[32px] font-bold leading-none mb-1"
            style={{ fontFamily: 'Georgia, serif', color: T.ink }}>
            {s.value}
          </div>
          <div className="text-[10px] uppercase"
            style={{ color: T.grey600, letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function GradeBadge({ grade, label }: { grade: string; label: string }) {
  const color = GRADE_COLORS[grade] ?? T.gold
  return (
    <div className="flex border rounded-sm overflow-hidden" style={{ borderColor: T.line }}>
      <div className="flex items-center justify-center w-28 sm:w-32 shrink-0 py-6"
        style={{ backgroundColor: color }}>
        <span className="text-[44px] font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
          {grade}
        </span>
      </div>
      <div className="px-5 py-4 flex flex-col justify-center" style={{ backgroundColor: T.paper }}>
        <span className="text-[10px] font-bold uppercase mb-1"
          style={{ color: T.gold, letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}>
          Grade préliminaire AEGRYN
        </span>
        <p className="text-[13px] leading-[1.5]"
          style={{ color: T.ink, fontFamily: 'Georgia, serif' }}>
          {label}
        </p>
      </div>
    </div>
  )
}

function SummaryBox({ items }: { items: SummaryItem[] }) {
  return (
    <div className="mb-2 overflow-hidden rounded-sm border" style={{ borderColor: T.line }}>
      {items.map((it, i) => (
        <div key={it.label}
          className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-1 sm:gap-3 px-4 py-3 border-b last:border-b-0"
          style={{ backgroundColor: i % 2 === 0 ? T.paper : '#FFFFFF', borderColor: T.line }}>
          <span className="text-[11px] font-bold uppercase"
            style={{ color: T.gold, letterSpacing: '0.06em', fontFamily: 'Arial, sans-serif' }}>
            {it.label}
          </span>
          <span className="text-[14px]" style={{ color: T.ink, fontFamily: 'Arial, sans-serif' }}>
            {it.value}
          </span>
        </div>
      ))}
    </div>
  )
}

function TargetGrid({ targets }: { targets: TargetItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
      {targets.map((tgt) => (
        <div key={tgt.title} className="p-4 rounded-sm border"
          style={{ backgroundColor: T.paper, borderColor: T.line }}>
          <p className="text-[11px] font-bold uppercase mb-1"
            style={{ color: T.gold, letterSpacing: '0.06em', fontFamily: 'Arial, sans-serif' }}>
            {tgt.title}
          </p>
          <p className="text-[14px] leading-[1.5]"
            style={{ color: T.ink, fontFamily: 'Georgia, serif' }}>
            {tgt.desc}
          </p>
        </div>
      ))}
    </div>
  )
}

function CollapsibleSection({ numeral, title, icon: _icon, defaultOpen = true, children }: {
  numeral?: string; title: string; icon?: LucideIcon
  defaultOpen?: boolean; children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <section className="mb-2">
      <button type="button" onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 pb-3 mb-5 border-b text-left"
        style={{ borderColor: T.line }} aria-expanded={open}>
        <span className="flex items-baseline gap-3">
          {numeral && (
            <span className="text-[13px] font-bold tracking-wider"
              style={{ color: T.gold, fontFamily: 'Arial, sans-serif' }}>
              {numeral}
            </span>
          )}
          <span className="text-[13px] font-bold uppercase"
            style={{ color: T.ink, letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>
            {title}
          </span>
        </span>
        {open
          ? <ChevronUp size={16} style={{ color: T.grey600 }} />
          : <ChevronDown size={16} style={{ color: T.grey600 }} />}
      </button>
      {open && <div>{children}</div>}
    </section>
  )
}

export default function AssetLotSheet({ asset }: { asset: AssetLot }) {
  const {
    lotNumber, name, tagline, catalogContext,
    heroStats, grade,
    executiveSummary, presentationNotice, provenance,
    rarity, assetState, capabilities, targetSegments,
    growth, competitivePosition, traction, maturity,
    risks, thesis, mentions,
  } = asset

  return (
    <div className="w-full max-w-[840px] mx-auto" style={{ backgroundColor: '#FFFFFF' }}>

      {/* Sticky header */}
      <div className="flex items-center justify-between py-3 px-1 border-b mb-8 sticky top-0 z-10 backdrop-blur-sm"
        style={{ borderColor: T.line, backgroundColor: 'rgba(255,255,255,0.92)' }}>
        <span className="text-[11px] font-bold"
          style={{ color: T.ink, letterSpacing: '0.14em', fontFamily: 'Arial, sans-serif' }}>
          AEGRYN AUCTION
        </span>
        <span className="text-[10px] hidden sm:inline"
          style={{ color: T.grey600, letterSpacing: '0.06em', fontFamily: 'Arial, sans-serif' }}>
          DOSSIER CONFIDENTIEL — DIFFUSION RESTREINTE
        </span>
      </div>

      <div className="px-1">
        {/* Lot header */}
        <Kicker>{catalogContext}</Kicker>
        <p className="text-[28px] sm:text-[32px] font-bold mb-1"
          style={{ fontFamily: 'Georgia, serif', color: T.ink }}>
          Lot N° {lotNumber}
        </p>
        <h1 className="text-[56px] sm:text-[72px] font-bold leading-none mb-5"
          style={{ fontFamily: 'Georgia, serif', color: T.ink }}>
          {name}
        </h1>
        <p className="text-[18px] sm:text-[20px] italic mb-6"
          style={{ fontFamily: 'Georgia, serif', color: T.grey600 }}>
          {tagline}
        </p>
        <div className="border-t-2 mb-2" style={{ borderColor: T.gold }} />

        <StatBlock stats={heroStats} />

        <div className="mb-12">
          <GradeBadge grade={grade.letter} label={grade.label} />
        </div>

        {/* Executive summary */}
        <div className="mb-14 pb-10 border-b" style={{ borderColor: T.line }}>
          <Kicker>Résumé exécutif · Lecture en un coup d&rsquo;œil</Kicker>
          <h2 className="text-[24px] font-bold mb-4"
            style={{ fontFamily: 'Georgia, serif', color: T.ink }}>
            Synthèse de l&rsquo;actif
          </h2>
          <Body>{executiveSummary.intro}</Body>
          <SummaryBox items={executiveSummary.items} />
        </div>

        {/* Sections I–XII */}
        <CollapsibleSection numeral="I" title="Notice de présentation" icon={FileText}>
          {presentationNotice.body.map((p, i) => <Body key={i}>{p}</Body>)}
          <Caption>{presentationNotice.meta}</Caption>
        </CollapsibleSection>

        <CollapsibleSection numeral="II" title="Provenance et antériorité" icon={ShieldCheck}>
          {provenance.body.map((p, i) => <Body key={i}>{p}</Body>)}
        </CollapsibleSection>

        <CollapsibleSection numeral="III" title="Rareté de l'actif" icon={Layers}>
          {rarity.body.map((p, i) => <Body key={i}>{p}</Body>)}
          {rarity.highlight && <Body emphasis>{rarity.highlight}</Body>}
        </CollapsibleSection>

        <CollapsibleSection numeral="IV" title="État de l'actif" icon={Layers}>
          {assetState.body.map((p, i) => <Body key={i}>{p}</Body>)}
          <SpecTable rows={assetState.specs} />
          {assetState.note && <Caption>{assetState.note}</Caption>}
        </CollapsibleSection>

        <CollapsibleSection numeral="V" title="Niveau d'avancement fonctionnel" icon={ShieldCheck}>
          <Body>{capabilities.intro}</Body>
          <ul className="mb-5">
            {capabilities.items.map((it: BulletItem) => (
              <Bullet key={it.label} label={it.label}>{it.text}</Bullet>
            ))}
          </ul>
          {capabilities.pending && <Body>{capabilities.pending}</Body>}
        </CollapsibleSection>

        <CollapsibleSection numeral="VI" title="Segments de clientèle adressés" icon={Users}>
          <Body>{targetSegments.intro}</Body>
          <TargetGrid targets={targetSegments.items} />
          {targetSegments.note && <Caption>{targetSegments.note}</Caption>}
        </CollapsibleSection>

        <CollapsibleSection numeral="VII" title="Potentiel de croissance — extension internationale" icon={Globe2}>
          {growth.body.map((p, i) => <Body key={i}>{p}</Body>)}
          <ul className="mb-5">
            {growth.items.map((it: BulletItem) => (
              <Bullet key={it.label} label={it.label}>{it.text}</Bullet>
            ))}
          </ul>
          {growth.closing && <Body>{growth.closing}</Body>}
        </CollapsibleSection>

        <CollapsibleSection numeral="VIII" title="Positionnement concurrentiel" icon={TrendingUp}>
          {competitivePosition.body.map((p, i) => <Body key={i}>{p}</Body>)}
          {competitivePosition.highlight && <Body emphasis>{competitivePosition.highlight}</Body>}
          {competitivePosition.closing && <Body>{competitivePosition.closing}</Body>}
        </CollapsibleSection>

        <CollapsibleSection numeral="IX" title="Traction commerciale et partenariats" icon={TrendingUp}>
          {traction.body.map((p, i) => <Body key={i}>{p}</Body>)}
        </CollapsibleSection>

        <CollapsibleSection numeral="X" title="Stade de maturité de marché" icon={TrendingUp}>
          <SpecTable rows={maturity.specs} />
        </CollapsibleSection>

        <CollapsibleSection numeral="XI" title="Risques identifiés et réserves" icon={AlertTriangle} defaultOpen={false}>
          <Body italic>{risks.intro}</Body>
          <ul>
            {risks.items.map((it: BulletItem) => (
              <Bullet key={it.label} label={it.label}>{it.text}</Bullet>
            ))}
          </ul>
        </CollapsibleSection>

        <CollapsibleSection numeral="XII" title="Thèse d'acquisition" icon={FileText}>
          {thesis.body.map((p, i) => <Body key={i}>{p}</Body>)}
          {thesis.closing && <Body emphasis>{thesis.closing}</Body>}
        </CollapsibleSection>

        {/* Legal mentions */}
        <div className="mt-14 pt-8 border-t" style={{ borderColor: T.line }}>
          <Kicker>Mentions et conditions de diffusion</Kicker>
          {mentions.body.map((p, i) => (
            <p key={i} className="text-[12px] leading-[1.6] mb-3"
              style={{ color: T.grey600, fontFamily: 'Arial, sans-serif' }}>
              {p}
            </p>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-10">
          <div className="border-t-2 mb-4 mx-auto w-16" style={{ borderColor: T.gold }} />
          <p className="text-[12px] font-bold"
            style={{ color: T.ink, letterSpacing: '0.2em', fontFamily: 'Arial, sans-serif' }}>
            AEGRYN AUCTION
          </p>
          <p className="text-[10px] mt-1"
            style={{ color: T.grey600, letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}>
            Genève · Suisse
          </p>
        </div>
      </div>
    </div>
  )
}
