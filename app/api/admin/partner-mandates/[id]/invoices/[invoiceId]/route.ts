import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; invoiceId: string }> }
) {
  const { id: mandateId, invoiceId } = await params
  const body = await req.json() as Record<string, unknown>

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const token = String(body.token ?? '')
  if (!adminToken || token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action } = body
  if (action !== 'validate' && action !== 'reject') {
    return NextResponse.json({ error: 'action doit être "validate" ou "reject"' }, { status: 400 })
  }

  const supa = createServiceClient()

  // Récupérer la facture + mandat pour calculer la commission Aegryn
  const { data: invoice } = await supa
    .from('partner_mandate_invoices')
    .select('id, amount_chf, status, mandate_id')
    .eq('id', invoiceId)
    .eq('mandate_id', mandateId)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Facture introuvable' }, { status: 404 })
  if (invoice.status !== 'submitted') {
    return NextResponse.json({ error: 'Facture déjà traitée' }, { status: 409 })
  }

  const { data: mandate } = await supa
    .from('partner_mandates')
    .select('partner_id, retrocession_pct')
    .eq('id', mandateId)
    .single()

  if (!mandate) return NextResponse.json({ error: 'Mandat introuvable' }, { status: 404 })

  // Mettre à jour le statut de la facture
  const newStatus = action === 'validate' ? 'validated' : 'rejected'
  const { error: updateErr } = await supa
    .from('partner_mandate_invoices')
    .update({
      status:       newStatus,
      validated_at: action === 'validate' ? new Date().toISOString() : null,
    })
    .eq('id', invoiceId)

  if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 })

  // CAS 3 : à la validation, créer une commission due pour Aegryn (retrocession_pct % du montant facturé)
  if (action === 'validate' && invoice.amount_chf && mandate.retrocession_pct) {
    const aegrynDue = Math.round(Number(invoice.amount_chf) * Number(mandate.retrocession_pct) / 100)

    await supa.from('commissions').insert({
      partner_id:  mandate.partner_id,
      mandate_id:  mandateId,
      type:        'mandate_retrocession',
      amount_chf:  aegrynDue,
      status:      'due',
    })
  }

  return NextResponse.json({ ok: true })
}
