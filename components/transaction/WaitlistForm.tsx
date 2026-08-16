'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

type ProfileType = 'buyer' | 'seller' | 'partner' | 'undecided'
type Step = 'profile' | 'qualify' | 'contact' | 'done'

interface WaitlistFormProps {
  locale: string
}

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

/* ── Helper: build options from i18n record ─────────────────────────── */

function objToOptions(record: Record<string, string>): { value: string; label: string }[] {
  return Object.entries(record).map(([value, label]) => ({ value, label }))
}

/* ── Composant principal ────────────────────────────────────────────── */

export default function WaitlistForm({ locale: _locale }: WaitlistFormProps) {
  const t = useTranslations('waitlist')

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
  const [partnerCategory, setPartnerCategory] = useState('')
  const [partnerDealFlow, setPartnerDealFlow] = useState('')

  /* ── i18n options ── */
  const placeholder = t('placeholder')

  const BUYER_CATEGORIES  = objToOptions(t.raw('step2.buyer.categories') as Record<string,string>)
  const TICKET_RANGES     = objToOptions(t.raw('step2.buyer.tickets')    as Record<string,string>)
  const TIMELINES_BUYER   = objToOptions(t.raw('step2.buyer.timelines')  as Record<string,string>)
  const ACQUISITION_INTENTS = objToOptions(t.raw('step2.buyer.intents')  as Record<string,string>)
  const SECTORS           = t.raw('sectors') as string[]
  const SELLER_STAGES     = objToOptions(t.raw('step2.seller.stages')    as Record<string,string>)
  const SELLER_ARR        = objToOptions(t.raw('step2.seller.arrRanges') as Record<string,string>)
  const SELLER_REASONS    = objToOptions(t.raw('step2.seller.reasons')   as Record<string,string>)
  const SELLER_TIMELINES  = objToOptions(t.raw('step2.seller.timelines') as Record<string,string>)
  const PARTNER_CATEGORIES = objToOptions(t.raw('step2.partner.categories') as Record<string,string>)
  const PARTNER_DEAL_FLOWS = objToOptions(t.raw('step2.partner.dealflows')  as Record<string,string>)
  const SOURCES            = objToOptions(t.raw('sources')                   as Record<string,string>)

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
        setError(data?.error ?? t('errors.server'))
      }
    } catch {
      setError(t('errors.network'))
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
          <p className="font-sans font-bold text-ag-black text-[18px] mb-2">{t('done.title')}</p>
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-md">
            {t('done.desc')}
          </p>
        </div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ag-gray-light">
          {t('done.note')}
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
            {t('header.label')}
          </p>
          <p className="font-sans font-bold text-white text-[16px] leading-snug">
            {t('header.title')}
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
              <Label>{t('step1.profileLabel')}</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(['buyer', 'seller', 'partner', 'undecided'] as const).map(v => (
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
                    {t(`step1.profiles.${v}`)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>{t('step1.sourceLabel')}</Label>
              <Select
                name="source"
                options={SOURCES}
                value={source}
                onChange={setSource}
                placeholder={placeholder}
              />
            </div>

            <button
              type="button"
              disabled={!profileType}
              onClick={() => setStep('qualify')}
              className="self-end inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-40"
            >
              {t('step1.next')} <ChevronRight size={13} />
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
                    <Label>{t('step2.buyer.categoryLabel')}</Label>
                    <Select name="buyerCategory" options={BUYER_CATEGORIES} value={buyerCategory} onChange={setBuyerCategory} placeholder={placeholder} />
                  </div>
                  <div>
                    <Label>{t('step2.buyer.ticketLabel')}</Label>
                    <Select name="ticketRange" options={TICKET_RANGES} value={ticketRange} onChange={setTicketRange} placeholder={placeholder} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('step2.buyer.timelineLabel')}</Label>
                    <Select name="timelineToDeploy" options={TIMELINES_BUYER} value={timelineToDeploy} onChange={setTimelineToDeploy} placeholder={placeholder} />
                  </div>
                  <div>
                    <Label>{t('step2.buyer.intentLabel')}</Label>
                    <Select name="acquisitionIntent" options={ACQUISITION_INTENTS} value={acquisitionIntent} onChange={setAcquisitionIntent} placeholder={placeholder} />
                  </div>
                </div>
                <div>
                  <Label>{t('step2.buyer.sectorsLabel')}</Label>
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
                  <Label>{t('step2.buyer.financingLabel')}</Label>
                  <div className="flex gap-3">
                    {([true, false] as const).map(v => (
                      <button
                        key={String(v)}
                        type="button"
                        onClick={() => setHasFinancing(v)}
                        className={`border px-5 py-2.5 font-sans text-[13px] transition-all ${
                          hasFinancing === v ? 'border-ag-black bg-ag-black text-white' : 'border-ag-border text-ag-gray hover:border-ag-black'
                        }`}
                      >
                        {v ? t('step2.buyer.yes') : t('step2.buyer.noInProgress')}
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
                    <Label>{t('step2.seller.stageLabel')}</Label>
                    <Select name="sellerStage" options={SELLER_STAGES} value={sellerStage} onChange={setSellerStage} placeholder={placeholder} />
                  </div>
                  <div>
                    <Label>{t('step2.seller.arrLabel')}</Label>
                    <Select name="sellerArr" options={SELLER_ARR} value={sellerArr} onChange={setSellerArr} placeholder={placeholder} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('step2.seller.reasonLabel')}</Label>
                    <Select name="sellerReason" options={SELLER_REASONS} value={sellerReason} onChange={setSellerReason} placeholder={placeholder} />
                  </div>
                  <div>
                    <Label>{t('step2.seller.timelineLabel')}</Label>
                    <Select name="sellerTimeline" options={SELLER_TIMELINES} value={sellerTimeline} onChange={setSellerTimeline} placeholder={placeholder} />
                  </div>
                </div>
              </div>
            )}

            {/* PARTNER */}
            {profileType === 'partner' && (
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>{t('step2.partner.categoryLabel')}</Label>
                    <Select name="partnerCategory" options={PARTNER_CATEGORIES} value={partnerCategory} onChange={setPartnerCategory} placeholder={placeholder} />
                  </div>
                  <div>
                    <Label>{t('step2.partner.dealflowLabel')}</Label>
                    <Select name="partnerDealFlow" options={PARTNER_DEAL_FLOWS} value={partnerDealFlow} onChange={setPartnerDealFlow} placeholder={placeholder} />
                  </div>
                </div>
              </div>
            )}

            {/* UNDECIDED */}
            {profileType === 'undecided' && (
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                {t('step2.undecidedNote')}
              </p>
            )}

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setStep('profile')}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ag-gray-light hover:text-ag-black transition-colors"
              >
                <ChevronLeft size={13} /> {t('step2.back')}
              </button>
              <button
                type="button"
                onClick={() => setStep('contact')}
                className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3 hover:bg-ag-black transition-colors"
              >
                {t('step2.next')} <ChevronRight size={13} />
              </button>
            </div>
          </>
        )}

        {/* ── ÉTAPE 3 : Coordonnées + consentement + envoi ── */}
        {step === 'contact' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>{t('step3.firstNameLabel')}</Label>
                <input
                  value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
                  placeholder={t('step3.firstNamePlaceholder')}
                />
              </div>
              <div>
                <Label>{t('step3.lastNameLabel')}</Label>
                <input
                  value={lastName} onChange={e => setLastName(e.target.value)}
                  className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
                  placeholder={t('step3.lastNamePlaceholder')}
                />
              </div>
            </div>
            <div>
              <Label>{t('step3.emailLabel')}</Label>
              <input
                type="email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
                placeholder={t('step3.emailPlaceholder')}
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
                  {t('step3.gdprConsent')}
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
                  {t('step3.marketingConsent')}
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
                <ChevronLeft size={13} /> {t('step3.back')}
              </button>
              <button
                type="button"
                disabled={!email || !gdprConsent || loading}
                onClick={handleSubmit}
                className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-40"
              >
                {loading ? t('step3.submitting') : t('step3.submit')} {!loading && <ArrowUpRight size={12} />}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
