'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUSES = [
  { value: 'awaited',  label: 'En attente de virement', color: 'text-amber-700' },
  { value: 'received', label: 'Reçu et confirmé — débloque la due diligence', color: 'text-green-700' },
  { value: 'released', label: 'Restitué', color: 'text-gray-500' },
  { value: 'applied',  label: 'Déduit (adjudicataire)', color: 'text-blue-700' },
  { value: 'forfeited','label': 'Perdu (défaillance)', color: 'text-red-600' },
] as const

type Status = (typeof STATUSES)[number]['value']

export default function SequesterStatusForm({
  sequesters_id,
  currentStatus,
  currentNote,
  currentBankRef,
}: {
  sequesters_id: string
  currentStatus: string
  currentNote: string
  currentBankRef: string
}) {
  const router = useRouter()
  const [status,   setStatus]   = useState<Status>(currentStatus as Status)
  const [note,     setNote]     = useState(currentNote)
  const [bankRef,  setBankRef]  = useState(currentBankRef)
  const [loading,  setLoading]  = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setFeedback(null)

    const res = await fetch('/api/transaction/sequester/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sequester_id: sequesters_id,
        status,
        admin_note: note || undefined,
        bank_ref:   bankRef || undefined,
      }),
    })
    const json = await res.json() as { ok?: boolean; error?: string }
    setLoading(false)

    if (!res.ok || !json.ok) {
      setFeedback({ ok: false, msg: json.error ?? 'Erreur serveur.' })
    } else {
      setFeedback({ ok: true, msg: 'Mise à jour enregistrée.' })
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 space-y-5 sticky top-6">
      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Modifier le statut</p>

      {/* Due dil callout */}
      <div className="bg-amber-50 border border-amber-100 px-4 py-3">
        <p className="font-sans text-[11px] text-amber-700 leading-relaxed">
          Passer à <strong>Reçu</strong> débloque la data room pour l&apos;acquéreur et bascule l&apos;offre en <code className="font-mono">due_diligence</code>.
        </p>
      </div>

      {/* Statut */}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">
          Statut
        </label>
        <div className="space-y-2">
          {STATUSES.map(s => (
            <label key={s.value} className={`flex items-start gap-3 cursor-pointer p-2.5 border transition-colors ${
              status === s.value ? 'border-gray-800 bg-gray-50' : 'border-gray-100 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="status"
                value={s.value}
                checked={status === s.value}
                onChange={() => setStatus(s.value)}
                className="mt-0.5 accent-gray-900"
              />
              <span className={`font-sans text-[11px] leading-snug ${s.color}`}>{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Référence bancaire */}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
          Référence bancaire
        </label>
        <input
          type="text"
          value={bankRef}
          onChange={e => setBankRef(e.target.value)}
          placeholder="SEPA ref / Swift ref…"
          className="w-full border border-gray-200 px-3 py-2 font-mono text-[11px] text-gray-700 focus:outline-none focus:border-gray-500"
        />
      </div>

      {/* Note admin */}
      <div>
        <label className="block font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1.5">
          Note interne (visible acquéreur si rejet)
        </label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={3}
          maxLength={1000}
          placeholder="Commentaire interne…"
          className="w-full border border-gray-200 px-3 py-2 font-sans text-[11px] text-gray-700 focus:outline-none focus:border-gray-500 resize-none"
        />
      </div>

      {feedback && (
        <p className={`font-sans text-[11px] ${feedback.ok ? 'text-green-600' : 'text-red-500'}`}>
          {feedback.msg}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white font-mono text-[10px] uppercase tracking-widest py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-40"
      >
        {loading ? 'Enregistrement…' : 'Enregistrer le statut'}
      </button>
    </form>
  )
}
