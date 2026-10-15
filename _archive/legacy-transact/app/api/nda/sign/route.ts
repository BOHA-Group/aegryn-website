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

  /* Vérifier que le profil existe (tout utilisateur authentifié peut signer) */
  const { data: profile } = await supa
    .from('profiles')
    .select('id, roles, role')
    .eq('id', user.id)
    .maybeSingle() as { data: { id: string; roles: string[] | null; role: string | null } | null }

  if (!profile) {
    return NextResponse.json({ error: 'Profil introuvable.' }, { status: 403 })
  }

  /* Vérifier si une signature catalog_general existe déjà */
  const { data: existing, error: selectErr } = await supa
    .from('nda_signatures')
    .select('id')
    .eq('buyer_id', user.id)
    .eq('scope', 'catalog_general')
    .is('asset_id', null)
    .maybeSingle()

  /* 42P01 = table inexistante → on tente le fallback direct */
  const tableIsMissing = selectErr?.code === '42P01'

  if (!tableIsMissing && existing) {
    /* Déjà signé — succès silencieux */
    return NextResponse.json({ ok: true })
  }

  const now = new Date().toISOString()

  /* Si la table est absente, fallback immédiat */
  if (tableIsMissing) {
    const { error: profileErr } = await supa
      .from('profiles')
      .update({ auction_nda_signed_at: now })
      .eq('id', user.id)
      .is('auction_nda_signed_at', null)
    if (profileErr) {
      console.error('[NDA sign fallback-early]', profileErr.code, profileErr.message)
      return NextResponse.json({ error: 'Erreur lors de la signature.', code: profileErr.code, detail: profileErr.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true })
  }

  const { error } = await supa.from('nda_signatures').insert({
    buyer_id:    user.id,
    nda_version: ndaVersion,
    signed_at:   now,
    ip_address:  ip,
    user_agent:  userAgent,
    scope:       'catalog_general',
    asset_id:    null,
  })

  if (error) {
    console.error('[NDA sign]', error.code, error.message)
    /* 23505 = unique_violation → déjà signé, succès silencieux */
    if (error.code === '23505') {
      return NextResponse.json({ ok: true })
    }
    /* 42P01 = table nda_signatures inexistante → fallback direct sur profiles */
    if (error.code === '42P01') {
      const { error: profileErr } = await supa
        .from('profiles')
        .update({ auction_nda_signed_at: now })
        .eq('id', user.id)
        .is('auction_nda_signed_at', null)
      if (profileErr) {
        console.error('[NDA sign fallback]', profileErr.code, profileErr.message)
        return NextResponse.json({ error: 'Erreur lors de la signature.', code: profileErr.code, detail: profileErr.message }, { status: 500 })
      }
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: 'Erreur lors de la signature.', code: error.code, detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
