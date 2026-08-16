'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Trash2 } from 'lucide-react'

type LotValues = {
  name:              string
  tagline:           string
  catalog_context:   string
  lot_number:        string
  slug:              string
  status:            string
  session_opens_at:  string
  session_closes_at: string
  reserve_price:     string
  buyer_premium_pct: string
  access_circle:     string
}

const STATUSES = ['draft', 'published', 'archived', 'withdrawn'] as const

export default function LotEditForm({ lot }: { lot: Record<string, unknown> }) {
  const router = useRouter()
  const id = String(lot.id)

  const [values, setValues] = useState<LotValues>({
    name:              String(lot.name              ?? ''),
    tagline:           String(lot.tagline           ?? ''),
    catalog_context:   String(lot.catalog_context   ?? ''),
    lot_number:        String(lot.lot_number        ?? ''),
    slug:              String(lot.slug              ?? ''),
    status:            String(lot.status            ?? 'draft'),
    session_opens_at:  lot.session_opens_at  ? String(lot.session_opens_at).slice(0, 16)  : '',
    session_closes_at: lot.session_closes_at ? String(lot.session_closes_at).slice(0, 16) : '',
    reserve_price:     lot.reserve_price     != null ? String(lot.reserve_price) : '',
    buyer_premium_pct: lot.buyer_premium_pct != null ? String(lot.buyer_premium_pct) : '10',
    access_circle:     lot.access_circle     != null ? String(lot.access_circle) : '2',
  })
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error,    setError]    = useState<string | null>(null)

  function set(k: keyof LotValues, v: string) {
    setValues(prev => ({ ...prev, [k]: v }))
  }

  async function handleSave() {
    setSaving(true); setError(null)
    try {
      const body: Record<string, unknown> = { ...values }
      if (!body.session_opens_at)  body.session_opens_at  = null
      if (!body.session_closes_at) body.session_closes_at = null
      if (body.reserve_price     === '') body.reserve_price = null
      else body.reserve_price = Number(body.reserve_price)
      body.buyer_premium_pct = Number(body.buyer_premium_pct)
      body.access_circle     = Number(body.access_circle)

      const res  = await fetch(`/api/admin/lots/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      router.push('/admin/transaction/lots')
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Supprimer définitivement le lot "${values.name}" ? Action irréversible.`)) return
    setDeleting(true); setError(null)
    try {
      const res  = await fetch(`/api/admin/lots/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      router.push('/admin/transaction/lots')
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

      {/* Nom + Lot number */}
      <div className="grid grid-cols-[1fr_140px] gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Nom du lot *</label>
          <input type="text" value={values.name} onChange={e => set('name', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] focus:outline-none focus:border-ag-navy"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">N° de lot</label>
          <input type="text" value={values.lot_number} onChange={e => set('lot_number', e.target.value)}
            placeholder="ex: 001"
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:border-ag-navy"
          />
        </div>
      </div>

      {/* Slug + Statut */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Slug</label>
          <input type="text" value={values.slug} onChange={e => set('slug', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:border-ag-navy"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Statut</label>
          <select value={values.status} onChange={e => set('status', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] bg-white focus:outline-none focus:border-ag-navy">
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Tagline + contexte */}
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Tagline</label>
        <input type="text" value={values.tagline} onChange={e => set('tagline', e.target.value)}
          placeholder="ex: SaaS B2B — analyse IA des contrats"
          className="w-full border border-gray-200 px-3 py-2.5 text-[13px] focus:outline-none focus:border-ag-navy"
        />
      </div>
      <div>
        <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Contexte catalogue</label>
        <input type="text" value={values.catalog_context} onChange={e => set('catalog_context', e.target.value)}
          placeholder="ex: Session Q3 2026 · SaaS B2B"
          className="w-full border border-gray-200 px-3 py-2.5 text-[13px] focus:outline-none focus:border-ag-navy"
        />
      </div>

      {/* Fenêtre de session */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Ouverture session</label>
          <input type="datetime-local" value={values.session_opens_at} onChange={e => set('session_opens_at', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] focus:outline-none focus:border-ag-navy"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Clôture session</label>
          <input type="datetime-local" value={values.session_closes_at} onChange={e => set('session_closes_at', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] focus:outline-none focus:border-ag-navy"
          />
        </div>
      </div>

      {/* Mise à prix + Commission + Cercle */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Mise à prix (CHF)</label>
          <input type="number" value={values.reserve_price} onChange={e => set('reserve_price', e.target.value)}
            placeholder="ex: 1000000"
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:border-ag-navy"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Commission acq. (%)</label>
          <input type="number" min="0" max="30" step="0.5" value={values.buyer_premium_pct} onChange={e => set('buyer_premium_pct', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] font-mono focus:outline-none focus:border-ag-navy"
          />
        </div>
        <div>
          <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1.5">Cercle d'accès (1–3)</label>
          <select value={values.access_circle} onChange={e => set('access_circle', e.target.value)}
            className="w-full border border-gray-200 px-3 py-2.5 text-[13px] bg-white focus:outline-none focus:border-ag-navy">
            <option value="1">1 — Vendeurs</option>
            <option value="2">2 — Acquéreurs qualifiés</option>
            <option value="3">3 — Observateurs</option>
          </select>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button onClick={handleSave} disabled={saving || deleting}
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-3 hover:bg-ag-black transition-colors disabled:opacity-50">
          {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
          Enregistrer
        </button>
        <button onClick={() => router.back()}
          className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 px-4 py-3 border border-gray-200 hover:border-gray-400 transition-colors">
          Annuler
        </button>
        <button onClick={handleDelete} disabled={saving || deleting}
          className="ml-auto flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-red-600 hover:text-red-800 px-4 py-3 border border-red-200 hover:border-red-400 transition-colors disabled:opacity-50">
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Supprimer le lot
        </button>
      </div>
    </div>
  )
}
