import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { getUser }                  from '@/lib/supabaseServer'

const lineItemSchema = z.object({
  description:   z.string(),
  unit:          z.string(),
  qty:           z.number(),
  unit_price_ht: z.number(),
})

const schema = z.object({
  invoice_number:       z.string().min(1),
  catalogue_request_id: z.string().uuid().nullable().optional(),
  asset_id:             z.string().uuid().nullable().optional(),
  seller_uid:           z.string().uuid().nullable().optional(),
  recipient_name:       z.string().min(1),
  recipient_email:      z.string().email(),
  recipient_address:    z.string().nullable().optional(),
  recipient_company:    z.string().nullable().optional(),
  recipient_vat_num:    z.string().nullable().optional(),
  line_items:           z.array(lineItemSchema),
  subtotal_ht:          z.number(),
  vat_rate:             z.number(),
  vat_amount:           z.number(),
  total_ttc:            z.number(),
  currency:             z.string().max(3),
  iban:                 z.string().nullable().optional(),
  bic:                  z.string().nullable().optional(),
  bank_name:            z.string().nullable().optional(),
  account_holder:       z.string().nullable().optional(),
  status:               z.enum(['draft', 'sent', 'paid', 'cancelled']),
  due_date:             z.string().nullable().optional(),
  issued_at:            z.string(),
  send_email:           z.boolean().optional(),
})

async function sendInvoiceEmail(to: string, name: string, invoiceNumber: string, total: string, dueDate: string | null) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `${process.env.RESEND_FROM_NAME ?? 'Aegryn'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to: [to],
      subject: `Aegryn — Facture ${invoiceNumber}`,
      text:
        `Bonjour ${name},\n\n` +
        `Veuillez trouver ci-joint votre facture Aegryn.\n\n` +
        `Référence : ${invoiceNumber}\n` +
        `Montant : ${total}\n` +
        (dueDate ? `Échéance : ${dueDate}\n` : '') +
        `\nMerci d'effectuer le virement à l'IBAN indiqué sur la facture en précisant la référence ${invoiceNumber}.\n\n` +
        `L'équipe Aegryn\nhttps://aegryn.com`,
    }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const supa = createServiceClient()
    const { data: profile } = await supa.from('profiles').select('roles').eq('id', user.id).single()
    if (!profile?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const body = schema.parse(await req.json())
    const { send_email, ...fields } = body

    const { data: inv, error: dbErr } = await supa
      .from('invoices')
      .insert({ ...fields, created_by_admin: user.id })
      .select('id, invoice_number, recipient_name, recipient_email, total_ttc, currency, due_date')
      .single()

    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

    if (send_email && inv) {
      const total = new Intl.NumberFormat('fr-CH', { style: 'currency', currency: inv.currency }).format(inv.total_ttc)
      await sendInvoiceEmail(inv.recipient_email, inv.recipient_name, inv.invoice_number, total, inv.due_date)
      await supa.from('invoices').update({ status: 'sent' }).eq('id', inv.id)
    }

    return NextResponse.json({ ok: true, id: inv?.id })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
