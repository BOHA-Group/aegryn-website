'use client'

import { useState } from 'react'
import { UserPlus, CheckCircle2 } from 'lucide-react'

export default function InviteButton({
  assetId, sellerEmail, sellerName, adminToken,
}: {
  assetId: string
  sellerEmail: string
  sellerName: string
  adminToken: string
}) {
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [error,   setError]   = useState('')

  async function invite() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/client/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    sellerEmail,
          fullName: sellerName,
          role:     'seller',
          assetId,
          token:    adminToken,
        }),
      })
      const json = await res.json()
      if (res.ok) setDone(true)
      else setError(json.error ?? 'Erreur')
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600">
      <CheckCircle2 size={10} /> Invité
    </span>
  )

  return (
    <div className="flex flex-col gap-0.5">
      <button
        onClick={invite}
        disabled={loading}
        title={`Inviter ${sellerEmail} à accéder à son espace client`}
        className="inline-flex items-center gap-1 text-[10px] font-semibold text-violet-600 hover:text-violet-800 disabled:opacity-40"
      >
        <UserPlus size={10} /> {loading ? '...' : 'Inviter'}
      </button>
      {error && <span className="text-[9px] text-red-500">{error}</span>}
    </div>
  )
}
