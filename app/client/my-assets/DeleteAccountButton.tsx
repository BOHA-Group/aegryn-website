'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

export default function DeleteAccountButton() {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  async function handleDelete() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/client/delete-account', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }
      router.push('/client/login')
      router.refresh()
    } catch {
      setError('Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.')
      setLoading(false)
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
      >
        <Trash2 size={12} /> Supprimer mon compte
      </button>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 p-5 max-w-md">
      {error && (
        <p className="font-sans text-[12px] text-red-600 mb-3">{error}</p>
      )}
      <p className="font-sans text-[13px] text-red-700 mb-4">
        Cette action est irréversible. Votre compte et vos données personnelles seront supprimés.
        Vos dossiers de certification déjà soumis sont conservés à des fins légales, sans lien avec votre identité.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white font-mono text-[11px] uppercase tracking-[0.14em] px-5 py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Suppression...' : 'Confirmer la suppression'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="border border-gray-300 text-gray-600 font-mono text-[11px] uppercase tracking-[0.14em] px-5 py-2.5 hover:border-gray-500 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
