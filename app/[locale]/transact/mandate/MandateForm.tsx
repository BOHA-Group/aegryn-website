'use client'

import { useState, useEffect } from 'react'
import { useTranslations }     from 'next-intl'
import { useSearchParams }     from 'next/navigation'
import { Link }                from '@/i18n/navigation'
import { ArrowUpRight, CheckCircle2, Scale } from 'lucide-react'

type MandateType = 'sell' | 'buy' | 'fundraise' | 'equity_stake'
type HasIp       = 'yes' | 'no' | 'pending' | ''

const MANDATE_TYPES: MandateType[] = ['sell', 'buy', 'fundraise', 'equity_stake']
const VERTICALS = ['saas_b2b','saas_b2c','marketplace','ecommerce','fintech','healthtech','edtech','deeptech','infra_devtools','media_content','other'] as const

export default function MandateForm() {
  const t    = useTranslations('transact.mandate')
  const tf   = useTranslations('transact.mandate.form')
  const tNav = useTranslations('nav')

  const searchParams = useSearchParams()

  /* ── State ───────────────────────────────────────────── */
  const [mandateType, setMandateType] = useState<MandateType | ''>('')
  const [hasIp,       setHasIp]       = useState<HasIp>('')
  const [swissAccept, setSwissAccept] = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [error,       setError]       = useState(false)
  const [loading,     setLoading]     = useState(false)

  /* Pré-sélection via ?type=sell|buy|fundraise|equity_stake */
  useEffect(() => {
    const param = searchParams.get('type') as MandateType | null
    if (param && MANDATE_TYPES.includes(param)) setMandateType(param)
  }, [searchParams])

  /* ── Submit ──────────────────────────────────────────── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!mandateType) return
    setLoading(true)
    setError(false)

    const data   = Object.fromEntries(new FormData(e.currentTarget))
    const locale = document.documentElement.lang || 'fr'

    /* Critères spécifiques par type */
    const criteria: Record<string, unknown> = {}
    if (mandateType === 'sell') {
      if (data.arrChf)       criteria.arr_chf          = Number(data.arrChf)
      if (data.yoyGrowth)    criteria.yoy_growth_pct   = Number(data.yoyGrowth)
      if (data.teamSize)     criteria.team_size         = Number(data.teamSize)
      if (hasIp)             criteria.has_ip            = hasIp === 'yes'
    } else if (mandateType === 'buy') {
      if (data.targetArrMin)    criteria.target_arr_min   = Number(data.targetArrMin)
      if (data.targetCountries) criteria.target_countries = String(data.targetCountries).split(',').map(s => s.trim()).filter(Boolean)
      if (data.profitability)   criteria.profitability    = String(data.profitability)
    } else if (mandateType === 'fundraise') {
      if (data.currentMrr)        criteria.current_mrr        = Number(data.currentMrr)
      if (data.useOfFunds)        criteria.use_of_funds        = String(data.useOfFunds)
      if (data.equityOfferedPct)  criteria.equity_offered_pct  = Number(data.equityOfferedPct)
    } else if (mandateType === 'equity_stake') {
      if (data.stakePctMax)  criteria.stake_pct_max  = Number(data.stakePctMax)
      if (data.partnerType)  criteria.partner_type   = String(data.partnerType)
      if (data.revenueChf)   criteria.revenue_chf    = Number(data.revenueChf)
    }

    const payload = {
      contactName:   data.contactName,
      contactEmail:  data.contactEmail,
      companyName:   data.companyName   || undefined,
      type:          mandateType,
      vertical:      data.vertical      || undefined,
      verticalOther: data.verticalOther || undefined,
      budgetMinChf:  data.budgetMinChf  ? Number(data.budgetMinChf)  : undefined,
      budgetMaxChf:  data.budgetMaxChf  ? Number(data.budgetMaxChf)  : undefined,
      description:   data.description   || undefined,
      criteria:      Object.keys(criteria).length > 0 ? criteria : undefined,
      locale,
    }

    try {
      const res = await fetch('/api/transact/mandate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (res.ok) setSubmitted(true)
      else        setError(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  /* ── Styles ──────────────────────────────────────────── */
  const inputCls   = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
  const selectCls  = inputCls + ' appearance-none'
  const labelCls   = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'
  const sectionCls = 'font-sans font-bold text-ag-black text-[11px] uppercase tracking-[0.18em] border-t border-ag-border pt-6 pb-2 mt-2'

  /* ── Success ─────────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="border border-ag-apex/30 bg-ag-off-white p-16 flex flex-col items-start gap-6">
        <CheckCircle2 size={32} className="text-ag-apex" />
        <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em]">
          {tf('successTitle')}
        </h2>
        <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-md">
          {tf('successDesc')}
        </p>
        <Link
          href="/transact"
          className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-6 py-3 hover:bg-ag-navy hover:text-white transition-colors"
        >
          {tNav('transact')} <ArrowUpRight size={12} />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* ══ 1. TYPE DE MANDAT ══════════════════════════════ */}
      <p className={sectionCls.replace('border-t border-ag-border pt-6 pb-2 mt-2', 'pb-2')} style={{ borderTop: 'none' }}>
        {tf('sectionType')}
      </p>

      {/* Sélecteur visuel en 4 tuiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {MANDATE_TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMandateType(type)}
            className={`text-left p-5 border transition-all ${
              mandateType === type
                ? 'border-ag-black bg-ag-black text-white'
                : 'border-ag-border bg-ag-white text-ag-gray hover:border-ag-black hover:text-ag-black'
            }`}
          >
            <p className={`font-mono text-[9px] uppercase tracking-[0.22em] mb-1.5 ${mandateType === type ? 'text-ag-apex' : 'text-ag-apex'}`}>
              {t(`segment.${type}.kicker`)}
            </p>
            <p className={`font-sans font-semibold text-[13px] leading-snug ${mandateType === type ? 'text-white' : 'text-ag-black'}`}>
              {t(`segment.${type}.title`)}
            </p>
            <p className={`font-sans text-[11px] mt-1.5 leading-snug ${mandateType === type ? 'text-white/60' : 'text-ag-gray'}`}>
              {t(`segment.${type}.desc`)}
            </p>
          </button>
        ))}
      </div>

      {/* Champ hidden pour validation (le bouton-tuile gère l'état) */}
      <input type="hidden" name="mandateType" value={mandateType} />

      {/* ══ 2. COORDONNÉES ════════════════════════════════ */}
      <p className={sectionCls}>{tf('sectionContact')}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{tf('contactName')}</label>
          <input name="contactName" type="text" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{tf('contactEmail')}</label>
          <input name="contactEmail" type="email" required className={inputCls} />
        </div>
      </div>

      <div>
        <label className={labelCls}>{tf('companyName')}</label>
        <input name="companyName" type="text" placeholder={tf('companyPlaceholder')} className={inputCls} />
      </div>

      {/* ══ 3. ACTIF / SECTEUR ════════════════════════════ */}
      {mandateType && (
        <>
          <p className={sectionCls}>{tf('sectionAsset')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>{tf('vertical')}</label>
              <select name="vertical" className={selectCls}>
                <option value="">{tf('verticalPlaceholder')}</option>
                {VERTICALS.map(v => (
                  <option key={v} value={v}>{tf(`verticalOptions.${v}`)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>{tf('verticalOther')}</label>
              <input
                name="verticalOther"
                type="text"
                placeholder={tf('verticalOtherPlaceholder')}
                className={inputCls}
              />
            </div>
          </div>

          {/* ── Critères spécifiques par type ─────────── */}
          {mandateType === 'sell' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className={labelCls}>{tf('arrChf')}</label>
                  <input name="arrChf" type="number" min="0" placeholder={tf('arrPlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{tf('yoyGrowth')}</label>
                  <input name="yoyGrowth" type="number" min="0" placeholder={tf('yoyPlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{tf('teamSize')}</label>
                  <input name="teamSize" type="number" min="0" placeholder={tf('teamPlaceholder')} className={inputCls} />
                </div>
              </div>
              <div>
                <p className={labelCls}>{tf('hasIp')}</p>
                <div className="flex gap-6 mt-1">
                  {(['yes','no','pending'] as const).map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio" name="ipFiled" value={v}
                        checked={hasIp === v}
                        onChange={() => setHasIp(v)}
                        className="accent-ag-navy"
                      />
                      <span className="font-sans text-[13px] text-ag-black">
                        {tf(v === 'yes' ? 'hasIpYes' : v === 'no' ? 'hasIpNo' : 'hasIpPending')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {mandateType === 'buy' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{tf('targetArrMin')}</label>
                <input name="targetArrMin" type="number" min="0" placeholder={tf('arrPlaceholder')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tf('targetCountries')}</label>
                <input name="targetCountries" type="text" placeholder={tf('targetCountriesPlaceholder')} className={inputCls} />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{tf('profitability')}</label>
                <input name="profitability" type="text" placeholder={tf('profitabilityPlaceholder')} className={inputCls} />
              </div>
            </div>
          )}

          {mandateType === 'fundraise' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelCls}>{tf('currentMrr')}</label>
                <input name="currentMrr" type="number" min="0" placeholder={tf('mrrPlaceholder')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tf('equityOfferedPct')}</label>
                <input name="equityOfferedPct" type="number" min="0" max="100" placeholder={tf('equityPctPlaceholder')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tf('useOfFunds')}</label>
                <input name="useOfFunds" type="text" placeholder={tf('useOfFundsPlaceholder')} className={inputCls} />
              </div>
            </div>
          )}

          {mandateType === 'equity_stake' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className={labelCls}>{tf('revenueChf')}</label>
                <input name="revenueChf" type="number" min="0" placeholder={tf('revenuePlaceholder')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tf('stakePctMax')}</label>
                <input name="stakePctMax" type="number" min="1" max="49" placeholder={tf('stakePlaceholder')} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>{tf('partnerType')}</label>
                <input name="partnerType" type="text" placeholder={tf('partnerTypePlaceholder')} className={inputCls} />
              </div>
            </div>
          )}

          {/* ── Budget / Ticket ────────────────────────── */}
          <p className={sectionCls}>{tf('sectionBudget')}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>{tf('budgetMinChf')}</label>
              <input name="budgetMinChf" type="number" min="0" placeholder={tf('budgetPlaceholder')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{tf('budgetMaxChf')}</label>
              <input name="budgetMaxChf" type="number" min="0" placeholder={tf('budgetPlaceholder')} className={inputCls} />
            </div>
          </div>
          <p className="font-sans text-[11px] text-ag-gray-light">{tf('budgetNote')}</p>

          {/* ── Description ───────────────────────────── */}
          <p className={sectionCls}>{tf('sectionContext')}</p>

          <div>
            <label className={labelCls}>{tf('description')}</label>
            <textarea
              name="description"
              rows={5}
              placeholder={tf('descriptionPlaceholder')}
              className={`${inputCls} resize-none`}
            />
          </div>
        </>
      )}

      {/* ══ 4. DROIT SUISSE ═══════════════════════════════ */}
      <div className="border border-ag-apex/25 bg-ag-apex/5 px-5 py-4 flex items-start gap-3">
        <Scale size={13} className="text-ag-apex shrink-0 mt-0.5" />
        <div className="flex items-start gap-3">
          <input
            id="swissLaw"
            type="checkbox"
            required
            checked={swissAccept}
            onChange={e => setSwissAccept(e.target.checked)}
            className="mt-0.5 accent-ag-navy shrink-0"
          />
          <label htmlFor="swissLaw" className="font-sans text-[12px] text-ag-black leading-relaxed cursor-pointer">
            {tf('swissLawLabel')}
          </label>
        </div>
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-600">{tf('errorMsg')}</p>
      )}

      <button
        type="submit"
        disabled={loading || !swissAccept || !mandateType}
        className="inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-8 py-4 hover:bg-ag-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? tf('submitting') : mandateType ? t(`segment.${mandateType}.cta`) : tf('submit')}
        {!loading && <ArrowUpRight size={13} />}
      </button>

    </form>
  )
}
