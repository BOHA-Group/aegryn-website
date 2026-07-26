'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

type Props = {
  filePath: string   /* URL complète stockée en DB, ou chemin relatif kyc/... */
  token?: string     /* token admin pour l'API signed-url */
}

/**
 * Bouton qui génère une signed URL temporaire (60s) côté serveur
 * et ouvre le document dans un nouvel onglet.
 * Le bucket kyc-documents doit être configuré en PRIVÉ dans Supabase.
 */
export default function SignedDocLink({ filePath, token }: Props) {
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  /* Extraire le chemin relatif depuis l'URL publique si nécessaire */
  function extractPath(raw: string): string {
    /* Si l'URL contient /object/public/kyc-documents/ ou /storage/v1/ */
    const marker = '/kyc-documents/'
    const idx = raw.indexOf(marker)
    if (idx !== -1) return 'kyc/' + raw.slice(idx + marker.length).replace(/^kyc\//, '')
    /* Déjà un chemin relatif */
    return raw
  }

  async function handleOpen() {
    setLoading(true)
    setError('')
    try {
      const path = extractPath(filePath)
      const qs   = new URLSearchParams({ path, ...(token ? { token } : {}) })
      const res  = await fetch(`/api/admin/kyc/signed-url?${qs}`)
      const json = await res.json() as { url?: string; error?: string }
      if (!res.ok || !json.url) throw new Error(json.error ?? 'Erreur serveur')
      window.open(json.url, '_blank', 'noopener,noreferrer')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-1">
      <button
        onClick={handleOpen}
        disabled={loading}
        className="text-[10px] text-blue-500 hover:underline disabled:opacity-50 flex items-center gap-1"
      >
        {loading && <Loader2 size={10} className="animate-spin" />}
        Voir le document (accès sécurisé) ↗
      </button>
      {error && <p className="text-[10px] text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}
