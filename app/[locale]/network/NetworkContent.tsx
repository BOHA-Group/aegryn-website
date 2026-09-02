'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ArrowUpRight, ShieldCheck, BrainCircuit, Scale, Cpu, ClipboardCheck,
  Building2, Users, Globe, ChevronDown, CheckCircle2,
} from 'lucide-react'

/* ─── Types ────────────────────────────────────────────────────────────────── */
type DimensionKey = 'strategy' | 'technology' | 'ma'
type ExpertDomain = {
  Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  domainKey: string
  color: string
  dimension: DimensionKey | 'all'
}

/* ─── Domaines d'expertise disponibles (alignés Conseil Strategy/Tech/M&A) ── */
const EXPERT_DOMAINS: ExpertDomain[] = [
  { Icon: BrainCircuit,   domainKey: 'strategy',    color: '#5ADDA4', dimension: 'strategy' },
  { Icon: Cpu,            domainKey: 'technology',  color: '#60a5fa', dimension: 'technology' },
  { Icon: Scale,          domainKey: 'ma',          color: '#818cf8', dimension: 'ma' },
  { Icon: ShieldCheck,    domainKey: 'security',    color: '#f472b6', dimension: 'technology' },
  { Icon: ClipboardCheck, domainKey: 'compliance',  color: '#fb923c', dimension: 'strategy' },
]

const DIMENSIONS: { key: DimensionKey | 'all'; labelKey: string }[] = [
  { key: 'all',        labelKey: 'filters.all' },
  { key: 'strategy',   labelKey: 'filters.strategy' },
  { key: 'technology', labelKey: 'filters.technology' },
  { key: 'ma',         labelKey: 'filters.ma' },
]

/* ─── Partenaires logos (illustratif) ─────────────────────────────────────── */
const PARTNER_LOGOS = [
  { name: 'Subblink',   initial: 'S', color: '#5ADDA4' },
  { name: 'Partner A',  initial: 'A', color: '#60a5fa' },
  { name: 'Partner B',  initial: 'B', color: '#818cf8' },
  { name: 'Partner C',  initial: 'C', color: '#fb923c' },
  { name: 'Partner D',  initial: 'D', color: '#f472b6' },
  { name: 'Partner E',  initial: 'E', color: '#a78bfa' },
]

/* ─── Placeholders fiches experts (mode illustration) ─────────────────────── */
const PLACEHOLDER_PROFILES = [
  { id: 'ph1', name: 'Sophie M.', role: 'M&A Advisor', org: 'Aegryn Advisory', dimension: 'ma' as DimensionKey,        domainKey: 'ma',          city: 'Genève',  langs: ['FR', 'EN'], color: '#818cf8' },
  { id: 'ph2', name: 'Thomas B.', role: 'CTO Advisory', org: 'TechLead GmbH',  dimension: 'technology' as DimensionKey, domainKey: 'security',    city: 'Zurich',  langs: ['DE', 'EN'], color: '#5ADDA4' },
  { id: 'ph3', name: 'Pierre D.', role: 'Tax & Law',    org: 'Cabinet Dumont', dimension: 'ma' as DimensionKey,        domainKey: 'compliance',  city: 'Paris',   langs: ['FR', 'EN', 'ES'], color: '#fb923c' },
  { id: 'ph4', name: 'Lena K.',   role: 'AI Strategy',  org: 'AI Partners',    dimension: 'strategy' as DimensionKey,  domainKey: 'strategy',    city: 'Berlin',  langs: ['DE', 'EN', 'FR'], color: '#60a5fa' },
  { id: 'ph5', name: 'Marco R.',  role: 'Corp. Law',    org: 'Studio Ricci',   dimension: 'ma' as DimensionKey,        domainKey: 'ma',          city: 'Milan',   langs: ['IT', 'EN', 'FR'], color: '#a78bfa' },
  { id: 'ph6', name: 'Elena V.',  role: 'CFO Advisory', org: 'Verdu Audit',    dimension: 'strategy' as DimensionKey,  domainKey: 'compliance',  city: 'Bruxelles', langs: ['FR', 'NL', 'EN'], color: '#f472b6' },
]

const selectCls = 'border border-ag-border bg-ag-white px-4 py-2.5 pr-10 font-sans text-[12px] text-ag-black appearance-none focus:outline-none focus:border-ag-black transition-colors cursor-pointer'

/* ─── FanCards ─────────────────────────────────────────────────────────────── */
function FanCards({
  domains, activeDomain, onSelect, t,
}: {
  domains: ExpertDomain[]
  activeDomain: string
  onSelect: (key: string) => void
  t: ReturnType<typeof useTranslations>
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const n = domains.length
  const SPREAD   = 60
  const SHIFT_PX = 150

  return (
    <div style={{ position: 'relative', height: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', overflow: 'visible' }}>
      {domains.map(({ Icon, domainKey, color }, i) => {
        const rotDeg    = -SPREAD / 2 + (i / (n - 1)) * SPREAD
        const arcY      = Math.abs(rotDeg) * 1.4
        const shiftX    = (i - (n - 1) / 2) * SHIFT_PX
        const isActive  = activeDomain === domainKey
        const isHovered = hovered === i
        const rest  = `translateX(calc(-50% + ${shiftX}px)) translateY(${arcY}px) rotate(${rotDeg}deg)`
        const lift  = `translateX(calc(-50% + ${shiftX}px)) translateY(-28px) rotate(0deg)`

        return (
          <button
            key={domainKey}
            onClick={() => onSelect(domainKey)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute', bottom: 0, left: '50%',
              width: 160, minHeight: 210, borderRadius: 12,
              border: `1.5px solid ${isActive || isHovered ? color + 'cc' : color + '40'}`,
              background: '#FFFFFF',
              padding: '18px 12px', textAlign: 'center',
              transformOrigin: 'bottom center',
              transform: isHovered || isActive ? lift : rest,
              transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s, border-color 0.2s',
              zIndex: isHovered || isActive ? 20 : i + 1,
              boxShadow: isHovered || isActive
                ? `0 16px 48px rgba(0,0,0,0.18), 0 0 0 2px ${color}60`
                : `0 4px 24px rgba(0,0,0,0.08)`,
              cursor: 'pointer',
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: `${color}18`, border: `1px solid ${color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0A0C14', marginBottom: 6, lineHeight: 1.3 }}>
              {t(`domains.${domainKey}`)}
            </div>
            <div style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {t(`domains.${domainKey}Desc`)}
            </div>
          </button>
        )
      })}
    </div>
  )
}

/* ─── ExpertPlaceholderCard ─────────────────────────────────────────────────── */
function ExpertPlaceholderCard({ p }: { p: typeof PLACEHOLDER_PROFILES[0] }) {
  const initials = p.name.split(' ').map(w => w[0]).join('').toUpperCase()
  return (
    <div className="bg-ag-white border border-ag-border p-5 flex flex-col gap-3 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: p.color }} />
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 bg-ag-off-white border border-ag-border flex items-center justify-center shrink-0">
          <span className="font-mono text-[14px] font-bold text-ag-gray">{initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans font-semibold text-ag-black text-[14px] leading-tight">{p.name}</p>
          <p className="font-sans text-[11px] mt-0.5" style={{ color: p.color }}>{p.role}</p>
          <p className="font-sans text-[11px] text-ag-gray">{p.org}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {p.langs.map(l => (
          <span key={l} className="font-mono text-[9px] text-ag-gray-light border border-ag-border px-1.5 py-0.5">{l}</span>
        ))}
        <span className="font-sans text-[10px] text-ag-gray-light border border-ag-border px-1.5 py-0.5 ml-auto flex items-center gap-1">
          <Globe size={9} /> {p.city}
        </span>
      </div>
      <div className="pt-2 border-t border-ag-border">
        <span className="inline-flex items-center gap-1 font-mono text-[8px] tracking-[0.14em] uppercase px-2 py-0.5 border border-ag-apex/30 bg-ag-apex/10 text-ag-apex">
          Aegryn Network
        </span>
      </div>
    </div>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function NetworkContent() {
  const t = useTranslations('network')
  const [activeDimension, setActiveDimension] = useState<DimensionKey | 'all'>('all')
  const [activeDomain, setActiveDomain]       = useState<string>('strategy')

  const filteredProfiles = activeDimension === 'all'
    ? PLACEHOLDER_PROFILES
    : PLACEHOLDER_PROFILES.filter(p => p.dimension === activeDimension)

  const visibleDomains = activeDimension === 'all'
    ? EXPERT_DOMAINS
    : EXPERT_DOMAINS.filter(d => d.dimension === activeDimension || d.dimension === 'all')

  return (
    <>
      {/* ── Hero ── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(42px,5.5vw,80px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl mb-10">
            {t('hero.desc')}
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-ag-apex" />
              <span className="font-sans text-[13px] text-ag-gray">{t('hero.stat1')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-ag-apex" />
              <span className="font-sans text-[13px] text-ag-gray">{t('hero.stat2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-ag-apex" />
              <span className="font-sans text-[13px] text-ag-gray">{t('hero.stat3')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 1 : Partenaires (logos) ── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('partners.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.15] max-w-2xl mb-6"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('partners.title')}
          </h2>
          <p className="text-[14px] text-ag-gray leading-relaxed max-w-xl mb-12">
            {t('partners.desc')}
          </p>

          {/* Logos partenaires — à venir */}

          <p className="font-sans text-[11px] text-ag-gray-light mt-6 italic">
            {t('partners.note')}
          </p>
        </div>
      </section>

      {/* ── Section 2 : Réseau d'experts (Fan cards + grille illustrative) ── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
            {/* Colonne gauche */}
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
                {t('experts.label')}
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.15] mb-6 whitespace-pre-line"
                style={{ fontSize: 'clamp(26px,3vw,44px)' }}
              >
                {t('experts.title')}
              </h2>
              <p className="text-[14px] text-ag-gray leading-relaxed mb-8">
                {t('experts.desc')}
              </p>

              {/* Filtres dimension */}
              <div className="flex flex-wrap gap-2 mb-10">
                {DIMENSIONS.map(d => (
                  <button
                    key={d.key}
                    onClick={() => { setActiveDimension(d.key); setActiveDomain('strategy') }}
                    className={[
                      'px-4 py-2 font-sans font-semibold text-[11px] uppercase tracking-[0.14em] border transition-colors',
                      activeDimension === d.key
                        ? 'bg-ag-navy text-white border-ag-navy'
                        : 'text-ag-gray border-ag-border hover:border-ag-black hover:text-ag-black',
                    ].join(' ')}
                  >
                    {t(d.labelKey)}
                  </button>
                ))}
              </div>

              {/* Fan cards */}
              <FanCards
                domains={visibleDomains}
                activeDomain={activeDomain}
                onSelect={setActiveDomain}
                t={t}
              />
            </div>

            {/* Colonne droite — grille profils illustratifs */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.18em] text-ag-gray-light">
                  {t('experts.profilesLabel')}
                </p>
                <div className="relative">
                  <select
                    value={activeDimension}
                    onChange={e => setActiveDimension(e.target.value as DimensionKey | 'all')}
                    className={selectCls}
                  >
                    {DIMENSIONS.map(d => (
                      <option key={d.key} value={d.key}>{t(d.labelKey)}</option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-ag-gray pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProfiles.map(p => (
                  <ExpertPlaceholderCard key={p.id} p={p} />
                ))}
              </div>

              {/* Notice désactivée */}
              <div className="mt-8 border border-ag-border bg-ag-white p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-ag-gray-light mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans font-semibold text-[12px] text-ag-gray mb-1">
                      {t('experts.comingSoonTitle')}
                    </p>
                    <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed">
                      {t('experts.comingSoonDesc')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Devenir partenaire ── */}
      <section className="bg-ag-navy py-24 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/50 mb-4">Aegryn Network</p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl whitespace-pre-line"
              style={{ fontSize: 'clamp(24px,2.8vw,42px)' }}
            >
              {t('cta.title')}
            </h2>
          </div>
          <Link
            href="/alliances"
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('cta.button')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
