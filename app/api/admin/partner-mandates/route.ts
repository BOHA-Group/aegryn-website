import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

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

  return NextResponse.json({ ok: true, id: data.id })
}
