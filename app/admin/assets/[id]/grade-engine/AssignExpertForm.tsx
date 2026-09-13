'use client'

import { useState } from 'react'
import { UserPlus } from 'lucide-react'

type Existing = { id: string; dimension: string; status: string; scope: string; deadline_at: string | null; partner_email: string | null; partner_name: string | null }

const DIMENSIONS = [
  { value: 'code',         label: 'C — Code & Architecture' },
  { value: 'ip',           label: 'I — IP & Droits' },
  { value: 'finance',      label: 'F — Finance' },
  { value: 'security',     label: 'S — Sécurité' },
  { value: 'organisation', label: 'O — Organisation & Talent' },
]

export default function AssignExpertForm({ assetId, dossierType, existing }: { assetId: string; dossierType: 'certification' | 'transaction'; existing: Existing[] }) {
  const [email, setEmail]       = useState('')
  const [fullName, setFullName] = useState('')
  const [dimension, setDim]     = useState('finance')
  const [scope, setScope]       = useState<'certification' | 'transaction'>(dossierType)
  const [days, setDays]         = useState(15)
  const [note, setNote]         = useState('')
  const [msg, setMsg]           = useState<string | null>(null)
  const [busy, setBusy]         = useState(false)
  const [rows, setRows]         = useState(existing)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const res = await fetch(`/api/admin/assets/${assetId}/assign-expert`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fullName: fullName || undefined, dimension, scope, deadlineDays: days, note: note || undefined }),
    })
    const json = await res.json()
    setBusy(false)
    if (!res.ok) { setMsg(`Erreur : ${json.error ?? res.status}`); return }
    setMsg(json.invited
      ? `Invitation envoyée à ${email} : compte partenaire à créer, puis NDA et KYC. Mandat enregistré.`
      : `Mandat attribué à ${email} (compte existant).`)
    setRows(r => [{ id: json.certificationId, dimension, status: 'assigned', scope, deadline_at: json.deadline, partner_email: email, partner_name: fullName || null }, ...r.filter(x => !(x.partner_email === email && x.dimension === dimension))])
    setEmail(''); setFullName(''); setNote('')
  }

  const inputCls = 'w-full border border-gray-200 bg-white px-3 py-2 text-[12px] text-gray-900 focus:outline-none focus:border-gray-900'

  return (
    <section className="bg-white border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <UserPlus size={14} className="text-ag-navy" />
        <h2 className="font-sans font-bold text-gray-900 text-[14px]">Mandater un expert indépendant</h2>
      </div>
      <p className="font-sans text-[11px] text-gray-500 mb-4">
        Email externe accepté : l&apos;expert reçoit une invitation à créer son compte partenaire (NDA + KYC), puis accède
        <strong> uniquement</strong> aux pièces de sa dimension via la Data Room. Sa revue alimente la validation manuelle du grade.
      </p>

      {rows.length > 0 && (
        <div className="mb-4 flex flex-col gap-1.5">
          {rows.map(r => (
            <div key={r.id} className="flex flex-wrap items-center justify-between gap-2 border border-gray-100 px-3 py-2 text-[11px]">
              <span className="font-semibold text-gray-800">{DIMENSIONS.find(d => d.value === r.dimension)?.label ?? r.dimension}</span>
              <span className="text-gray-600">{r.partner_name ?? r.partner_email ?? '—'}</span>
              <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">{r.scope} · {r.status}{r.deadline_at ? ` · ${new Date(r.deadline_at).toLocaleDateString('fr-CH')}` : ''}</span>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input type="email" required placeholder="email de l'expert" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
        <input type="text" placeholder="Nom (optionnel, pour l'invitation)" value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} />
        <select value={dimension} onChange={e => setDim(e.target.value)} className={inputCls}>
          {DIMENSIONS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
        <div className="grid grid-cols-2 gap-3">
          <select value={scope} onChange={e => setScope(e.target.value as 'certification' | 'transaction')} className={inputCls}>
            <option value="certification">Certification CIFSO</option>
            <option value="transaction">Transaction</option>
          </select>
          <input type="number" min={1} max={90} value={days} onChange={e => setDays(Number(e.target.value))} className={inputCls} title="Échéance (jours)" />
        </div>
        <input type="text" placeholder="Note interne (optionnel)" value={note} onChange={e => setNote(e.target.value)} className={`${inputCls} sm:col-span-2`} />
        <div className="sm:col-span-2 flex items-center justify-between gap-3">
          <p className="font-sans text-[11px] text-gray-500 min-h-[1em]">{msg}</p>
          <button type="submit" disabled={busy}
            className="rounded-lg bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ag-navy/90 disabled:opacity-50 transition-colors shrink-0">
            {busy ? 'Envoi…' : 'Mandater'}
          </button>
        </div>
      </form>
    </section>
  )
}
