'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

type ProfileType = 'buyer' | 'seller' | 'partner' | 'undecided'
type Step = 'profile' | 'qualify' | 'contact' | 'done'

interface WaitlistFormProps {
  locale: string  // reserved for i18n translations
}

/* ── Options ────────────────────────────────────────────────────────── */

const BUYER_CATEGORIES = [
  { value: 'individual_hnw',     label: 'Particulier fortuné (HNW)' },
  { value: 'family_office',      label: 'Family office' },
  { value: 'search_fund',        label: 'Search fund / ETA' },
  { value: 'pe_vc_fund',         label: 'Fonds PE / VC' },
  { value: 'corporate_strategic', label: 'Acquéreur corporatif / stratégique' },
  { value: 'holding',            label: 'Holding patrimoniale' },
]

const TICKET_RANGES = [
  { value: '<500k',   label: '< 500K€' },
  { value: '500k-2m', label: '500K€ – 2M€' },
  { value: '2m-5m',   label: '2M€ – 5M€' },
  { value: '5m-20m',  label: '5M€ – 20M€' },
  { value: '20m+',    label: '> 20M€' },
]

const TIMELINES_BUYER = [
  { value: 'immediate',    label: 'Immédiat (< 3 mois)' },
  { value: '3-6m',         label: '3 – 6 mois' },
  { value: '6-12m',        label: '6 – 12 mois' },
  { value: 'opportunistic', label: 'Opportuniste / sans échéance' },
]

const ACQUISITION_INTENTS = [
  { value: 'single_asset',     label: 'Acquisition unique ciblée' },
  { value: 'portfolio_buildup', label: 'Constitution de portefeuille' },
  { value: 'exploratory',      label: 'Exploration de marché' },
]

const SECTORS = [
  'SaaS B2B', 'IA / ML', 'LegalTech', 'FinTech', 'EdTech', 'HealthTech',
  'E-commerce', 'Marketplaces', 'Cybersécurité', 'PropTech', 'Logistique', 'Autre',
]

const SELLER_STAGES = [
  { value: 'idea',               label: 'Idée / pré-lancement' },
  { value: 'mvp',                label: 'MVP / beta' },
  { value: 'revenue_generating', label: 'Génère des revenus' },
  { value: 'scaling',            label: 'En croissance' },
  { value: 'mature',             label: 'Mature / établi' },
]

const SELLER_ARR = [
  { value: '<100k',     label: '< 100K€' },
  { value: '100k-500k', label: '100K€ – 500K€' },
  { value: '500k-2m',   label: '500K€ – 2M€' },
  { value: '2m-10m',    label: '2M€ – 10M€' },
  { value: '10m+',      label: '> 10M€' },
]

const SELLER_REASONS = [
  { value: 'full_exit',       label: 'Cession totale' },
  { value: 'partial',         label: 'Cession partielle / levée' },
  { value: 'succession',      label: 'Transmission / succession' },
  { value: 'burnout',         label: 'Fatigue / burnout fondateur' },
  { value: 'strategic_pivot', label: 'Pivot stratégique' },
]

const SELLER_TIMELINES = [
  { value: 'immediate', label: 'Immédiat (< 3 mois)' },
  { value: '3-6m',      label: '3 – 6 mois' },
  { value: '6-12m',     label: '6 – 12 mois' },
  { value: 'flexible',  label: 'Flexible / selon offre' },
]

const PARTNER_CATEGORIES = [
  { value: 'law_firm',     label: 'Cabinet d\'avocats' },
  { value: 'accounting',   label: 'Cabinet d\'expertise comptable' },
  { value: 'ma_boutique',  label: 'Boutique M&A / conseil' },
  { value: 'vc_pe',        label: 'VC / PE' },
  { value: 'accelerator',  label: 'Accélérateur / incubateur' },
  { value: 'other',        label: 'Autre' },
]

const PARTNER_DEAL_FLOWS = [
  { value: '<5_per_year',      label: '< 5 introductions / an' },
  { value: '5-10_per_year',    label: '5 – 10 / an' },
  { value: '10-20_per_year',   label: '10 – 20 / an' },
  { value: '20+_per_year',     label: '> 20 / an' },
]

const SOURCES = [
  { value: 'linkedin',       label: 'LinkedIn' },
  { value: 'organic',        label: 'Recherche / bouche-à-oreille' },
  { value: 'referral',       label: 'Recommandation' },
  { value: 'event',          label: 'Événement / conférence' },
  { value: 'partner_intro',  label: 'Introduction partenaire' },
  { value: 'direct',         label: 'Contact direct AEGRYN' },
]

/* ── Helpers UI ─────────────────────────────────────────────────────── */

function Select({ name, options, value, onChange, placeholder }: {
  name: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
      {children}
    </label>
  )
}

/* ── Composant principal ────────────────────────────────────────────── */

export default function WaitlistForm({ locale: _locale }: WaitlistFormProps) {
  const [step, setStep]               = useState<Step>('profile')
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')

  /* Champs communs */
  const [profileType, setProfileType]   = useState<ProfileType | ''>('')
  const [email, setEmail]               = useState('')
  const [firstName, setFirstName]       = useState('')
  const [lastName, setLastName]         = useState('')
  const [source, setSource]             = useState('')
  const [gdprConsent, setGdprConsent]   = useState(false)
  const [marketingConsent, setMarketing] = useState(false)

  /* Buyer */
  const [buyerCategory, setBuyerCategory]         = useState('')
  const [ticketRange, setTicketRange]             = useState('')
  const [acquisitionIntent, setAcquisitionIntent] = useState('')
  const [sectors, setSectors]                     = useState<string[]>([])
  const [timelineToDeploy, setTimelineToDeploy]   = useState('')
  const [hasFinancing, setHasFinancing]           = useState<boolean | null>(null)

  /* Seller */
  const [sellerStage, setSellerStage]     = useState('')
  const [sellerArr, setSellerArr]         = useState('')
  const [sellerReason, setSellerReason]   = useState('')
  const [sellerTimeline, setSellerTimeline] = useState('')

  /* Partner */
  const [partnerCategory, setPartnerCategory]       = useState('')
  const [partnerDealFlow, setPartnerDealFlow]       = useState('')

  function toggleSector(s: string) {
    setSectors(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : prev.length < 5 ? [...prev, s] : prev
    )
  }

  async function handleSubmit() {
    if (!email || !profileType || !gdprConsent) return
    setLoading(true)
    setError('')

    const payload: Record<string, unknown> = {
      email,
      firstName: firstName || undefined,
      lastName:  lastName  || undefined,
      profileType,
      source:    source    || undefined,
      gdprConsent,
      marketingConsent,
    }

    if (profileType === 'buyer') {
      Object.assign(payload, {
        buyerCategory:       buyerCategory        || undefined,
        ticketRange:         ticketRange          || undefined,
        acquisitionIntent:   acquisitionIntent    || undefined,
        sectorsInterest:     sectors,
        timelineToDeploy:    timelineToDeploy     || undefined,
        hasFinancingSecured: hasFinancing         ?? undefined,
      })
    }
    if (profileType === 'seller') {
      Object.assign(payload, {
        sellerAssetStage:    sellerStage    || undefined,
        sellerAssetArrRange: sellerArr      || undefined,
        sellerReasonToSell:  sellerReason   || undefined,
        sellerTimeline:      sellerTimeline || undefined,
      })
    }
    if (profileType === 'partner') {
      Object.assign(payload, {
        partnerCategory:           partnerCategory  || undefined,
        partnerDealFlowEstimate:   partnerDealFlow  || undefined,
      })
    }

    try {
      const res = await fetch('/api/prospects/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        setStep('done')
      } else {
        const data = await res.json()
        setError(data?.error ?? 'Une erreur est survenue.')
      }
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  /* ── Rendu ── */

  if (step === 'done') {
    return (
      <div className="bg-ag-off-white border border-ag-border p-10 flex flex-col items-center gap-5 text-center">
        <CheckCircle2 size={36} className="text-ag-apex" />
        <div>
          <p className="font-sans font-bold text-ag-black text-[18px] mb-2">Demande enregistrée</p>
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-md">
            Notre équipe examinera votre profil et vous contactera sous 48h pour valider votre accès
            à la prochaine session AEGRYN Auction.
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ag-gray-light">
          Aucun accès sans invitation nominative.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-ag-white border border-ag-border">
      {/* Header */}
      <div className="bg-ag-navy px-8 py-6 flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ag-apex mb-1.5">
            Waiting list — Sessions Auction
          </p>
          <p className="font-sans font-bold text-white text-[16px] leading-snug">
            Rejoindre la liste d&apos;accès prioritaire
          </p>
        </div>
        {/* Progress dots */}
        <div className="flex items-center gap-1.5 shrink-0 mt-1">
          {(['profile', 'qualify', 'contact'] as const).map((s, i) => (
            <span
              key={s}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                step === s ? 'bg-ag-apex' :
                (['profile', 'qualify', 'contact'].indexOf(step) > i) ? 'bg-ag-apex/40' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="p-8 flex flex-col gap-6">

        {/* ── ÉTAPE 1 : Type de profil ── */}
        {step === 'profile' && (
          <>
            <div>
              <Label>Je suis *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {([
                  { v: 'buyer',    l: 'Acquéreur' },
                  { v: 'seller',   l: 'Cédant' },
                  { v: 'partner',  l: 'Partenaire' },
                  { v: 'undecided', l: 'Non défini' },
                ] as const).map(({ v, l }) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setProfileType(v)}
                    className={`border px-4 py-3 font-sans text-[13px] font-semibold transition-all ${
                      profileType === v
                        ? 'border-ag-black bg-ag-black text-white'
                        : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Comment avez-vous entendu parler d&apos;AEGRYN ?</Label>
              <Select
                name="source"
                options={SOURCES}
                value={source}
                onChange={setSource}
                placeholder="— Sélectionner —"
              />
            </div>

            <button
              type="button"
              disabled={!profileType}
              onClick={() => setStep('qualify')}
              className="self-end inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-40"
            >
              Suivant <ChevronRight size={13} />
            </button>
          </>
        )}

        {/* ── ÉTAPE 2 : Qualification conditionnelle ── */}
        {step === 'qualify' && (
          <>
            {/* BUYER */}
            {profileType === 'buyer' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Profil acquéreur *</Label>
                    <Select name="buyerCategory" options={BUYER_CATEGORIES} value={buyerCategory} onChange={setBuyerCategory} placeholder="— Sélectionner —" />
                  </div>
                  <div>
                    <Label>Ticket d&apos;acquisition cible *</Label>
                    <Select name="ticketRange" options={TICKET_RANGES} value={ticketRange} onChange={setTicketRange} placeholder="— Sélectionner —" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Horizon de déploiement *</Label>
                    <Select name="timelineToDeploy" options={TIMELINES_BUYER} value={timelineToDeploy} onChange={setTimelineToDeploy} placeholder="— Sélectionner —" />
                  </div>
                  <div>
                    <Label>Nature de l&apos;acquisition</Label>
                    <Select name="acquisitionIntent" options={ACQUISITION_INTENTS} value={acquisitionIntent} onChange={setAcquisitionIntent} placeholder="— Sélectionner —" />
                  </div>
                </div>
                <div>
                  <Label>Secteurs d&apos;intérêt (5 max)</Label>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {SECTORS.map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSector(s)}
                        className={`font-mono text-[9px] uppercase tracking-[0.14em] px-3 py-1.5 border transition-all ${
                          sectors.includes(s)
                            ? 'border-ag-apex bg-ag-apex/10 text-ag-black'
                            : 'border-ag-border text-ag-gray hover:border-ag-black'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Financement sécurisé ?</Label>
                  <div className="flex gap-3">
                    {[{ v: true, l: 'Oui' }, { v: false, l: 'Non / en cours' }].map(({ v, l }) => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => setHasFinancing(v)}
                        className={`border px-5 py-2.5 font-sans text-[13px] transition-all ${
                          hasFinancing === v ? 'border-ag-black bg-ag-black text-white' : 'border-ag-border text-ag-gray hover:border-ag-black'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SELLER */}
            {profileType === 'seller' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Stade de l&apos;actif *</Label>
                    <Select name="sellerStage" options={SELLER_STAGES} value={sellerStage} onChange={setSellerStage} placeholder="— Sélectionner —" />
                  </div>
                  <div>
                    <Label>ARR annuel estimé *</Label>
                    <Select name="sellerArr" options={SELLER_ARR} value={sellerArr} onChange={setSellerArr} placeholder="— Sélectionner —" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Raison de cession *</Label>
                    <Select name="sellerReason" options={SELLER_REASONS} value={sellerReason} onChange={setSellerReason} placeholder="— Sélectionner —" />
                  </div>
                  <div>
                    <Label>Horizon souhaité</Label>
                    <Select name="sellerTimeline" options={SELLER_TIMELINES} value={sellerTimeline} onChange={setSellerTimeline} placeholder="— Sélectionner —" />
                  </div>
                </div>
              </div>
            )}

            {/* PARTNER */}
            {profileType === 'partner' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Type de structure *</Label>
                    <Select name="partnerCategory" options={PARTNER_CATEGORIES} value={partnerCategory} onChange={setPartnerCategory} placeholder="— Sélectionner —" />
                  </div>
                  <div>
                    <Label>Volume d&apos;introductions estimé</Label>
                    <Select name="partnerDealFlow" options={PARTNER_DEAL_FLOWS} value={partnerDealFlow} onChange={setPartnerDealFlow} placeholder="— Sélectionner —" />
                  </div>
                </div>
              </div>
            )}

            {/* UNDECIDED */}
            {profileType === 'undecided' && (
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                Aucun problème — renseignez simplement vos coordonnées et notre équipe prendra contact avec vous.
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ag-gray-light hover:text-ag-black transition-colors"
              >
                <ChevronLeft size={13} /> Retour
              </button>
              <button
                type="button"
                onClick={() => setStep('contact')}
                className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3 hover:bg-ag-black transition-colors"
              >
                Suivant <ChevronRight size={13} />
              </button>
            </div>
          </>
        )}

        {/* ── ÉTAPE 3 : Coordonnées + consentement + envoi ── */}
        {step === 'contact' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Prénom</Label>
                <input
                  value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
                  placeholder="Jean"
                />
              </div>
              <div>
                <Label>Nom *</Label>
                <input
                  value={lastName} onChange={e => setLastName(e.target.value)}
                  className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
                  placeholder="Dupont"
                />
              </div>
            </div>
            <div>
              <Label>Email *</Label>
              <input
                type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
                placeholder="vous@exemple.com"
              />
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={e => setGdprConsent(e.target.checked)}
                  className="mt-0.5 accent-ag-black"
                />
                <span className="font-sans text-[12px] text-ag-gray leading-relaxed">
                  J&apos;accepte que mes données soient traitées par AEGRYN dans le cadre de ma demande d&apos;accès
                  aux sessions auction, conformément au RGPD / nLPD. *
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingConsent}
                  onChange={e => setMarketing(e.target.checked)}
                  className="mt-0.5 accent-ag-black"
                />
                <span className="font-sans text-[12px] text-ag-gray leading-relaxed">
                  J&apos;accepte de recevoir les communications AEGRYN (nouvelles sessions, actifs disponibles).
                </span>
              </label>
            </div>

            {error && (
              <p className="font-sans text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('qualify')}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ag-gray-light hover:text-ag-black transition-colors"
              >
                <ChevronLeft size={13} /> Retour
              </button>
              <button
                type="button"
                disabled={!email || !gdprConsent || loading}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-40"
              >
                {loading ? 'Envoi...' : 'Soumettre'} {!loading && <ArrowUpRight size={12} />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
