/**
 * POST /api/client/nda/asset
 * Enregistre la signature du NDA data room par actif (scope = asset_specific).
 * Prérequis : NDA catalog_general déjà signé.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const body     = await req.json().catch(() => ({}))
  const assetId  = body?.asset_id as string | undefined
  const version  = body?.version  as string | undefined

  if (!assetId) return NextResponse.json({ error: 'asset_id requis' }, { status: 400 })

  const supa = createServiceClient()

  /* Vérifie que le NDA général est signé */
  const { data: generalNda } = await supa
    .from('nda_signatures')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('scope', 'catalog_general')
    .not('signed_at', 'is', null)
    .maybeSingle()

  if (!generalNda) {
    return NextResponse.json({ error: 'NDA général non signé' }, { status: 403 })
  }

  /* Vérifie que l'actif est publié */
  const { data: asset } = await supa
    .from('auction_assets')
    .select('id')
    .eq('id', assetId)
    .eq('status', 'published')
    .maybeSingle()

  if (!asset) return NextResponse.json({ error: 'Actif introuvable' }, { status: 404 })

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
          ?? req.headers.get('x-real-ip')
          ?? null
  const ua = req.headers.get('user-agent') ?? null

  /* Upsert — si une ligne pending existe déjà (signed_at null), on la complète */
  const { error } = await supa
    .from('nda_signatures')
    .upsert(
      {
        buyer_id:    user.id,
        scope:       'asset_specific',
        asset_id:    assetId,
        nda_version: version ?? '2026-08',
        signed_at:   new Date().toISOString(),
        ip_address:  ip,
        user_agent:  ua,
      },
      { onConflict: 'buyer_id,scope,asset_id' },
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
