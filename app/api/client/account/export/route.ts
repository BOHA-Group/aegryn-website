/**
 * GET /api/client/account/export
 *
 * Export RGPD Art.20 (EU) / Art.28 nLPD (CH) — portabilité des données.
 * Retourne un fichier JSON téléchargeable avec toutes les données personnelles
 * de l'utilisateur connecté.
 *
 * Inspiré de subblink-app/api/export-user-data.js
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supa = createServiceClient()

  const [
    profileRes,
    notificationsRes,
    kycRes,
    offersRes,
    transactionsRes,
    commissionsRes,
    introductionsRes,
  ] = await Promise.all([
    supa.from('profiles')
      .select('full_name, roles, email_notifications_enabled, created_at')
      .eq('id', user.id)
      .single(),

    supa.from('user_notifications')
      .select('id, type, title, body, read_at, dismissed_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200),

    supa.from('kyc_documents')
      .select('doc_type, status, created_at, reviewed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    supa.from('offers')
      .select('id, asset_id, amount, status, created_at')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false }),

    supa.from('transactions')
      .select('id, asset_id, stage, created_at')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false }),

    supa.from('commissions')
      .select('id, amount, status, created_at')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false }),

    supa.from('introductions')
      .select('id, target_name, status, created_at')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const exportPayload = {
    export_date:   new Date().toISOString(),
    export_format: 'application/json',
    rgpd_basis:    'Art. 20 RGPD (EU) / Art. 28 nLPD (CH) — portabilité des données',
    account: {
      id:              user.id,
      email:           user.email,
      created_at:      user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile:       profileRes.data  ?? null,
    notifications: notificationsRes.data ?? [],
    kyc_documents: kycRes.data       ?? [],
    offers:        offersRes.data    ?? [],
    transactions:  transactionsRes.data ?? [],
    commissions:   commissionsRes.data  ?? [],
    introductions: introductionsRes.data ?? [],
  }

  const filename = `aegryn-export-${user.id.slice(0, 8)}-${new Date().toISOString().slice(0, 10)}.json`

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
