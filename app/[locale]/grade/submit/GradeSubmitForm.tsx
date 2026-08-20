'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, CheckCircle2, ChevronLeft } from 'lucide-react'
import { EXPERTISE_TAXONOMY } from '@/lib/expertiseTaxonomy'

type EvalType = 'review_internal' | 'review_partner' | 'full_certification'

const IP_KEYS = ['yes', 'no', 'pending'] as const
type IpKey = typeof IP_KEYS[number]

export default function GradeSubmitForm() {
  const t          = useTranslations('gradeSubmit')
  const tNav       = useTranslations('nav')
  const params     = useSearchParams()

  const [evalType,       setEvalType]       = useState<EvalType>('full_certification')
  const [partnerCatId,   setPartnerCatId]   = useState('')
  const [partnerSpecId,  setPartnerSpecId]  = useState('')
  const [partnerOther,   setPartnerOther]   = useState('')
  const [sourceLeadId,   setSourceLeadId]   = useState<string | null>(null)

  const partnerCat      = EXPERTISE_TAXONOMY.find(c => c.id === partnerCatId)
  const partnerSpecList = partnerCat?.specialties ?? []

  const [ipChoice, setIpChoice] = useState<IpKey | ''>('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]         = useState(false)
  const [loading, setLoading]     = useState(false)

  /* ── Accord catalogue (full_certification uniquement) ── */
  const [catalogueAgreed, setCatalogueAgreed] = useState(false)
  const [feeAgreed, setFeeAgreed]             = useState(false)

  useEffect(() => {
    const suggested = params.get('suggested') as EvalType | null
    const lead      = params.get('source_lead')
    if (suggested && ['review_internal', 'review_partner', 'full_certification'].includes(suggested)) {
      setEvalType(suggested)
    }
    if (lead) setSourceLeadId(lead)
  }, [params])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const data   = Object.fromEntries(new FormData(e.currentTarget))
    const locale = document.documentElement.lang || 'fr'
    const payload = {
      fullName:        data.fullName,
      email:           data.email,
      company:         data.company        || undefined,
      assetName:       data.assetName,
      assetType:       data.assetType,
      assetUrl:        data.assetUrl        || undefined,
      techStack:       data.techStack       || undefined,
      status:          data.status          || undefined,
      arr:             data.arr              || undefined,
      ipFiled:         data.ipFiled          || undefined,
      motivation:      data.motivation       || undefined,
      targetValuation: data.targetValuation  || undefined,
      timeline:        data.timeline         || undefined,
      message:         data.message          || undefined,
      evaluationType:  evalType,
      partnerCatId:    evalType === 'review_partner' ? (partnerCatId || undefined) : undefined,
      partnerSpecId:   evalType === 'review_partner' ? (partnerSpecId || undefined) : undefined,
      partnerOther:    evalType === 'review_partner' ? (partnerOther || undefined) : undefined,
      sourceLeadId:    sourceLeadId ?? undefined,
      locale,
    }
    try {
      const res = await fetch('/api/grade/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) { setError(true); return }

      const json = await res.json().catch(() => ({}))
      const assetId = json?.assetId ?? undefined

      /* ── Demande catalogue pour full_certification avec accord ── */
      if (evalType === 'full_certification' && catalogueAgreed && feeAgreed) {
        await fetch('/api/grade/catalogue-request', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            assetId,
            assetName:       String(data.assetName),
            catalogueAgreed: true,
            feeAgreed:       true,
          }),
        })
      }

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

  return (
    <main className="bg-ag-white">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/grade"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-ag-apex transition-colors mb-10"
          >
            <ChevronLeft size={11} /> {tNav('grade')}
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

      {/* Form */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16">

          {/* Left — grade scale reminder */}
          <div className="flex flex-col gap-10">
            <div className="border border-ag-border p-6 flex flex-col gap-3">
              {(t.raw('gradeScale') as { g: string; d: string }[]).map(({ g, d }) => {
                const colorMap: Record<string, string> = {
                  'AEG ★': 'text-ag-apex',
                  'AAA':   'text-ag-grade-aaa',
                  'AA':    'text-ag-grade-aa',
                  'A':     'text-ag-grade-a',
                  'B':     'text-ag-gray-light',
                }
                return (
                  <div key={g} className="flex items-center gap-4">
                    <span className={`font-mono text-[11px] font-bold tracking-[0.08em] w-16 shrink-0 ${colorMap[g] ?? 'text-ag-gray'}`}>{g}</span>
                    <span className="font-sans text-[12px] text-ag-gray">{d}</span>
                  </div>
                )
              })}
            </div>
            <p className="font-sans text-[12px] text-ag-gray-light leading-relaxed border-t border-ag-border pt-6">
              {t('form.legalNote')}
            </p>
          </div>

          {/* Right */}
          {params.get('cancelled') === 'true' && (
            <div className="col-span-full mb-4 border border-amber-200 bg-amber-50 px-5 py-4 text-[13px] text-amber-800">
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
                className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-6 py-3 hover:bg-ag-navy hover:text-white transition-colors"
              >
                {tNav('grade')} <ArrowUpRight size={12} />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* ── Sélecteur palier d'évaluation ── */}
              <div className="border border-ag-border p-6 flex flex-col gap-4">
                <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-black">
                  {t('form.evalTypeTitle')}
                </p>
                <div className="flex flex-col gap-3">
                  {([
                    {
                      key:   'full_certification' as EvalType,
                      label: t('form.evalTypeFull.label'),
                      desc:  t('form.evalTypeFull.desc'),
                      price: t('form.evalTypeFull.price'),
                    },
                    {
                      key:   'review_internal' as EvalType,
                      label: t('form.evalTypeReview.label'),
                      desc:  t('form.evalTypeReview.desc'),
                      price: t('form.evalTypeReview.price'),
                    },
                    {
                      key:   'review_partner' as EvalType,
                      label: t('form.evalTypeReviewPlus.label'),
                      desc:  t('form.evalTypeReviewPlus.desc'),
                      price: t('form.evalTypeReviewPlus.price'),
                    },
                  ]).map(({ key, label, desc, price }) => (
                    <label
                      key={key}
                      className={`flex items-start gap-4 cursor-pointer border p-4 transition-colors ${
                        evalType === key
                          ? 'border-ag-navy bg-ag-navy/5'
                          : 'border-ag-border hover:border-ag-black/30'
                      }`}
                    >
                      <input
                        type="radio" name="evalType" value={key}
                        checked={evalType === key}
                        onChange={() => setEvalType(key)}
                        className="mt-1 accent-ag-navy shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-3 flex-wrap">
                          <span className="font-sans font-bold text-ag-black text-[13px]">{label}</span>
                          <span className="font-mono text-[11px] font-bold px-2 py-0.5" style={{ backgroundColor: '#5ADDA4', color: '#0A0F1E' }}>{price}</span>
                        </div>
                        <p className="font-sans text-[12px] text-ag-gray mt-1 leading-relaxed">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Note déductibilité */}
                {(evalType === 'review_internal' || evalType === 'review_partner') && (
                  <div className="flex flex-col gap-2">
                    <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 text-[12px] text-emerald-800 font-sans leading-relaxed">
                      {t('form.evalDeductibleNote')}
                    </div>
                    <div className="bg-ag-navy/5 border border-ag-navy/20 px-4 py-3 text-[12px] text-ag-navy font-sans leading-relaxed">
                      {t('form.invoiceNote')}
                    </div>
                  </div>
                )}

                {/* Sélecteur partenaire (Review+ seulement) — taxonomie cascadée */}
                {evalType === 'review_partner' && (
                  <div className="mt-1 flex flex-col gap-3">
                    <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">
                      {t('form.partnerSelectLabel')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <select
                        className={selectCls}
                        value={partnerCatId}
                        onChange={e => { setPartnerCatId(e.target.value); setPartnerSpecId('') }}
                      >
                        <option value="">— Catégorie / domaine —</option>
                        {EXPERTISE_TAXONOMY.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.labelFr}</option>
                        ))}
                      </select>
                      <select
                        className={selectCls}
                        value={partnerSpecId}
                        onChange={e => setPartnerSpecId(e.target.value)}
                        disabled={partnerSpecList.length === 0}
                      >
                        <option value="">{partnerCatId ? '— Expertise —' : '— Choisir une catégorie d\'abord —'}</option>
                        {partnerSpecList.map(s => (
                          <option key={s.id} value={s.id}>{s.labelFr}</option>
                        ))}
                      </select>
                    </div>
                    <input
                      type="text"
                      className={inputCls}
                      value={partnerOther}
                      onChange={e => setPartnerOther(e.target.value)}
                      placeholder="Autre / précision libre (optionnel)"
                    />
                  </div>
                )}
              </div>

              {/* Asset name + type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.assetName')}</label>
                  <input name="assetName" type="text" required className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.assetType')}</label>
                  <select name="assetType" required className={selectCls}>
                    <option value="">{t('form.assetTypePlaceholder')}</option>
                    {(['saas','mobile','marketplace','protocol','ip','other'] as const).map(k => (
                      <option key={k} value={k}>{t(`form.assetTypeOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* URL + Stack */}
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

              {/* Status + ARR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.status')}</label>
                  <select name="status" required className={selectCls}>
                    <option value="">{t('form.statusPlaceholder')}</option>
                    {(['prod_revenue','prod_no_revenue','beta','prototype','ip_only'] as const).map(k => (
                      <option key={k} value={k}>{t(`form.statusOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t('form.arr')}</label>
                  <input name="arr" type="number" min="0" className={inputCls} />
                </div>
              </div>


              {/* IP filed */}
              <div>
                <p className={labelCls}>{t('form.ipFiled')}</p>
                <div className="flex gap-6 mt-1">
                  {IP_KEYS.map(v => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio" name="ipFiled" value={v} required
                        checked={ipChoice === v}
                        onChange={() => setIpChoice(v)}
                        className="accent-ag-navy"
                      />
                      <span className="font-sans text-[13px] text-ag-black">{ipLabelMap[v]}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Motivation + valuation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>{t('form.motivation')}</label>
                  <select name="motivation" required className={selectCls}>
                    <option value="">{t('form.motivationPlaceholder')}</option>
                    {(['full_exit','partial_exit','liquidity','valuation','other'] as const).map(k => (
                      <option key={k} value={k}>{t(`form.motivationOptions.${k}`)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>{t('form.targetValuation')}</label>
                  <input name="targetValuation" type="number" min="0" className={inputCls} />
                </div>
              </div>

              {/* Timeline */}
              <div>
                <label className={labelCls}>{t('form.timeline')}</label>
                <select name="timeline" required className={selectCls}>
                  <option value="">{t('form.timelinePlaceholder')}</option>
                  {(['urgent','standard','long','none'] as const).map(k => (
                    <option key={k} value={k}>{t(`form.timelineOptions.${k}`)}</option>
                  ))}
                </select>
              </div>

              {/* Contact */}
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
                    <label className={labelCls}>{t('form.email')}</label>
                    <input name="email" type="email" required className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>{t('form.company')}</label>
                  <input name="company" type="text" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls}>{t('form.message')}</label>
                  <textarea name="message" rows={4} className={`${inputCls} resize-none`} />
                </div>
              </div>

              {/* ── Accord mise au catalogue (full_certification uniquement) ── */}
              {evalType === 'full_certification' && (
                <div className="border border-ag-navy/30 bg-ag-navy/5 p-6 flex flex-col gap-4">
                  <p className="font-sans font-bold text-ag-black text-[13px] tracking-[-0.01em]">
                    Accord de mise au catalogue Aegryn
                  </p>
                  <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                    La <strong>Certification Transaction</strong> inclut la mise au catalogue d&apos;Aegryn et l&apos;ouverture aux acquéreurs membres qualifiés. Votre actif sera préparé à <strong>J+15</strong> après admission et visible aux acquéreurs à <strong>J+45 minimum</strong>.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-[12px] text-amber-800 font-sans leading-relaxed">
                    <strong>Frais de publication : CHF 2 000 HT</strong> — Cet acompte est déduit de la commission Aegryn en cas de vente. Il est conservé par Aegryn si aucune transaction n&apos;est réalisée (cf. CGV § 11 et NDA signé). Une facture sera émise après validation de votre dossier par notre équipe.
                  </div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={catalogueAgreed}
                      onChange={e => setCatalogueAgreed(e.target.checked)}
                      className="mt-0.5 accent-ag-navy shrink-0 w-4 h-4"
                    />
                    <span className="font-sans text-[13px] text-ag-black leading-snug">
                      J&apos;accepte la mise au catalogue Aegryn et les conditions contractuelles associées (NDA, CGV, délais de 45 jours minimum).
                    </span>
                  </label>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={feeAgreed}
                      onChange={e => setFeeAgreed(e.target.checked)}
                      className="mt-0.5 accent-ag-navy shrink-0 w-4 h-4"
                    />
                    <span className="font-sans text-[13px] text-ag-black leading-snug">
                      J&apos;accepte le versement des frais de publication de <strong>CHF 2 000 HT</strong> sur présentation de facture, déductibles de la commission en cas de vente.
                    </span>
                  </label>
                  {evalType === 'full_certification' && (!catalogueAgreed || !feeAgreed) && (
                    <p className="font-sans text-[11px] text-amber-700">
                      Les deux cases doivent être cochées pour soumettre une demande de Certification Transaction.
                    </p>
                  )}
                </div>
              )}

              {error && (
                <p className="font-sans text-[12px] text-red-600">{t('form.errorMsg')}</p>
              )}

              <button
                type="submit"
                disabled={loading || (evalType === 'full_certification' && (!catalogueAgreed || !feeAgreed))}
                className="inline-flex items-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-8 py-4 hover:bg-ag-navy-mid transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
