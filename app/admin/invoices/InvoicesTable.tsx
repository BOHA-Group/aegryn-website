'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Trash2 } from 'lucide-react'

const STATUS_LABELS: Record<string, string> = {
  draft:     'Brouillon',
  sent:      'Envoyée',
  paid:      'Payée',
  cancelled: 'Annulée',
}
const STATUS_COLORS: Record<string, string> = {
  draft:     'bg-gray-100 text-gray-600',
  sent:      'bg-blue-100 text-blue-700',
  paid:      'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-600',
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'short', year: 'numeric' })
}

export type Invoice = {
  id: string
  invoice_number: string
  recipient_name: string
  recipient_email: string
  total_ttc: number
  currency: string
  status: string
  issued_at: string
  due_date: string | null
  asset_id: string | null
}

export default function InvoicesTable({ initialInvoices }: { initialInvoices: Invoice[] }) {
  const [invoices, setInvoices] = useState(initialInvoices)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function deleteInvoice(id: string, num: string) {
    if (!confirm(`Supprimer définitivement la facture ${num} ?`)) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/invoices/${id}`, { method: 'DELETE' })
      setInvoices(prev => prev.filter(inv => inv.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  if (invoices.length === 0) {
    return (
      <div className="bg-white border border-gray-200 px-6 py-12 text-center">
        <p className="font-sans text-[13px] text-gray-400">Aucune facture pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-gray-200 overflow-hidden">
      <table className="w-full text-left text-[12px]">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-400">N° Facture</th>
            <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-400">Destinataire</th>
            <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-400">Montant</th>
            <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-400">Date</th>
            <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-400">Échéance</th>
            <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-400">Statut</th>
            <th className="px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-400"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {invoices.map(inv => (
            <tr key={inv.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3 font-mono text-[11px] font-semibold text-ag-navy">{inv.invoice_number}</td>
              <td className="px-4 py-3">
                <p className="font-sans font-medium text-gray-900">{inv.recipient_name}</p>
                <p className="font-mono text-[10px] text-gray-400">{inv.recipient_email}</p>
              </td>
              <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                {new Intl.NumberFormat('fr-CH', { style: 'currency', currency: inv.currency, maximumFractionDigits: 0 }).format(inv.total_ttc)}
              </td>
              <td className="px-4 py-3 font-sans text-gray-500">{fmtDate(inv.issued_at)}</td>
              <td className="px-4 py-3 font-sans text-gray-500">{fmtDate(inv.due_date)}</td>
              <td className="px-4 py-3">
                <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 ${STATUS_COLORS[inv.status] ?? 'bg-gray-100 text-gray-500'}`}>
                  {STATUS_LABELS[inv.status] ?? inv.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/invoices/${inv.id}`}
                    className="inline-flex items-center gap-1 text-ag-navy hover:text-ag-black font-mono text-[10px] uppercase tracking-widest"
                  >
                    Éditer <ArrowUpRight size={10} />
                  </Link>
                  <button
                    onClick={() => deleteInvoice(inv.id, inv.invoice_number)}
                    disabled={deletingId === inv.id}
                    title="Supprimer cette facture"
                    className="inline-flex items-center gap-1 text-red-300 hover:text-red-600 font-mono text-[10px] uppercase tracking-widest disabled:opacity-40 transition-colors"
                  >
                    <Trash2 size={11} /> {deletingId === inv.id ? '…' : 'Suppr.'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
