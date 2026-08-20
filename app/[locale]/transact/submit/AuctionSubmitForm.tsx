'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, CheckCircle2, ChevronLeft, Scale } from 'lucide-react'

type IpKey = 'yes' | 'no' | 'pending'
const IP_KEYS: IpKey[] = ['yes', 'no', 'pending']

export default function TransactionSubmitForm() {
  const t    = useTranslations('transactionSubmit')
  const tNav = useTranslations('nav')

  const [ipChoice,    setIpChoice]    = useState<IpKey | ''>('')
  const [swissAccept, setSwissAccept] = useState(false)
  const [submitted,   setSubmitted]   = useState(false)
  const [error,       setError]       = useState(false)
  const [loading,     setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const data   = Object.fromEntries(new FormData(e.currentTarget))
    const locale = document.documentElement.lang || 'fr'
    const payload = {
      fullName:       data.fullName,
      email:          data.email,
      company:        data.company        || undefined,
      country:        data.country        || undefined,
      assetName:      data.assetName,
      assetType:      data.assetType,
      assetUrl:       data.assetUrl       || undefined,
      techStack:      data.techStack      || undefined,
      devStage:       data.devStage,
      arr:            data.arr            || undefined,
      askPrice:       data.askPrice       || undefined,
      ipFiled:        ipChoice            || undefined,
      motivation:     data.motivation,
      timeline:       data.timeline,
      targetSession:  data.targetSession  || undefined,
      swissLawAccept: 'true',
      message:        data.message        || undefined,
      locale,
    }
    try {
      const res = await fetch('/api/transact/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) setSubmitted(true)
      else        setError(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
  const selectCls = inputCls + ' appearance-none'
  const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'
  const sectionCls = 'font-sans font-bold text-ag-black text-[12px] uppercase tracking-[0.18em] border-t border-ag-border pt-6 pb-2'

  const steps = t.raw('steps') as { num: string; title: string; desc: string }[]

  return (
    <main className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/transact"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-ag-apex transition-colors mb-10"
          >
            <ChevronLeft size={11} /> {tNav('transact')}
          </Link>
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl mb-8">
            {t('hero.desc')}
          </p>
          {/* Swiss law badge */}
          <div className="inline-flex items-start gap-3 border border-ag-apex/30 bg-ag-apex/10 px-5 py-3 max-w-lg">
            <Scale size={13} className="text-ag-apex shrink-0 mt-0.5" />
            <p className="font-sans text-[12px] text-white/75 leading-relaxed">
              {t('swissNote')}
            </p>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="py-12 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ag-border border border-ag-border">
            {steps.map(({ num, title, desc }) => (
              <div key={num} className="bg-ag-white p-6 flex flex-col gap-2">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex">{num}</span>
                <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">{title}</p>
                <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-4xl mx-auto">
          {submitted ? (
            <div className="border border-ag-apex/30 bg-ag-off-white p-16 flex flex-col items-start gap-6">
              <CheckCircle2 size={32} className="text-ag-apex" />
              <h2 className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em]">
                {t('form.successTitle')}
              </h2>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-md">
                {t('form.successDesc')}
              </p>
              <Link
                href="/transact"
                className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-6 py-3 hover:bg-ag-navy hover:text-white transition-colors"
              >
                {tNav('transact')} <ArrowUpRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Asset ── */}
              <p className={sectionCls}>{t('form.sectionAsset')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.assetName')}</label>
                  <input name="assetName" type="text" required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.assetType')}</label>
                  <select name="assetType" required className={selectCls}>
                    <option value="">{t('form.assetTypePlaceholder')}</option>
                    {(['saas_b2b','saas_b2c','marketplace','mobile','protocol','ip','other'] as const).map(k => (
                      <option key={k} value={k}>{t(`form.assetTypeOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.assetUrl')}</label>
                  <input name="assetUrl" type="url" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.techStack')}</label>
                  <input name="techStack" type="text" placeholder={t('form.techStackPlaceholder')} className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>{t('form.devStage')}</label>
                <select name="devStage" required className={selectCls}>
                  <option value="">{t('form.devStagePlaceholder')}</option>
                  {(['prod_revenue','prod_no_revenue','beta','prototype','ip_only'] as const).map(k => (
                    <option key={k} value={k}>{t(`form.devStageOptions.${k}`)}</option>
                  ))}
                </select>
              </div>

              {/* ── Financial ── */}
              <p className={sectionCls}>{t('form.sectionFinancial')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.arr')}</label>
                  <input name="arr" type="number" min="0" placeholder={t('form.arrPlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.askPrice')}</label>
                  <input name="askPrice" type="number" min="0" placeholder={t('form.askPricePlaceholder')} className={inputCls} />
                </div>
              </div>

              <div>
                <p className={labelCls}>{t('form.ipFiled')}</p>
                <div className="flex gap-6 mt-1">
                  {IP_KEYS.map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio" name="ipFiled" value={v}
                        checked={ipChoice === v}
                        onChange={() => setIpChoice(v)}
                        className="accent-ag-navy"
                      />
                      <span className="font-sans text-[13px] text-ag-black">
                        {t(`form.ip${v.charAt(0).toUpperCase() + v.slice(1)}` as 'form.ipYes')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Transaction context ── */}
              <p className={sectionCls}>{t('form.sectionTransaction')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className={labelCls}>{t('form.motivation')}</label>
                  <select name="motivation" required className={selectCls}>
                    <option value="">{t('form.motivationPlaceholder')}</option>
                    {(['full_exit','partial_exit','liquidity','other'] as const).map(k => (
                      <option key={k} value={k}>{t(`form.motivationOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t('form.timeline')}</label>
                  <select name="timeline" required className={selectCls}>
                    <option value="">{t('form.timelinePlaceholder')}</option>
                    {(['urgent','standard','long'] as const).map(k => (
                      <option key={k} value={k}>{t(`form.timelineOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t('form.targetSession')}</label>
                  <select name="targetSession" className={selectCls}>
                    <option value="">{t('form.targetSessionPlaceholder')}</option>
                    {(['q3_2026','q4_2026','q1_2027','flexible'] as const).map(k => (
                      <option key={k} value={k}>{t(`form.targetSessionOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* ── Contact ── */}
              <p className={sectionCls}>{t('form.sectionContact')}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.fullName')}</label>
                  <input name="fullName" type="text" required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.email')}</label>
                  <input name="email" type="email" required className={inputCls} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.country')}</label>
                  <input name="country" type="text" placeholder={t('form.countryPlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.company')}</label>
                  <input name="company" type="text" className={inputCls} />
                </div>
              </div>

              <div>
                <label className={labelCls}>{t('form.message')}</label>
                <textarea name="message" rows={4} className={`${inputCls} resize-none`} />
              </div>

              {/* ── Swiss law acceptance ── */}
              <div className="border border-ag-apex/25 bg-ag-apex/5 px-5 py-4 flex items-start gap-3">
                <input
                  id="swissLaw"
                  type="checkbox"
                  required
                  checked={swissAccept}
                  onChange={e => setSwissAccept(e.target.checked)}
                  className="mt-1 accent-ag-navy shrink-0"
                />
                <label htmlFor="swissLaw" className="font-sans text-[12px] text-ag-black leading-relaxed cursor-pointer">
                  {t('form.swissLawLabel')}
                </label>
              </div>

              {error && (
                <p className="font-sans text-[12px] text-red-600">{t('form.errorMsg')}</p>
              )}

              <button
                type="submit"
                disabled={loading || !swissAccept}
                className="inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-8 py-4 hover:bg-ag-navy-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('form.submitting') : t('form.submit')}
                {!loading && <ArrowUpRight size={13} />}
              </button>

            </form>
          )}
        </div>
      </section>

    </main>
  )
}
