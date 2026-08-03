'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle, ArrowUpRight } from 'lucide-react'

type Lot = {
  asset_id:   string
  lot_number: string
  slug:       string
  name?:      string
  adjudicated?: boolean
  final_price?: string
  buyer_note?:  string
}

export default function SessionResultsPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const id = params.id

  const [session, setSession]   = useState<Record<string, unknown> | null>(null)
  const [lots,    setLots]      = useState<Lot[]>([])
  const [saving,  setSaving]    = useState(false)
  const [saved,   setSaved]     = useState(false)
  const [error,   setError]     = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/sessions/${id}/results`)
      .then(r => r.json())
      .then(d => {
        setSession(d.session)
        setLots((d.lots ?? []) as Lot[])
      })
      .catch(() => setError('Impossible de charger la session'))
  }, [id])

  function updateLot(idx: number, field: keyof Lot, value: string | boolean) {
    setLots(prev => prev.map((l, i) => i === idx ? { ...l, [field]: value } : l))
  }

  async function publish() {
    setSaving(true); setError(null)
    try {
      const res = await fetch(`/api/admin/sessions/${id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lots, status: 'published' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      setSaved(true)
      setTimeout(() => router.push('/admin/sessions'), 1500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
      setSaving(false)
    }
  }

  if (!session) return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center">
      {error
        ? <p className="text-red-600 text-[13px]">{error}</p>
        : <Loader2 size={20} className="animate-spin text-gray-400" />}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/sessions" className="font-sans text-[12px] text-gray-400 hover:text-gray-700">
          ← Sessions
        </Link>
        <span className="text-gray-200">|</span>
        <h1 className="font-sans font-bold text-gray-900 text-[15px]">
          Publication des résultats — {String(session.name ?? '')}
        </h1>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {saved && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-5 py-4 text-emerald-700">
            <CheckCircle size={16} />
            <span className="font-sans text-[13px] font-semibold">Session publiée avec succès.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">{error}</div>
        )}

        <div className="bg-blue-50 border border-blue-100 px-5 py-4 text-[12px] text-blue-700">
          Renseignez les résultats de chaque lot puis cliquez sur <strong>Publier les résultats</strong>.
          Le statut de la session passera à <em>published</em>.
        </div>

        {lots.length === 0 && (
          <div className="bg-white border border-gray-200 p-10 text-center text-[13px] text-gray-400">
            Aucun lot enregistré pour cette session.
          </div>
        )}

        {lots.map((lot, idx) => (
          <div key={lot.asset_id ?? idx} className="bg-white border border-gray-200">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Lot #{lot.lot_number}</span>
                <span className="font-sans font-semibold text-gray-800 text-[13px]">{lot.name ?? lot.slug}</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!lot.adjudicated}
                  onChange={e => updateLot(idx, 'adjudicated', e.target.checked)}
                  className="w-4 h-4 accent-emerald-600"
                />
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Adjugé</span>
              </label>
            </div>
            <div className="px-5 py-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Prix final (CHF)</label>
                <input
                  type="number"
                  value={lot.final_price ?? ''}
                  onChange={e => updateLot(idx, 'final_price', e.target.value)}
                  placeholder="ex: 1500000"
                  className="w-full border border-gray-200 px-3 py-2 text-[13px] font-mono focus:outline-none focus:border-ag-navy"
                />
              </div>
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1.5">Note (optionnel)</label>
                <input
                  type="text"
                  value={lot.buyer_note ?? ''}
                  onChange={e => updateLot(idx, 'buyer_note', e.target.value)}
                  placeholder="ex: Acquis par fonds PE suisse"
                  className="w-full border border-gray-200 px-3 py-2 text-[13px] font-sans focus:outline-none focus:border-ag-navy"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button
            onClick={publish}
            disabled={saving || saved}
            className="flex items-center gap-2 bg-emerald-700 text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-emerald-800 transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={12} className="animate-spin" /> : <ArrowUpRight size={12} />}
            Publier les résultats
          </button>
          <Link href="/admin/sessions"
            className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 px-4 py-3 border border-gray-200 hover:border-gray-400 transition-colors">
            Annuler
          </Link>
        </div>

      </div>
    </div>
  )
}
