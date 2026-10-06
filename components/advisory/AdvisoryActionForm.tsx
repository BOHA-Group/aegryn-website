'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ActionDef } from '@/content/advisory/actions'
import { SECTOR_CLUSTERS, REVENUE_BANDS } from '@/content/advisory/actions'
import { ACTION_FORM_UI } from '@/content/advisory/actionForm'
import { routing } from '@/i18n/routing'

interface Props {
  locale: string
  /** Métier ACCOMPAGNER, slug de cycle FRANCHIR ou 'general' (intro accueil #franchir). */
  metier: string
  action: string
  def:    ActionDef
}

const inputCls  = 'w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-sm text-ag-dark placeholder-ag-gray-light outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10'
const selectCls = `${inputCls} h-[46px]`
const labelCls  = 'mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light'

/**
 * Formulaire d'action des pages ACCOMPAGNER : un titre et une question
 * propres à l'action demandée (bouton "échange" ou bouton d'action d'une
 * page métier), plus les champs communs (nom, email, CA, secteur).
 * Poste vers /api/advisory/lead, étiqueté metier + action.
 */
export function AdvisoryActionForm({ locale, metier, action, def }: Props) {
  const ui       = ACTION_FORM_UI[locale] ?? ACTION_FORM_UI.fr
  const sectors  = SECTOR_CLUSTERS[locale] ?? SECTOR_CLUSTERS.fr
  const revenues = REVENUE_BANDS[locale] ?? REVENUE_BANDS.fr
  const contactPath = (routing.pathnames['/contact'] as Record<string, string>)[locale] ?? '/contact'

  const [status, setStatus]     = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [revenueBand, setRevenueBand] = useState('')
  const [sector, setSector]     = useState('')
  const [answer, setAnswer]     = useState('')
  const [newsletterOptin, setNewsletterOptin] = useState(false)

  const isComplete = fullName.trim().length > 0 && email.trim().length > 0 && answer.trim().length > 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isComplete) return
    setStatus('sending')
    try {
      const res = await fetch('/api/advisory/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metier, action, fullName, email,
          revenueBand: revenueBand || undefined,
          sector: sector || undefined,
          answer, newsletterOptin, locale,
        }),
      })
      if (!res.ok) { setStatus('error'); return }
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start justify-center gap-4 rounded-2xl border border-ag-apex/30 bg-ag-apex/5 p-10">
        <span className="font-sans font-semibold text-2xl text-ag-apex-ink">✓</span>
        <p className="font-sans text-xl font-bold text-ag-dark">{ui.successTitle}</p>
        <p className="text-sm text-ag-gray">{ui.successDesc}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelCls}>{ui.name} *</label>
          <input id="fullName" type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>{ui.email} *</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="revenueBand" className={labelCls}>{ui.revenueLabel}</label>
          <select id="revenueBand" value={revenueBand} onChange={e => setRevenueBand(e.target.value)} className={selectCls}>
            <option value="">{ui.revenuePlaceholder}</option>
            {revenues.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="sector" className={labelCls}>{ui.sectorLabel}</label>
          <select id="sector" value={sector} onChange={e => setSector(e.target.value)} className={selectCls}>
            <option value="">{ui.sectorPlaceholder}</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="answer" className={labelCls}>{def.question} *</label>
        {def.questionType === 'select' ? (
          <select id="answer" required value={answer} onChange={e => setAnswer(e.target.value)} className={`${selectCls} w-full`}>
            <option value="" disabled>{ui.revenuePlaceholder}</option>
            {(def.options ?? []).map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <textarea id="answer" required rows={3} value={answer} onChange={e => setAnswer(e.target.value)} className={`${inputCls} resize-none`} />
        )}
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox" checked={newsletterOptin}
          onChange={e => setNewsletterOptin(e.target.checked)}
          className="mt-0.5 accent-ag-navy shrink-0 w-4 h-4"
        />
        <span className="font-sans text-[12px] text-ag-gray leading-snug">{ui.newsletterLabel}</span>
      </label>

      {status === 'error' && (
        <p className="font-sans text-xs text-red-400">
          {ui.error}{' '}
          <a href="mailto:contact@boha-group.com" className="underline underline-offset-2 hover:text-red-300 transition-colors">
            contact@boha-group.com
          </a>
        </p>
      )}

      <button
        type="submit"
        disabled={!isComplete || status === 'sending'}
        className={`group flex items-center gap-3 rounded-full px-7 py-3.5 font-sans text-sm font-bold transition-all ${
          isComplete ? 'bg-ag-apex text-ag-navy hover:bg-ag-navy hover:text-white cursor-pointer' : 'bg-ag-border text-ag-gray-light cursor-not-allowed'
        } disabled:opacity-70`}
      >
        {status === 'sending' ? ui.sending : ui.submit}
        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </button>

      <p className="font-sans text-[12px] text-ag-gray-light">
        <Link href={`/${locale}${contactPath}`} className="underline underline-offset-2 hover:text-ag-gray">{ui.backToGeneral}</Link>
      </p>
    </form>
  )
}
