'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, SendHorizonal } from 'lucide-react'

type Props = {
  assetId: string
  userId: string
  assetName: string
}

export default function NewOfferForm({ assetId, assetName }: Props) {
  const router = useRouter()
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const parsed = parseFloat(amount.replace(/[^0-9.]/g, ''))
    if (!parsed || parsed <= 0) {
      setError('Veuillez saisir un montant valide.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/buyer/offres', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_id: assetId, amount_chf: parsed, message }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la soumission.')
      router.push(`/client/buyer/offres/${json.id}`)
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
          Montant de l&apos;offre (CHF) *
        </label>
        <input
          type="number"
          min="0"
          step="1000"
          required
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="ex. 2500000"
          className="w-full bg-white border border-gray-300 px-4 py-3 font-mono text-[14px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-ag-navy transition-colors"
        />
        <p className="font-sans text-[11px] text-gray-400 mt-1.5">
          Indiquez le montant indicatif de votre offre en CHF. Ce montant est non-engageant à ce stade.
        </p>
      </div>

      <div>
        <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
          Message à l&apos;équipe Aegryn (optionnel)
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder={`Présentez brièvement votre intérêt pour ${assetName}, votre profil d'acquéreur ou toute question préliminaire.`}
          className="w-full bg-white border border-gray-300 px-4 py-3 font-sans text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-ag-navy transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 size={12} className="animate-spin" /> : <SendHorizonal size={12} />}
          Soumettre l&apos;EI
        </button>
        <p className="font-sans text-[11px] text-gray-400">
          En soumettant, vous confirmez avoir lu et accepté les conditions de confidentialité Aegryn.
        </p>
      </div>
    </form>
  )
}
