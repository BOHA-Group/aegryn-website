/**
 * POST /api/buyer/data-room-light
 * Soumet une demande d'accès à la data room light pour un actif.
 *
 * Conditions :
 *  1. Utilisateur authentifié
 *  2. KYC approuvé (profiles.kyc_status = 'approved')
 *  3. Actif publié + data_room_light_enabled = true
 *  4. Pas de demande déjà existante pour cet actif
 *
 * Body: { asset_id: string }
 * Returns: { ok: true, request_id: string, status: string }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'
import { getUser }                   from '@/lib/supabaseServer'

const schema = z.object({
  asset_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  /* ── 1. Auth ── */
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  /* ── 2. Body ── */
  let body: z.infer<typeof schema>
  try {
    body = schema.parse(await req.json())
  } catch {
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* ── 3. KYC check ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('kyc_status')
    .eq('id', user.id)
    .single() as { data: { kyc_status: string | null } | null }

  if (profile?.kyc_status !== 'approved') {
    return NextResponse.json({ error: 'kyc_required' }, { status: 403 })
  }

  /* ── 4. Actif publié + light enabled ── */
  const { data: asset } = await supa
    .from('assets')
    .select('id, data_room_light_enabled, status')
    .eq('id', body.asset_id)
    .eq('status', 'published')
    .single() as { data: { id: string; data_room_light_enabled: boolean; status: string } | null }

  if (!asset) {
    return NextResponse.json({ error: 'asset_not_found' }, { status: 404 })
  }

  if (!asset.data_room_light_enabled) {
    return NextResponse.json({ error: 'light_not_enabled' }, { status: 403 })
  }

  /* ── 5. Vérifier doublon ── */
  const { data: existing } = await supa
    .from('data_room_light_requests')
    .select('id, status')
    .eq('asset_id', body.asset_id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({
      ok: true,
      request_id: existing.id,
      status: existing.status,
      already_exists: true,
    })
  }

  /* ── 6. Insérer la demande ── */
  const { data: inserted, error: insertErr } = await supa
    .from('data_room_light_requests')
    .insert({
      asset_id: body.asset_id,
      user_id:  user.id,
      status:   'pending',
    })
    .select('id, status')
    .single()

  if (insertErr || !inserted) {
    console.error('[data-room-light] insert:', insertErr)
    return NextResponse.json({ error: 'insert_failed' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, request_id: inserted.id, status: inserted.status })
}

/* ── GET : récupère le statut de la demande pour un actif ── */
export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const assetId = req.nextUrl.searchParams.get('asset_id')
  if (!assetId) return NextResponse.json({ error: 'missing asset_id' }, { status: 400 })

  const supa = createServiceClient()
  const { data } = await supa
    .from('data_room_light_requests')
    .select('id, status, bid_amount_chf, reviewed_at')
    .eq('asset_id', assetId)
    .eq('user_id', user.id)
    .maybeSingle()

  return NextResponse.json({ request: data ?? null })
}
