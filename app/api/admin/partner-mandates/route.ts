import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail, emailPartnerMandateCreated } from '@/lib/sendEmail'

export async function POST(req: NextRequest) {
  const body = await req.json() as Record<string, unknown>

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const token = String(body.token ?? '')
  if (!adminToken || token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const {
    partner_id, client_name, client_email, client_type, mandate_type,
    description, asset_id, retrocession_pct, started_at, status,
  } = body

  if (!partner_id || !client_name || !client_email) {
    return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
  }

  const supa = createServiceClient()

  const { data, error } = await supa
    .from('partner_mandates')
    .insert({
      partner_id:       String(partner_id),
      client_name:      String(client_name),
      client_email:     String(client_email),
      client_type:      String(client_type ?? 'seller'),
      mandate_type:     String(mandate_type ?? 'advisory'),
      description:      description ? String(description) : null,
      asset_id:         asset_id ? String(asset_id) : null,
      retrocession_pct: Number(retrocession_pct ?? 15),
      started_at:       started_at ? String(started_at) : null,
      status:           String(status ?? 'active'),
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Email de notification au partenaire (best-effort)
  const { data: profile } = await supa
    .from('profiles')
    .select('email, full_name')
    .eq('id', String(partner_id))
    .single()

  if (profile?.email) {
    let assetName: string | null = null
    if (asset_id) {
      const { data: asset } = await supa
        .from('assets')
        .select('company_name')
        .eq('id', String(asset_id))
        .single()
      assetName = String(asset?.company_name ?? '')
    }

    const { subject, html } = await emailPartnerMandateCreated({
      partnerName:     String(profile.full_name ?? profile.email),
      partnerEmail:    profile.email,
      clientName:      String(client_name),
      mandateType:     String(mandate_type ?? 'advisory'),
      retrocessionPct: Number(retrocession_pct ?? 15),
      assetName,
    })
    await sendEmail(profile.email, subject, html, 'mandate-created').catch(() => {})
  }

  return NextResponse.json({ ok: true, id: data.id })
}
