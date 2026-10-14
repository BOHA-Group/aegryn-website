'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NDA_ROLES, ROLE_LABELS, type NdaRole } from '@/lib/nda/template'

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-ag-navy'
const labelCls = 'mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500'

export function SignatoryActions({ id, status, hasPdf }: { id: string; status: string; hasPdf: boolean }) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  async function act(action: 'resend' | 'revoke' | 'regenerate') {
    if (action === 'revoke' && !confirm('Révoquer ce lien ? Le signataire ne pourra plus signer.')) return
    setBusy(action); setMsg(null)
    const res = await fetch(`/api/admin/nda/signatories/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }) })
    setBusy(null)
    if (res.ok) router.refresh(); else setMsg('Échec de l’action.')
  }
  const btn = 'rounded-md border border-gray-300 px-2.5 py-1 text-[12px] text-gray-700 hover:bg-gray-100 disabled:opacity-40'
  return (
    <div className="flex flex-wrap items-center gap-2">
      {(status === 'pending' || status === 'expired') && <button className={btn} disabled={!!busy} onClick={() => act('resend')}>{busy === 'resend' ? '...' : 'Renvoyer le lien'}</button>}
      {(status === 'pending' || status === 'expired') && <button className={`${btn} text-red-600`} disabled={!!busy} onClick={() => act('revoke')}>Révoquer</button>}
      {status === 'signed' && hasPdf && <a className={btn} href={`/api/admin/nda/signatories/${id}/pdf`}>Télécharger le PDF</a>}
      {status === 'signed' && !hasPdf && <button className={btn} disabled={!!busy} onClick={() => act('regenerate')}>{busy === 'regenerate' ? '...' : 'Régénérer le PDF'}</button>}
      {msg && <span className="text-[12px] text-red-600">{msg}</span>}
    </div>
  )
}

export function AddSignatory({ agreementId }: { agreementId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [roles, setRoles] = useState<NdaRole[]>(['project_owner'])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const valid = fullName.trim().length >= 2 && email.includes('@') && roles.length > 0

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || busy) return
    setBusy(true); setError(null)
    const res = await fetch(`/api/admin/nda/${agreementId}/signatories`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, company: company || null, email, roles, send: true }),
    })
    setBusy(false)
    if (res.ok) { setOpen(false); setFullName(''); setCompany(''); setEmail(''); router.refresh() } else setError('Échec de l’ajout.')
  }

  if (!open) return <button onClick={() => setOpen(true)} className="rounded-lg bg-ag-navy px-4 py-2 text-sm font-semibold text-white">Distribuer à un autre signataire</button>
  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-gray-200 bg-white p-5">
      <div className="grid gap-3 md:grid-cols-3">
        <div><label className={labelCls}>Nom complet</label><input className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} /></div>
        <div><label className={labelCls}>Société (facultatif)</label><input className={inputCls} value={company} onChange={e => setCompany(e.target.value)} /></div>
        <div><label className={labelCls}>E-mail</label><input className={inputCls} type="email" value={email} onChange={e => setEmail(e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {NDA_ROLES.map(r => (
          <label key={r} className={`cursor-pointer rounded-full border px-3 py-1 text-[12px] ${roles.includes(r) ? 'border-ag-navy bg-ag-navy text-white' : 'border-gray-300 bg-white text-gray-600'}`}>
            <input type="checkbox" className="sr-only" checked={roles.includes(r)} onChange={() => setRoles(p => (p.includes(r) ? p.filter(x => x !== r) : [...p, r]))} />{ROLE_LABELS.fr[r]}
          </label>
        ))}
      </div>
      {error && <p className="text-[13px] text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button disabled={!valid || busy} className="rounded-lg bg-ag-navy px-5 py-2 text-sm font-semibold text-white disabled:opacity-40">{busy ? 'Envoi...' : 'Ajouter et envoyer le lien'}</button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-600">Annuler</button>
      </div>
    </form>
  )
}
