'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, ChevronLeft, ChevronDown, MapPin } from 'lucide-react'

const FORMAT_KEYS = ['physical', 'video'] as const
const ARR_KEYS    = ['pre', 'under100', '100to500', '500to2m', 'above2m'] as const
const CITY_KEYS   = ['zurich', 'paris', 'amsterdam', 'munich'] as const

export default function AssessmentDaysPage() {
  const t    = useTranslations('assessmentDays')
  const tNav = useTranslations('nav')

  const [format, setFormat]       = useState<'physical' | 'video' | ''>('')
  const [openFaq, setOpenFaq]     = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState(false)
  const [loading, setLoading]     = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const data = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, _type: 'assessment-day' }),
      })
      if (res.ok) setSubmitted(true)
      else setError(true)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
  const selectCls = inputCls + ' appearance-none'
  const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

  const faqItems = t.raw('faq.items') as Array<{q:string;a:string}>
  const whatItems = t.raw('what.items') as Array<{title:string;desc:string}>
  const cities = t.raw('cities.list') as Array<{city:string;country:string;dates:string;format:string}>
  const notIncludedItems = t.raw('notIncluded.items') as string[]
  const bringItems = t.raw('bring.items') as string[]

  return (
    <main id="main" className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/auction"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-ag-apex transition-colors mb-10"
          >
            <ChevronLeft size={11} /> {tNav('auction')}
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
          <p className="font-sans text-[15px] text-white/60 leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* What you get */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('what.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black leading-[1.1] tracking-[-0.03em] mb-14"
            style={{ fontSize: 'clamp(22px,3vw,42px)' }}
          >
            {t('what.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whatItems.map((item, i) => (
              <div key={i} className="border border-ag-border p-6 flex flex-col gap-4">
                <span className="font-mono text-[10px] font-bold tracking-[0.12em] text-ag-apex">0{i + 1}</span>
                <h3 className="font-sans font-bold text-ag-black text-[14px] tracking-[-0.01em]">{item.title}</h3>
                <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Not included + Bring */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-14">
            <div className="border border-ag-border/50 p-6">
              <p className="font-sans font-bold text-ag-black text-[13px] mb-4">{t('notIncluded.title')}</p>
              <ul className="flex flex-col gap-2">
                {notIncludedItems.map((item, i) => (
                  <li key={i} className="font-sans text-[12px] text-ag-gray flex items-start gap-3">
                    <span className="mt-1 w-3 h-px bg-ag-gray-light inline-block shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="border border-ag-apex/20 bg-ag-off-white p-6">
              <p className="font-sans font-bold text-ag-black text-[13px] mb-4">{t('bring.title')}</p>
              <ul className="flex flex-col gap-2">
                {bringItems.map((item, i) => (
                  <li key={i} className="font-sans text-[12px] text-ag-black flex items-start gap-3">
                    <CheckCircle2 size={12} className="text-ag-apex mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="bg-ag-off-white py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-gray-light/50 inline-block" />
            {t('cities.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black leading-[1.1] tracking-[-0.03em] mb-10"
            style={{ fontSize: 'clamp(22px,3vw,42px)' }}
          >
            {t('cities.title')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cities.map((c) => (
              <div key={c.city} className="border border-ag-border bg-ag-white p-6 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-ag-apex" />
                  <span className="font-sans font-bold text-ag-black text-[15px]">{c.city}</span>
                </div>
                <span className="font-sans text-[11px] text-ag-gray-light uppercase tracking-[0.12em]">{c.country}</span>
                <p className="font-sans text-[12px] text-ag-gray">{c.dates}</p>
                <span className="font-sans text-[11px] text-ag-apex border border-ag-apex/30 px-2 py-1 self-start">{c.format}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-16">
          <div>
            <h2
              className="font-sans font-bold text-ag-black leading-[1.15] tracking-[-0.025em] mb-4"
              style={{ fontSize: 'clamp(20px,2.5vw,34px)' }}
            >
              {t('form.title')}
            </h2>
            <p className="font-sans text-[13px] text-ag-gray-light leading-relaxed border-t border-ag-border pt-4 mt-4">
              {t('form.note')}
            </p>
          </div>

          {submitted ? (
            <div className="border border-ag-apex/30 bg-ag-off-white p-12 flex flex-col items-start gap-6">
              <CheckCircle2 size={32} className="text-ag-apex" />
              <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">{t('form.successTitle')}</h3>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-sm">{t('form.successDesc')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.name')}</label>
                  <input name="name" type="text" required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.email')}</label>
                  <input name="email" type="email" required className={inputCls} />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className={labelCls}>{t('form.company')}</label>
                <input name="company" type="text" className={inputCls} />
              </div>

              {/* City + Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.city')}</label>
                  <select name="city" required className={selectCls}>
                    <option value="">{t('form.cityPlaceholder')}</option>
                    {CITY_KEYS.map(k => (
                      <option key={k} value={k}>{t(`form.cityOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className={labelCls}>{t('form.format')}</p>
                  <div className="flex gap-4 mt-1">
                    {(['physical','video'] as const).map(v => (
                      <label key={v} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio" name="format" value={v} required
                          checked={format === v}
                          onChange={() => setFormat(v)}
                          className="accent-ag-navy"
                        />
                        <span className="font-sans text-[13px] text-ag-black">
                          {v === 'physical' ? t('form.formatPhysical') : t('form.formatVideo')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Asset type + ARR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.assetType')}</label>
                  <input name="assetType" type="text" placeholder={t('form.assetTypePlaceholder')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.arrRange')}</label>
                  <select name="arrRange" className={selectCls}>
                    <option value="">{t('form.arrPlaceholder')}</option>
                    {ARR_KEYS.map(k => (
                      <option key={k} value={k}>{t(`form.arrOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className={labelCls}>{t('form.message')}</label>
                <textarea name="message" rows={3} className={`${inputCls} resize-none`} />
              </div>

              {error && (
                <p className="font-sans text-[12px] text-red-600">{t('form.errorMsg')}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-8 py-4 hover:bg-ag-navy-mid transition-colors disabled:opacity-60"
              >
                {loading ? t('form.submitting') : t('form.submit')}
                {!loading && <ArrowUpRight size={13} />}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-ag-off-white py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto max-w-3xl">
          <h2
            className="font-sans font-bold text-ag-black leading-[1.1] tracking-[-0.025em] mb-10"
            style={{ fontSize: 'clamp(22px,2.5vw,36px)' }}
          >
            {t('faq.title')}
          </h2>
          <div className="flex flex-col">
            {faqItems.map((item, i) => (
              <div key={i} className="border-b border-ag-border">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-sans font-bold text-ag-black text-[14px] tracking-[-0.01em] pr-8">{item.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-ag-gray-light shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed pb-5 max-w-2xl">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
