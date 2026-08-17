'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

type Row = {
  id: string
  status: string
  bid_amount_chf: number | null
  admin_note: string | null
  reviewed_at: string | null
  created_at: string
  asset_id: string
  user_id: string
  assets: { company_name: string | null; asset_type: string | null; arr: number | null; official_grade: string | null } | null
  profiles: { email: string | null; first_name: string | null; last_name: string | null; kyc_status: string | null } | null
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}
function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })
}
function statusBadge(s: string) {
  return s === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : s === 'rejected'    ? 'bg-red-50 text-red-600 border-red-200'
    : s === 'revoked'     ? 'bg-gray-100 text-gray-500 border-gray-200'
    : 'bg-amber-50 text-amber-700 border-amber-200'
}

export default function DataRoomRequestsClient({ rows: initialRows }: { rows: Row[] }) {
  const router = useRouter()
  const [_isPending, startTransition] = useTransition()
  const [rows, setRows]   = useState(initialRows)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [saving, setSaving]     = useState<Record<string, boolean>>({})
  const [bidAmounts, setBidAmounts] = useState<Record<string, string>>({})
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})

  function toggle(id: string) {
    setExpanded(p => ({ ...p, [id]: !p[id] }))
  }

  async function review(reqId: string, action: 'approve' | 'reject' | 'revoke') {
    setSaving(p => ({ ...p, [reqId]: true }))
    try {
      const bidAmount = bidAmounts[reqId] ? parseFloat(bidAmounts[reqId]) : undefined
      const res = await fetch(`/api/admin/data-room-requests/${reqId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          bid_amount_chf: bidAmount,
          admin_note: adminNotes[reqId] ?? undefined,
        }),
      })
      if (res.ok) {
        const updated = await res.json()
        setRows(p => p.map(r => r.id === reqId ? { ...r, ...updated.request } : r))
        setExpanded(p => ({ ...p, [reqId]: false }))
        startTransition(() => router.refresh())
      }
    } finally {
      setSaving(p => ({ ...p, [reqId]: false }))
    }
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-16 text-center">
        <p className="text-[13px] text-gray-400">Aucune demande.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rows.map(row => {
        const isOpen = expanded[row.id]
        const isPending = row.status === 'pending'

        return (
          <div key={row.id} className="bg-white border border-gray-200">
            {/* Header ligne */}
            <button
              type="button"
              onClick={() => toggle(row.id)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors"
            >
              {/* Statut */}
              <span className={`shrink-0 border px-2 py-0.5 font-mono text-[9px] uppercase font-bold ${statusBadge(row.status)}`}>
                {row.status}
              </span>

              {/* Actif */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] text-gray-800 truncate">
                  {row.assets?.company_name ?? `Actif ${row.asset_id.slice(0, 8)}`}
                </p>
                <p className="text-[11px] text-gray-400">
                  {row.profiles?.email ?? row.user_id.slice(0, 12)}
                  {row.profiles?.kyc_status && (
                    <span className={`ml-2 font-mono text-[9px] ${row.profiles.kyc_status === 'approved' ? 'text-emerald-600' : 'text-amber-500'}`}>
                      KYC {row.profiles.kyc_status}
                    </span>
                  )}
                </p>
              </div>

              {/* Montant */}
              <div className="text-right shrink-0">
                <p className="font-mono text-[11px] text-gray-600">{fmtChf(row.bid_amount_chf)}</p>
                <p className="font-mono text-[9px] text-gray-300">Séquestre : {row.bid_amount_chf ? fmtChf(Math.round(row.bid_amount_chf * 0.1)) : '—'}</p>
              </div>

              {/* Date */}
              <p className="font-mono text-[10px] text-gray-400 shrink-0 hidden sm:block">{fmtDate(row.created_at)}</p>

              {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
            </button>

            {/* Détail expandable */}
            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                {/* Infos */}
                <div className="grid grid-cols-2 gap-4 text-[12px]">
                  <div>
                    <p className="font-mono text-[9px] uppercase text-gray-400 mb-1">Acquéreur</p>
                    <p className="text-gray-800">{row.profiles?.first_name} {row.profiles?.last_name}</p>
                    <p className="text-gray-500">{row.profiles?.email}</p>
                    <p className="font-mono text-[10px] text-gray-400 mt-0.5">user_id: {row.user_id.slice(0, 16)}…</p>
                  </div>
                  <div>
                    <p className="font-mono text-[9px] uppercase text-gray-400 mb-1">Actif</p>
                    <p className="text-gray-800">{row.assets?.company_name ?? '—'}</p>
                    <p className="text-gray-400 font-mono text-[10px]">{row.assets?.asset_type} · Grade {row.assets?.official_grade ?? '—'} · ARR {fmtChf(row.assets?.arr ?? null)}</p>
                  </div>
                </div>

                {/* Formulaire approbation */}
                {isPending && (
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex gap-3 flex-wrap">
                      <div className="flex-1 min-w-[180px]">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-gray-400 block mb-1">
                          Montant indicatif (CHF) — base séquestre 10%
                        </label>
                        <input
                          type="number"
                          step="1000"
                          min="0"
                          value={bidAmounts[row.id] ?? (row.bid_amount_chf?.toString() ?? '')}
                          onChange={e => setBidAmounts(p => ({ ...p, [row.id]: e.target.value }))}
                          placeholder="ex: 500000"
                          className="w-full border border-gray-200 px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-ag-navy/40"
                        />
                        {bidAmounts[row.id] && (
                          <p className="font-mono text-[10px] text-indigo-600 mt-1">
                            Séquestre : {fmtChf(Math.round(parseFloat(bidAmounts[row.id]) * 0.1))}
                          </p>
                        )}
                      </div>
                      <div className="flex-1 min-w-[180px]">
                        <label className="font-mono text-[9px] uppercase tracking-widest text-gray-400 block mb-1">Note admin (optionnel)</label>
                        <textarea
                          rows={2}
                          value={adminNotes[row.id] ?? (row.admin_note ?? '')}
                          onChange={e => setAdminNotes(p => ({ ...p, [row.id]: e.target.value }))}
                          className="w-full border border-gray-200 px-3 py-2 text-[12px] resize-none focus:outline-none focus:border-ag-navy/40"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={saving[row.id] || !bidAmounts[row.id]}
                        onClick={() => review(row.id, 'approve')}
                        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-40"
                      >
                        {saving[row.id] ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                        Approuver + notifier
                      </button>
                      <button
                        type="button"
                        disabled={saving[row.id]}
                        onClick={() => review(row.id, 'reject')}
                        className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border border-red-200 text-red-600 px-4 py-2 hover:bg-red-50 transition-colors disabled:opacity-40"
                      >
                        {saving[row.id] ? <Loader2 size={11} className="animate-spin" /> : <XCircle size={11} />}
                        Refuser
                      </button>
                    </div>
                    <p className="font-mono text-[9px] text-gray-400">Renseignez le montant avant d&apos;approuver — il sera affiché à l&apos;acquéreur.</p>
                  </div>
                )}

                {/* Révoquer si approuvé */}
                {row.status === 'approved' && (
                  <div className="border-t border-gray-100 pt-3 flex items-center gap-3">
                    <p className="font-sans text-[11px] text-gray-500">
                      Approuvé le {fmtDate(row.reviewed_at)} · Montant : {fmtChf(row.bid_amount_chf)}
                    </p>
                    <button
                      type="button"
                      disabled={saving[row.id]}
                      onClick={() => review(row.id, 'revoke')}
                      className="font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1.5 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40"
                    >
                      {saving[row.id] ? <Loader2 size={10} className="animate-spin" /> : 'Révoquer'}
                    </button>
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
