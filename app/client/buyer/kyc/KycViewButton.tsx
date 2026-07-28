'use client'

import { useState } from 'react'
import { Loader2, Eye } from 'lucide-react'

export default function KycViewButton({ docId }: { docId: string }) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleView() {
    setError('')
    setLoading(true)
    try {
      const res  = await fetch(`/api/buyer/kyc/signed-url?doc_id=${docId}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur')
      window.open(json.url, '_blank', 'noopener,noreferrer')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleView}
        disabled={loading}
        className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50"
      >
        {loading ? <Loader2 size={10} className="animate-spin" /> : <Eye size={10} />}
        Voir →
      </button>
      {error && <p className="font-sans text-[10px] text-red-500">{error}</p>}
    </div>
  )
}
