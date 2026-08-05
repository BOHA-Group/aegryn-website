import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { getUser }                  from '@/lib/supabaseServer'

const patchSchema = z.object({
  invoice_number:       z.string().min(1).optional(),
  recipient_name:       z.string().min(1).optional(),
  recipient_email:      z.string().email().optional(),
  recipient_address:    z.string().nullable().optional(),
  recipient_company:    z.string().nullable().optional(),
  recipient_vat_num:    z.string().nullable().optional(),
  line_items:           z.array(z.object({
    description:   z.string(),
    unit:          z.string(),
    qty:           z.number(),
    unit_price_ht: z.number(),
  })).optional(),
  subtotal_ht:   z.number().optional(),
  vat_rate:      z.number().optional(),
  vat_amount:    z.number().optional(),
  total_ttc:     z.number().optional(),
  currency:      z.string().max(3).optional(),
  iban:          z.string().nullable().optional(),
  bic:           z.string().nullable().optional(),
  bank_name:     z.string().nullable().optional(),
  account_holder:z.string().nullable().optional(),
  status:        z.enum(['draft', 'sent', 'paid', 'cancelled']).optional(),
  due_date:      z.string().nullable().optional(),
  issued_at:     z.string().optional(),
  send_email:    z.boolean().optional(),
})

type Params = { params: Promise<{ id: string }> }

async function requireAdmin() {
  const user = await getUser()
  if (!user) return null
  const supa = createServiceClient()
  const { data: profile } = await supa.from('profiles').select('roles').eq('id', user.id).single()
  if (!profile?.roles?.includes('admin')) return null
  return user
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params
  try {
    const user = await requireAdmin()
    if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

    const supa = createServiceClient()
    const body = patchSchema.parse(await req.json())
    const { send_email, ...fields } = body

    const { data: inv, error: dbErr } = await supa
      .from('invoices')
      .update(fields)
      .eq('id', id)
      .select('id, invoice_number, recipient_name, recipient_email, total_ttc, currency, due_date')
      .single()

    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

    if (send_email && inv) {
      const total = new Intl.NumberFormat('fr-CH', { style: 'currency', currency: inv.currency }).format(inv.total_ttc)
      const key  = process.env.RESEND_API_KEY
      const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
      if (key) {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `${process.env.RESEND_FROM_NAME ?? 'AEGRYN'} <${from}>`,
            reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
            to: [inv.recipient_email],
            subject: `AEGRYN — Facture ${inv.invoice_number}`,
            text:
              `Bonjour ${inv.recipient_name},\n\n` +
              `Veuillez trouver votre facture AEGRYN.\n\n` +
              `Référence : ${inv.invoice_number}\nMontant : ${total}\n` +
              (inv.due_date ? `Échéance : ${inv.due_date}\n` : '') +
              `\nMerci d'effectuer le virement à l'IBAN indiqué sur la facture en précisant la référence ${inv.invoice_number}.\n\nL'équipe AEGRYN`,
          }),
        })
      }
      await supa.from('invoices').update({ status: 'sent' }).eq('id', id)
    }

    return NextResponse.json({ ok: true, id })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const supa = createServiceClient()
  const { data, error } = await supa.from('invoices').select('*').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}
