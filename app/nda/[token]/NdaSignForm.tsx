'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NDA_PAGE } from './ndaText'
import type { NdaLang } from '@/lib/nda/template'

export default function NdaSignForm({ token, lang, expectedName }: { token: string; lang: NdaLang; expectedName: string }) {
  const t = NDA_PAGE[lang]
  const router = useRouter()
  const [name, setName] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ready = name.trim().length >= 2 && accepted && !busy

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setBusy(true); setError(null)
    try {
      const res = await fetch('/api/nda/agreements/sign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, signedName: name, accept: true }),
      })
      if (res.ok) { router.refresh(); return }
      const body = await res.json().catch(() => ({}))
      setError(body?.error === 'expired' || body?.error === 'revoked' || body?.error === 'invalid' ? t.errorExpired : body?.error === 'bad_name' ? t.errorName : t.error)
    } catch { setError(t.error) }
    setBusy(false)
  }

  return (
    <form onSubmit={submit} className="space-y-6 rounded-2xl border border-ag-border bg-white p-6 md:p-8">
      <div>
        <label htmlFor="signedName" className="mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{t.nameLabel}</label>
        <input
          id="signedName" type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)} maxLength={120}
          placeholder={expectedName}
          className="w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-base italic text-ag-navy outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10"
        />
        <p className="mt-1 font-sans text-[11px] text-ag-gray-light">{t.nameHelp}</p>
      </div>
      <label className="flex items-start gap-3 cursor-pointer">
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-ag-navy" />
        <span className="font-sans text-[13px] text-ag-black leading-relaxed">{t.accept}</span>
      </label>
      {error && <p className="font-sans text-[12px] text-red-500">{error}</p>}
      <button
        type="submit" disabled={!ready}
        className={`rounded-full px-7 py-3.5 font-sans text-sm font-bold transition-all ${ready ? 'bg-ag-apex text-ag-navy hover:bg-ag-navy hover:text-white cursor-pointer' : 'bg-ag-border text-ag-gray-light cursor-not-allowed'}`}
      >
        {busy ? t.signing : t.submit}
      </button>
    </form>
  )
}
