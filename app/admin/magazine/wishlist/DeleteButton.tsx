'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function DeleteButton({ id, token }: { id: number; token?: string }) {
  const [confirm, setConfirm] = useState(false)
  const [loading, setLoading]  = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const url = `/api/admin/wishlist/${id}${token ? `?token=${token}` : ''}`
    const res = await fetch(url, { method: 'DELETE' })
    if (res.ok) {
      router.refresh()
    } else {
      alert('Erreur lors de la suppression')
      setLoading(false)
      setConfirm(false)
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-[9px] font-bold text-white bg-red-600 px-2 py-0.5 hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? '…' : 'Confirmer'}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-[9px] text-gray-400 hover:text-gray-700"
        >
          Annuler
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-[9px] font-semibold text-gray-300 hover:text-red-600 transition-colors px-1"
      title="Supprimer"
    >
      ✕
    </button>
  )
}
