/**
 * POST /api/transaction/request-dossier
 *
 * Crée une demande d'accès au dossier complet.
 * Aucun email envoyé — l'URL n'est révélée que dans /client/buyer
 * après approbation admin, pour éviter tout forward non autorisé.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { createAuthClient }          from '@/lib/supabaseServer'
import { z }                         from 'zod'

const schema = z.object({
  asset_id: z.string().uuid(),
  note:     z.string().max(1000).optional(),
})

export async function POST(req: NextRequest) {
  try {
    /* ── 1. Auth ── */
    const authClient = await createAuthClient()
    const { data: { user } } = await authClient.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Authentification requise.' }, { status: 401 })
    }

    /* ── 2. Validation body ── */
    const body   = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
    }
    const { asset_id, note } = parsed.data

    /* ── 3. Vérifier que l'actif est publié et la session est ouverte ── */
    const supa = createServiceClient()
    const { data: asset } = await supa
      .from('auction_assets')
      .select('id, status, session_opens_at, session_closes_at')
      .eq('id', asset_id)
      .single()

    if (!asset || asset.status !== 'published') {
      return NextResponse.json({ error: 'Actif non disponible.' }, { status: 404 })
    }
    const now = new Date()
    if (asset.session_opens_at && new Date(asset.session_opens_at) > now) {
      return NextResponse.json({ error: 'La session n\'est pas encore ouverte.' }, { status: 403 })
    }
    if (asset.session_closes_at && new Date(asset.session_closes_at) < now) {
      return NextResponse.json({ error: 'La session est clôturée.' }, { status: 403 })
    }

    /* ── 4. Créer ou ignorer si demande déjà existante ── */
    const { error } = await supa
      .from('auction_dossier_requests')
      .upsert(
        { asset_id, user_id: user.id, note: note ?? null, status: 'pending' },
        { onConflict: 'asset_id,user_id', ignoreDuplicates: true }
      )

    if (error) {
      console.error('[request-dossier]', error)
      return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[request-dossier]', err)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }
}
