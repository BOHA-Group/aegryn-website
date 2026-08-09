'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, CheckCircle2, Mail, Globe, MapPin, Star, ChevronDown, Filter, ShieldCheck, BrainCircuit, TrendingUp, Scale, FileSearch, Cpu, ClipboardCheck, X } from 'lucide-react'
import {
  EXPERTISE_TAXONOMY,
  getCategoryIdsByDimension,
  getAllCategoryIds,
  getAllSpecialtyIds,
  getCategoryLabel,
  getSpecialtyLabel,
} from '@/lib/expertiseTaxonomy'

type ExpertProfile = {
  id:           string
  user_id:      string
  first_name:   string
  last_name:    string
  profession:   string
  specialties:  string[]
  city:         string | null
  country_code: string
  bio:          string | null
  organization: string | null
  email_public: string | null
  phone:        string | null
  website:      string | null
  min_rate_eur:  number | null
  rate_currency: string | null
  languages:     string[]
  avatar_url:    string | null
  verified_at:   string | null
  category:     string | null
  domain:       string[]
  expertise_dimension:   string | null
  expertise_categories:  string[]
  expertise_specialties: string[]
}

const DIMENSIONS = [
  { key: 'tech',        labelKey: 'categories.tech'        },
  { key: 'transaction', labelKey: 'categories.transaction' },
] as const

type DimensionKey = typeof DIMENSIONS[number]['key']

// Domaines = catégorie ids par dimension, dérivés de la taxonomie
const DOMAINS_BY_DIMENSION: Record<DimensionKey, readonly string[]> = {
  tech:        getCategoryIdsByDimension('tech'),
  transaction: getCategoryIdsByDimension('transaction'),
}

const ALL_DOMAINS = getAllCategoryIds()

// Expertises = specialty ids de toute la taxonomie
const ALL_EXPERTISES = getAllSpecialtyIds()

const COUNTRIES = ['CH', 'FR', 'DE', 'BE', 'LU', 'ES', 'IT', 'NL', 'PT', 'AT', 'PL', 'SE', 'DK', 'FI', 'NO', 'IE', 'CZ', 'HU', 'RO'] as const

const EXPERT_DOMAINS = [
  { Icon: ShieldCheck,    domainKey: 'cybersecurity',    color: '#5ADDA4' },
  { Icon: BrainCircuit,   domainKey: 'ai',               color: '#a78bfa' },
  { Icon: Cpu,            domainKey: 'architecture',     color: '#60a5fa' },
  { Icon: Scale,          domainKey: 'm_and_a',          color: '#818cf8' },
  { Icon: ClipboardCheck, domainKey: 'vendor_readiness', color: '#f472b6' },
  { Icon: FileSearch,     domainKey: 'dd_hr',            color: '#fb923c' },
  { Icon: TrendingUp,     domainKey: 'valuation',        color: '#34d399' },
] as const

const PLACEHOLDERS: ExpertProfile[] = [
  { id: 'ph1', user_id: '', first_name: 'Sophie', last_name: 'M.', profession: 'M&A Advisor', specialties: ['Due diligence', 'Valorisation'], city: 'Genève', country_code: 'CH', bio: 'Spécialiste des transactions M&A tech en Suisse romande. 12 ans d\'expérience en structuration et accompagnement de cédants.', organization: 'Aegryn Advisory', email_public: null, phone: null, website: null, min_rate_eur: 350, rate_currency: 'CHF', languages: ['fr', 'en'], avatar_url: null, verified_at: new Date().toISOString(), category: 'advisory_transaction', domain: ['m_and_a', 'valuation'], expertise_dimension: 'transaction', expertise_categories: [], expertise_specialties: [] },
  { id: 'ph2', user_id: '', first_name: 'Thomas', last_name: 'B.', profession: 'Cybersecurity', specialties: ['Audit sécurité', 'ISO 27001'], city: 'Zurich', country_code: 'CH', bio: 'Expert en cybersécurité et audit de conformité pour entreprises tech. Certifié CISSP et ISO 27001 Lead Auditor.', organization: 'SecureAxis GmbH', email_public: null, phone: null, website: null, min_rate_eur: 280, rate_currency: 'CHF', languages: ['de', 'en'], avatar_url: null, verified_at: new Date().toISOString(), category: 'advisory_tech', domain: ['cybersecurity', 'ai'], expertise_dimension: 'tech', expertise_categories: [], expertise_specialties: [] },
  { id: 'ph3', user_id: '', first_name: 'Pierre', last_name: 'D.', profession: 'Tax', specialties: ['Fiscalité internationale', 'Restructuration'], city: 'Paris', country_code: 'FR', bio: 'Conseil fiscal international spécialisé dans les opérations transfrontalières et la restructuration de holdings tech.', organization: 'Cabinet Dumont & Partners', email_public: null, phone: null, website: null, min_rate_eur: 320, rate_currency: 'EUR', languages: ['fr', 'en', 'es'], avatar_url: null, verified_at: new Date().toISOString(), category: 'advisory_transaction', domain: ['tax', 'law'], expertise_dimension: 'transaction', expertise_categories: [], expertise_specialties: [] },
  { id: 'ph4', user_id: '', first_name: 'Lena', last_name: 'K.', profession: 'CTO', specialties: ['Architecture cloud', 'IA / LLM'], city: 'Berlin', country_code: 'DE', bio: 'CTO fractional spécialisée dans la modernisation de stack technique et l\'intégration IA pour startups B2B.', organization: 'TechLead GmbH', email_public: null, phone: null, website: null, min_rate_eur: 300, rate_currency: 'EUR', languages: ['de', 'en', 'fr'], avatar_url: null, verified_at: new Date().toISOString(), category: 'advisory_tech', domain: ['ai', 'cybersecurity'], expertise_dimension: 'tech', expertise_categories: [], expertise_specialties: [] },
  { id: 'ph5', user_id: '', first_name: 'Marco', last_name: 'R.', profession: 'Lawyer', specialties: ['Droit des sociétés', 'M&A', 'IP'], city: 'Milan', country_code: 'IT', bio: 'Avocat d\'affaires spécialisé en droit des sociétés et transactions M&A. Intervient sur les opérations cross-border Europe.', organization: 'Studio Ricci', email_public: null, phone: null, website: null, min_rate_eur: 290, rate_currency: 'EUR', languages: ['it', 'en', 'fr'], avatar_url: null, verified_at: new Date().toISOString(), category: 'advisory_transaction', domain: ['law', 'm_and_a'], expertise_dimension: 'transaction', expertise_categories: [], expertise_specialties: [] },
  { id: 'ph6', user_id: '', first_name: 'Elena', last_name: 'V.', profession: 'Accountant', specialties: ['Audit', 'Finance d\'entreprise'], city: 'Bruxelles', country_code: 'BE', bio: 'Expert-comptable et auditeur certifié. Accompagnement des PME tech en croissance sur leur structuration financière.', organization: 'Verdu Audit', email_public: null, phone: null, website: null, min_rate_eur: 240, rate_currency: 'EUR', languages: ['fr', 'nl', 'en'], avatar_url: null, verified_at: new Date().toISOString(), category: 'advisory_transaction', domain: ['accounting', 'finance'], expertise_dimension: 'transaction', expertise_categories: [], expertise_specialties: [] },
]

type DomainCard = {
  readonly Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  readonly domainKey: string
  readonly color: string
}

function FanCards({
  domains, activeDomain, onSelect, t,
}: {
  domains: readonly DomainCard[]
  activeDomain: string
  onSelect: (key: string) => void
  t: ReturnType<typeof useTranslations>
}) {
  const [hovered, setHovered] = useState<number | null>(null)
  const n = domains.length
  const SPREAD   = 52          // degrés total de l'éventail
  const SHIFT_PX = 138         // espacement horizontal entre cartes

  return (
    <div
      style={{
        position: 'relative',
        height: 280,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        overflow: 'visible',
        paddingBottom: 0,
      }}
    >
      {domains.map(({ Icon, domainKey, color }, i) => {
        const rotDeg = -SPREAD / 2 + (i / (n - 1)) * SPREAD
        const arcY   = Math.abs(rotDeg) * 1.4
        const shiftX = (i - (n - 1) / 2) * SHIFT_PX
        const isActive  = activeDomain === domainKey
        const isHovered = hovered === i

        const restTransform  = `translateX(calc(-50% + ${shiftX}px)) translateY(${arcY}px) rotate(${rotDeg}deg)`
        const liftTransform  = `translateX(calc(-50% + ${shiftX}px)) translateY(-28px) rotate(0deg)`

        return (
          <button
            key={domainKey}
            onClick={() => onSelect(domainKey)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position:       'absolute',
              bottom:         0,
              left:           '50%',
              width:          168,
              minHeight:      210,
              borderRadius:   14,
              border:         `1.5px solid ${isActive || isHovered ? color + 'aa' : color + '40'}`,
              background:     '#FFFFFF',
              padding:        '20px 14px',
              textAlign:      'center',
              transformOrigin:'bottom center',
              transform:      isHovered || isActive ? liftTransform : restTransform,
              transition:     'transform 0.38s cubic-bezier(0.22,1,0.36,1), box-shadow 0.38s cubic-bezier(0.22,1,0.36,1), border-color 0.2s',
              zIndex:         isHovered || isActive ? 20 : i + 1,
              boxShadow:      isHovered || isActive
                ? `0 16px 48px rgba(0,0,0,0.18), 0 0 0 2px ${color}60`
                : `0 4px 24px rgba(0,0,0,0.08), 0 0 0 0 ${color}`,
              cursor:         'pointer',
            }}
          >
            {/* Icône dans cercle coloré */}
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: `${color}18`,
              border: `1px solid ${color}35`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 14px',
            }}>
              <Icon size={18} style={{ color }} />
            </div>
            {/* Titre */}
            <div style={{
              fontSize: 13, fontWeight: 700,
              color: '#0A0C14',
              marginBottom: 6, lineHeight: 1.3,
            }}>
              {t(`domains.${domainKey}`)}
            </div>
            {/* Description */}
            <div style={{
              fontSize: 11, color: '#6B7280',
              lineHeight: 1.6, opacity: 0.85,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {t(`domains.${domainKey}Desc`)}
            </div>
          </button>
        )
      })}
    </div>
  )
}

const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const selectCls = 'w-full border border-ag-border bg-ag-white px-4 py-2.5 pr-10 font-sans text-[12px] text-ag-black appearance-none focus:outline-none focus:border-ag-black transition-colors cursor-pointer'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

const DIMENSION_LABELS_PUBLIC: Record<string, string> = {
  tech:        'Advisory Tech',
  transaction: 'Advisory Transaction',
  both:        'Advisory Tech & Transaction',
}

const DIMENSION_COLORS_PUBLIC: Record<string, { bg: string; border: string; text: string }> = {
  tech:        { bg: 'bg-[#5ADDA4]/10', border: 'border-[#5ADDA4]/40', text: 'text-[#0e7a52]' },
  transaction: { bg: 'bg-[#818cf8]/10', border: 'border-[#818cf8]/40', text: 'text-[#4338ca]' },
  both:        { bg: 'bg-ag-apex/8',    border: 'border-ag-apex/30',    text: 'text-ag-apex'   },
}

function getCatColorPublic(catId: string) {
  const cat = EXPERTISE_TAXONOMY.find(c => c.id === catId)
  if (!cat) return { bg: 'bg-ag-off-white', border: 'border-ag-border', text: 'text-ag-gray' }
  return DIMENSION_COLORS_PUBLIC[cat.dimension] ?? { bg: 'bg-ag-off-white', border: 'border-ag-border', text: 'text-ag-gray' }
}

type ActiveFilters = { category: string; domain: string; specialty: string; country: string }

type ContactLeadModalProps = {
  expert: ExpertProfile
  filters: ActiveFilters
  onClose: () => void
}

function ContactLeadModal({ expert, filters, onClose }: ContactLeadModalProps) {
  const t = useTranslations('experts')
  const backdropRef = useRef<HTMLDivElement>(null)
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [consent,   setConsent]   = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)
  const [done,      setDone]      = useState(false)
  const [revealedEmail, setRevealedEmail] = useState<string | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!consent) { setError(t('contactModal.errorConsent')); return }
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/experts/contact-lead', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expert_id:        expert.user_id,
          first_name:       firstName.trim(),
          last_name:        lastName.trim(),
          email:            email.trim(),
          consent_given:    true,
          filter_category:  filters.category  || undefined,
          filter_domain:    filters.domain    || undefined,
          filter_specialty: filters.specialty || undefined,
          filter_country:   filters.country   || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? t('contactModal.errorGeneric')); return }
      setRevealedEmail(data.email_public ?? null)
      setDone(true)
    } catch { setError(t('contactModal.errorGeneric')) }
    finally  { setLoading(false) }
  }

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ag-black/60 backdrop-blur-[3px] p-4"
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
    >
      <div className="bg-ag-white border border-ag-border w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ag-gray-light hover:text-ag-black transition-colors"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>

        <div className="p-8">
          {done ? (
            <div className="flex flex-col gap-4">
              <CheckCircle2 size={28} className="text-ag-apex" />
              <p className="font-sans font-bold text-ag-black text-[18px]">{t('contactModal.successTitle')}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('contactModal.successDesc')}</p>
              {revealedEmail && (
                <a
                  href={`mailto:${revealedEmail}`}
                  className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 bg-ag-navy text-white hover:bg-ag-black transition-colors mt-2"
                >
                  <Mail size={11} /> {revealedEmail}
                </a>
              )}
            </div>
          ) : (
            <>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.24em] text-ag-gray-light mb-1">
                {t('contactModal.label')}
              </p>
              <h3 className="font-sans font-bold text-ag-black text-[18px] leading-tight mb-1">
                {expert.first_name} {expert.last_name}
              </h3>
              <p className="font-sans text-[12px] text-ag-apex font-semibold mb-6">{expert.profession}</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>{t('contactModal.fieldFirstName')} *</label>
                    <input
                      type="text" required value={firstName}
                      onChange={e => setFirstName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t('contactModal.fieldLastName')} *</label>
                    <input
                      type="text" required value={lastName}
                      onChange={e => setLastName(e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t('contactModal.fieldEmail')} *</label>
                  <input
                    type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={inputCls}
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox" checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 shrink-0 accent-ag-navy"
                  />
                  <span className="font-sans text-[11px] text-ag-gray leading-relaxed">
                    {t('contactModal.consentText')}
                  </span>
                </label>

                {error && <p className="font-sans text-[11px] text-red-500">{error}</p>}

                <button
                  type="submit"
                  disabled={loading || !consent}
                  className="w-full inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-50"
                >
                  {loading ? t('contactModal.submitting') : t('contactModal.submit')}
                  {!loading && <ArrowUpRight size={12} />}
                </button>

                <p className="font-sans text-[10px] text-ag-gray-light text-center leading-relaxed">
                  {t('contactModal.rgpdNote')}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function trackClick(expertId: string, clickType: 'email' | 'website', filters: ActiveFilters) {
  fetch('/api/experts/track-click', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      expert_id:        expertId,
      click_type:       clickType,
      filter_category:  filters.category  || undefined,
      filter_domain:    filters.domain    || undefined,
      filter_specialty: filters.specialty || undefined,
      filter_country:   filters.country   || undefined,
    }),
  }).catch(() => {})
}

function ExpertCard({ profile, t, blurred = false, filters = { category: '', domain: '', specialty: '', country: '' }, onContactClick }: { profile: ExpertProfile; t: ReturnType<typeof useTranslations>; blurred?: boolean; filters?: ActiveFilters; onContactClick?: (profile: ExpertProfile) => void }) {
  const initials = `${profile.first_name[0] ?? ''}${profile.last_name[0] ?? ''}`.toUpperCase()

  const categoryNodes = EXPERTISE_TAXONOMY.filter(c =>
    (profile.expertise_categories ?? []).includes(c.id)
  )
  const specialtyNodes = EXPERTISE_TAXONOMY
    .flatMap(c => c.specialties)
    .filter(s => (profile.expertise_specialties ?? []).includes(s.id))

  return (
    <div className={`bg-ag-white border border-ag-border p-6 flex flex-col gap-4 relative ${blurred ? 'select-none' : ''}`}>
      {blurred && (
        <div className="absolute inset-0 backdrop-blur-[6px] bg-ag-white/60 z-10 flex flex-col items-center justify-center gap-3">
          <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.22em] uppercase px-3 py-1.5 border border-ag-apex/40 bg-ag-apex/10 text-ag-apex-ink">
            <Star size={9} className="text-ag-apex" /> {t('placeholder.badge')}
          </span>
        </div>
      )}

      {/* Identité — en tête */}
      <div className="flex items-start gap-4">
        {profile.avatar_url ? (
          <Image
            src={profile.avatar_url}
            alt={`${profile.first_name} ${profile.last_name}`}
            width={48}
            height={48}
            className="w-12 h-12 object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-ag-off-white border border-ag-border flex items-center justify-center shrink-0">
            <span className="font-mono text-[13px] font-bold text-ag-gray">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-tight">
              {profile.first_name} {profile.last_name}
            </h3>
            {profile.verified_at && !blurred && (
              <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 bg-ag-apex/10 text-ag-apex border border-ag-apex/30">
                <CheckCircle2 size={9} /> {t('card.verifiedBadge')}
              </span>
            )}
          </div>
          <p className="font-sans text-[12px] text-ag-apex font-semibold">{profile.profession}</p>
          {profile.organization && (
            <p className="font-sans text-[12px] text-ag-gray mt-0.5">{profile.organization}</p>
          )}
        </div>
      </div>

      {/* Taxonomie : Dimension → Catégories → Spécialités */}
      {(profile.expertise_dimension || categoryNodes.length > 0 || specialtyNodes.length > 0) ? (
        <div className="space-y-1">
          {profile.expertise_dimension && (
            <div className="flex flex-wrap gap-1">
              {(() => { const dc = DIMENSION_COLORS_PUBLIC[profile.expertise_dimension]; return (
                <span className={`inline-flex items-center font-mono text-[8px] tracking-[0.12em] uppercase px-1.5 py-0.5 border font-bold ${dc?.bg ?? 'bg-ag-off-white'} ${dc?.border ?? 'border-ag-border'} ${dc?.text ?? 'text-ag-gray'}`}>
                  {DIMENSION_LABELS_PUBLIC[profile.expertise_dimension] ?? profile.expertise_dimension}
                </span>
              )})()}
            </div>
          )}
          {categoryNodes.length > 0 && (
            <div className="flex flex-wrap gap-1 pl-2 border-l border-ag-border ml-0.5">
              {categoryNodes.map(cat => {
                const cc = getCatColorPublic(cat.id)
                return (
                  <span key={cat.id} className={`font-mono text-[8px] tracking-[0.10em] uppercase px-1.5 py-0.5 border ${cc.bg} ${cc.border} ${cc.text}`}>
                    {getCategoryLabel(cat, 'fr')}
                  </span>
                )
              })}
            </div>
          )}
          {specialtyNodes.length > 0 && (
            <div className="flex flex-wrap gap-1 pl-3 border-l border-ag-border/40 ml-0.5">
              {specialtyNodes.slice(0, 6).map(s => (
                <span key={s.id} className="font-sans text-[10px] px-1.5 py-0.5 bg-ag-off-white border border-ag-border text-ag-gray">
                  {getSpecialtyLabel(s, 'fr')}
                </span>
              ))}
              {specialtyNodes.length > 6 && (
                <span className="font-sans text-[10px] text-ag-gray-light px-1 py-0.5">+{specialtyNodes.length - 6}</span>
              )}
            </div>
          )}
        </div>
      ) : null}

      {profile.bio && (
        <p className="font-sans text-[12px] text-ag-gray leading-relaxed line-clamp-3">{profile.bio}</p>
      )}

      <div className="pt-2 border-t border-ag-border mt-auto space-y-1.5">
        {profile.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {profile.languages.map(l => (
              <span key={l} className="font-mono text-[9px] text-ag-gray-light border border-ag-border px-1.5 py-0.5">
                {l.toUpperCase()}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          {(profile.city || profile.country_code) ? (
            <span className="inline-flex items-center gap-1 font-sans text-[11px] text-ag-gray-light min-w-0 truncate">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate">{[profile.city, profile.country_code].filter(Boolean).join(', ')}</span>
            </span>
          ) : <span />}
          {profile.min_rate_eur != null && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ag-gray-light shrink-0">
              <Star size={9} /> {t('card.rateFrom')} {profile.min_rate_eur} {profile.rate_currency ?? 'CHF'} /h
            </span>
          )}
        </div>
      </div>

      {!blurred && (
        <div className="flex gap-3">
          {profile.email_public && (
            <button
              onClick={() => onContactClick?.(profile)}
              className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border border-ag-navy text-ag-navy hover:bg-ag-navy hover:text-white transition-colors"
            >
              <Mail size={10} /> {t('card.contact')}
            </button>
          )}
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(profile.user_id, 'website', filters)}
              className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black transition-colors"
            >
              <Globe size={10} /> Site
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function WaitlistForm({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const raw = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/experts/apply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          prenom:       raw.prenom,
          nom:          raw.nom,
          email:        raw.email,
          profession:   raw.profession  || undefined,
          category:     raw.category   || undefined,
          domain:       raw.domain     || undefined,
          organization: raw.organization || undefined,
          city:         raw.city         || undefined,
          country:      raw.country      || undefined,
          bio:          raw.bio          || undefined,
          website:      raw.website      || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'duplicate') setError(t('waitlist.duplicateMsg'))
        else setError(t('waitlist.errorMsg'))
      } else {
        setSubmitted(true)
      }
    } catch { setError(t('waitlist.errorMsg')) }
    finally  { setLoading(false) }
  }

  if (submitted) {
    return (
      <div className="border border-ag-apex/30 bg-ag-off-white p-10 flex flex-col items-start gap-4">
        <CheckCircle2 size={28} className="text-ag-apex" />
        <p className="font-sans font-bold text-ag-black text-[18px]">{t('waitlist.successTitle')}</p>
        <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('waitlist.successDesc')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t('waitlist.fieldPrenom')} *</label>
          <input name="prenom" type="text" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t('waitlist.fieldNom')} *</label>
          <input name="nom" type="text" required className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t('waitlist.fieldEmail')} *</label>
          <input name="email" type="email" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t('waitlist.fieldCategory')} *</label>
          <div className="relative">
            <select name="category" required className={selectCls}>
              <option value="">—</option>
              {DIMENSIONS.map(d => (
                <option key={d.key} value={d.key}>{t(d.labelKey)}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-ag-gray pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t('waitlist.fieldDomain')} *</label>
          <div className="relative">
            <select name="domain" required className={selectCls}>
              <option value="">—</option>
              {ALL_DOMAINS.map(d => {
                const cat = EXPERTISE_TAXONOMY.find(c => c.id === d)
                return <option key={d} value={d}>{cat?.labelFr ?? d}</option>
              })}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-ag-gray pointer-events-none" />
          </div>
        </div>
        <div>
          <label className={labelCls}>{t('waitlist.fieldCountry')} *</label>
          <div className="relative">
            <select name="country" required className={selectCls}>
              <option value="">—</option>
              {COUNTRIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-ag-gray pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t('waitlist.fieldOrg')}</label>
          <input name="organization" type="text" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t('waitlist.fieldCity')}</label>
          <input name="city" type="text" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>{t('waitlist.fieldBio')}</label>
        <textarea name="bio" rows={4} maxLength={1200} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className={labelCls}>{t('waitlist.fieldWebsite')}</label>
        <input name="website" type="url" className={inputCls} placeholder="https://" />
      </div>
      {error && <p className="font-sans text-[11px] text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-ag-navy transition-colors disabled:opacity-60"
      >
        {loading ? t('waitlist.submitting') : t('waitlist.submit')} {!loading && <ArrowUpRight size={13} />}
      </button>
    </form>
  )
}

function SelectFilter({
  value, onChange, placeholder, options,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: { value: string; label: string }[]
}) {
  return (
    <div className="relative flex-1 min-w-[160px]">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={selectCls}
      >
        <option value="">{placeholder}</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-ag-gray pointer-events-none" />
    </div>
  )
}

// Retourne les specialty ids disponibles selon les filtres actifs
function getAvailableExpertises(category: string, domain: string): readonly string[] {
  // Domaine sélectionné → expertises de cette catégorie-taxonomie uniquement
  if (domain) {
    const cat = EXPERTISE_TAXONOMY.find(c => c.id === domain)
    return cat ? cat.specialties.map(s => s.id) : []
  }
  // Catégorie (dimension) sélectionnée → expertises de toutes ses catégories
  if (category) {
    const domainIds = DOMAINS_BY_DIMENSION[category as DimensionKey] ?? []
    return EXPERTISE_TAXONOMY
      .filter(c => domainIds.includes(c.id))
      .flatMap(c => c.specialties.map(s => s.id))
  }
  // Aucun filtre → toutes
  return ALL_EXPERTISES
}

export default function ExpertsContent() {
  const t = useTranslations('experts')
  const [profiles,       setProfiles]       = useState<ExpertProfile[]>([])
  const [loadingGrid,    setLoadingGrid]    = useState(true)
  const [category,       setCategory]       = useState('')
  const [domain,         setDomain]         = useState('')
  const [specialty,      setSpecialty]      = useState('')
  const [country,        setCountry]        = useState('')
  const [contactTarget,  setContactTarget]  = useState<ExpertProfile | null>(null)

  useEffect(() => {
    setLoadingGrid(true)
    const params = new URLSearchParams()
    if (category)  params.set('category',  category)
    if (domain)    params.set('domain',    domain)
    if (specialty) params.set('specialty', specialty)
    if (country)   params.set('country',   country)
    fetch(`/api/experts/profiles${params.toString() ? `?${params}` : ''}`)
      .then(r => r.json())
      .then(d => setProfiles(d.profiles ?? []))
      .catch(() => setProfiles([]))
      .finally(() => setLoadingGrid(false))
  }, [category, domain, specialty, country])

  const isFiltered   = !!(category || domain || specialty || country)
  const showGrid     = !loadingGrid
  const isEmpty      = showGrid && profiles.length === 0 && isFiltered
  const showPlaceholders = showGrid && profiles.length === 0 && !isFiltered

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-36">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(44px,6vw,80px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* ── Showcase catégories — éventail de cartes ─────────────────── */}
      <section className="border-b border-ag-border bg-ag-off-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-4 text-center">
          <p className="font-mono text-[9px] tracking-[0.30em] uppercase text-ag-gray-light mb-4">
            {t('showcase.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight mb-3"
            style={{ fontSize: 'clamp(24px,3.5vw,44px)' }}
          >
            {t('showcase.title')}
          </h2>
          <p className="font-sans text-[13px] text-ag-gray max-w-lg mx-auto mb-10">
            {t('showcase.desc')}
          </p>
        </div>

        {/* Cards éventail — mécanique Subblink: arcY + shiftX + pivot bottom center */}
        <FanCards
          domains={EXPERT_DOMAINS}
          activeDomain={domain}
          onSelect={(key) => { setDomain(prev => prev === key ? '' : key); setCategory('') }} // key = specialty id dans éventail, filtre domaine
          t={t}
        />
      </section>

      {/* ── Filtres + compteur ───────────────────────────────────────── */}
      <section className="border-b border-ag-border bg-ag-white sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <Filter size={13} className="text-ag-gray-light shrink-0" />
            <SelectFilter
              value={category}
              onChange={v => { setCategory(v); setDomain(''); setSpecialty('') }}
              placeholder={t('filters.allCategories')}
              options={DIMENSIONS.map(d => ({ value: d.key, label: t(d.labelKey) }))}
            />
            <SelectFilter
              value={domain}
              onChange={v => { setDomain(v); setSpecialty('') }}
              placeholder={t('filters.allDomains')}
              options={(category && DOMAINS_BY_DIMENSION[category as DimensionKey]
                ? DOMAINS_BY_DIMENSION[category as DimensionKey]
                : ALL_DOMAINS
              ).map(d => {
                const cat = EXPERTISE_TAXONOMY.find(c => c.id === d)
                return { value: d, label: cat?.labelFr ?? d }
              })}
            />
            <SelectFilter
              value={specialty}
              onChange={setSpecialty}
              placeholder={t('filters.allSpecialties')}
              options={getAvailableExpertises(category, domain).map(id => {
                const spec = EXPERTISE_TAXONOMY.flatMap(c => c.specialties).find(s => s.id === id)
                return { value: id, label: spec?.labelFr ?? id }
              })}
            />
            <SelectFilter
              value={country}
              onChange={setCountry}
              placeholder={t('filters.allCountries')}
              options={COUNTRIES.map(c => ({ value: c, label: c }))}
            />
            <span className="font-mono text-[10px] tracking-[0.14em] text-ag-gray-light ml-auto shrink-0">
              {loadingGrid ? '…' : profiles.length} {t('filters.count')}
            </span>
          </div>
        </div>
      </section>

      {/* ── Grille experts ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        {loadingGrid && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-ag-white h-64 animate-pulse" />
            ))}
          </div>
        )}

        {isEmpty && (
          <div className="border border-ag-border bg-ag-off-white p-16 text-center">
            <p className="font-sans font-semibold text-ag-black text-[16px] mb-2">{t('empty.title')}</p>
            <p className="font-sans text-[13px] text-ag-gray">{t('empty.desc')}</p>
          </div>
        )}

        {showPlaceholders && (
          <>
            <div className="flex flex-col items-center gap-2 mb-10 text-center">
              <span className="inline-flex items-center gap-2 font-mono text-[9px] tracking-[0.24em] uppercase px-4 py-2 border border-ag-apex/40 bg-ag-apex/8 text-ag-apex-ink mb-1">
                <Star size={10} className="text-ag-apex" /> {t('placeholder.badge')}
              </span>
              <p className="font-sans font-bold text-ag-black text-[20px] leading-tight">{t('placeholder.title')}</p>
              <p className="font-sans text-[13px] text-ag-gray max-w-md">{t('placeholder.desc')}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
              {PLACEHOLDERS.map(p => (
                <ExpertCard key={p.id} profile={p} t={t} blurred />
              ))}
            </div>
          </>
        )}

        {!loadingGrid && profiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {profiles.map(p => (
              <ExpertCard
                key={p.id}
                profile={p}
                t={t}
                filters={{ category, domain, specialty, country }}
                onContactClick={setContactTarget}
              />
            ))}
          </div>
        )}

        {contactTarget && (
          <ContactLeadModal
            expert={contactTarget}
            filters={{ category, domain, specialty, country }}
            onClose={() => setContactTarget(null)}
          />
        )}
      </section>

      {/* ── Section candidature ──────────────────────────────────────── */}
      <section className="bg-ag-off-white border-t border-ag-border py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
              {t('waitlist.label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              {t('waitlist.title')}
            </h2>
            <p className="text-[13px] text-ag-gray leading-relaxed">
              {t('waitlist.desc')}
            </p>
          </div>
          <WaitlistForm t={t} />
        </div>
      </section>
    </>
  )
}
