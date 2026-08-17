'use client'

import { useState, useTransition } from 'react'
import { useRouter }               from 'next/navigation'
import { CheckCircle2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'

type Row = {
  id: string; status: string; bid_amount_chf: number; sequester_amount_chf: number
  buyer_note: string | null; seller_note: string | null; admin_note: string | null
  created_at: string; reviewed_at: string | null; asset_id: string; bidder_id: string
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
  return s === 'sequester_received' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : s === 'approved' || s === 'sequester_sent' ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
    : s === 'rejected' ? 'bg-red-50 text-red-600 border-red-200'
    : 'bg-amber-50 text-amber-700 border-amber-200'
}

export default function LightBidsAdminClient({ rows: initialRows }: { rows: Row[] }) {
  const router = useRouter()
  const [_isPending, startTransition] = useTransition()
  const [rows, setRows]   = useState(initialRows)
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [saving, setSaving]     = useState<Record<string, boolean>>({})
  const [adminNotes, setAdminNotes] = useState<Record<string, string>>({})

  function toggle(id: string) { setExpanded(p => ({ ...p, [id]: !p[id] })) }

  async function confirmSequester(rowId: string) {
    setSaving(p => ({ ...p, [rowId]: true }))
    try {
      const res = await fetch(`/api/admin/light-bid/${rowId}/sequester`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_note: adminNotes[rowId] ?? undefined }),
      })
      if (res.ok) {
        const json = await res.json()
        setRows(p => p.map(r => r.id === rowId ? { ...r, ...json.bid } : r))
        setExpanded(p => ({ ...p, [rowId]: false }))
        startTransition(() => router.refresh())
      }
    } finally {
      setSaving(p => ({ ...p, [rowId]: false }))
    }
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white border border-gray-200 p-16 text-center">
        <p className="text-[13px] text-gray-400">Aucune offre.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {rows.map(row => {
        const isOpen = expanded[row.id]
        const canConfirm = row.status === 'approved' || row.status === 'sequester_sent'

        return (
          <div key={row.id} className="bg-white border border-gray-200">
            <button type="button" onClick={() => toggle(row.id)}
              className="w-full flex items-center gap-4 px-5 py-3.5 text-left hover:bg-gray-50 transition-colors">
              <span className={`shrink-0 border px-2 py-0.5 font-mono text-[9px] uppercase font-bold ${statusBadge(row.status)}`}>
                {row.status}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[13px] text-gray-800 truncate">
                  {row.assets?.company_name ?? row.asset_id.slice(0, 8)}
                </p>
                <p className="text-[11px] text-gray-400">{row.profiles?.email}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono text-[13px] font-bold text-gray-800">{fmtChf(row.bid_amount_chf)}</p>
                <p className="font-mono text-[9px] text-indigo-600">Séquestre : {fmtChf(row.sequester_amount_chf)}</p>
              </div>
              <p className="font-mono text-[10px] text-gray-400 shrink-0 hidden sm:block">{fmtDate(row.created_at)}</p>
              {isOpen ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-[12px]">
                  <div><p className="font-mono text-[9px] uppercase text-gray-400 mb-0.5">Offre</p><p className="font-bold text-[15px]">{fmtChf(row.bid_amount_chf)}</p></div>
                  <div><p className="font-mono text-[9px] uppercase text-gray-400 mb-0.5">Séquestre (10%)</p><p className="font-bold text-[15px] text-indigo-700">{fmtChf(row.sequester_amount_chf)}</p></div>
                  <div><p className="font-mono text-[9px] uppercase text-gray-400 mb-0.5">Acquéreur</p><p>{row.profiles?.first_name} {row.profiles?.last_name}</p><p className="text-gray-400">{row.profiles?.email}</p></div>
                </div>

                {row.buyer_note && (
                  <div className="bg-gray-50 border border-gray-100 px-4 py-3">
                    <p className="font-mono text-[9px] text-gray-400 mb-1">Message acquéreur</p>
                    <p className="text-[12px] text-gray-700">{row.buyer_note}</p>
                  </div>
                )}
                {row.seller_note && (
                  <div className="bg-blue-50 border border-blue-100 px-4 py-3">
                    <p className="font-mono text-[9px] text-blue-400 mb-1">Note vendeur</p>
                    <p className="text-[12px] text-blue-800">{row.seller_note}</p>
                  </div>
                )}

                {canConfirm && (
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <div>
                      <label className="font-mono text-[9px] uppercase tracking-widest text-gray-400 block mb-1">Note admin (optionnel)</label>
                      <input
                        type="text"
                        value={adminNotes[row.id] ?? ''}
                        onChange={e => setAdminNotes(p => ({ ...p, [row.id]: e.target.value }))}
                        placeholder="Référence virement, date réception..."
                        className="w-full border border-gray-200 px-3 py-2 text-[12px] font-mono focus:outline-none focus:border-ag-navy/40"
                      />
                    </div>
                    <button
                      type="button"
                      disabled={saving[row.id]}
                      onClick={() => confirmSequester(row.id)}
                      className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest bg-emerald-600 text-white px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-40"
                    >
                      {saving[row.id] ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                      Confirmer réception séquestre
                    </button>
                    <p className="font-mono text-[9px] text-gray-400">
                      Action irréversible — débloque la data room complète pour l&apos;acquéreur.
                    </p>
                  </div>
                )}

                {row.status === 'sequester_received' && (
                  <div className="border-t border-gray-100 pt-3">
                    <p className="font-mono text-[10px] text-emerald-600">✓ Séquestre confirmé le {fmtDate(row.reviewed_at)}</p>
                    {row.admin_note && <p className="font-sans text-[11px] text-gray-500 mt-1">{row.admin_note}</p>}
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
