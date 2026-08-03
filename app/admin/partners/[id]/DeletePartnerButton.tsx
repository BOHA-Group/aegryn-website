'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, Loader2 } from 'lucide-react'

export default function DeletePartnerButton({
  partnerId,
  tokenQs,
}: {
  partnerId: string
  tokenQs:   string
}) {
  const router   = useRouter()
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleDelete() {
    const confirmed = window.confirm(
      'Supprimer définitivement ce compte partenaire ?\n\nCette action est IRRÉVERSIBLE.\nToutes les données associées seront effacées (KYC, NDA, certifications, introductions, commissions).\nLes actifs et offres seront dissociés mais conservés.'
    )
    if (!confirmed) return
    setLoading(true)
    setError('')
    const qs  = tokenQs ? tokenQs : ''
    const res = await fetch(`/api/admin/members/${partnerId}${qs}`, { method: 'DELETE' })
    const data = await res.json() as { ok?: boolean; error?: string }
    if (data.ok) {
      router.push(`/admin/partners${qs}`)
    } else {
      setError(data.error ?? 'Erreur inconnue.')
      setLoading(false)
    }
  }

  return (
    <div className="border border-red-200 bg-red-50 p-5">
      <div className="flex items-start gap-3 mb-4">
        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 font-bold">Zone de danger</p>
          <p className="font-sans text-[12px] text-red-700 mt-1">
            Supprime définitivement le compte Auth, le profil, les documents KYC, les demandes NDA,
            les certifications, introductions et commissions. Les actifs sont dissociés mais <strong>conservés</strong>.
          </p>
        </div>
      </div>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="flex items-center gap-2 bg-red-600 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
        {loading ? 'Suppression…' : 'Supprimer le compte partenaire'}
      </button>
      {error && <p className="font-sans text-[12px] text-red-700 mt-3">{error}</p>}
    </div>
  )
}
