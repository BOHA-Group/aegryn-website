'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, FileSearch } from 'lucide-react'

export default function DiligenceRequestButton({ assetId }: { assetId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  async function handleRequest() {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/buyer/data-room-light', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ asset_id: assetId }),
      })
      const json = await res.json()
      if (!res.ok) {
        if (json.error === 'kyc_required') {
          setError('Votre KYC doit être validé avant de faire une demande.')
        } else if (json.error === 'light_not_enabled') {
          setError('La data room light n\'est pas disponible pour cet actif.')
        } else {
          setError(json.error ?? 'Une erreur est survenue.')
        }
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
    <div className="flex flex-col gap-3">
      <button
        type="button"
        disabled={loading}
        onClick={handleRequest}
        className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-50 w-fit"
      >
        {loading
          ? <Loader2 size={12} className="animate-spin" />
          : <FileSearch size={12} />}
        Demander l&apos;accès data room light
      </button>
      {error && (
        <p className="font-sans text-[12px] text-red-600">{error}</p>
      )}
    </div>
  )
}
