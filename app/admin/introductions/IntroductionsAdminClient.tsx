'use client'

import { useState } from 'react'
import { Loader2, Check, Users } from 'lucide-react'

type Partner = {
  email:     string
  full_name: string | null
} | null

export type IntroductionAdmin = {
  id:                  string
  introduction_type:   string
  contact_name:        string
  contact_email:       string
  introduction_status: string
  context_note:        string | null
  admin_note:          string | null
  created_at:          string
  partner:             Partner
}

type Props = {
  introductions: IntroductionAdmin[]
}

const STATUS_OPTIONS = [
  { value: 'new',         label: 'Nouvelle',    color: 'text-blue-600 border-blue-200 bg-blue-50' },
  { value: 'contacted',   label: 'Contactée',   color: 'text-gray-500 border-gray-200 bg-gray-50' },
  { value: 'qualified',   label: 'Qualifiée',   color: 'text-amber-600 border-amber-200 bg-amber-50' },
  { value: 'closed_won',  label: 'Convertie',   color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  { value: 'closed_lost', label: 'Non retenue', color: 'text-red-400 border-red-100 bg-red-50' },
] as const

const FILTER_OPTIONS = [
  { value: 'all',         label: 'Toutes' },
  { value: 'new',         label: 'Nouvelles' },
  { value: 'contacted',   label: 'Contactées' },
  { value: 'qualified',   label: 'Qualifiées' },
  { value: 'closed_won',  label: 'Converties' },
  { value: 'closed_lost', label: 'Non retenues' },
] as const

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function IntroductionsAdminClient({ introductions: initial }: Props) {
  const [items,   setItems]   = useState(initial)
  const [filter,  setFilter]  = useState<string>('new')
  const [saving,  setSaving]  = useState<string | null>(null)
  const [noteId,  setNoteId]  = useState<string | null>(null)
  const [noteVal, setNoteVal] = useState('')
  const [error,   setError]   = useState('')

  const filtered = filter === 'all' ? items : items.filter(i => i.introduction_status === filter)

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = items.filter(i => i.introduction_status === s.value).length
    return acc
  }, {} as Record<string, number>)

  async function updateStatus(id: string, status: string) {
    setSaving(id + status)
    setError('')
    try {
      const res = await fetch(`/api/admin/introductions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ introduction_status: status }),
      })
      if (!res.ok) throw new Error('Erreur lors de la mise à jour.')
      setItems(prev => prev.map(i => i.id === id ? { ...i, introduction_status: status } : i))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur.')
    } finally {
      setSaving(null)
    }
  }

  async function saveNote(id: string) {
    setSaving(id + 'note')
    setError('')
    try {
      const res = await fetch(`/api/admin/introductions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_note: noteVal.trim() || null }),
      })
      if (!res.ok) throw new Error('Erreur lors de la sauvegarde.')
      setItems(prev => prev.map(i => i.id === id ? { ...i, admin_note: noteVal.trim() || null } : i))
      setNoteId(null)
      setNoteVal('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur.')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="p-8 max-w-6xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Administration</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Introductions partenaires</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Apports d&apos;affaires soumis par les partenaires — qualification et suivi.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        {STATUS_OPTIONS.map(s => (
          <div key={s.value} className={`border p-4 cursor-pointer transition-colors ${filter === s.value ? s.color : 'border-gray-200 bg-white hover:border-gray-300'}`}
            onClick={() => setFilter(s.value)}>
            <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
            <p className="font-sans font-bold text-[20px] text-gray-900">{counts[s.value] ?? 0}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-2 flex-wrap mb-6">
        {FILTER_OPTIONS.map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
              filter === f.value ? 'bg-ag-navy text-white border-ag-navy' : 'border-gray-200 text-gray-500 hover:border-gray-400'
            }`}
          >
            {f.label} {f.value !== 'all' && `(${counts[f.value] ?? 0})`}
          </button>
        ))}
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5 mb-4">{error}</p>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-12 text-center">
          <Users size={24} className="text-gray-300 mx-auto mb-3" />
          <p className="font-sans text-[13px] text-gray-400">Aucune introduction dans cette catégorie.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(intro => {
            const statusCfg = STATUS_OPTIONS.find(s => s.value === intro.introduction_status) ?? STATUS_OPTIONS[0]
            const isEditingNote = noteId === intro.id

            return (
              <div key={intro.id} className="bg-white border border-gray-200 p-5">

                <div className="flex items-start gap-4 flex-wrap">
                  {/* Infos contact */}
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-sans font-semibold text-gray-900 text-[14px]">{intro.contact_name}</p>
                      <span className="font-mono text-[8px] uppercase tracking-widest text-gray-400 border border-gray-200 px-1.5 py-0.5">
                        {intro.introduction_type === 'asset' ? 'Actif' : 'Acquéreur'}
                      </span>
                      <span className={`border px-2 py-0.5 font-mono text-[8px] uppercase tracking-widest ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-gray-500">{intro.contact_email}</p>
                    <p className="font-mono text-[9px] text-gray-300 mt-1">
                      Partenaire : {intro.partner?.full_name ?? intro.partner?.email ?? '—'}
                      {' · '}{fmtDate(intro.created_at)}
                    </p>
                  </div>

                  {/* Changer statut */}
                  <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s.value}
                        type="button"
                        disabled={saving !== null || intro.introduction_status === s.value}
                        onClick={() => updateStatus(intro.id, s.value)}
                        className={`font-mono text-[8px] uppercase tracking-widest px-2.5 py-1 border transition-colors disabled:opacity-40 ${
                          intro.introduction_status === s.value
                            ? s.color + ' cursor-default'
                            : 'border-gray-200 text-gray-500 hover:border-gray-400 bg-white'
                        }`}
                      >
                        {saving === intro.id + s.value
                          ? <Loader2 size={10} className="animate-spin" />
                          : s.label
                        }
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note contexte */}
                {intro.context_note && (
                  <p className="font-sans text-[11px] text-gray-500 mt-3 italic border-l-2 border-gray-200 pl-3">
                    {intro.context_note}
                  </p>
                )}

                {/* Note admin */}
                <div className="mt-3">
                  {isEditingNote ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        rows={2}
                        value={noteVal}
                        onChange={e => setNoteVal(e.target.value)}
                        placeholder="Note interne Aegryn…"
                        className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[12px] focus:outline-none focus:border-ag-navy resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => saveNote(intro.id)}
                          disabled={saving !== null}
                          className="flex items-center gap-1.5 bg-ag-navy text-white font-mono text-[9px] uppercase tracking-widest px-4 py-1.5 hover:bg-ag-black transition-colors disabled:opacity-50"
                        >
                          {saving === intro.id + 'note' ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
                          Enregistrer
                        </button>
                        <button type="button"
                          onClick={() => { setNoteId(null); setNoteVal('') }}
                          className="font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors">
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      {intro.admin_note ? (
                        <div className="flex-1 bg-amber-50 border border-amber-200 px-3 py-2">
                          <p className="font-mono text-[8px] uppercase tracking-widest text-amber-600 mb-0.5">Note interne</p>
                          <p className="font-sans text-[11px] text-gray-700">{intro.admin_note}</p>
                        </div>
                      ) : (
                        <p className="font-mono text-[9px] text-gray-300 flex-1">Aucune note interne.</p>
                      )}
                      <button
                        type="button"
                        onClick={() => { setNoteId(intro.id); setNoteVal(intro.admin_note ?? '') }}
                        className="font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-ag-navy border border-transparent hover:border-gray-200 px-2 py-1 transition-colors shrink-0"
                      >
                        {intro.admin_note ? 'Modifier' : '+ Note'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <a href={`/admin`}
          className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors">
          ← Retour au tableau de bord
        </a>
      </div>
    </div>
  )
}
