import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

const schema = z.object({
  token: z.string(),
  status: z.enum(['ei_submitted', 'ap_signed', 'escrow_paid', 'dd_in_progress', 'signing', 'closed', 'cancelled']).optional(),
  ap_accepted_buyer:  z.boolean().optional(),
  ap_accepted_seller: z.boolean().optional(),
  escrow_amount_chf:   z.number().optional(),
  escrow_provider:     z.string().max(200).optional(),
  escrow_reference:    z.string().max(200).optional(),
  escrow_confirmed:    z.boolean().optional(),
  escrow_note:         z.string().max(2000).optional(),
  dd_started_at:       z.string().optional(),
  dd_deadline_at:      z.string().optional(),
  dd_extended_to:      z.string().optional(),
  dataroom_url:        z.string().max(500).optional(),
  signing_date:        z.string().optional(),
  spa_document_url:    z.string().max(500).optional(),
  certificate_url:     z.string().max(500).optional(),
  issue_certificate:   z.boolean().optional(),
  commission_seller_pct:        z.number().optional(),
  commission_buyer_premium_pct: z.number().optional(),
  commission_referrer_chf:      z.number().optional(),
  net_seller_proceeds_chf:      z.number().optional(),
  admin_note: z.string().max(2000).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = schema.parse(await req.json())

    const adminToken = process.env.ADMIN_LEADS_TOKEN
    if (adminToken && body.token !== adminToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const supa = createServiceClient()
    const update: Record<string, unknown> = {}

    if (body.status) {
      update.status = body.status
      if (body.status === 'ap_signed')   update.ap_accepted_at = new Date().toISOString()
      if (body.status === 'closed')      update.closed_at      = new Date().toISOString()
    }
    if (body.ap_accepted_buyer  != null) update.ap_accepted_buyer  = body.ap_accepted_buyer
    if (body.ap_accepted_seller != null) update.ap_accepted_seller = body.ap_accepted_seller

    if (body.escrow_amount_chf  != null) update.escrow_amount_chf = body.escrow_amount_chf
    if (body.escrow_provider)            update.escrow_provider   = body.escrow_provider
    if (body.escrow_reference)           update.escrow_reference  = body.escrow_reference
    if (body.escrow_confirmed)           update.escrow_confirmed_at = new Date().toISOString()
    if (body.escrow_note)                update.escrow_note       = body.escrow_note

    if (body.dd_started_at)  update.dd_started_at  = body.dd_started_at
    if (body.dd_deadline_at) update.dd_deadline_at = body.dd_deadline_at
    if (body.dd_extended_to) update.dd_extended_to = body.dd_extended_to
    if (body.dataroom_url)   update.dataroom_url   = body.dataroom_url

    if (body.signing_date)     update.signing_date     = body.signing_date
    if (body.spa_document_url) update.spa_document_url = body.spa_document_url
    if (body.certificate_url)  update.certificate_url  = body.certificate_url
    if (body.issue_certificate) update.certificate_issued_at = new Date().toISOString()

    if (body.commission_seller_pct        != null) update.commission_seller_pct        = body.commission_seller_pct
    if (body.commission_buyer_premium_pct != null) update.commission_buyer_premium_pct = body.commission_buyer_premium_pct
    if (body.commission_referrer_chf      != null) update.commission_referrer_chf      = body.commission_referrer_chf
    if (body.net_seller_proceeds_chf      != null) update.net_seller_proceeds_chf      = body.net_seller_proceeds_chf

    if (body.admin_note) update.admin_note = body.admin_note

    const { error } = await supa.from('transactions').update(update).eq('id', id)

    if (error) {
      console.error('[admin/transactions/patch]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[admin/transactions/patch]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
