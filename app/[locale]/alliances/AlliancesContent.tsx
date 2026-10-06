'use client'

import { useState } from 'react'
import { useTranslations }     from 'next-intl'
import { useSearchParams }     from 'next/navigation'
import { Link }                from '@/i18n/navigation'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

const METIER_KEYS = ['strategie', 'risques', 'technologie', 'talent', 'ma'] as const
type MetierKey = typeof METIER_KEYS[number]

const METIER_HREFS: Record<MetierKey, string> = {
  strategie:   '/advisory/strategy',
  risques:     '/advisory/risk-compliance',
  technologie: '/advisory/technology',
  talent:      '/advisory/talent-organization',
  ma:          '/advisory/ma',
}

const DIMENSION_KEYS = ['C', 'I', 'F', 'S', 'O'] as const

type ApplicantType = 'expert' | 'auditeur' | 'apporteur'

const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors rounded-lg'
const selectCls = inputCls + ' appearance-none'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function AlliancesContent() {
  const t            = useTranslations('alliances')
  const searchParams = useSearchParams()

  const initialType = searchParams.get('type')
  const [appType, setAppType] = useState<ApplicantType>(
    initialType === 'auditeur' || initialType === 'apporteur' ? initialType : 'expert'
  )
  const initialMetier = searchParams.get('metier')
  const [metier, setMetier] = useState<string>(
    initialMetier && (METIER_KEYS as readonly string[]).includes(initialMetier) ? initialMetier : ''
  )
  const initialDim = searchParams.get('dimension')
  const [dimension, setDimension] = useState<string>(
    initialDim && (DIMENSION_KEYS as readonly string[]).includes(initialDim) ? initialDim : ''
  )
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [formError, setFormError] = useState(false)

  function joinMetier(key: MetierKey) {
    setAppType('expert')
    setMetier(key)
    scrollToId('candidature')
  }

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
          applicant_type:    appType,
          metier:            appType === 'expert'    ? metier    || undefined : undefined,
          dimension:         appType === 'auditeur'  ? dimension || undefined : undefined,
          applicant_name:    raw.applicant_name,
          organization_name: raw.organization_name,
          country:           raw.country || undefined,
          experience:        raw.experience || undefined,
          website:           raw.website || undefined,
          email:             raw.email,
          consent:           raw.consent === 'on',
          locale:            document.documentElement.lang || 'fr',
        }),
      })
      if (res.ok) setSubmitted(true)
      else setFormError(true)
    } catch { setFormError(true) }
    finally  { setLoading(false) }
  }

  const cards = t.raw('intro.cards') as { title: string; desc: string; cta: string }[]
  const cardHrefs = ['#strategie', '/investisseurs', '/grade/partners'] as const

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

      {/* Layout : sidebar gauche + contenu droite */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col lg:flex-row gap-0">

          {/* ── Sidebar navigation verticale ── */}
          <aside className="hidden lg:block shrink-0 w-64 border-r border-ag-border sticky top-20 self-start pt-10 pb-10 max-h-[calc(100vh-80px)] overflow-y-auto">
            <nav className="flex flex-col gap-0 pr-6">

              {/* Partenaires & expertises → /network + 5 ancres */}
              <Link
                href={'/network' as never}
                className="px-5 py-3 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-black hover:text-ag-apex-ink transition-colors"
              >
                {t('side.group')}
              </Link>
              <p className="px-5 pb-3 font-sans text-[11px] text-ag-gray-light leading-relaxed">
                {t('side.groupDesc')}
              </p>
              {METIER_KEYS.map(key => (
                <button
                  key={key}
                  onClick={() => scrollToId(key)}
                  className="relative text-left pl-8 pr-5 py-2 font-sans text-[12px] text-ag-gray-light hover:text-ag-black transition-colors"
                >
                  {t(`metiers.items.${key}.title`)}
                </button>
              ))}

              <div className="border-t border-ag-border mx-5 my-6" />

              {/* Investisseurs → /investisseurs */}
              <Link
                href={'/investisseurs' as never}
                className="px-5 py-3 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-black hover:text-ag-apex-ink transition-colors"
              >
                {t('side.investors')}
              </Link>
              <p className="px-5 pb-2 font-sans text-[11px] text-ag-gray-light leading-relaxed">
                {t('side.investorsDesc')}
              </p>

              <div className="border-t border-ag-border mx-5 my-6" />

              {/* Auditeurs → /grade/partners */}
              <Link
                href={'/grade/partners' as never}
                className="px-5 py-3 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-black hover:text-ag-apex-ink transition-colors"
              >
                {t('side.auditors')}
              </Link>
              <p className="px-5 pb-2 font-sans text-[11px] text-ag-gray-light leading-relaxed">
                {t('side.auditorsDesc')}
              </p>

              <div className="border-t border-ag-border mx-5 my-6" />

              {/* Candidature */}
              <button
                onClick={() => scrollToId('candidature')}
                className="relative text-left px-5 py-3 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-apex-ink hover:text-ag-black transition-colors"
              >
                {t('side.apply')}
              </button>
            </nav>
          </aside>

          {/* ── Nav mobile (visible < lg) ── */}
          <div className="lg:hidden w-full border-b border-ag-border overflow-x-auto">
            <div className="flex gap-0 min-w-max">
              {METIER_KEYS.map(key => (
                <button
                  key={key}
                  onClick={() => scrollToId(key)}
                  className="px-4 py-3.5 font-sans font-semibold text-[10px] uppercase tracking-[0.14em] text-ag-gray-light hover:text-ag-black whitespace-nowrap transition-colors"
                >
                  {t(`metiers.items.${key}.title`)}
                </button>
              ))}
              <Link href={'/investisseurs' as never} className="px-4 py-3.5 font-sans font-semibold text-[10px] uppercase tracking-[0.14em] text-ag-gray-light hover:text-ag-black whitespace-nowrap">
                {t('side.investors')}
              </Link>
              <Link href={'/grade/partners' as never} className="px-4 py-3.5 font-sans font-semibold text-[10px] uppercase tracking-[0.14em] text-ag-gray-light hover:text-ag-black whitespace-nowrap">
                {t('side.auditors')}
              </Link>
              <button
                onClick={() => scrollToId('candidature')}
                className="px-4 py-3.5 font-sans font-semibold text-[10px] uppercase tracking-[0.14em] text-ag-apex-ink whitespace-nowrap"
              >
                {t('side.apply')}
              </button>
            </div>
          </div>

          {/* ── Contenu ── */}
          <div className="flex-1 min-w-0 py-10 lg:pl-12 flex flex-col gap-24">

            {/* Intro — trois entrées */}
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
                {t('intro.label')}
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6 max-w-2xl"
                style={{ fontSize: 'clamp(26px,3vw,48px)' }}
              >
                {t('intro.title')}
              </h2>
              <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl mb-12">
                {t('intro.desc')}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
                {cards.map((card, i) => {
                  const inner = (
                    <div className="bg-ag-white p-8 h-full flex flex-col gap-4 group hover:bg-ag-off-white transition-colors">
                      <h3 className="font-sans font-bold text-ag-black text-[15px] leading-tight">
                        {card.title}
                      </h3>
                      <p className="text-[13px] text-ag-gray leading-relaxed flex-1">{card.desc}</p>
                      <span className="inline-flex items-center gap-1.5 font-sans font-semibold text-[10px] uppercase tracking-[0.16em] text-ag-apex-ink group-hover:text-ag-black transition-colors">
                        {card.cta} <ArrowUpRight size={12} />
                      </span>
                    </div>
                  )
                  return cardHrefs[i].startsWith('#') ? (
                    <button key={i} onClick={() => scrollToId(cardHrefs[i].slice(1))} className="text-left">
                      {inner}
                    </button>
                  ) : (
                    <Link key={i} href={cardHrefs[i] as never}>{inner}</Link>
                  )
                })}
              </div>
            </div>

            {/* Cinq métiers */}
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
                {t('metiers.label')}
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4"
                style={{ fontSize: 'clamp(24px,2.8vw,40px)' }}
              >
                {t('metiers.title')}
              </h2>
              <p className="text-[14px] text-ag-gray leading-relaxed max-w-xl mb-12">
                {t('metiers.desc')}
              </p>

              <div className="flex flex-col gap-16">
                {METIER_KEYS.map((key) => (
                  <div key={key} id={key} className="scroll-mt-24">
                    <h3 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.01em] leading-tight mb-3">
                      {t(`metiers.items.${key}.title`)}
                    </h3>
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed mb-8 max-w-xl">
                      <span className="font-semibold uppercase tracking-[0.14em] text-[10px] text-ag-gray-light block mb-1">
                        {t('metiers.profilesLabel')}
                      </span>
                      {t(`metiers.items.${key}.profiles`)}
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5 mb-8 max-w-3xl">
                      {(t.raw(`metiers.items.${key}.expertises`) as string[]).map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={13} className="text-ag-apex mt-0.5 shrink-0" />
                          <span className="font-sans text-[13px] text-ag-gray leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                    {key === 'ma' && (
                      <p className="font-sans text-[12px] text-ag-gray-light italic leading-relaxed mb-8 max-w-xl">
                        {t('metiers.items.ma.note')}
                      </p>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        href={METIER_HREFS[key] as never}
                        className="rounded-lg inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:border-ag-black transition-colors"
                      >
                        {t('metiers.viewPage')} <ArrowUpRight size={12} />
                      </Link>
                      <button
                        onClick={() => joinMetier(key)}
                        className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-ag-apex hover:text-ag-navy transition-colors"
                      >
                        {t('metiers.join')} <ArrowUpRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Candidature */}
            <div id="candidature" className="scroll-mt-24">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12">
                <div>
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
                    {t('candidature.label')}
                  </p>
                  <h2
                    className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
                    style={{ fontSize: 'clamp(26px,3vw,48px)' }}
                  >
                    {t('candidature.title')}
                  </h2>
                  <p className="text-[13px] text-ag-gray leading-relaxed">
                    {t('candidature.desc')}
                  </p>
                </div>

                {submitted ? (
                  <div className="border border-ag-apex/30 bg-ag-off-white p-10 rounded-2xl flex flex-col items-start gap-4">
                    <CheckCircle2 size={28} className="text-ag-apex-ink" />
                    <p className="font-sans font-bold text-ag-black text-[18px]">{t('candidature.successTitle')}</p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('candidature.successDesc')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleApply} className="space-y-5">
                    <div>
                      <label className={labelCls}>{t('candidature.typeLabel')}</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {(['expert', 'auditeur', 'apporteur'] as const).map(k => (
                          <button
                            key={k}
                            type="button"
                            onClick={() => setAppType(k)}
                            className={[
                              'rounded-lg border px-4 py-3 font-sans font-semibold text-[11px] uppercase tracking-[0.12em] transition-colors text-left',
                              appType === k
                                ? 'border-ag-navy bg-ag-navy text-white'
                                : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black',
                            ].join(' ')}
                          >
                            {t(`candidature.type${k === 'expert' ? 'Expert' : k === 'auditeur' ? 'Auditeur' : 'Apporteur'}`)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {appType === 'expert' && (
                      <div>
                        <label className={labelCls}>{t('candidature.metierLabel')}</label>
                        <select
                          required
                          value={metier}
                          onChange={e => setMetier(e.target.value)}
                          className={selectCls}
                        >
                          <option value="">{t('candidature.selectPlaceholder')}</option>
                          {METIER_KEYS.map(k => (
                            <option key={k} value={k}>{t(`metiers.items.${k}.title`)}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {appType === 'auditeur' && (
                      <div>
                        <label className={labelCls}>{t('candidature.dimensionLabel')}</label>
                        <select
                          required
                          value={dimension}
                          onChange={e => setDimension(e.target.value)}
                          className={selectCls}
                        >
                          <option value="">{t('candidature.selectPlaceholder')}</option>
                          {DIMENSION_KEYS.map(k => (
                            <option key={k} value={k}>{t(`candidature.dimensions.${k}`)}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>{t('candidature.name')}</label>
                        <input name="applicant_name" type="text" required className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{t('candidature.org')}</label>
                        <input name="organization_name" type="text" required className={inputCls} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className={labelCls}>{t('candidature.country')}</label>
                        <input name="country" type="text" className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>{t('candidature.website')}</label>
                        <input name="website" type="text" className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>{t('candidature.experience')}</label>
                      <textarea name="experience" rows={3} required className={`${inputCls} resize-none`} />
                    </div>
                    <div>
                      <label className={labelCls}>{t('candidature.email')}</label>
                      <input name="email" type="email" required className={inputCls} />
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input name="consent" type="checkbox" required className="mt-0.5 accent-ag-navy" />
                      <span className="font-sans text-[12px] text-ag-gray leading-relaxed">
                        {t('candidature.consent')}
                      </span>
                    </label>
                    {formError && (
                      <p className="font-sans text-[11px] text-red-500">{t('candidature.errorMsg')}</p>
                    )}
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-lg inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-ag-navy transition-colors disabled:opacity-60"
                    >
                      {loading ? t('candidature.submitting') : t('candidature.submit')} {!loading && <ArrowUpRight size={13} />}
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
