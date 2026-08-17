'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

type Bid = {
  id: string
  status: string
  bid_amount_chf: number
  sequester_amount_chf: number
  buyer_note: string | null
  seller_note: string | null
  created_at: string
  reviewed_at: string | null
  profiles: {
    email: string | null
    first_name: string | null
    last_name: string | null
    kyc_status: string | null
  } | null
}

function fmtChf(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
function statusBadge(s: string) {
  return s === 'approved' || s === 'sequester_received' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : s === 'rejected'  ? 'bg-red-50 text-red-600 border-red-200'
    : s === 'sequester_sent' ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : 'bg-amber-50 text-amber-700 border-amber-200'
}
function statusLabel(s: string) {
  return s === 'pending_seller'     ? 'En attente de décision'
    : s === 'approved'              ? 'Approuvée'
    : s === 'rejected'              ? 'Refusée'
    : s === 'sequester_sent'        ? 'Séquestre en attente'
    : s === 'sequester_received'    ? 'Séquestre reçu ✓'
    : s === 'withdrawn'             ? 'Retirée'
    : s
}

export default function SellerBidsClient({ bids: initialBids, assetId: _assetId }: { bids: Bid[]; assetId: string }) {
  const router = useRouter()
  const [_isPending, startTransition] = useTransition()
  const [bids, setBids]       = useState(initialBids)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [saving, setSaving]     = useState<Record<string, boolean>>({})
  const [sellerNotes, setSellerNotes] = useState<Record<string, string>>({})

  function toggle(id: string) {
    setExpanded(p => ({ ...p, [id]: !p[id] }))
  }

  async function decide(bidId: string, action: 'approve' | 'reject') {
    setSaving(p => ({ ...p, [bidId]: true }))
    try {
      const res = await fetch(`/api/seller/light-bid/${bidId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, seller_note: sellerNotes[bidId] ?? undefined }),
      })
      if (res.ok) {
        const json = await res.json()
        setBids(p => p.map(b => b.id === bidId ? { ...b, ...json.bid } : b))
        setExpanded(p => ({ ...p, [bidId]: false }))
        startTransition(() => router.refresh())
      }
    } finally {
      setSaving(p => ({ ...p, [bidId]: false }))
    }
  }

  return (
    <div className="space-y-2">
      {bids.map(bid => {
        const isOpen    = expanded[bid.id]
        const isPending = bid.status === 'pending_seller'

        return (
          <div key={bid.id} className="bg-white border border-gray-200">
            {/* Header ligne */}
            <button
              type="button"
              onClick={() => toggle(bid.id)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
            >
              <span className={`shrink-0 border px-2 py-0.5 font-mono text-[9px] uppercase font-bold ${statusBadge(bid.status)}`}>
                {statusLabel(bid.status)}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] text-gray-800 truncate">
                  {bid.profiles?.first_name} {bid.profiles?.last_name}
                </p>
                <p className="text-[11px] text-gray-400">{bid.profiles?.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-[13px] font-bold text-gray-800">{fmtChf(bid.bid_amount_chf)}</p>
                <p className="font-mono text-[9px] text-gray-300">Séquestre : {fmtChf(bid.sequester_amount_chf)}</p>
              </div>
              <p className="font-mono text-[10px] text-gray-400 shrink-0 hidden sm:block">{fmtDate(bid.created_at)}</p>
              {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
            </button>

            {/* Détail */}
            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                {/* Infos */}
                <div className="text-[12px] space-y-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="font-mono text-[9px] uppercase text-gray-400 mb-0.5">Offre</p>
                      <p className="font-bold text-[16px] text-gray-900">{fmtChf(bid.bid_amount_chf)}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] uppercase text-gray-400 mb-0.5">Séquestre (10%)</p>
                      <p className="font-bold text-[16px] text-indigo-700">{fmtChf(bid.sequester_amount_chf)}</p>
                    </div>
                  </div>
                  {bid.buyer_note && (
                    <div className="bg-gray-50 border border-gray-100 px-4 py-3 mt-2">
                      <p className="font-mono text-[9px] uppercase text-gray-400 mb-1">Message de l&apos;acquéreur</p>
                      <p className="text-[12px] text-gray-700 leading-relaxed">{bid.buyer_note}</p>
                    </div>
                  )}
                </div>

                {/* Décision (si pending) */}
                {isPending && (
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-widest text-gray-400 block mb-1">
                        Note au candidat (optionnel)
                      </label>
                      <textarea
                        rows={2}
                        value={sellerNotes[bid.id] ?? ''}
                        onChange={e => setSellerNotes(p => ({ ...p, [bid.id]: e.target.value }))}
                        placeholder="Raison du refus, demande de précisions..."
                        className="w-full border border-gray-200 px-3 py-2 text-[12px] resize-none focus:outline-none focus:border-ag-navy/40"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={saving[bid.id]}
                        onClick={() => decide(bid.id, 'approve')}
                        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-40"
                      >
                        {saving[bid.id] ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                        Approuver l&apos;offre
                      </button>
                      <button
                        type="button"
                        disabled={saving[bid.id]}
                        onClick={() => decide(bid.id, 'reject')}
                        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        {saving[bid.id] ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                        Refuser
                      </button>
                    </div>
                    <p className="font-sans text-[10px] text-gray-400">
                      En approuvant, l&apos;acquéreur sera invité à verser le séquestre de <strong>{fmtChf(bid.sequester_amount_chf)}</strong>.
                    </p>
                  </div>
                )}

                {/* Statut post-décision */}
                {!isPending && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="font-sans text-[11px] text-gray-500">
                      Décidé le {fmtDate(bid.reviewed_at)}
                      {bid.seller_note && <> · <em>{bid.seller_note}</em></>}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
