'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'
const selectCls = inputCls + ' appearance-none cursor-pointer'

const BUYER_TYPE_VALUES = ['founder', 'fund', 'family_office', 'corporate', 'other'] as const
const FUNDS_PROOF_VALUES = ['bank_statement', 'fund_commitment', 'self_declared', 'other'] as const
const SECTOR_KEYS = [
  'saas_b2b', 'saas_b2c', 'marketplace', 'ecommerce', 'mobile_app',
  'digital_agency', 'ai_data', 'fintech', 'proptech', 'healthtech',
  'cybersecurity', 'infrastructure', 'content_media',
] as const
const GEO_KEYS = ['ch', 'fr', 'de', 'benelux', 'south_eu', 'east_eu', 'all_eu', 'international'] as const
const OP_TYPE_VALUES = ['full_acquisition', 'majority', 'minority', 'lbo'] as const

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 font-sans text-[11px] transition-colors whitespace-nowrap ${
        active ? 'border-ag-black bg-ag-black text-white' : 'border-ag-border text-ag-black hover:border-ag-black'
      }`}
    >
      {label}
    </button>
  )
}

export default function BuyerForm() {
  const t = useTranslations('transactBuyers.form')
  const [form, setForm] = useState({
    full_name:    '',
    email:        '',
    organization: '',
    country:      'CH',
    buyer_type:   '',
    ticket_min:   '',
    ticket_max:   '',
    funds_proof:  '',
    funds_amount: '',
    message:      '',
  })
  const [sectors,    setSectors]    = useState<string[]>([])
  const [geos,       setGeos]       = useState<string[]>([])
  const [opTypes,    setOpTypes]    = useState<string[]>([])
  const [submitted,  setSubmitted]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  function toggle<T extends string>(arr: T[], setArr: (v: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const canSubmit = form.full_name && form.email && form.buyer_type && form.funds_proof && sectors.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/transact/buyers', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name:       form.full_name,
          email:           form.email,
          organization:    form.organization || undefined,
          country:         form.country,
          buyer_type:      form.buyer_type,
          ticket_min_eur:  form.ticket_min ? parseInt(form.ticket_min) : undefined,
          ticket_max_eur:  form.ticket_max ? parseInt(form.ticket_max) : undefined,
          sectors:         sectors.map(s => t(`sectors.${s}`)),
          geographies:     geos.map(g => t(`geos.${g}`)),
          operation_types: opTypes,
          funds_proof:     form.funds_proof,
          funds_amount:    form.funds_amount || undefined,
          message:         form.message || undefined,
          locale:          document.documentElement.lang || 'fr',
          source_url:      window.location.href,
        }),
      })
      if (res.ok) setSubmitted(true)
      else        setError(t('errorMsg'))
    } catch {
      setError(t('errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-10 flex flex-col items-center gap-4 text-center">
        <CheckCircle2 size={32} className="text-emerald-500" />
        <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">
          {t('successTitle')}
        </h3>
        <p className="font-sans text-[14px] text-ag-gray max-w-md leading-relaxed">
          {t('successDesc')}
        </p>
        <Link
          href="/transact/sessions"
          className="rounded-lg inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:border-ag-black transition-colors mt-2"
        >
          {t('successCta')} <ArrowUpRight size={11} />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* Identité */}
      <div className="border border-ag-border bg-ag-white p-7 flex flex-col gap-5">
        <p className={labelCls}>{t('sectionIdentity')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>{t('fullName')} *</label>
            <input
              type="text" required value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder={t('fullNamePlaceholder')} className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t('email')} *</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder={t('emailPlaceholder')} className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t('organization')}</label>
            <input
              type="text" value={form.organization}
              onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
              placeholder={t('organizationPlaceholder')} className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t('country')} *</label>
            <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={selectCls}>
              {['CH','FR','DE','BE','LU','GB','US','SG','AE','Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Profil acheteur */}
      <div className="border border-ag-border bg-ag-white p-7 flex flex-col gap-5">
        <p className={labelCls}>{t('sectionProfile')}</p>

        <div>
          <label className={labelCls}>{t('buyerType')} *</label>
          <select required value={form.buyer_type} onChange={e => setForm(f => ({ ...f, buyer_type: e.target.value }))} className={selectCls}>
            <option value="">{t('selectPlaceholder')}</option>
            {BUYER_TYPE_VALUES.map(v => <option key={v} value={v}>{t(`buyerTypes.${v}`)}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>{t('ticketMin')}</label>
            <input
              type="number" min="0" value={form.ticket_min}
              onChange={e => setForm(f => ({ ...f, ticket_min: e.target.value }))}
              placeholder="100 000" className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>{t('ticketMax')}</label>
            <input
              type="number" min="0" value={form.ticket_max}
              onChange={e => setForm(f => ({ ...f, ticket_max: e.target.value }))}
              placeholder="5 000 000" className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>{t('sectorsLabel')} * <span className="normal-case text-ag-gray-light font-normal">{t('sectorsHint')}</span></label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SECTOR_KEYS.map(s => (
              <Chip key={s} label={t(`sectors.${s}`)} active={sectors.includes(s)} onClick={() => toggle(sectors, setSectors, s)} />
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>{t('geosLabel')}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {GEO_KEYS.map(g => (
              <Chip key={g} label={t(`geos.${g}`)} active={geos.includes(g)} onClick={() => toggle(geos, setGeos, g)} />
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>{t('opTypesLabel')}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {OP_TYPE_VALUES.map(v => (
              <Chip key={v} label={t(`opTypes.${v}`)} active={opTypes.includes(v)} onClick={() => toggle(opTypes, setOpTypes, v)} />
            ))}
          </div>
        </div>
      </div>

      {/* Capacité financière */}
      <div className="border border-ag-border bg-ag-white p-7 flex flex-col gap-5">
        <p className={labelCls}>{t('sectionFunds')}</p>
        <div>
          <label className={labelCls}>{t('fundsProof')} *</label>
          <select required value={form.funds_proof} onChange={e => setForm(f => ({ ...f, funds_proof: e.target.value }))} className={selectCls}>
            <option value="">{t('selectPlaceholder')}</option>
            {FUNDS_PROOF_VALUES.map(v => <option key={v} value={v}>{t(`fundsProofOptions.${v}`)}</option>)}
          </select>
          <p className="font-sans text-[11px] text-ag-gray-light mt-1.5">
            {t('fundsProofHint')}
          </p>
        </div>
        <div>
          <label className={labelCls}>{t('fundsAmount')}</label>
          <input
            type="text" value={form.funds_amount}
            onChange={e => setForm(f => ({ ...f, funds_amount: e.target.value }))}
            placeholder={t('fundsAmountPlaceholder')} className={inputCls}
          />
        </div>
      </div>

      {/* Message */}
      <div className="border border-ag-border bg-ag-white p-7">
        <label className={labelCls}>{t('messageLabel')}</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder={t('messagePlaceholder')}
          rows={4}
          className={inputCls + ' resize-none'}
        />
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-500">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="font-sans text-[11px] text-ag-gray-light max-w-xs leading-relaxed">
          {t('privacyNote')}
        </p>
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-navy-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <ArrowUpRight size={13} />}
          {t('submit')}
        </button>
      </div>
    </form>
  )
}
