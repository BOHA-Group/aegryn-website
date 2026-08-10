'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Trash2 } from 'lucide-react'

type SessionValues = {
  name: string
  type: string
  theme: string
  session_date: string
  location: string
  format: string
  status: string
  notes: string
}

type Props = {
  mode:      'create' | 'edit'
  sessionId?: string
  initial?:  Partial<SessionValues>
}

const STATUSES = ['planning', 'confirmed', 'open', 'live', 'closed', 'published'] as const
const FORMATS  = ['digital', 'physical', 'hybrid'] as const
const TYPES    = ['main', 'thematic'] as const

const STATUS_LABELS: Record<string, string> = {
  planning: 'Planification', confirmed: 'Confirmée', open: 'Ouverte',
  live: 'En cours', closed: 'Clôturée', published: 'Publiée',
}
const FORMAT_LABELS: Record<string, string> = { digital: 'Digital', physical: 'Physique', hybrid: 'Hybride' }

export default function SessionForm({ mode, sessionId, initial }: Props) {
  const router = useRouter()

  const [values, setValues] = useState<SessionValues>({
    name:         initial?.name         ?? '',
    type:         initial?.type         ?? 'main',
    theme:        initial?.theme        ?? '',
    session_date: initial?.session_date ? String(initial.session_date).slice(0, 16) : '',
    location:     initial?.location     ?? '',
    format:       initial?.format       ?? 'digital',
    status:       initial?.status       ?? 'planning',
    notes:        initial?.notes        ?? '',
  })
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  function set(k: keyof SessionValues, v: string) {
    setValues(prev => ({ ...prev, [k]: v }))
  }

  async function handleSave() {
    if (!values.name.trim()) { setError('Le nom est requis'); return }
    setSaving(true); setError(null)
    try {
      const url  = mode === 'create' ? '/api/admin/sessions' : `/api/admin/sessions/${sessionId}`
      const method = mode === 'create' ? 'POST' : 'PATCH'
      const body: Record<string, unknown> = { ...values }
      if (!body.session_date) body.session_date = null
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      router.push('/admin/sessions')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!sessionId) return
    if (!window.confirm('Supprimer définitivement cette session ? Action irréversible.')) return
    setDeleting(true); setError(null)
    try {
      const res  = await fetch(`/api/admin/sessions/${sessionId}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      router.push('/admin/sessions')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">{error}</div>
      )}

      {/* Nom */}
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Nom de la session *</label>
        <input
          type="text" value={values.name} onChange={e => set('name', e.target.value)}
          placeholder="ex: Session Aegryn Q3 2026"
          className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy"
        />
      </div>

      {/* Type + Thème */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Type</label>
          <select value={values.type} onChange={e => set('type', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy bg-white">
            {TYPES.map(t => <option key={t} value={t}>{t === 'main' ? 'Principale' : 'Thématique'}</option>)}
          </select>
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Thème (si thématique)</label>
          <input type="text" value={values.theme} onChange={e => set('theme', e.target.value)}
            placeholder="ex: SaaS B2B vertical"
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy"
          />
        </div>
      </div>

      {/* Date + Format */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Date de session</label>
          <input type="datetime-local" value={values.session_date} onChange={e => set('session_date', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Format</label>
          <select value={values.format} onChange={e => set('format', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy bg-white">
            {FORMATS.map(f => <option key={f} value={f}>{FORMAT_LABELS[f]}</option>)}
          </select>
        </div>
      </div>

      {/* Lieu + Statut */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Lieu</label>
          <input type="text" value={values.location} onChange={e => set('location', e.target.value)}
            placeholder="ex: Genève, Suisse"
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Statut</label>
          <select value={values.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy bg-white">
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Notes internes</label>
        <textarea rows={3} value={values.notes} onChange={e => set('notes', e.target.value)}
          placeholder="Notes visibles uniquement par l'admin Aegryn"
          className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy resize-none"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          disabled={saving || deleting}
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-3 hover:bg-ag-black transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          {mode === 'create' ? 'Créer la session' : 'Enregistrer'}
        </button>

        <button onClick={() => router.back()}
          className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 px-4 py-3 border border-gray-200 hover:border-gray-400 transition-colors">
          Annuler
        </button>

        {mode === 'edit' && sessionId && (
          <button
            onClick={handleDelete}
            disabled={saving || deleting}
            className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-red-600 hover:text-red-800 px-4 py-3 border border-red-200 hover:border-red-400 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
            Supprimer la session
          </button>
        )}
      </div>
    </div>
  )
}
