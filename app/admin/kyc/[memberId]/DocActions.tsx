'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface Props {
  memberId: string
  docId:    string
  token?:   string
}

export default function DocActions({ memberId, docId, token }: Props) {
  const [showReject, setShowReject]   = useState(false)
  const [reason,     setReason]       = useState('')
  const [error,      setError]        = useState('')
  const [isPending,  startTransition] = useTransition()
  const router = useRouter()

  async function patch(status: 'validated' | 'rejected', rejectionReason?: string) {
    setError('')
    const body: Record<string, unknown> = {
      token:       token ?? '',
      kyc_doc_id:  docId,
      kyc_status:  status,
    }
    if (rejectionReason) body.kyc_rejection_reason = rejectionReason

    const res = await fetch(`/api/admin/members/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json() as { ok?: boolean; error?: string }
    if (!res.ok || !json.ok) {
      setError(json.error ?? 'Erreur serveur')
      return
    }
    router.refresh()
  }

  function handleValidate() {
    startTransition(() => patch('validated'))
  }

  function handleRejectSubmit() {
    if (!reason.trim()) { setError('Motif requis'); return }
    startTransition(() => patch('rejected', reason.trim()).then(() => {
      setShowReject(false)
      setReason('')
    }))
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      {!showReject ? (
        <div className="flex gap-1.5">
          <button
            onClick={handleValidate}
            disabled={isPending}
            className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 border border-emerald-200 px-2 py-1 hover:border-emerald-400 transition-colors disabled:opacity-50"
          >
            {isPending && <Loader2 size={9} className="animate-spin" />}
            Valider
          </button>
          <button
            onClick={() => { setShowReject(true); setError('') }}
            disabled={isPending}
            className="text-[10px] font-semibold text-red-500 border border-red-200 px-2 py-1 hover:border-red-400 transition-colors disabled:opacity-50"
          >
            Rejeter
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 items-end w-56">
          <textarea
            value={reason}
            onChange={e => setReason(e.target.value)}
            placeholder="Motif de rejet…"
            rows={2}
            className="w-full text-[11px] border border-gray-300 px-2 py-1 focus:outline-none focus:border-red-400 resize-none font-sans"
          />
          <div className="flex gap-1.5">
            <button
              onClick={() => { setShowReject(false); setReason(''); setError('') }}
              className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 hover:border-gray-400 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleRejectSubmit}
              disabled={isPending}
              className="flex items-center gap-1 text-[10px] font-semibold text-red-600 border border-red-300 px-2 py-1 hover:border-red-500 bg-red-50 transition-colors disabled:opacity-50"
            >
              {isPending && <Loader2 size={9} className="animate-spin" />}
              Confirmer rejet
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  )
}
