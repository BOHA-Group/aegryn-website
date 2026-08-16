/**
 * POST /api/auction/grant-access
 * Route admin uniquement (JWT role = 'admin').
 *
 * Accorde l'accès au dossier complet.
 * expires_at = LEAST(now + 30 jours, session_closes_at)
 * Aucun email envoyé — l'acquéreur découvrira le lien dans /client/auction.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { createAuthClient }          from '@/lib/supabaseServer'
import { z }                         from 'zod'

const schema = z.object({
  request_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  try {
    /* ── 1. Auth admin ── */
    const authClient = await createAuthClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 })
    }

    const supa = createServiceClient()

    /* Vérification rôle admin via JWT claim */
    const { data: { user: fullUser } } = await supa.auth.admin.getUserById(user.id)
    const role = (fullUser?.app_metadata as { role?: string } | undefined)?.role
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs.' }, { status: 403 })
    }

    /* ── 2. Validation body ── */
    const body   = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
    }
    const { request_id } = parsed.data

    /* ── 3. Récupérer la demande + asset ── */
    const { data: req_ } = await supa
      .from('auction_dossier_requests')
      .select('id, asset_id, user_id, status')
      .eq('id', request_id)
      .single()

    if (!req_ || req_.status !== 'pending') {
      return NextResponse.json({ error: 'Demande introuvable ou déjà traitée.' }, { status: 404 })
    }

    const { data: asset } = await supa
      .from('auction_assets')
      .select('session_closes_at')
      .eq('id', req_.asset_id)
      .single()

    /* ── 4. Calculer expires_at ── */
    const thirtyDays = new Date()
    thirtyDays.setDate(thirtyDays.getDate() + 30)

    const closesAt = asset?.session_closes_at
      ? new Date(asset.session_closes_at)
      : null

    /* expires_at = LEAST(now + 30 jours, session_closes_at) */
    const expiresAt = closesAt && closesAt < thirtyDays ? closesAt : thirtyDays

    /* ── 5. Créer / mettre à jour l'accès ── */
    const { error: accessErr } = await supa
      .from('auction_asset_access')
      .upsert(
        {
          asset_id:   req_.asset_id,
          user_id:    req_.user_id,
          granted_by: user.id,
          expires_at: expiresAt.toISOString(),
          status:     'active',
        },
        { onConflict: 'asset_id,user_id' }
      )

    if (accessErr) {
      console.error('[grant-access] upsert access', accessErr)
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    /* ── 6. Marquer la demande comme approuvée ── */
    await supa
      .from('auction_dossier_requests')
      .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', request_id)

    return NextResponse.json({ ok: true, expires_at: expiresAt.toISOString() })
  } catch (err) {
    console.error('[grant-access]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
