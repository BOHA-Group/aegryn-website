'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

type PackKey = 'express' | 'standard' | 'premium'

const IP_KEYS = ['yes', 'no', 'pending'] as const
type IpKey = typeof IP_KEYS[number]

export default function GradeSubmitForm() {
  const t      = useTranslations('gradeSubmit')
  const tNav   = useTranslations('nav')
  const params = useSearchParams()

  const [pack,      setPack]      = useState<PackKey>('standard')
  const [ipChoice,  setIpChoice]  = useState<IpKey | ''>('')
  const [submitted, setSubmitted] = useState(false)
  const [error,     setError]     = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [cgvAgreed, setCgvAgreed] = useState(false)

  useEffect(() => {
    const suggested = params.get('pack') as PackKey | null
    if (suggested && ['express', 'standard', 'premium'].includes(suggested)) {
      setPack(suggested)
    }
  }, [params])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const data   = Object.fromEntries(new FormData(e.currentTarget))
    const locale = document.documentElement.lang || 'fr'
    const payload = {
      fullName:    data.fullName,
      email:       data.email,
      company:     data.company     || undefined,
      phone:       data.phone       || undefined,
      role:        data.role        || undefined,
      orgName:     data.orgName,
      orgSize:     data.orgSize     || undefined,
      orgSector:   data.orgSector   || undefined,
      orgCountry:  data.orgCountry  || undefined,
      orgWeb:      data.orgWeb      || undefined,
      ipFiled:     data.ipFiled     || undefined,
      objective:   data.objective   || undefined,
      message:     data.message     || undefined,
      pack,
      cgvAgreed:   true,
      locale,
    }
    try {
      const res = await fetch('/api/grade/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { setError(true); return }
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
  const selectCls = inputCls + ' appearance-none'
  const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

  const ipLabelMap: Record<IpKey, string> = {
    yes:     t('form.ipYes'),
    no:      t('form.ipNo'),
    pending: t('form.ipPending'),
  }

  const packs = (t.raw('packs') as { key: PackKey; name: string; price: string; target: string; duration: string; includes: string[] }[])

  return (
    <main className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
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
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16">

          {/* Left — CIFSO 5000 dimensions reminder */}
          <div className="flex flex-col gap-8">

            {/* CIFSO 5 dimensions */}
            <div className="border border-ag-border p-6 flex flex-col gap-4">
              <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.01em]">
                {t('sidebar.cifsoDimsTitle')}
              </p>
              <div className="flex flex-col gap-3">
                {(t.raw('sidebar.cifsoDims') as { code: string; name: string; color: string }[]).map(({ code, name, color }) => (
                  <div key={code} className="flex items-center gap-3">
                    <span
                      className="font-mono text-[12px] font-bold w-6 shrink-0"
                      style={{ color }}
                    >
                      {code}
                    </span>
                    <span className="font-sans text-[12px] text-ag-gray leading-snug">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Certification mandate note */}
            <div className="border border-ag-border p-5 bg-ag-off-white flex flex-col gap-3">
              <p className="font-sans font-bold text-ag-black text-[12px]">{t('sidebar.mandateTitle')}</p>
              <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{t('sidebar.mandateDesc')}</p>
            </div>

            <p className="font-sans text-[12px] text-ag-gray-light leading-relaxed border-t border-ag-border pt-6">
              {t('form.legalNote')}
            </p>
          </div>

          {/* Right */}
          {params.get('cancelled') === 'true' && (
            <div className="rounded-lg col-span-full mb-4 border border-amber-200 bg-amber-50 px-5 py-4 text-[13px] text-amber-800">
              {t('form.cancelledNote')}
            </div>
          )}
          {submitted ? (
            <div className="border border-ag-apex/30 bg-ag-off-white p-12 flex flex-col items-start gap-6">
              <CheckCircle2 size={32} className="text-ag-apex" />
              <h2 className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em]">
                {t('form.successTitle')}
              </h2>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-sm">
                {t('form.successDesc')}
              </p>
              <Link
                href="/grade"
                className="rounded-lg inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-6 py-3 hover:bg-ag-navy hover:text-white transition-colors"
              >
                {tNav('grade')} <ArrowUpRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Pack selector ── */}
              <div className="border border-ag-border p-6 flex flex-col gap-4">
                <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-black">
                  {t('form.packTitle')}
                </p>
                <div className="flex flex-col gap-3">
                  {packs.map(({ key, name, price, target, duration }) => (
                    <label
                      key={key}
                      className={`flex items-start gap-4 cursor-pointer border p-4 transition-colors ${
                        pack === key
                          ? 'border-ag-navy bg-ag-navy/5'
                          : 'border-ag-border hover:border-ag-black/30'
                      }`}
                    >
                      <input
                        type="radio" name="pack" value={key}
                        checked={pack === key}
                        onChange={() => setPack(key)}
                        className="mt-1 accent-ag-navy shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="font-sans font-bold text-ag-black text-[13px]">{name}</span>
                          <span className="rounded-lg font-mono text-[11px] font-bold px-2 py-0.5 bg-ag-navy/10 text-ag-navy">{price}</span>
                        </div>
                        <p className="font-sans text-[11px] text-ag-gray-light mt-0.5">{duration}</p>
                        <p className="font-sans text-[12px] text-ag-gray mt-1 leading-relaxed">{target}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Organisation ── */}
              <div className="border-t border-ag-border pt-6 space-y-5">
                <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.01em]">
                  {t('form.orgTitle')}
                </p>
                <div>
                  <label className={labelCls}>{t('form.orgName')}</label>
                  <input name="orgName" type="text" required className={inputCls} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('form.orgSize')}</label>
                    <select name="orgSize" required className={selectCls}>
                      <option value="">{t('form.orgSizePlaceholder')}</option>
                      {(['1_10','11_20','21_100','101_500','500plus'] as const).map(k => (
                        <option key={k} value={k}>{t(`form.orgSizeOptions.${k}`)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t('form.orgSector')}</label>
                    <input name="orgSector" type="text" placeholder={t('form.orgSectorPlaceholder')} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('form.orgCountry')}</label>
                    <input name="orgCountry" type="text" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('form.orgWeb')}</label>
                    <input name="orgWeb" type="url" className={inputCls} />
                  </div>
                </div>
              </div>

              {/* ── IP ── */}
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
                      <span className="font-sans text-[13px] text-ag-black">{ipLabelMap[v]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Objective ── */}
              <div>
                <label className={labelCls}>{t('form.objective')}</label>
                <select name="objective" required className={selectCls}>
                  <option value="">{t('form.objectivePlaceholder')}</option>
                  {(['financing','investment','succession','ma','annual_report','other'] as const).map(k => (
                    <option key={k} value={k}>{t(`form.objectiveOptions.${k}`)}</option>
                  ))}
                </select>
              </div>

              {/* ── Contact ── */}
              <div className="border-t border-ag-border pt-6 space-y-5">
                <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.01em]">
                  {t('form.contactTitle')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('form.fullName')}</label>
                    <input name="fullName" type="text" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('form.role')}</label>
                    <input name="role" type="text" placeholder={t('form.rolePlaceholder')} className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('form.email')}</label>
                    <input name="email" type="email" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('form.phone')}</label>
                    <input name="phone" type="tel" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t('form.message')}</label>
                  <textarea name="message" rows={4} className={`${inputCls} resize-none`} />
                </div>
              </div>

              {/* ── CGV + NDA acceptance ── */}
              <div className="border border-ag-border p-5 bg-ag-off-white flex flex-col gap-4">
                <p className="font-sans font-bold text-ag-black text-[12px]">{t('form.cgvTitle')}</p>
                <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                  {t('form.cgvDesc')}
                </p>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cgvAgreed}
                    onChange={e => setCgvAgreed(e.target.checked)}
                    required
                    className="mt-0.5 accent-ag-navy shrink-0 w-4 h-4"
                  />
                  <span className="font-sans text-[13px] text-ag-black leading-snug">
                    {t('form.cgvCheckbox')}
                  </span>
                </label>
              </div>

              {error && (
                <p className="font-sans text-[12px] text-red-600">{t('form.errorMsg')}</p>
              )}

              <button
                type="submit"
                disabled={loading || !cgvAgreed}
                className="rounded-lg inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-8 py-4 hover:bg-ag-navy-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
