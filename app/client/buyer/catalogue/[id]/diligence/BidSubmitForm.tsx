'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send } from 'lucide-react'

function fmtChf(n: number) {
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

export default function BidSubmitForm({ assetId }: { assetId: string }) {
  const router   = useRouter()
  const [amount, setAmount]   = useState('')
  const [note,   setNote]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const parsedAmount  = parseFloat(amount)
  const validAmount   = !isNaN(parsedAmount) && parsedAmount >= 10000
  const sequesterAmt  = validAmount ? Math.round(parsedAmount * 0.1) : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validAmount) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/buyer/light-bid', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ asset_id: assetId, bid_amount_chf: parsedAmount, buyer_note: note }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? 'Une erreur est survenue.')
        return
      }
      router.refresh()
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Montant */}
      <div>
        <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1.5">
          Votre offre de principe (CHF) <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          min="10000"
          step="1000"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="ex. 500 000"
          className="w-full border border-gray-200 px-4 py-2.5 text-[14px] font-mono focus:outline-none focus:border-ag-navy/40 placeholder:text-gray-300"
          required
        />
        {sequesterAmt != null && (
          <p className="mt-1.5 font-mono text-[10px] text-indigo-600">
            Séquestre correspondant (10%) : <strong>{fmtChf(sequesterAmt)}</strong>
          </p>
        )}
        <p className="mt-1 font-sans text-[10px] text-gray-400">
          Montant minimum : CHF 10 000 — L&apos;offre est indicative et non-engageante avant approbation du vendeur.
        </p>
      </div>

      {/* Note optionnelle */}
      <div>
        <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1.5">
          Message au vendeur (optionnel)
        </label>
        <textarea
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Présentation de votre profil, intentions, questions..."
          className="w-full border border-gray-200 px-4 py-2.5 text-[13px] font-sans focus:outline-none focus:border-ag-navy/40 resize-none placeholder:text-gray-300"
        />
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-600">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading || !validAmount}
        className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-40"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
        Soumettre l&apos;offre de principe
      </button>
    </form>
  )
}
