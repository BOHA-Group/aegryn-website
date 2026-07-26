'use client'

import { useState } from 'react'

export default function AnonymiseButton({ userId: _userId }: { userId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState('')

  async function handleAnonymise() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/client/anonymise-account', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Une erreur est survenue.')
        setLoading(false)
        return
      }
      setDone(true)
      window.location.reload()
    } catch {
      setError('Impossible de contacter le serveur.')
      setLoading(false)
    }
  }

  if (done) {
    return <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-600">Anonymise</span>
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="font-mono text-[10px] uppercase tracking-widest text-orange-500 border border-orange-200 px-3 py-1.5 hover:bg-orange-50 transition-colors shrink-0"
      >
        Anonymiser
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-2 items-end shrink-0">
      {error && <p className="font-sans text-[11px] text-red-500">{error}</p>}
      <p className="font-sans text-[11px] text-orange-700 text-right max-w-[200px]">
        Votre nom et email seront remplacés de façon irréversible.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleAnonymise}
          disabled={loading}
          className="bg-orange-500 text-white font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:bg-orange-600 transition-colors disabled:opacity-50"
        >
          {loading ? '...' : 'Confirmer'}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="border border-gray-300 text-gray-500 font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 hover:border-gray-500 transition-colors disabled:opacity-50"
        >
          Annuler
        </button>
      </div>
    </div>
  )
}
