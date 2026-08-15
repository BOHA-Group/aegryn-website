'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, Lock, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  locale:    string
  userId?:   string
  userEmail?: string
  status:    'pending_nda' | 'pending_cgv'
}

const CAPACITIES = [
  '< 100K€', '100K€ – 500K€', '500K€ – 2M€', '2M€ – 10M€', '> 10M€',
]

export default function AuctionAccessRequestForm({ locale, userId, userEmail, status }: Props) {
  const t = useTranslations('accessForm')
  const [done,    setDone]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const BUYER_TYPES = [
    { value: 'pe',            label: t('buyerTypes.pe') },
    { value: 'strategic',     label: t('buyerTypes.strategic') },
    { value: 'family_office', label: t('buyerTypes.family_office') },
    { value: 'individual',    label: t('buyerTypes.individual') },
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/transact/access-request', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId:    userId   ?? null,
          email:     fd.get('email'),
          fullName:  fd.get('fullName'),
          company:   fd.get('company')    || undefined,
          buyerType: fd.get('buyerType')  || undefined,
          capacity:  fd.get('capacity')   || undefined,
          message:   fd.get('message')    || undefined,
          locale,
        }),
      })
      if (res.ok) setDone(true)
      else        setError(t('errorGeneric'))
    } catch {
      setError(t('errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-ag-off-white border border-ag-border p-8 flex flex-col items-center gap-4 text-center max-w-lg mx-auto">
        <CheckCircle2 size={32} className="text-ag-apex" />
        <div>
          <p className="font-sans font-bold text-ag-black text-[16px] mb-2">{t('doneTitle')}</p>
          <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('doneDesc')}</p>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mt-4">
            {t('doneNote')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto">

      {/* Contexte */}
      <div className="border border-ag-border bg-ag-off-white p-6 mb-6 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Lock size={14} className="text-ag-gray-light mt-0.5 shrink-0" />
          <div>
            <p className="font-sans font-semibold text-ag-black text-[13px] mb-1">
              {t('restrictedTitle')}
            </p>
            <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
              {t('restrictedDesc')}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <FileText size={14} className="text-ag-gray-light mt-0.5 shrink-0" />
          <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
            {status === 'pending_cgv' ? t('pendingCgvDesc') : t('pendingNdaDesc')}
          </p>
        </div>
      </div>

      {status === 'pending_cgv' ? (
        <div className="border border-ag-apex/30 bg-ag-white p-6 text-center">
          <p className="font-sans font-semibold text-ag-black text-[14px] mb-2">
            {t('ndaSignedTitle')}
          </p>
          <p className="font-sans text-[12px] text-ag-gray">{t('ndaSignedDesc')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-ag-white border border-ag-border p-6 flex flex-col gap-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ag-gray-light mb-1">
            {t('formLabel')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
                {t('labelName')}
              </label>
              <input
                name="fullName" required
                className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black bg-white"
                placeholder={t('placeholderName')}
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
                {t('labelEmail')}
              </label>
              <input
                name="email" type="email" required
                defaultValue={userEmail ?? ''}
                className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black bg-white"
                placeholder={t('placeholderEmail')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
                {t('labelCompany')}
              </label>
              <input
                name="company"
                className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black bg-white"
                placeholder={t('placeholderCompany')}
              />
            </div>
            <div>
              <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
                {t('labelBuyerType')}
              </label>
              <select
                name="buyerType"
                className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
              >
                <option value="">{t('selectDefault')}</option>
                {BUYER_TYPES.map(bt => (
                  <option key={bt.value} value={bt.value}>{bt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
              {t('labelCapacity')}
            </label>
            <select
              name="capacity"
              className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black bg-white"
            >
              <option value="">{t('selectDefault')}</option>
              {CAPACITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
              {t('labelMessage')}
            </label>
            <textarea
              name="message" rows={3}
              className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black bg-white resize-none"
              placeholder={t('placeholderMessage')}
            />
          </div>

          {error && (
            <p className="font-sans text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold hover:bg-ag-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? t('sending') : t('submit')} {!loading && <ArrowUpRight size={12} />}
          </button>

          <p className="font-sans text-[10px] text-ag-gray-light text-center">
            {t('disclaimer')}
          </p>
        </form>
      )}
    </div>
  )
}
