import type { Metadata } from 'next'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { FilePlus } from 'lucide-react'
import InvoicesTable, { type Invoice } from './InvoicesTable'

export const metadata: Metadata = {
  title: 'Factures — Admin AEGRYN',
  robots: { index: false, follow: false },
}

export default async function AdminInvoicesPage() {
  const supa = createServiceClient()
  const { data: invoices } = await supa
    .from('invoices')
    .select('id, invoice_number, recipient_name, recipient_email, total_ttc, currency, status, issued_at, due_date, asset_id')
    .order('issued_at', { ascending: false })
    .limit(100)

  return (
    <div className="p-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Admin</p>
          <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Factures AEGRYN</h1>
        </div>
        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-ag-black transition-colors"
        >
          <FilePlus size={12} /> Nouvelle facture
        </Link>
      </div>

      <InvoicesTable initialInvoices={(invoices ?? []) as Invoice[]} />
    </div>
  )
}
