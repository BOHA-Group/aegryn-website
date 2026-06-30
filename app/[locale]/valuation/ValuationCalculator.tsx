'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowUpRight, ChevronRight, ChevronLeft, RotateCcw, TrendingUp, Mail, CheckCircle2 } from 'lucide-react'

/* ─── Types ──────────────────────────────────────────────── */
interface FormData {
  arr:       string
  mrr:       string
  growth:    string
  churn:     string
  nrr:       string
  margin:    string
  seniority: 'under1' | 'one_to_three' | 'above3' | ''
  ip:        'yes' | 'no' | 'pending' | ''
  stack:     string
}

interface ValuationResult {
  conservative: { min: number; max: number; multiple: number }
  median:       { min: number; max: number; multiple: number }
  premium:      { min: number; max: number; multiple: number } | null
  arr:          number
  isPremium:    boolean
}

/* ─── Calculation engine (pure JS, zero API) ─────────────── */
function calculate(f: FormData): ValuationResult {
  const arr    = parseFloat(f.arr)    || 0
  const growth = parseFloat(f.growth) || 0
  const churn  = parseFloat(f.churn)  || 0
  const nrr    = parseFloat(f.nrr)    || 100
  const margin = parseFloat(f.margin) || 60

  let adj = 0

  // Growth
  if (growth > 50)      adj += 1.0
  else if (growth > 25) adj += 0.5
  else if (growth < 0)  adj -= 0.5

  // Churn
  if (churn > 10)      adj -= 0.8
  else if (churn > 5)  adj -= 0.3
  else if (churn < 1)  adj += 0.2

  // NRR
  if (nrr > 120)       adj += 0.8
  else if (nrr > 110)  adj += 0.5
  else if (nrr < 90)   adj -= 0.5
  else if (nrr < 80)   adj -= 0.8

  // Margin
  if (margin > 80)      adj += 0.4
  else if (margin > 70) adj += 0.2
  else if (margin < 50) adj -= 0.4
  else if (margin < 40) adj -= 0.7

  // Seniority
  if (f.seniority === 'above3')       adj += 0.2
  else if (f.seniority === 'under1')  adj -= 0.5

  // IP
  if (f.ip === 'yes')     adj += 0.2
  else if (f.ip === 'pending') adj += 0.1

  const adjClamped = Math.max(-2, Math.min(2, adj))

  const consMult   = Math.max(1.0, 2.5 + adjClamped * 0.5)
  const medMult    = Math.max(1.5, 3.1 + adjClamped * 0.7)
  const isPremium  = nrr > 110 && growth > 25
  const premMinMult = isPremium ? Math.min(8, 5 + adjClamped * 0.5)  : 0
  const premMaxMult = isPremium ? Math.min(10, 8 + adjClamped * 0.6) : 0

  return {
    arr,
    isPremium,
    conservative: { multiple: +consMult.toFixed(1), min: arr * consMult * 0.85, max: arr * consMult * 1.15 },
    median:       { multiple: +medMult.toFixed(1),  min: arr * medMult  * 0.85, max: arr * medMult  * 1.15 },
    premium: isPremium
      ? { multiple: +((premMinMult + premMaxMult) / 2).toFixed(1), min: arr * premMinMult, max: arr * premMaxMult }
      : null,
  }
}

/* ─── Format ─────────────────────────────────────────────── */
function fmtEur(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')} M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K€`
  return `${n.toFixed(0)} €`
}

/* ─── Style helpers ──────────────────────────────────────── */
const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const selectCls = inputCls + ' appearance-none'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

const SENIORITY_KEYS = ['under1', 'one_to_three', 'above3'] as const
const STACK_KEYS     = ['saas_b2b', 'marketplace', 'mobile', 'protocol', 'ip_only', 'other'] as const
const IP_KEYS        = ['yes', 'no', 'pending'] as const

/* ─── Component ──────────────────────────────────────────── */
export default function ValuationCalculator() {
  const t = useTranslations('valuation')
  const tNav = useTranslations('nav')

  const [step, setStep]   = useState(1)
  const [result, setResult] = useState<ValuationResult | null>(null)

  const [form, setForm] = useState<FormData>({
    arr: '', mrr: '', growth: '', churn: '',
    nrr: '', margin: '', seniority: '',
    ip: '', stack: '',
  })

  const [email, setEmail]         = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [emailErr, setEmailErr]   = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)

  function set(k: keyof FormData, v: string) {
    setForm(p => ({ ...p, [k]: v }))
  }

  function canNext() {
    if (step === 1) return !!form.arr && !!form.growth && !!form.churn
    if (step === 2) return !!form.nrr && !!form.margin && !!form.seniority
    if (step === 3) return !!form.ip && !!form.stack
    return false
  }

  function handleCalculate() {
    setResult(calculate(form))
    setStep(4)
  }

  function restart() {
    setForm({ arr: '', mrr: '', growth: '', churn: '', nrr: '', margin: '', seniority: '', ip: '', stack: '' })
    setStep(1)
    setResult(null)
    setEmail('')
    setEmailSent(false)
    setEmailErr(false)
  }

  async function sendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!result) return
    setEmailLoading(true)
    setEmailErr(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _type: 'valuation-report',
          email,
          arr: form.arr,
          growth: form.growth,
          nrr: form.nrr,
          conservative_min: fmtEur(result.conservative.min),
          conservative_max: fmtEur(result.conservative.max),
          median_min: fmtEur(result.median.min),
          median_max: fmtEur(result.median.max),
          premium: result.isPremium,
        }),
      })
      if (res.ok) setEmailSent(true)
      else setEmailErr(true)
    } catch {
      setEmailErr(true)
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <main id="main" className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">

          {/* Left — progress + market context */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-8">

            {/* Steps */}
            {step < 4 && (
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map(n => (
                  <div
                    key={n}
                    className={`flex items-center gap-3 py-3 border-l-2 pl-4 transition-colors ${
                      step === n ? 'border-ag-apex' : step > n ? 'border-ag-apex/30' : 'border-ag-border'
                    }`}
                  >
                    <span className={`font-mono text-[10px] font-bold tracking-[0.1em] ${step >= n ? 'text-ag-apex' : 'text-ag-gray-light'}`}>
                      0{n}
                    </span>
                    <span className={`font-sans text-[12px] ${step === n ? 'text-ag-black font-semibold' : 'text-ag-gray-light'}`}>
                      {t(`step${n}.title` as Parameters<typeof t>[0])}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Market context card */}
            <div className="border border-ag-border p-6 flex flex-col gap-4">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">
                Marché SaaS B2B — 2026
              </p>
              {[
                { v: '3,1x ARR', l: 'Multiple médian marché' },
                { v: '6,9x ARR', l: 'Grade AAA — Top actifs' },
                { v: '2,8x ARR', l: 'Sans certification' },
                { v: '14,2 Md€', l: 'Volume M&A SaaS Europe' },
              ].map(({ v, l }) => (
                <div key={l} className="flex items-baseline justify-between gap-4 border-b border-ag-border pb-3 last:border-b-0 last:pb-0">
                  <span className="font-sans font-bold text-ag-black text-[15px]">{v}</span>
                  <span className="font-sans text-[11px] text-ag-gray-light text-right">{l}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form or result */}
          <div>

            {/* ── Step 1 ── */}
            {step === 1 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-ag-border pb-4">
                  <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em]">
                    {t('step1.title')}
                  </h2>
                  <span className="font-sans text-[11px] text-ag-gray-light">
                    {t('progress.step')} 1 {t('progress.of')} 3
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('step1.arr')} *</label>
                    <input
                      type="number" min="0" value={form.arr}
                      onChange={e => set('arr', e.target.value)}
                      placeholder={t('step1.arrPlaceholder')}
                      className={inputCls}
                    />
                    <p className="font-sans text-[10px] text-ag-gray-light mt-1">{t('step1.arrHint')}</p>
                  </div>
                  <div>
                    <label className={labelCls}>{t('step1.mrr')}</label>
                    <input
                      type="number" min="0" value={form.mrr}
                      onChange={e => set('mrr', e.target.value)}
                      placeholder={t('step1.mrrPlaceholder')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('step1.growth')} *</label>
                    <input
                      type="number" value={form.growth}
                      onChange={e => set('growth', e.target.value)}
                      placeholder={t('step1.growthPlaceholder')}
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>{t('step1.churn')} *</label>
                    <input
                      type="number" min="0" max="100" step="0.1" value={form.churn}
                      onChange={e => set('churn', e.target.value)}
                      placeholder={t('step1.churnPlaceholder')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <button
                  disabled={!canNext()}
                  onClick={() => setStep(2)}
                  className="self-start inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-ag-navy-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {t('next')} <ChevronRight size={13} />
                </button>
              </div>
            )}

            {/* ── Step 2 ── */}
            {step === 2 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-ag-border pb-4">
                  <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em]">
                    {t('step2.title')}
                  </h2>
                  <span className="font-sans text-[11px] text-ag-gray-light">
                    {t('progress.step')} 2 {t('progress.of')} 3
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('step2.nrr')} *</label>
                    <input
                      type="number" min="0" max="300" value={form.nrr}
                      onChange={e => set('nrr', e.target.value)}
                      placeholder={t('step2.nrrPlaceholder')}
                      className={inputCls}
                    />
                    <p className="font-sans text-[10px] text-ag-gray-light mt-1">{t('step2.nrrHint')}</p>
                  </div>
                  <div>
                    <label className={labelCls}>{t('step2.margin')} *</label>
                    <input
                      type="number" min="0" max="100" value={form.margin}
                      onChange={e => set('margin', e.target.value)}
                      placeholder={t('step2.marginPlaceholder')}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t('step2.seniority')} *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
                    {SENIORITY_KEYS.map(k => (
                      <button
                        key={k}
                        onClick={() => set('seniority', k)}
                        className={`border px-4 py-3 font-sans text-[12px] text-left transition-colors ${
                          form.seniority === k
                            ? 'border-ag-black bg-ag-black text-white'
                            : 'border-ag-border text-ag-black hover:border-ag-black'
                        }`}
                      >
                        {t(`step2.seniorityOptions.${k}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-5 py-4 hover:border-ag-black transition-colors"
                  >
                    <ChevronLeft size={13} /> {t('back')}
                  </button>
                  <button
                    disabled={!canNext()}
                    onClick={() => setStep(3)}
                    className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-ag-navy-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {t('next')} <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            )}

            {/* ── Step 3 ── */}
            {step === 3 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-ag-border pb-4">
                  <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em]">
                    {t('step3.title')}
                  </h2>
                  <span className="font-sans text-[11px] text-ag-gray-light">
                    {t('progress.step')} 3 {t('progress.of')} 3
                  </span>
                </div>

                <div>
                  <label className={labelCls}>{t('step3.ip')} *</label>
                  <div className="flex gap-4 mt-1 flex-wrap">
                    {IP_KEYS.map(k => (
                      <button
                        key={k}
                        onClick={() => set('ip', k)}
                        className={`border px-5 py-2.5 font-sans text-[12px] transition-colors ${
                          form.ip === k
                            ? 'border-ag-black bg-ag-black text-white'
                            : 'border-ag-border text-ag-black hover:border-ag-black'
                        }`}
                      >
                        {t(`step3.ip${k.charAt(0).toUpperCase() + k.slice(1)}` as Parameters<typeof t>[0])}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t('step3.stack')} *</label>
                  <select
                    value={form.stack}
                    onChange={e => set('stack', e.target.value)}
                    className={selectCls}
                  >
                    <option value="">{t('step3.stackPlaceholder')}</option>
                    {STACK_KEYS.map(k => (
                      <option key={k} value={k}>{t(`step3.stackOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-5 py-4 hover:border-ag-black transition-colors"
                  >
                    <ChevronLeft size={13} /> {t('back')}
                  </button>
                  <button
                    disabled={!canNext()}
                    onClick={handleCalculate}
                    className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-bold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <TrendingUp size={13} /> {t('calculate')}
                  </button>
                </div>
              </div>
            )}

            {/* ── Result ── */}
            {step === 4 && result && (
              <div className="flex flex-col gap-8">
                <div className="flex items-center justify-between border-b border-ag-border pb-4">
                  <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em]">
                    {t('result.title')}
                  </h2>
                  <button
                    onClick={restart}
                    className="inline-flex items-center gap-1.5 font-sans text-[11px] text-ag-gray-light hover:text-ag-black transition-colors"
                  >
                    <RotateCcw size={12} /> {t('result.restart')}
                  </button>
                </div>

                {/* Range cards */}
                <div className={`grid gap-4 ${result.isPremium ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>

                  {/* Conservative */}
                  <div className="border border-ag-border p-6 flex flex-col gap-3">
                    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">
                      {t('result.conservative.label')}
                    </p>
                    <p className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em]">
                      {fmtEur(result.conservative.min)} — {fmtEur(result.conservative.max)}
                    </p>
                    <p className="font-sans text-[10px] text-ag-gray-light">
                      {t('result.arrMultiple')} : {result.conservative.multiple}x
                    </p>
                    <p className="font-sans text-[11px] text-ag-gray mt-auto">{t('result.conservative.hint')}</p>
                  </div>

                  {/* Median */}
                  <div className="border-2 border-ag-navy p-6 flex flex-col gap-3 relative">
                    <span className="absolute top-3 right-3 font-sans font-bold text-[9px] uppercase tracking-[0.2em] text-ag-apex bg-ag-navy px-2 py-1">
                      2026
                    </span>
                    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-navy">
                      {t('result.median.label')}
                    </p>
                    <p className="font-sans font-bold text-ag-navy text-[22px] tracking-[-0.02em]">
                      {fmtEur(result.median.min)} — {fmtEur(result.median.max)}
                    </p>
                    <p className="font-sans text-[10px] text-ag-gray-light">
                      {t('result.arrMultiple')} : {result.median.multiple}x
                    </p>
                    <p className="font-sans text-[11px] text-ag-gray mt-auto">{t('result.median.hint')}</p>
                  </div>

                  {/* Premium — conditionnel */}
                  {result.isPremium && result.premium && (
                    <div className="border border-ag-apex p-6 flex flex-col gap-3 bg-ag-navy">
                      <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-apex">
                        {t('result.premium.label')}
                      </p>
                      <p className="font-sans font-bold text-white text-[22px] tracking-[-0.02em]">
                        {fmtEur(result.premium.min)} — {fmtEur(result.premium.max)}
                      </p>
                      <p className="font-sans text-[10px] text-white/50">
                        {t('result.arrMultiple')} : {result.premium.multiple}x
                      </p>
                      <p className="font-sans text-[11px] text-white/60 mt-auto">{t('result.premium.hint')}</p>
                    </div>
                  )}
                </div>

                {/* Basis */}
                <div className="flex flex-wrap gap-6 border-t border-ag-border pt-4">
                  {[
                    { l: 'ARR',     v: fmtEur(result.arr) },
                    { l: 'YoY',     v: `${form.growth}%` },
                    { l: 'Churn',   v: `${form.churn}%/mois` },
                    { l: 'NRR',     v: `${form.nrr}%` },
                    { l: 'Marge',   v: `${form.margin}%` },
                  ].map(({ l, v }) => (
                    <div key={l}>
                      <p className="font-sans text-[10px] text-ag-gray-light uppercase tracking-[0.18em]">{l}</p>
                      <p className="font-sans font-bold text-ag-black text-[13px]">{v}</p>
                    </div>
                  ))}
                </div>

                {/* Grade hint */}
                <div className="border border-ag-apex/30 bg-ag-off-white p-6 flex flex-col gap-4">
                  <p className="font-sans text-[13px] text-ag-black leading-relaxed">{t('result.gradeHint')}</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/grade/submit"
                      className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:bg-ag-navy-mid transition-colors"
                    >
                      {t('result.ctaGrade')} <ArrowUpRight size={12} />
                    </Link>
                    <Link
                      href="/auction/assessment-days"
                      className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:border-ag-black transition-colors"
                    >
                      {t('result.ctaAssessment')} <ArrowUpRight size={12} />
                    </Link>
                  </div>
                </div>

                {/* Email capture */}
                <div className="border border-ag-border p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail size={16} className="text-ag-gray-light" />
                    <p className="font-sans font-bold text-ag-black text-[14px]">{t('result.emailTitle')}</p>
                  </div>
                  <p className="font-sans text-[12px] text-ag-gray mb-5 leading-relaxed">{t('result.emailDesc')}</p>

                  {emailSent ? (
                    <div className="flex items-center gap-2 text-ag-apex">
                      <CheckCircle2 size={16} />
                      <span className="font-sans font-semibold text-[12px]">{t('result.emailSuccess')}</span>
                    </div>
                  ) : (
                    <form onSubmit={sendEmail} className="flex gap-3">
                      <input
                        type="email" required value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder={t('result.emailPlaceholder')}
                        className={`${inputCls} flex-1`}
                      />
                      <button
                        type="submit"
                        disabled={emailLoading}
                        className="shrink-0 bg-ag-black text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:bg-ag-navy transition-colors disabled:opacity-60"
                      >
                        {emailLoading ? t('result.emailSending') : t('result.emailSubmit')}
                      </button>
                    </form>
                  )}
                  {emailErr && (
                    <p className="font-sans text-[11px] text-red-500 mt-2">{t('result.emailError')}</p>
                  )}
                </div>

                {/* Disclaimer */}
                <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed border-t border-ag-border pt-4">
                  {t('result.disclaimer')}
                </p>
              </div>
            )}

          </div>
        </div>
      </section>

    </main>
  )
}
