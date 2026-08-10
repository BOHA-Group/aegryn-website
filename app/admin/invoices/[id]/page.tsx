import type { Metadata } from 'next'
import { notFound }        from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import InvoiceEditor from './InvoiceEditor'

export const metadata: Metadata = {
  title: 'Facture — Admin Aegryn',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ id: string }> }

export default async function AdminInvoicePage({ params }: Props) {
  const { id } = await params
  const supa = createServiceClient()

  /* Pour "new" on crée un brouillon vide */
  if (id === 'new') {
    const year   = new Date().getFullYear()
    const { count } = await supa.from('invoices').select('id', { count: 'exact', head: true })
    const seqNum    = String((count ?? 0) + 1).padStart(4, '0')
    const blankInvoice = {
      id:                   null,
      invoice_number:       `AEG-${year}-${seqNum}`,
      catalogue_request_id: null,
      asset_id:             null,
      seller_uid:           null,
      recipient_name:       '',
      recipient_email:      '',
      recipient_address:    '',
      recipient_company:    '',
      recipient_vat_num:    '',
      line_items:           [{ description: '', unit: 'Forfait', qty: 1, unit_price_ht: 0 }],
      subtotal_ht:          0,
      vat_rate:             0,
      vat_amount:           0,
      total_ttc:            0,
      currency:             'CHF',
      iban:                 process.env.Aegryn_IBAN ?? '',
      bic:                  process.env.Aegryn_BIC ?? '',
      bank_name:            process.env.Aegryn_BANK_NAME ?? '',
      account_holder:       'Aegryn / BOHA-Group',
      status:               'draft',
      due_date:             new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
      issued_at:            new Date().toISOString().slice(0, 10),
      pdf_storage_path:     null,
    }
    return <InvoiceEditor invoice={blankInvoice} isNew />
  }

  const { data: invoice } = await supa
    .from('invoices')
    .select('*')
    .eq('id', id)
    .single()

  if (!invoice) notFound()

  return <InvoiceEditor invoice={invoice} isNew={false} />
}
