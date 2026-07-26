/**
 * POST /api/data-room/upload
 *
 * Upload d'un document dans la data room.
 * Vérifie que l'utilisateur est le vendeur de l'actif.
 * Stocke dans Supabase Storage bucket 'data-room' (privé).
 *
 * FormData:
 *   - file: File
 *   - assetId: string
 *   - category: DataRoomCategory
 *   - document_type: string
 *   - notes?: string
 *   - is_sensitive?: 'true'
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }        from '@/lib/supabase'
import { getUser }                    from '@/lib/supabaseServer'
import type { DataRoomCategory }      from '@/lib/dataRoom'

const MAX_SIZE_BYTES = 20 * 1024 * 1024 // 20 Mo
const ALLOWED_MIME = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'application/zip',
]

const VALID_CATEGORIES: DataRoomCategory[] = ['code', 'ip', 'finance', 'security', 'transversal']

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const form = await req.formData().catch(() => null)
  if (!form) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })

  const file         = form.get('file') as File | null
  const assetId      = form.get('assetId') as string | null
  const category     = form.get('category') as DataRoomCategory | null
  const documentType = form.get('document_type') as string | null
  const notes        = form.get('notes') as string | null
  const isSensitive  = form.get('is_sensitive') === 'true'

  if (!file || !assetId || !category || !documentType) {
    return NextResponse.json({ error: 'Champs obligatoires manquants.' }, { status: 400 })
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Catégorie invalide.' }, { status: 400 })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 20 Mo).' }, { status: 413 })
  }

  if (ALLOWED_MIME.length > 0 && !ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ error: 'Type de fichier non autorisé.' }, { status: 415 })
  }

  const supa = createServiceClient()

  /* Vérifier que le vendeur est bien propriétaire de l'actif */
  const { data: asset } = await supa
    .from('assets')
    .select('id, seller_email')
    .eq('id', assetId)
    .single() as { data: { id: string; seller_email: string } | null }

  if (!asset) return NextResponse.json({ error: 'Actif introuvable.' }, { status: 404 })

  const { data: profile } = await supa
    .from('profiles')
    .select('email, role, roles')
    .eq('id', user.id)
    .single() as { data: { email: string; role: string; roles: string[] | null } | null }

  if (!profile) return NextResponse.json({ error: 'Profil introuvable.' }, { status: 403 })

  const isAdmin = profile.role === 'admin' || (profile.roles ?? []).some((r) => ['admin', 'super_admin'].includes(r))
  if (!isAdmin && profile.email !== asset.seller_email) {
    return NextResponse.json({ error: 'Accès interdit.' }, { status: 403 })
  }

  /* Chemin : data-room/{assetId}/{category}/{timestamp}_{fileName} */
  const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${assetId}/${category}/${Date.now()}_${safeFileName}`

  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)

  const { error: storageError } = await supa.storage
    .from('data-room')
    .upload(filePath, buffer, {
      contentType:  file.type,
      cacheControl: '3600',
      upsert:       false,
    })

  if (storageError) {
    console.error('[data-room/upload] Storage error:', storageError)
    return NextResponse.json({ error: 'Erreur de stockage.' }, { status: 500 })
  }

  /* Insérer la métadonnée en base */
  const { error: dbError } = await supa
    .from('data_room_documents')
    .insert({
      asset_id:        assetId,
      category,
      document_type:   documentType,
      file_path:       filePath,
      file_name:       file.name,
      file_size_bytes: file.size,
      mime_type:       file.type,
      uploaded_by:     user.id,
      visible_to:      'admin_only', // Toujours masqué par défaut
      is_sensitive:    isSensitive,
      notes:           notes || null,
    })

  if (dbError) {
    console.error('[data-room/upload] DB error:', dbError)
    await supa.storage.from('data-room').remove([filePath])
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
