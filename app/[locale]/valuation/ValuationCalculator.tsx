'use client'

import { useState }        from 'react'
import { useTranslations } from 'next-intl'
import Link                from 'next/link'
import {
  ArrowUpRight, ChevronRight, ChevronLeft,
  RotateCcw, CheckCircle2, Mail,
} from 'lucide-react'
import {
  type FinanceData, type CodeData, type IPData, type SecurityData,
  type ValuationResult,
  scoreFinance, scoreCode, scoreIP, scoreSecurity,
  estimateGrade, runValuation, fmtEur, preRevenueRange,
} from '@/lib/valuationEngine'

/* ─── Style constants ────────────────────────────────────── */
const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const selectCls = inputCls + ' appearance-none'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'
const hintCls   = 'font-sans text-[10px] text-ag-gray-light mt-1 leading-relaxed'

function RadioGroup<T extends string>({
  options, value, onChange,
}: {
  options: { key: T; label: string }[]
  value: T | ''
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={`border px-4 py-2 font-sans text-[12px] transition-colors whitespace-nowrap ${
            value === key
              ? 'border-ag-black bg-ag-black text-white'
              : 'border-ag-border text-ag-black hover:border-ag-black'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

/* ─── Score bar ──────────────────────────────────────────── */
function ScoreBar({ score, max = 25 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100)
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-1.5 bg-ag-border">
        <div
          className="h-full bg-ag-apex transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-sans font-semibold text-[11px] text-ag-black w-12 text-right shrink-0">
        {score} / {max}
      </span>
    </div>
  )
}

/* ─── Grade badge ────────────────────────────────────────── */
function GradeBadge({ grade, colorClass }: { grade: string; colorClass: string }) {
  return (
    <div className={`inline-flex items-center justify-center w-24 h-24 border-2 ${
      grade === '★' ? 'border-ag-apex' : 'border-current'
    } ${colorClass}`}>
      <span className="font-sans font-bold text-[28px] tracking-tight leading-none">
        {grade === 'NG' ? '—' : grade === '★' ? '★' : `AEG\n${grade}`}
      </span>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function ValuationCalculator() {
  const t    = useTranslations('valuation')
  const tNav = useTranslations('nav')

  const STEPS = ['finance', 'code', 'ip', 'security'] as const
  type Step = typeof STEPS[number] | 'result'

  const [step, setStep]     = useState<Step>('finance')
  const [result, setResult] = useState<ValuationResult | null>(null)

  /* ── Form state ── */
  const [finance, setFinance] = useState<Partial<FinanceData>>({})
  const [code,    setCode]    = useState<Partial<CodeData>>({})
  const [ip,      setIp]      = useState<Partial<IPData>>({})
  const [security, setSecurity] = useState<Partial<SecurityData>>({})

  /* ── Email ── */
  const [email, setEmail]           = useState('')
  const [emailSent, setEmailSent]   = useState(false)
  const [emailErr,  setEmailErr]    = useState(false)
  const [emailLoading, setEmailLoading] = useState(false)
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null)

  function f<T>(setter: React.Dispatch<React.SetStateAction<Partial<T>>>, key: keyof T, val: unknown) {
    setter(p => ({ ...p, [key]: val }))
  }

  /* ── Validation ── */
  function canAdvance(): boolean {
    if (step === 'finance')  return !!(finance.arr !== undefined && finance.growth !== undefined && finance.churn !== undefined && finance.nrr !== undefined && finance.margin !== undefined && finance.seniority && finance.arrAudited)
    if (step === 'code')     return !!(code.tests && code.docs && code.cicd && code.techDebt && code.deps)
    if (step === 'ip')       return !!(ip.trademark && ip.copyright && ip.opensource && ip.apiContracts)
    if (step === 'security') return !!(security.pentest && security.gdpr && security.mfa && security.secrets)
    return false
  }

  function advance() {
    const idx = STEPS.indexOf(step as typeof STEPS[number])
    if (idx < STEPS.length - 1) {
      setStep(STEPS[idx + 1])
    } else {
      const input = {
        finance:  finance as FinanceData,
        code:     code    as CodeData,
        ip:       ip      as IPData,
        security: security as SecurityData,
      }
      setResult(runValuation(input))
      setStep('result')
    }
  }

  function back() {
    const idx = STEPS.indexOf(step as typeof STEPS[number])
    if (idx > 0) setStep(STEPS[idx - 1])
  }

  function restart() {
    setStep('finance')
    setFinance({})
    setCode({})
    setIp({})
    setSecurity({})
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
      const res = await fetch('/api/valuation/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          estimated_grade:  result.grade.grade,
          score_total:      result.grade.totalScore,
          score_breakdown:  {
            finance:  result.scores.finance,
            code:     result.scores.code,
            ip:       result.scores.ip,
            security: result.scores.security,
          },
          arr:          finance.arr,
          growth_yoy:   finance.growth,
          churn_monthly: finance.churn,
          nrr:          finance.nrr,
          gross_margin: finance.margin,
          seniority:    finance.seniority,
          arr_audited:  finance.arrAudited,
          valuation_low:    result.range?.low,
          valuation_high:   result.range?.high,
          valuation_median: result.range?.median,
          pre_revenue:      result.preRevenue,
          locale:      document.documentElement.lang || 'fr',
          source_url:  window.location.href,
        }),
      })
      if (res.ok) {
        setEmailSent(true)
        const json = await res.json().catch(() => ({}))
        if (json?.id) setSavedLeadId(json.id)
      } else setEmailErr(true)
    } catch { setEmailErr(true) }
    finally  { setEmailLoading(false) }
  }

  const stepIdx = STEPS.indexOf(step as typeof STEPS[number])

  /* ─── Market context sidebar ─────────────────────────── */
  const marketItems = t.raw('marketContext.items') as { value: string; label: string }[]

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

      {/* Calculator area */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">

          {/* ── Sidebar ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-8">

            {/* Progress */}
            {step !== 'result' && (
              <div className="flex flex-col gap-1">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={`flex items-center gap-3 py-3 pl-4 border-l-2 transition-colors ${
                      step === s         ? 'border-ag-apex'
                      : stepIdx > i      ? 'border-ag-apex/40'
                      :                    'border-ag-border'
                    }`}
                  >
                    <span className={`font-mono text-[9px] font-bold tracking-[0.12em] shrink-0 ${
                      i <= stepIdx ? 'text-ag-apex' : 'text-ag-gray-light'
                    }`}>
                      0{i + 1}
                    </span>
                    <span className={`font-sans text-[12px] ${
                      step === s ? 'text-ag-black font-semibold' : 'text-ag-gray-light'
                    }`}>
                      {t(`steps.${s}`)}
                    </span>
                    {stepIdx > i && (
                      <CheckCircle2 size={11} className="text-ag-apex ml-auto shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Market context */}
            <div className="border border-ag-border p-5 flex flex-col gap-3">
              <p className="font-sans font-semibold text-[9px] uppercase tracking-[0.22em] text-ag-gray-light">
                {t('marketContext.label')}
              </p>
              {marketItems.map(({ value, label }) => (
                <div key={label} className="flex items-baseline justify-between gap-3 border-b border-ag-border pb-2.5 last:border-b-0 last:pb-0">
                  <span className="font-sans font-bold text-ag-black text-[14px]">{value}</span>
                  <span className="font-sans text-[10px] text-ag-gray-light text-right leading-tight">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Form panels ── */}
          <div>

            {/* STEP — FINANCE */}
            {step === 'finance' && (
              <div className="flex flex-col gap-6">
                <StepHeader title={t('finance.title')} subtitle={t('finance.subtitle')} step={1} total={4} t={t} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('finance.arr')} *</label>
                    <input type="number" min="0"
                      value={finance.arr ?? ''}
                      onChange={e => f(setFinance, 'arr', parseFloat(e.target.value) || 0)}
                      placeholder={t('finance.arrPlaceholder')} className={inputCls} />
                    <p className={hintCls}>{t('finance.arrHint')}</p>
                  </div>
                  <div>
                    <label className={labelCls}>{t('finance.growth')} *</label>
                    <input type="number"
                      value={finance.growth ?? ''}
                      onChange={e => f(setFinance, 'growth', parseFloat(e.target.value) || 0)}
                      placeholder={t('finance.growthPlaceholder')} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('finance.churn')} *</label>
                    <input type="number" min="0" max="100" step="0.1"
                      value={finance.churn ?? ''}
                      onChange={e => f(setFinance, 'churn', parseFloat(e.target.value) || 0)}
                      placeholder={t('finance.churnPlaceholder')} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('finance.nrr')} *</label>
                    <input type="number" min="0" max="300"
                      value={finance.nrr ?? ''}
                      onChange={e => f(setFinance, 'nrr', parseFloat(e.target.value) || 0)}
                      placeholder={t('finance.nrrPlaceholder')} className={inputCls} />
                    <p className={hintCls}>{t('finance.nrrHint')}</p>
                  </div>
                  <div>
                    <label className={labelCls}>{t('finance.margin')} *</label>
                    <input type="number" min="0" max="100"
                      value={finance.margin ?? ''}
                      onChange={e => f(setFinance, 'margin', parseFloat(e.target.value) || 0)}
                      placeholder={t('finance.marginPlaceholder')} className={inputCls} />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>{t('finance.seniority')} *</label>
                  <RadioGroup
                    options={(['under1','one_to_three','above3'] as const).map(k => ({ key: k, label: t(`finance.seniorityOptions.${k}`) }))}
                    value={finance.seniority ?? ''}
                    onChange={v => f(setFinance, 'seniority', v)}
                  />
                </div>

                <div>
                  <label className={labelCls}>{t('finance.arrAudited')} *</label>
                  <RadioGroup
                    options={(['yes','no','not_yet'] as const).map(k => ({ key: k, label: t(`finance.arrAuditedOptions.${k}`) }))}
                    value={finance.arrAudited ?? ''}
                    onChange={v => f(setFinance, 'arrAudited', v)}
                  />
                </div>

                <NavButtons canAdvance={canAdvance()} onNext={advance} showBack={false} onBack={back} nextLabel={t('next')} backLabel={t('back')} />
              </div>
            )}

            {/* STEP — CODE */}
            {step === 'code' && (
              <div className="flex flex-col gap-6">
                <StepHeader title={t('code.title')} subtitle={t('code.subtitle')} step={2} total={4} t={t} />

                {([ 
                  { key: 'tests',    label: t('code.tests'),    opts: (['full','partial','none'] as const).map(k => ({ key: k, label: t(`code.testsOptions.${k}`) })) },
                  { key: 'docs',     label: t('code.docs'),     opts: (['full','partial','none'] as const).map(k => ({ key: k, label: t(`code.docsOptions.${k}`) })) },
                  { key: 'cicd',     label: t('code.cicd'),     opts: (['yes','no'] as const).map(k => ({ key: k, label: t(`code.cicdOptions.${k}`) })) },
                  { key: 'techDebt', label: t('code.techDebt'), opts: (['documented','known','unknown'] as const).map(k => ({ key: k, label: t(`code.techDebtOptions.${k}`) })) },
                  { key: 'deps',     label: t('code.deps'),     opts: (['under1y','one_to_two','above2y','unknown'] as const).map(k => ({ key: k, label: t(`code.depsOptions.${k}`) })) },
                ] as { key: keyof CodeData; label: string; opts: {key: string; label: string}[] }[]).map(({ key, label, opts }) => (
                  <div key={key as string}>
                    <label className={labelCls}>{label} *</label>
                    <RadioGroup
                      options={opts as {key: never; label: string}[]}
                      value={(code[key] ?? '') as never}
                      onChange={(v) => f(setCode, key, v)}
                    />
                  </div>
                ))}

                <div>
                  <label className={labelCls}>{t('code.stack')}</label>
                  <input type="text"
                    value={code.stack ?? ''}
                    onChange={e => f(setCode, 'stack', e.target.value)}
                    placeholder={t('code.stackPlaceholder')} className={inputCls} />
                </div>

                <NavButtons canAdvance={canAdvance()} onNext={advance} showBack onBack={back} nextLabel={t('next')} backLabel={t('back')} />
              </div>
            )}

            {/* STEP — IP */}
            {step === 'ip' && (
              <div className="flex flex-col gap-6">
                <StepHeader title={t('ip.title')} subtitle={t('ip.subtitle')} step={3} total={4} t={t} />

                {([
                  { key: 'trademark',    label: t('ip.trademark'),    opts: (['yes','pending','no'] as const).map(k => ({ key: k, label: t(`ip.trademarkOptions.${k}`) })) },
                  { key: 'copyright',    label: t('ip.copyright'),    opts: (['full','partial','none'] as const).map(k => ({ key: k, label: t(`ip.copyrightOptions.${k}`) })) },
                  { key: 'opensource',   label: t('ip.opensource'),   opts: (['clean','gpl','unaudited'] as const).map(k => ({ key: k, label: t(`ip.opensourceOptions.${k}`) })) },
                  { key: 'apiContracts', label: t('ip.apiContracts'), opts: (['yes','partial','no'] as const).map(k => ({ key: k, label: t(`ip.apiContractsOptions.${k}`) })) },
                ] as { key: keyof IPData; label: string; opts: {key: string; label: string}[] }[]).map(({ key, label, opts }) => (
                  <div key={key as string}>
                    <label className={labelCls}>{label} *</label>
                    <RadioGroup
                      options={opts as {key: never; label: string}[]}
                      value={(ip[key] ?? '') as never}
                      onChange={(v) => f(setIp, key, v)}
                    />
                  </div>
                ))}

                <NavButtons canAdvance={canAdvance()} onNext={advance} showBack onBack={back} nextLabel={t('next')} backLabel={t('back')} />
              </div>
            )}

            {/* STEP — SECURITY */}
            {step === 'security' && (
              <div className="flex flex-col gap-6">
                <StepHeader title={t('security.title')} subtitle={t('security.subtitle')} step={4} total={4} t={t} />

                {([
                  { key: 'pentest', label: t('security.pentest'), opts: (['under6m','six_to_12m','above12m','never'] as const).map(k => ({ key: k, label: t(`security.pentestOptions.${k}`) })) },
                  { key: 'gdpr',    label: t('security.gdpr'),    opts: (['full','partial','none'] as const).map(k => ({ key: k, label: t(`security.gdprOptions.${k}`) })) },
                  { key: 'mfa',     label: t('security.mfa'),     opts: (['yes','no'] as const).map(k => ({ key: k, label: t(`security.mfaOptions.${k}`) })) },
                  { key: 'secrets', label: t('security.secrets'), opts: (['vault','partial','none'] as const).map(k => ({ key: k, label: t(`security.secretsOptions.${k}`) })) },
                ] as { key: keyof SecurityData; label: string; opts: {key: string; label: string}[] }[]).map(({ key, label, opts }) => (
                  <div key={key as string}>
                    <label className={labelCls}>{label} *</label>
                    <RadioGroup
                      options={opts as {key: never; label: string}[]}
                      value={(security[key] ?? '') as never}
                      onChange={(v) => f(setSecurity, key, v)}
                    />
                  </div>
                ))}

                <NavButtons canAdvance={canAdvance()} onNext={advance} showBack onBack={back} nextLabel={t('calculate')} backLabel={t('back')} isLast />
              </div>
            )}

            {/* STEP — RESULT */}
            {step === 'result' && result && (
              <ResultPanel result={result} finance={finance} t={t}
                email={email} setEmail={setEmail}
                emailSent={emailSent} emailErr={emailErr} emailLoading={emailLoading}
                onEmailSubmit={sendEmail} onRestart={restart}
                savedLeadId={savedLeadId}
              />
            )}

          </div>
        </div>
      </section>
    </main>
  )
}

/* ─── Sub-components ─────────────────────────────────────── */

function StepHeader({ title, subtitle, step, total, t }: {
  title: string; subtitle: string; step: number; total: number
  t: ReturnType<typeof useTranslations>
}) {
  return (
    <div className="border-b border-ag-border pb-4">
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">{title}</h2>
        <span className="font-sans text-[11px] text-ag-gray-light">
          {t('progress.step')} {step} {t('progress.of')} {total}
        </span>
      </div>
      <p className="font-sans text-[11px] text-ag-apex font-semibold uppercase tracking-[0.18em]">{subtitle}</p>
    </div>
  )
}

function NavButtons({ canAdvance, onNext, showBack, onBack, nextLabel, backLabel, isLast }: {
  canAdvance: boolean; onNext: () => void; showBack: boolean; onBack: () => void
  nextLabel: string; backLabel: string; isLast?: boolean
}) {
  return (
    <div className="flex gap-3 pt-2">
      {showBack && (
        <button type="button" onClick={onBack}
          className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-5 py-3.5 hover:border-ag-black transition-colors">
          <ChevronLeft size={12} /> {backLabel}
        </button>
      )}
      <button type="button" disabled={!canAdvance} onClick={onNext}
        className={`inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-3.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
          isLast
            ? 'bg-ag-apex text-ag-navy hover:bg-white'
            : 'bg-ag-navy text-white hover:bg-ag-navy-mid'
        }`}>
        {nextLabel} <ChevronRight size={12} />
      </button>
    </div>
  )
}

function ResultPanel({ result, finance, t, email, setEmail, emailSent, emailErr, emailLoading, onEmailSubmit, onRestart, savedLeadId }: {
  result: ValuationResult
  finance: Partial<FinanceData>
  t: ReturnType<typeof useTranslations>
  email: string; setEmail: (v: string) => void
  emailSent: boolean; emailErr: boolean; emailLoading: boolean
  onEmailSubmit: (e: React.FormEvent) => void
  onRestart: () => void
  savedLeadId?: string | null
}) {
  const { grade, scores, range, preRevenue, preRevenueScore, weakestDim, strongestDim } = result
  const prRange = preRevenue ? preRevenueRange(preRevenueScore) : null

  const dimKeys = ['finance', 'code', 'ip', 'security'] as const
  const dimLabels: Record<string, string> = {
    finance: t('steps.finance'), code: t('steps.code'),
    ip: t('steps.ip'), security: t('steps.security'),
  }

  return (
    <div className="flex flex-col gap-8">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-ag-border pb-4">
        <h2 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">
          {t('result.gradeTitle')}
        </h2>
        <button onClick={onRestart} className="inline-flex items-center gap-1.5 font-sans text-[11px] text-ag-gray-light hover:text-ag-black transition-colors">
          <RotateCcw size={12} /> {t('result.restart')}
        </button>
      </div>

      {/* Grade + score hero */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 p-8 border border-ag-border bg-ag-off-white">
        <div className="flex items-center justify-center w-28 h-28 border-2 border-current shrink-0 flex-col gap-0.5" style={{ color: grade.grade === '★' ? '#5ADDA4' : grade.grade === 'AAA' ? '#2563eb' : grade.grade === 'AA' ? '#16a34a' : grade.grade === 'A' ? '#ca8a04' : '#6b7280' }}>
          {grade.grade === '★' ? (
            <span className="font-sans font-bold text-[36px] leading-none">★</span>
          ) : grade.grade === 'NG' ? (
            <span className="font-sans font-bold text-[18px] leading-none text-ag-gray-light">N/G</span>
          ) : (
            <>
              <span className="font-sans font-semibold text-[9px] tracking-[0.2em] opacity-60">AEG</span>
              <span className="font-sans font-bold text-[28px] leading-none">{grade.grade}</span>
            </>
          )}
          {grade.grade !== 'NG' && (
            <span className="font-sans text-[8px] tracking-[0.1em] opacity-50 uppercase mt-0.5">{t('result.estimated')}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <p className="font-sans text-[13px] text-ag-gray-light">
            {t('result.scoreLabel')} : <span className="font-bold text-ag-black text-[22px] tracking-tight">{scores.total}</span>
            <span className="text-[14px] text-ag-gray-light"> {t('result.outOf')}</span>
          </p>
          {!preRevenue && range && (
            <>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
                {t('result.rangeTitle')}
              </p>
              <p className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] leading-tight">
                {fmtEur(range.low)} — {fmtEur(range.high)}
              </p>
              <p className="font-sans text-[11px] text-ag-gray-light">
                {t('result.medianLabel')} : {fmtEur(range.median)} · {t('result.multipleLabel')} : {grade.multLow}x – {grade.multHigh}x
              </p>
              {finance.arr !== undefined && (
                <p className="font-sans text-[11px] text-ag-gray-light">
                  {t('result.basisLabel')} {fmtEur(finance.arr)}
                </p>
              )}
            </>
          )}
          {preRevenue && prRange && (
            <>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{t('result.preRevenueTitle')}</p>
              <p className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em]">
                {fmtEur(prRange.low)} — {fmtEur(prRange.high)}
              </p>
              <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed">{t('result.preRevenueDesc')}</p>
            </>
          )}
        </div>
      </div>

      {/* Dimension breakdown */}
      <div className="border border-ag-border p-6 flex flex-col gap-5">
        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">
          {t('result.dimBreakdown')}
        </p>
        {dimKeys.map(dim => (
          <div key={dim} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-sans font-semibold text-[12px] text-ag-black">{dimLabels[dim]}</span>
              <span className="font-sans text-[11px] text-ag-gray-light">{t('result.dimMax')}</span>
            </div>
            <ScoreBar score={scores[dim as keyof typeof scores] as number} />
          </div>
        ))}
      </div>

      {/* Diagnostic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="border border-red-100 bg-red-50 p-5 flex flex-col gap-2">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-red-500">
            {t('result.weakTitle')}
          </p>
          <p className="font-sans text-[12px] text-ag-black leading-relaxed">
            {t(`result.weakMessages.${weakestDim}`)}
          </p>
        </div>
        <div className="border border-emerald-100 bg-emerald-50 p-5 flex flex-col gap-2">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-emerald-600">
            {t('result.strongTitle')}
          </p>
          <p className="font-sans text-[12px] text-ag-black leading-relaxed">
            {t(`result.strongMessages.${strongestDim}`)}
          </p>
        </div>
      </div>

      {/* Special notes */}
      {preRevenue && (
        <div className="border border-ag-apex/30 bg-ag-off-white p-5">
          <p className="font-sans text-[12px] text-ag-black leading-relaxed">{t('result.preRevenueNote')}</p>
        </div>
      )}
      {grade.grade === 'NG' && (
        <div className="border border-ag-border p-5">
          <p className="font-sans text-[12px] text-ag-black leading-relaxed">{t('result.ngNote')}</p>
        </div>
      )}

      {/* CTAs */}
      {(() => {
        const gradeKey = result.grade.grade
        const suggested = (gradeKey === 'NG' || gradeKey === 'B')
          ? 'review_internal'
          : gradeKey === 'A'
          ? 'review_partner'
          : 'full_certification'
        const leadParam = savedLeadId ? `&source_lead=${savedLeadId}` : ''
        const submitHref = `/grade/submit?suggested=${suggested}${leadParam}`
        return (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href={submitHref}
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors">
              {t('result.ctaGrade')} <ArrowUpRight size={12} />
            </Link>
            <Link href="/auction/assessment-days"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3.5 hover:border-ag-black transition-colors">
              {t('result.ctaAssessment')} <ArrowUpRight size={12} />
            </Link>
          </div>
        )
      })()}

      {/* Email capture */}
      <div className="border border-ag-border p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <Mail size={15} className="text-ag-gray-light shrink-0" />
          <p className="font-sans font-bold text-ag-black text-[14px]">{t('result.emailTitle')}</p>
        </div>
        <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{t('result.emailDesc')}</p>
        {emailSent ? (
          <div className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 size={15} />
            <span className="font-sans font-semibold text-[12px]">{t('result.emailSuccess')}</span>
          </div>
        ) : (
          <form onSubmit={onEmailSubmit} className="flex gap-3">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder={t('result.emailPlaceholder')}
              className={`${inputCls} flex-1`} />
            <button type="submit" disabled={emailLoading}
              className="shrink-0 bg-ag-black text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:bg-ag-navy transition-colors disabled:opacity-60">
              {emailLoading ? t('result.emailSending') : t('result.emailSubmit')}
            </button>
          </form>
        )}
        {emailErr && <p className="font-sans text-[11px] text-red-500">{t('result.emailError')}</p>}
      </div>

      {/* Disclaimer visible — non officiel */}
      <div className="border border-amber-200 bg-amber-50 p-5 flex flex-col gap-2">
        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-amber-700">
          {t('result.disclaimerLabel')}
        </p>
        <p className="font-sans text-[12px] text-ag-black leading-relaxed">
          {t('result.disclaimer')}
        </p>
        <Link href="/grade/submit" className="inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] text-amber-700 underline underline-offset-2 hover:text-ag-black transition-colors mt-1">
          {t('result.disclaimerCta')} <ArrowUpRight size={11} />
        </Link>
      </div>
    </div>
  )
}
