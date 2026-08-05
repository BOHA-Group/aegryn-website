'use client'

import { useState } from 'react'
import { Loader2, Pencil, Trash2, X, Check } from 'lucide-react'

export type Introduction = {
  id:                  string
  introduction_type:   string
  contact_name:        string
  contact_email:       string
  introduction_status: string
  context_note:        string | null
  created_at:          string
  admin_note:          string | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new:          { label: 'Nouvelle',    color: 'text-blue-600 border-blue-200 bg-blue-50' },
  contacted:    { label: 'Contactée',   color: 'text-gray-500 border-gray-200 bg-gray-50' },
  qualified:    { label: 'Qualifiée',   color: 'text-amber-600 border-amber-200 bg-amber-50' },
  closed_won:   { label: 'Convertie',   color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  closed_lost:  { label: 'Non retenue', color: 'text-red-400 border-red-100 bg-red-50' },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type EditState = {
  introduction_type: 'asset' | 'buyer'
  contact_name:      string
  contact_email:     string
  context_note:      string
}

export default function IntroductionsList({ initial }: { initial: Introduction[] }) {
  const [items,    setItems]    = useState(initial)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [editData, setEditData] = useState<EditState | null>(null)
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error,    setError]    = useState('')

  function startEdit(intro: Introduction) {
    setEditId(intro.id)
    setEditData({
      introduction_type: intro.introduction_type as 'asset' | 'buyer',
      contact_name:      intro.contact_name,
      contact_email:     intro.contact_email,
      context_note:      intro.context_note ?? '',
    })
    setError('')
  }

  function cancelEdit() {
    setEditId(null)
    setEditData(null)
    setError('')
  }

  async function saveEdit(id: string) {
    if (!editData) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`/api/partner/introductions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          introduction_type: editData.introduction_type,
          contact_name:      editData.contact_name.trim(),
          contact_email:     editData.contact_email.trim(),
          context_note:      editData.context_note.trim() || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la sauvegarde.')
      setItems(prev => prev.map(i => i.id === id ? {
        ...i,
        introduction_type: editData.introduction_type,
        contact_name:      editData.contact_name.trim(),
        contact_email:     editData.contact_email.trim(),
        context_note:      editData.context_note.trim() || null,
      } : i))
      cancelEdit()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setSaving(false)
    }
  }

  async function deleteIntro(id: string) {
    if (!window.confirm('Supprimer cette introduction ? Cette action est irréversible.')) return
    setDeleting(id)
    setError('')
    try {
      const res = await fetch(`/api/partner/introductions/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la suppression.')
      setItems(prev => prev.filter(i => i.id !== id))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setDeleting(null)
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 px-8 py-12 text-center">
        <p className="font-sans text-[14px] text-gray-400">Aucune introduction soumise pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {error && (
        <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>
      )}
      {items.map(intro => {
        const statusCfg = STATUS_CONFIG[intro.introduction_status] ?? STATUS_CONFIG.new
        const isEditing = editId === intro.id
        const canEdit   = intro.introduction_status === 'new'

        if (isEditing && editData) {
          return (
            <div key={intro.id} className="bg-white border-2 border-ag-navy p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ag-navy">Modifier l&apos;introduction</p>
                <button type="button" onClick={cancelEdit} className="text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Type */}
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Type</p>
                  <div className="flex gap-2">
                    {(['asset', 'buyer'] as const).map(t => (
                      <button key={t} type="button"
                        onClick={() => setEditData(d => d ? { ...d, introduction_type: t } : d)}
                        className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                          editData.introduction_type === t
                            ? 'bg-ag-navy text-white border-ag-navy'
                            : 'text-gray-500 border-gray-300 hover:border-gray-500'
                        }`}>
                        {t === 'asset' ? 'Apport actif' : 'Apport acquéreur'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Nom *</label>
                    <input
                      type="text" required
                      value={editData.contact_name}
                      onChange={e => setEditData(d => d ? { ...d, contact_name: e.target.value } : d)}
                      className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-ag-navy"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Email *</label>
                    <input
                      type="email" required
                      value={editData.contact_email}
                      onChange={e => setEditData(d => d ? { ...d, contact_email: e.target.value } : d)}
                      className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-ag-navy"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Contexte (optionnel)</label>
                  <textarea
                    rows={3}
                    value={editData.context_note}
                    onChange={e => setEditData(d => d ? { ...d, context_note: e.target.value } : d)}
                    className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[12px] focus:outline-none focus:border-ag-navy resize-none"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => saveEdit(intro.id)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2 hover:bg-ag-black transition-colors disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                    Enregistrer
                  </button>
                  <button type="button" onClick={cancelEdit}
                    className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            </div>
          )
        }

        return (
          <div key={intro.id} className="bg-white border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-sans font-semibold text-gray-900 text-[14px]">{intro.contact_name}</p>
                  <span className="font-mono text-[8px] uppercase tracking-widest text-gray-400 border border-gray-200 px-1.5 py-0.5">
                    {intro.introduction_type === 'asset' ? 'Actif' : 'Acquéreur'}
                  </span>
                </div>
                <p className="font-sans text-[11px] text-gray-400">{intro.contact_email}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${statusCfg.color}`}>
                  {statusCfg.label}
                </span>
                {canEdit && (
                  <>
                    <button
                      type="button"
                      onClick={() => startEdit(intro)}
                      title="Modifier"
                      className="p-1.5 text-gray-400 hover:text-ag-navy border border-transparent hover:border-gray-200 transition-colors"
                    >
                      <Pencil size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteIntro(intro.id)}
                      disabled={deleting === intro.id}
                      title="Supprimer"
                      className="p-1.5 text-gray-400 hover:text-red-500 border border-transparent hover:border-red-100 transition-colors"
                    >
                      {deleting === intro.id
                        ? <Loader2 size={12} className="animate-spin" />
                        : <Trash2 size={12} />
                      }
                    </button>
                  </>
                )}
              </div>
            </div>

            {intro.context_note && (
              <p className="font-sans text-[11px] text-gray-500 mb-3 italic border-l-2 border-gray-200 pl-3">
                {intro.context_note}
              </p>
            )}

            {intro.admin_note && (
              <div className="bg-gray-50 border border-gray-200 px-3 py-2 mb-3">
                <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400 mb-1">Note AEGRYN</p>
                <p className="font-sans text-[11px] text-gray-600">{intro.admin_note}</p>
              </div>
            )}

            <p className="font-mono text-[9px] text-gray-300">
              Soumise le {fmtDate(intro.created_at)}
              {!canEdit && <span className="ml-2 text-gray-400">(non modifiable — déjà traitée)</span>}
            </p>
          </div>
        )
      })}
    </div>
  )
}
