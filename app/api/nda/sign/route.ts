/**
 * POST /api/nda/sign
 *
 * Insère une signature NDA catalog_general pour l'acheteur connecté.
 * ip_address et user_agent capturés côté serveur.
 *
 * Body: { ndaVersion?: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { getUser }                   from '@/lib/supabaseServer'

const CURRENT_NDA_VERSION = 'v1.0-2026-07'

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })

  const ip        = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = req.headers.get('user-agent') ?? null

  let ndaVersion = CURRENT_NDA_VERSION
  try {
    const body = await req.json() as { ndaVersion?: string }
    if (body.ndaVersion) ndaVersion = body.ndaVersion
  } catch { /* body optionnel */ }

  const supa = createServiceClient()

  /* Vérifier que l'utilisateur a le rôle buyer */
  const { data: profile } = await supa
    .from('profiles')
    .select('roles')
    .eq('id', user.id)
    .single() as { data: { roles: string[] | null } | null }

  const roles = profile?.roles ?? []
  if (!roles.includes('buyer') && !roles.includes('partner')) {
    return NextResponse.json({ error: 'Rôle acheteur requis.' }, { status: 403 })
  }

  /* Upsert — UNIQUE(buyer_id, scope, asset_id) avec asset_id NULL */
  const { error } = await supa.from('nda_signatures').upsert(
    {
      buyer_id:    user.id,
      nda_version: ndaVersion,
      signed_at:   new Date().toISOString(),
      ip_address:  ip,
      user_agent:  userAgent,
      scope:       'catalog_general',
      asset_id:    null,
    },
    { onConflict: 'buyer_id,scope,asset_id', ignoreDuplicates: false }
  )

  if (error) {
    console.error('[NDA sign]', error)
    return NextResponse.json({ error: 'Erreur lors de la signature.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
