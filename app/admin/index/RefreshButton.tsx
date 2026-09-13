'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RefreshCw } from 'lucide-react'

export default function RefreshButton() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const router = useRouter()
  async function run() {
    setLoading(true); setMsg('')
    try {
      const res = await fetch('/api/admin/index/refresh', { method: 'POST' })
      const j = await res.json()
      setMsg(res.ok ? `${j.upserted} séries mises à jour, ${j.sources.filter((s: { status: string }) => s.status === 'ok').length}/${j.sources.length} sources OK` : (j.error ?? 'Erreur'))
      router.refresh()
    } finally { setLoading(false) }
  }
  return (
    <div className="flex items-center gap-3">
      <button onClick={run} disabled={loading} className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-ag-navy/90 disabled:opacity-50 transition-colors">
        <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> {loading ? 'Collecte en cours…' : 'Rafraîchir maintenant'}
      </button>
      {msg && <span className="font-sans text-[12px] text-gray-600">{msg}</span>}
    </div>
  )
}
