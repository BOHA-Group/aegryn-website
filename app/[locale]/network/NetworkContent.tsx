'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import {
  ArrowUpRight, ShieldCheck, BrainCircuit, Scale, Cpu, ClipboardCheck,
  Building2, Users, Globe,
} from 'lucide-react'

/* ─── Types ────────────────────────────────────────────────────────────────── */
type DimensionKey = 'strategy' | 'technology' | 'ma'
type ExpertDomain = {
  Icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>
  domainKey: string
  color: string
  dimension: DimensionKey | 'all'
}

type ExpertiseCard = {
  title: string
  tags: string[]
  dimension: DimensionKey
  color: string
}

/* ─── Grille expertises mobilisables par dimension ─────────────────────────── */
const EXPERTISE_CARDS: ExpertiseCard[] = [
  // STRATEGY (vert apex)
  { title: 'Stratégie d\'entreprise',    tags: ['Vision long terme', 'OKR', 'Business model'], dimension: 'strategy', color: '#5ADDA4' },
  { title: 'Transformation digitale',    tags: ['Change management', 'Roadmap SI', 'Adoption'], dimension: 'strategy', color: '#5ADDA4' },
  { title: 'Gouvernance & Compliance',   tags: ['RGPD', 'NIS2', 'DORA', 'AI Act'],             dimension: 'strategy', color: '#5ADDA4' },
  { title: 'Intelligence compétitive',   tags: ['Veille marché', 'Benchmarking', 'Tendances'],  dimension: 'strategy', color: '#5ADDA4' },
  { title: 'Finance & Restructuring',    tags: ['Business plan', 'Restructuration', 'Tréso'],   dimension: 'strategy', color: '#5ADDA4' },
  { title: 'ESG & Durabilité',           tags: ['Reporting ESG', 'Impact', 'Taxonomie UE'],     dimension: 'strategy', color: '#5ADDA4' },
  { title: 'Risk Management',            tags: ['Risk mapping', 'Continuité', 'Sinistres'],      dimension: 'strategy', color: '#5ADDA4' },
  { title: 'Opérations & Lean',          tags: ['Process mining', 'Efficience', 'KPI ops'],     dimension: 'strategy', color: '#5ADDA4' },
  { title: 'Innovation & Ventures',      tags: ['Open innovation', 'Intrapreneuriat', 'Labs'],  dimension: 'strategy', color: '#5ADDA4' },

  // TECHNOLOGY (bleu)
  { title: 'Architecture Système',       tags: ['Cloud', 'Microservices', 'API-first'],          dimension: 'technology', color: '#60a5fa' },
  { title: 'Cybersécurité offensive',    tags: ['Pentest', 'Red team', 'Vuln. scoring'],         dimension: 'technology', color: '#60a5fa' },
  { title: 'Cybersécurité défensive',    tags: ['SOC', 'SIEM', 'Threat intel'],                  dimension: 'technology', color: '#60a5fa' },
  { title: 'IA & Machine Learning',      tags: ['LLM', 'Fine-tuning', 'MLOps', 'RAG'],           dimension: 'technology', color: '#60a5fa' },
  { title: 'DevSecOps',                  tags: ['CI/CD sécurisé', 'SBOM', 'Shift-left'],         dimension: 'technology', color: '#60a5fa' },
  { title: 'Data & Analytique',          tags: ['Data lake', 'BI', 'Pipelines temps réel'],      dimension: 'technology', color: '#60a5fa' },
  { title: 'Cloud & Infrastructure',     tags: ['AWS', 'Azure', 'GCP', 'FinOps'],                dimension: 'technology', color: '#60a5fa' },
  { title: 'Audit Technique Actifs',     tags: ['Code review', 'Dette tech', 'Certification'],   dimension: 'technology', color: '#60a5fa' },
  { title: 'Product Engineering',        tags: ['SaaS B2B', 'App mobile', 'Protocoles IA'],      dimension: 'technology', color: '#60a5fa' },

  // M&A (violet)
  { title: 'Due Diligence Stratégique',  tags: ['Marché', 'Positionnement', 'Synergies'],        dimension: 'ma', color: '#818cf8' },
  { title: 'Due Diligence Financière',   tags: ['QoE', 'Normalisation', 'Flux de tréso'],        dimension: 'ma', color: '#818cf8' },
  { title: 'Due Diligence Technique',    tags: ['Architecture', 'Code', 'Dette', 'IP'],          dimension: 'ma', color: '#818cf8' },
  { title: 'Valorisation d\'actifs',     tags: ['DCF', 'Multiples', 'ARR/NRR', 'EBITDA'],       dimension: 'ma', color: '#818cf8' },
  { title: 'Structuration Juridique',    tags: ['SPA', 'LOI', 'Earn-out', 'GAP'],               dimension: 'ma', color: '#818cf8' },
  { title: 'Fiscalité & Optimisation',   tags: ['Structuration holding', 'Exit tax', 'Treaty'],  dimension: 'ma', color: '#818cf8' },
  { title: 'Séquestre & Financement',    tags: ['Escrow', 'Bridge', 'Mezzanine', 'LBO'],         dimension: 'ma', color: '#818cf8' },
  { title: 'Assurance W&I & Risque',     tags: ['W&I insurance', 'Tax liability', 'D&O'],        dimension: 'ma', color: '#818cf8' },
  { title: 'Post-Merger Integration',    tags: ['PMI', 'Synergies', 'Gouvernance', 'Culture'],   dimension: 'ma', color: '#818cf8' },
]

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

/* ─── ExpertiseCard animée ──────────────────────────────────────────────────── */
function ExpertiseCardItem({ card }: { card: ExpertiseCard }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: 'box-shadow 0.25s, transform 0.25s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? `0 8px 32px rgba(0,0,0,0.10), 0 0 0 1.5px ${card.color}55` : '0 1px 4px rgba(0,0,0,0.04)',
      }}
      className="bg-ag-white border border-ag-border p-5 flex flex-col gap-3 cursor-default"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-sans font-bold text-ag-black text-[13px] leading-snug">{card.title}</h3>
        <div className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ background: card.color }} />
      </div>
      <div className="flex flex-wrap gap-1">
        {card.tags.map(tag => (
          <span
            key={tag}
            className="font-sans text-[9px] tracking-[0.07em] text-ag-gray border border-ag-border px-2 py-0.5"
            style={{ borderColor: hovered ? `${card.color}55` : undefined }}
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── FanCards ─────────────────────────────────────────────────────────────── */
function FanCards({
  domains, activeDomain, onSelect, t,
}: {
  domains: ExpertDomain[]
  activeDomain: string | null
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
        // Si une autre carte est active, les cartes non-actives s'estompent légèrement
        const isOtherActive = activeDomain !== null && !isActive
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
              border: `1.5px solid ${isActive ? color + 'cc' : isHovered ? color + 'aa' : color + '40'}`,
              background: '#FFFFFF',
              padding: '18px 12px', textAlign: 'center',
              transformOrigin: 'bottom center',
              transform: isHovered || isActive ? lift : rest,
              transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s, border-color 0.2s, opacity 0.3s',
              zIndex: isHovered || isActive ? 20 : i + 1,
              boxShadow: isActive
                ? `0 16px 48px rgba(0,0,0,0.18), 0 0 0 2.5px ${color}80`
                : isHovered
                  ? `0 12px 36px rgba(0,0,0,0.14), 0 0 0 1.5px ${color}50`
                  : `0 4px 24px rgba(0,0,0,0.08)`,
              opacity: isOtherActive && !isHovered ? 0.55 : 1,
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

/* ─── Main Component ─────────────────────────────────────────────────────────── */
export default function NetworkContent() {
  const t = useTranslations('network')
  // Filtre boutons dimension (indépendant des fan cards)
  const [activeDimension, setActiveDimension] = useState<DimensionKey | 'all'>('all')
  // Fan card sélectionnée — null = aucune (toutes expertises)
  const [activeDomain, setActiveDomain]       = useState<string | null>(null)

  const visibleDomains = EXPERT_DOMAINS

  // Fan card sélectionnée → filtre par la dimension de ce domaine
  // Bouton filtre actif (hors 'all') → filtre par dimension du bouton
  // Les deux peuvent se combiner ; fan card prime si sélectionnée
  const activeDomainMeta = activeDomain
    ? EXPERT_DOMAINS.find(d => d.domainKey === activeDomain)
    : null

  const filteredExpertise = (() => {
    if (activeDomainMeta) {
      // Fan card active : filtre par la dimension de ce domaine
      const dim = activeDomainMeta.dimension
      return EXPERTISE_CARDS.filter(c => c.dimension === dim)
    }
    if (activeDimension !== 'all') {
      // Bouton filtre actif seulement
      return EXPERTISE_CARDS.filter(c => c.dimension === activeDimension)
    }
    return EXPERTISE_CARDS
  })()

  function handleDomainSelect(domainKey: string) {
    // Toggle : reclic sur la même carte = désélectionner
    setActiveDomain(prev => prev === domainKey ? null : domainKey)
  }

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

      {/* ── Section 1 : Nos partenaires (structures externes) ── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
          <div className="flex items-center gap-4 mb-8">
            <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ag-gray-light border border-ag-border px-3 py-1">
              {t('partners.label')}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ag-apex">
              {t('partners.badge')}
            </span>
          </div>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.15] max-w-2xl mb-6"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('partners.title')}
          </h2>
          <p className="text-[14px] text-ag-gray leading-relaxed max-w-xl mb-6">
            {t('partners.desc')}
          </p>
          <p className="font-sans text-[11px] text-ag-gray-light italic">
            {t('partners.note')}
          </p>
        </div>
      </section>

      {/* ── Section 2 : Nos expertises (Aegryn interne + partenaires par extension) ── */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">

          {/* Header + filtres */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ag-gray-light border border-ag-border px-3 py-1">
                  {t('experts.label')}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ag-apex">
                  {t('experts.badge')}
                </span>
              </div>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.15] whitespace-pre-line"
                style={{ fontSize: 'clamp(26px,3vw,44px)' }}
              >
                {t('experts.title')}
              </h2>
              <p className="text-[14px] text-ag-gray leading-relaxed mt-4 max-w-xl">
                {t('experts.desc')}
              </p>
            </div>
            {/* Filtres dimension */}
            <div className="flex flex-wrap gap-2 shrink-0">
              {DIMENSIONS.map(d => (
                <button
                  key={d.key}
                  onClick={() => { setActiveDimension(d.key); if (d.key !== 'all') setActiveDomain(d.key) }}
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
          </div>

          {/* Fan cards — clic filtre aussi la grille */}
          <div className="mb-12">
            <FanCards
              domains={visibleDomains}
              activeDomain={activeDomain}
              onSelect={handleDomainSelect}
              t={t}
            />
          </div>

          {/* Grille expertises animées — filtrée par dimension active */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {filteredExpertise.map((card) => (
              <ExpertiseCardItem key={card.title} card={card} />
            ))}
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
