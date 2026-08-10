import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAdminUser }        from '@/lib/adminAuth'

/* Tables autorisées pour la suppression en masse */
const ALLOWED_TABLES = [
  'expert_applications',
  'expert_profiles',
  'kyc_documents',
  'buyer_kyc_verifications',
  'nda_requests',
  'valuation_leads',
  'user_notifications',
  'introductions',
  'commissions',
  'partner_certifications',
  'partner_mandates',
  'newsletter_subscribers',
] as const

type AllowedTable = typeof ALLOWED_TABLES[number]

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const token = searchParams.get('token') ?? ''

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const tokenOk = !!adminToken && token === adminToken
  if (!tokenOk) {
    const adminUser = await getAdminUser()
    if (!adminUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  let body: { table: string; ids: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const { table, ids } = body

  if (!table || !ALLOWED_TABLES.includes(table as AllowedTable)) {
    return NextResponse.json({ error: 'invalid_table' }, { status: 400 })
  }

  if (!Array.isArray(ids) || ids.length === 0 || ids.length > 200) {
    return NextResponse.json({ error: 'invalid_ids' }, { status: 400 })
  }

  const supa = createServiceClient()

  const idField = 'id'
  const { error, count } = await supa
    .from(table as AllowedTable)
    .delete({ count: 'exact' })
    .in(idField, ids)

  if (error) {
    console.error('[admin/bulk-delete]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, deleted: count ?? ids.length })
}
