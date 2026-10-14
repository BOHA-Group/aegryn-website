'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NDA_PAGE } from './ndaText'
import type { NdaLang } from '@/lib/nda/template'

/**
 * Bloc de signature, calqué sur la page de signatures du PDF :
 * à gauche Aegryn (contresignature automatique), à droite le Signataire (action).
 * Le bouton n'est jamais désactivé : s'il manque le nom ou la case, un message
 * explicite s'affiche et le champ concerné prend le focus.
 */
export default function NdaSignForm({ token, lang, expectedName, aegryn }: {
  token: string; lang: NdaLang; expectedName: string; aegryn: { name: string; title: string }
}) {
  const t = NDA_PAGE[lang]
  const router = useRouter()
  const [name, setName] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const complete = name.trim().length >= 2 && accepted

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (busy) return
    if (name.trim().length < 2) { setError(t.needName); document.getElementById('signedName')?.focus(); return }
    if (!accepted) { setError(t.needAccept); document.getElementById('acceptBox')?.focus(); return }
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/nda/agreements/sign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, signedName: name, accept: true }),
      })
      if (res.ok) { router.refresh(); return }
      const body = await res.json().catch(() => ({}))
      setError(body?.error === 'expired' || body?.error === 'revoked' || body?.error === 'invalid' ? t.errorExpired : body?.error === 'bad_name' ? t.needName : t.error)
    } catch { setError(t.error) }
    setBusy(false)
  }

  return (
    <form onSubmit={submit} noValidate className="overflow-hidden rounded-sm bg-white shadow-[0_10px_40px_rgba(15,28,63,0.18)]">
      <div className="border-t-4 border-ag-apex bg-ag-navy px-6 py-5 md:px-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex">{t.stepLabel}</p>
        <h2 className="mt-1 font-sans text-[22px] font-bold tracking-tight text-white">{t.signTitle}</h2>
        <p className="mt-1 text-[13px] text-white/70">{t.signIntro}</p>
      </div>

      <div className="grid gap-px bg-ag-border md:grid-cols-2">
        {/* Aegryn : contresignature automatique */}
        <div className="bg-ag-off-white px-6 py-6 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{t.forAegryn}</p>
          <p className="mt-5 border-b border-ag-border pb-2 font-sans text-[22px] italic text-ag-navy/80">{aegryn.name}</p>
          <p className="mt-2 text-[13px] text-ag-gray">{aegryn.title}</p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-ag-border bg-white px-3 py-1 text-[11px] text-ag-gray">
            <span className="h-1.5 w-1.5 rounded-full bg-ag-apex" />{t.autoCounter}
          </p>
          <p className="mt-2 text-[12px] text-ag-gray-light">{t.autoCounterNote}</p>
        </div>

        {/* Signataire : action */}
        <div className="bg-white px-6 py-6 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-apex-ink">{t.theSignatory} · {t.yourSignature}</p>
          <label htmlFor="signedName" className="mt-5 block font-sans text-[11px] font-semibold text-ag-gray">{t.nameLabel}</label>
          <input
            id="signedName" type="text" autoComplete="name" value={name} onChange={e => { setName(e.target.value); setError(null) }} maxLength={120}
            placeholder={expectedName}
            className="mt-1 w-full border-0 border-b-2 border-ag-navy bg-transparent px-0 py-2 font-sans text-[22px] italic text-ag-navy outline-none placeholder:text-ag-gray-light/60 focus:border-ag-apex"
          />
          <p className="mt-2 text-[12px] text-ag-gray-light">{t.nameHelp}</p>
        </div>
      </div>

      <div className="space-y-5 border-t border-ag-border bg-white px-6 py-6 md:px-10">
        <label className="flex cursor-pointer items-start gap-3">
          <input id="acceptBox" type="checkbox" checked={accepted} onChange={e => { setAccepted(e.target.checked); setError(null) }} className="mt-1 h-4 w-4 shrink-0 accent-ag-navy" />
          <span className="font-sans text-[13px] leading-relaxed text-ag-black">{t.accept}</span>
        </label>
        {error && <p role="alert" className="font-sans text-[13px] font-semibold text-red-600">{error}</p>}
        <button
          type="submit" disabled={busy}
          className={`w-full rounded-full px-7 py-4 font-sans text-sm font-bold transition-all md:w-auto ${complete ? 'bg-ag-apex text-ag-navy hover:bg-ag-navy hover:text-white' : 'bg-ag-navy/10 text-ag-navy/70 hover:bg-ag-navy/15'} ${busy ? 'cursor-wait opacity-70' : 'cursor-pointer'}`}
        >
          {busy ? t.signing : t.submit}
        </button>
      </div>
    </form>
  )
}
