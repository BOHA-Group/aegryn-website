'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { NDA_ROLES, ROLE_LABELS, type NdaRole } from '@/lib/nda/template'

type Draft = { fullName: string; company: string; email: string; roles: NdaRole[] }
export type CreateDefaults = { name?: string; email?: string; project?: string; role?: string }

const inputCls = 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-ag-navy'
const labelCls = 'mb-1 block font-mono text-[10px] uppercase tracking-[0.18em] text-gray-500'

export default function NdaCreateForm({ defaults, initiallyOpen }: { defaults: CreateDefaults; initiallyOpen: boolean }) {
  const router = useRouter()
  const startRole = (NDA_ROLES as readonly string[]).includes(defaults.role ?? '') ? (defaults.role as NdaRole) : 'project_owner'
  const [open, setOpen] = useState(initiallyOpen)
  const [project, setProject] = useState(defaults.project ?? '')
  const [lang, setLang] = useState<'fr' | 'en'>('fr')
  const [term, setTerm] = useState(5)
  const [penalty, setPenalty] = useState('')
  const [send, setSend] = useState(true)
  const [signatories, setSignatories] = useState<Draft[]>([{ fullName: defaults.name ?? '', company: '', email: defaults.email ?? '', roles: [startRole] }])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const patch = (i: number, p: Partial<Draft>) => setSignatories(prev => prev.map((s, k) => (k === i ? { ...s, ...p } : s)))
  const toggleRole = (i: number, r: NdaRole) => patch(i, { roles: signatories[i].roles.includes(r) ? signatories[i].roles.filter(x => x !== r) : [...signatories[i].roles, r] })
  const valid = project.trim().length >= 2 && signatories.every(s => s.fullName.trim().length >= 2 && s.email.includes('@') && s.roles.length > 0)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || busy) return
    setBusy(true); setError(null)
    const res = await fetch('/api/admin/nda', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectLabel: project, lang, termYears: term, penaltyChf: penalty ? parseInt(penalty, 10) : null, send,
        sourceContactEmail: defaults.email ?? null,
        signatories: signatories.map(s => ({ fullName: s.fullName, company: s.company || null, email: s.email, roles: s.roles })),
      }),
    })
    const body = await res.json().catch(() => ({}))
    if (res.ok && body.id) { router.push(`/admin/nda/${body.id}`); return }
    setError(body.error === 'not_configured' ? 'Signataire Aegryn non configuré (NDA_AEGRYN_SIGNATORY_NAME et NDA_AEGRYN_SIGNATORY_TITLE).' : `Échec de la création (${body.error ?? res.status}).`)
    setBusy(false)
  }

  if (!open) {
    return <button onClick={() => setOpen(true)} className="rounded-lg bg-ag-navy px-4 py-2 text-sm font-semibold text-white hover:bg-ag-navy-mid">Nouvel accord</button>
  }

  return (
    <form onSubmit={submit} className="space-y-5 rounded-xl border border-gray-200 bg-white p-6">
      <div className="grid gap-4 md:grid-cols-[1fr_120px_120px_160px]">
        <div><label className={labelCls}>Objet de l’accord (projet)</label><input className={inputCls} value={project} onChange={e => setProject(e.target.value)} maxLength={200} placeholder="Ex. Projet Alpha, cadrage et réalisation" /></div>
        <div><label className={labelCls}>Langue</label><select className={inputCls} value={lang} onChange={e => setLang(e.target.value as 'fr' | 'en')}><option value="fr">Français</option><option value="en">English</option></select></div>
        <div><label className={labelCls}>Durée (ans)</label><select className={inputCls} value={term} onChange={e => setTerm(parseInt(e.target.value, 10))}>{[3, 5, 7, 10].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
        <div><label className={labelCls}>Peine conv. (CHF)</label><input className={inputCls} inputMode="numeric" value={penalty} onChange={e => setPenalty(e.target.value.replace(/\D/g, ''))} placeholder="Aucune" /></div>
      </div>

      <div className="space-y-4">
        {signatories.map((s, i) => (
          <div key={i} className="space-y-3 rounded-lg border border-gray-200 bg-gray-50/60 p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div><label className={labelCls}>Nom complet</label><input className={inputCls} value={s.fullName} onChange={e => patch(i, { fullName: e.target.value })} /></div>
              <div><label className={labelCls}>Société (facultatif)</label><input className={inputCls} value={s.company} onChange={e => patch(i, { company: e.target.value })} /></div>
              <div><label className={labelCls}>E-mail</label><input className={inputCls} type="email" value={s.email} onChange={e => patch(i, { email: e.target.value })} /></div>
            </div>
            <div>
              <p className={labelCls}>Profils (annexes incluses)</p>
              <div className="flex flex-wrap gap-2">
                {NDA_ROLES.map(r => (
                  <label key={r} className={`cursor-pointer rounded-full border px-3 py-1 text-[12px] ${s.roles.includes(r) ? 'border-ag-navy bg-ag-navy text-white' : 'border-gray-300 bg-white text-gray-600'}`}>
                    <input type="checkbox" className="sr-only" checked={s.roles.includes(r)} onChange={() => toggleRole(i, r)} />{ROLE_LABELS.fr[r]}
                  </label>
                ))}
              </div>
            </div>
            {signatories.length > 1 && <button type="button" className="text-[12px] text-red-600 underline" onClick={() => setSignatories(prev => prev.filter((_, k) => k !== i))}>Retirer ce signataire</button>}
          </div>
        ))}
        <button type="button" className="text-[13px] font-semibold text-ag-navy underline" onClick={() => setSignatories(prev => [...prev, { fullName: '', company: '', email: '', roles: ['project_owner'] }])}>+ Ajouter un signataire</button>
      </div>

      <label className="flex items-center gap-2 text-[13px] text-gray-700"><input type="checkbox" checked={send} onChange={e => setSend(e.target.checked)} className="accent-ag-navy" />Envoyer les liens de signature maintenant</label>
      {error && <p className="text-[13px] text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button disabled={!valid || busy} className="rounded-lg bg-ag-navy px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{busy ? 'Création...' : 'Créer l’accord'}</button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-gray-300 px-5 py-2 text-sm text-gray-600">Annuler</button>
      </div>
    </form>
  )
}
