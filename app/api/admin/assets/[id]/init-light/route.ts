/**
 * POST /api/admin/assets/[id]/init-light
 * Admin-only.
 * Crée les 12 entrées DATA_ROOM_LIGHT_PRESET dans data_room_documents
 * pour cet actif (si elles n'existent pas déjà) et active data_room_light_enabled.
 *
 * Les documents sont créés avec :
 *   - room_level = 'light'
 *   - visible_to = 'light_buyers'
 *   - file_path = '' (placeholder — le vendeur uploade via son espace)
 *   - admin_quality = 'missing'
 *
 * Idempotent : ne recrée pas les documents dont le code existe déjà.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { getAdminUser }              from '@/lib/adminAuth'
import { DATA_ROOM_LIGHT_PRESET }    from '@/lib/dataRoom'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  /* ── 1. Admin check ── */
  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  const { id: assetId } = await params
  const supa = createServiceClient()

  /* ── 2. Vérifier que l'actif existe ── */
  const { data: asset } = await supa
    .from('assets')
    .select('id, seller_email')
    .eq('id', assetId)
    .single()

  if (!asset) return NextResponse.json({ error: 'asset_not_found' }, { status: 404 })

  /* ── 3. Codes déjà présents ── */
  const { data: existing } = await supa
    .from('data_room_documents')
    .select('document_code')
    .eq('asset_id', assetId)
    .eq('room_level', 'light')

  const existingCodes = new Set((existing ?? []).map((r) => r.document_code))

  /* ── 4. Insérer les manquants ── */
  const toInsert = DATA_ROOM_LIGHT_PRESET.filter(
    (entry) => !existingCodes.has(entry.code)
  ).map((entry) => ({
    asset_id:       assetId,
    category:       entry.category,
    document_type:  entry.code,
    document_code:  entry.code,
    file_path:      '',             // placeholder — le vendeur uploade
    file_name:      '',
    uploaded_by:    adminUser.id,
    visible_to:     'light_buyers',
    is_sensitive:   entry.is_sensitive,
    room_level:     'light',
    required_level: entry.required_level,
    admin_quality:  'missing',
    notes:          entry.note_seller ?? null,
    blocks_grading: false,
  }))

  if (toInsert.length > 0) {
    const { error: insertErr } = await supa
      .from('data_room_documents')
      .insert(toInsert)

    if (insertErr) {
      console.error('[init-light] insert:', insertErr)
      return NextResponse.json({ error: 'insert_failed', detail: insertErr.message }, { status: 500 })
    }
  }

  /* ── 5. Activer data_room_light_enabled ── */
  await supa
    .from('assets')
    .update({ data_room_light_enabled: true })
    .eq('id', assetId)

  return NextResponse.json({
    ok:      true,
    created: toInsert.length,
    skipped: existingCodes.size,
  })
}
