'use client'

import { useState } from 'react'
import { useTranslations }     from 'next-intl'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

const TAB_KEYS = ['overview', 'advisory_tech', 'advisory_transaction', 'certification', 'dealflow', 'sequestre', 'technique', 'assurance', 'apply'] as const
type TabKey = typeof TAB_KEYS[number]


const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const selectCls = inputCls + ' appearance-none'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

export default function AlliancesContent() {
  const t          = useTranslations('alliances')
  const searchParams = useSearchParams()
  const router     = useRouter()
  const pathname   = usePathname()

  const initialTab = (searchParams.get('tab') as TabKey | null) ?? 'overview'
  const [activeTab, setActiveTab] = useState<TabKey>(
    TAB_KEYS.includes(initialTab) ? initialTab : 'overview'
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [formError, setFormError] = useState(false)

  async function handleApply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setFormError(false)
    const raw = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/alliances/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organization_name: raw.organization_name,
          structure_type:    raw.structure_type,
          alliance_type:     raw.alliance_type,
          email:             raw.email,
          country:           raw.country || undefined,
          description:       raw.description || undefined,
          website:           raw.website || undefined,
          locale:            document.documentElement.lang || 'fr',
        }),
      })
      if (res.ok) setSubmitted(true)
      else setFormError(true)
    } catch { setFormError(true) }
    finally  { setLoading(false) }
  }

  function setTab(key: TabKey) {
    setActiveTab(key)
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] max-w-3xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-white/60 leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Sticky tabs nav */}
      <div className="sticky top-0 z-30 bg-ag-white border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 overflow-x-auto">
          <div className="flex gap-0 min-w-max">
            {TAB_KEYS.map(key => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={[
                  'relative px-6 py-4 font-sans font-semibold text-[11px] uppercase tracking-[0.18em] transition-colors whitespace-nowrap',
                  activeTab === key
                    ? 'text-ag-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-ag-black'
                    : 'text-ag-gray-light hover:text-ag-black',
                ].join(' ')}
              >
                {t(`tabs.${key}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab panels */}
      <div className="min-h-[60vh]">

        {/* Overview */}
        {activeTab === 'overview' && (
          <>
            {/* 6 discipline cards */}
            <section className="border-b border-ag-border bg-ag-off-white">
              <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                <div className="flex items-center border-b border-ag-border pb-4 mb-14">
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
                    / {t('disciplines.label')}
                  </p>
                </div>
                <p className="text-[15px] text-ag-gray leading-relaxed max-w-2xl mb-14">
                  {t('disciplines.intro')}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border">
                  {(t.raw('disciplines.items') as { num: string; title: string; desc: string }[]).map(item => (
                    <div key={item.num} className="bg-ag-off-white p-8 hover:bg-white transition-colors">
                      <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-5">{item.num}</p>
                      <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] leading-tight mb-3">
                        {item.title}
                      </h3>
                      <p className="text-[13px] text-ag-gray leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Alliance Partners bloc */}
            <section className="border-b border-ag-border bg-ag-white">
              <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
                <div className="flex items-center border-b border-ag-border pb-4 mb-14">
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
                    / {t('alliancePartners.label')}
                  </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16 items-start">
                  <div>
                    <h2
                      className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
                      style={{ fontSize: 'clamp(24px,2.5vw,36px)' }}
                    >
                      {t('alliancePartners.title')}
                    </h2>
                    <a
                      href={t('alliancePartners.ctaHref')}
                      onClick={(e) => { e.preventDefault(); setTab('apply') }}
                      className="inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-apex hover:text-ag-navy transition-colors"
                    >
                      {t('alliancePartners.cta')} <ArrowUpRight size={14} />
                    </a>
                  </div>
                  <p className="text-[15px] text-ag-gray leading-relaxed self-start">
                    {t('alliancePartners.desc')}
                  </p>
                </div>
              </div>
            </section>

            {/* Partner note */}
            <section className="max-w-7xl mx-auto px-6 md:px-12 py-12">
              <p className="font-sans text-[12px] text-ag-gray-light italic">
                {t('partnerNote')}
              </p>
            </section>
          </>
        )}

        {/* Category detail tabs */}
        {(activeTab !== 'overview' && activeTab !== 'apply') && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="max-w-2xl">
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-apex mb-5">
                {t(`types.${activeTab}.label`)}
              </p>
              {t.raw(`types.${activeTab}.title`) !== `alliances.types.${activeTab}.title` && (
                <h2 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6" style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}>
                  {t(`types.${activeTab}.title`)}
                </h2>
              )}
              {t.raw(`types.${activeTab}.desc`) !== `alliances.types.${activeTab}.desc` && (
                <p className="text-[15px] text-ag-gray leading-relaxed mb-8 max-w-lg">
                  {t(`types.${activeTab}.desc`)}
                </p>
              )}
              <ul className="flex flex-col gap-3 mb-10">
                {(t(`types.${activeTab}.profiles`) as string)
                  .split(' · ')
                  .map((p: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 size={13} className="text-ag-apex mt-0.5 shrink-0" />
                      <span className="font-sans text-[13px] text-ag-gray leading-relaxed">{p}</span>
                    </li>
                  ))}
              </ul>
              <p className="font-sans text-[12px] text-ag-gray-light italic mb-8">
                {t('partnerNote')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setTab('apply')}
                  className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-ag-navy-mid transition-colors"
                >
                  {t.raw(`types.${activeTab}.cta`) ? t(`types.${activeTab}.cta`) : t('types.certification.cta')} <ArrowUpRight size={12} />
                </button>
                <button
                  onClick={() => setTab('overview')}
                  className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:border-ag-black transition-colors"
                >
                  {t('tabs.overview')}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Apply — form */}
        {activeTab === 'apply' && (
          <section className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
              <div>
                <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
                  / Application
                </p>
                <h2
                  className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
                  style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
                >
                  {t('form.title')}
                </h2>
                <p className="text-[13px] text-ag-gray leading-relaxed">
                  {t('form.note')}
                </p>
              </div>

              {submitted ? (
                <div className="border border-ag-apex/30 bg-ag-off-white p-10 flex flex-col items-start gap-4">
                  <CheckCircle2 size={28} className="text-ag-apex" />
                  <p className="font-sans font-bold text-ag-black text-[18px]">{t('form.successTitle')}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('form.successDesc')}</p>
                </div>
              ) : (
              <form onSubmit={handleApply} className="space-y-5">
                <div>
                    <label className={labelCls}>{t('form.organizationLabel')}</label>
                    <input name="organization_name" type="text" required className={inputCls} />
                  </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('form.structure')}</label>
                    <select name="structure_type" required className={selectCls}>
                      <option value="">{t('form.structurePlaceholder')}</option>
                      {(['law_firm','audit','bank','fund','notary','accelerator','platform','other'] as const).map(k => (
                        <option key={k} value={k}>{(t.raw('form.structureOpts') as Record<string,string>)[k]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>{t('form.type')}</label>
                    <select name="alliance_type" required className={selectCls}>
                      <option value="">{t('form.typePlaceholder')}</option>
                      {(['advisory_tech','advisory_transaction','certification','dealflow','sequestre','technique','assurance'] as const).map(k => (
                        <option key={k} value={k}>{t(`types.${k}.label`)}</option>
                      ))}
                      <option value="other">{t('form.typeOtherLabel')}</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className={labelCls}>{t('form.email')}</label>
                    <input name="email" type="email" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>{t('form.country')}</label>
                    <input name="country" type="text" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t('form.description')}</label>
                  <textarea name="description" rows={5} required className={`${inputCls} resize-none`} />
                </div>
                {formError && (
                  <p className="font-sans text-[11px] text-red-500">{t('form.errorMsg')}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-ag-navy transition-colors disabled:opacity-60"
                >
                  {loading ? t('form.submitting') : t('form.submit')} {!loading && <ArrowUpRight size={13} />}
                </button>
              </form>
              )}
            </div>
          </section>
        )}

      </div>

      {/* CTA navy */}
      <section className="bg-ag-navy py-24 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/50 mb-4">{t('hero.label')}</p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(24px,2.8vw,42px)' }}
            >
              {t('hero.title')}
            </h2>
          </div>
          <button
            onClick={() => setTab('apply')}
            className="shrink-0 inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
          >
            {t('types.certification.cta')} <ArrowUpRight size={14} />
          </button>
        </div>
      </section>
    </>
  )
}
