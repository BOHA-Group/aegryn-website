/**
 * PATCH /api/data-room/visibility
 *
 * Modifie la visibilité d'un document de la data room.
 * Réservé au vendeur de l'actif ou admin.
 *
 * Body: { documentId: string; visible_to: DataRoomVisibility }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }        from '@/lib/supabase'
import { getUser }                    from '@/lib/supabaseServer'
import type { DataRoomVisibility }    from '@/lib/dataRoom'

const VALID_VISIBILITY: DataRoomVisibility[] = ['admin_only', 'assigned_partner', 'nda_buyers']

export async function PATCH(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let documentId: string, visible_to: DataRoomVisibility
  try {
    const body = await req.json() as { documentId?: string; visible_to?: string }
    if (!body.documentId || !body.visible_to) throw new Error()
    if (!VALID_VISIBILITY.includes(body.visible_to as DataRoomVisibility)) throw new Error()
    documentId = body.documentId
    visible_to = body.visible_to as DataRoomVisibility
  } catch {
    return NextResponse.json({ error: 'Données invalides.' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* Charger le document + actif associé */
  const { data: doc } = await supa
    .from('data_room_documents')
    .select('id, asset_id')
    .eq('id', documentId)
    .single() as { data: { id: string; asset_id: string } | null }

  if (!doc) return NextResponse.json({ error: 'Document introuvable.' }, { status: 404 })

  /* Vérifier autorisation */
  const { data: profile } = await supa
    .from('profiles')
    .select('email, role, roles')
    .eq('id', user.id)
    .single() as { data: { email: string; role: string; roles: string[] | null } | null }

  if (!profile) return NextResponse.json({ error: 'Profil introuvable.' }, { status: 403 })

  const isAdmin = profile.role === 'admin' || (profile.roles ?? []).some((r) => ['admin', 'super_admin'].includes(r))

  if (!isAdmin) {
    const { data: asset } = await supa
      .from('assets')
      .select('seller_email')
      .eq('id', doc.asset_id)
      .single() as { data: { seller_email: string } | null }

    if (!asset || profile.email !== asset.seller_email) {
      return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 })
    }
  }

  /* Mettre à jour */
  const { error } = await supa
    .from('data_room_documents')
    .update({
      visible_to,
      visibility_set_by:      user.id,
      visibility_updated_at:  new Date().toISOString(),
    })
    .eq('id', documentId)

  if (error) return NextResponse.json({ error: 'Mise à jour échouée.' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
