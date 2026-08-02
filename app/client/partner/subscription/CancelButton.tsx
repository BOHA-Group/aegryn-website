'use client'

import { useState } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'

export default function CancelButton() {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function openPortal() {
    setLoading(true)
    setError(null)
    try {
      const res  = await fetch('/api/partner/portal', { method: 'POST' })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Erreur lors de l\'ouverture du portail.')
        setLoading(false)
      }
    } catch {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={openPortal}
        disabled={loading}
        className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest border border-gray-300 px-4 py-2 text-gray-500 hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-50"
      >
        {loading
          ? <Loader2 size={12} className="animate-spin" />
          : <ExternalLink size={12} />
        }
        Gérer / résilier l&apos;abonnement
      </button>
      {error && (
        <p className="font-sans text-[11px] text-red-600 mt-2">{error}</p>
      )}
      <p className="font-sans text-[10px] text-gray-400 mt-1.5">
        La résiliation stoppe le renouvellement. L&apos;abonnement reste actif jusqu&apos;à la date d&apos;échéance.
      </p>
    </div>
  )
}
