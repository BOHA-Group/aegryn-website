'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send } from 'lucide-react'

export default function AccessRequestButton({ assetId }: { assetId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleRequest() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/buyer/data-room-light', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ asset_id: assetId }),
      })
      const json = await res.json() as { ok?: boolean; error?: string; already_exists?: boolean }
      if (!res.ok && !json.already_exists) {
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
    <div className="space-y-3">
      <button
        type="button"
        disabled={loading}
        onClick={handleRequest}
        className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-40"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
        Demander l&apos;accès à la data room light
      </button>
      {error && <p className="font-sans text-[12px] text-red-600">{error}</p>}
      <p className="font-sans text-[10px] text-gray-400">
        Traitement sous 24–48h ouvrées. Vous recevrez une notification par email.
      </p>
    </div>
  )
}
