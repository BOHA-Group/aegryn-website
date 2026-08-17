/**
 * POST /api/data-room/signed-url
 *
 * Génère une URL signée (1h) pour un document de la data room.
 * Vérifie les droits RLS avant toute génération.
 * Insère un log data_room_access_log à chaque appel.
 *
 * Body: { documentId: string }
 * Returns: { url: string; fileName: string; isSensitive: boolean }
 */

import { NextRequest, NextResponse }  from 'next/server'
import { createServiceClient }  from '@/lib/supabase'
import { getUser }              from '@/lib/supabaseServer'
import { SIGNED_URL_EXPIRY_SECONDS, type DataRoomDocument } from '@/lib/dataRoom'

export async function POST(req: NextRequest) {
  /* ── 1. Auth ── */
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  /* ── 2. Body ── */
  let documentId: string
  try {
    const body = await req.json() as { documentId?: string }
    if (!body.documentId) throw new Error('missing documentId')
    documentId = body.documentId
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const supa = createServiceClient()

  /* ── 3. Fetch document (service role bypasse RLS pour la lecture initiale) ── */
  const { data: doc, error: docErr } = await supa
    .from('data_room_documents')
    .select('*')
    .eq('id', documentId)
    .single() as { data: DataRoomDocument | null; error: unknown }

  if (docErr || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  /* ── 4. Vérification des droits manuellement (calque sur les RLS policies) ── */
  const hasAccess = await checkAccess(supa, user.id, doc)
  if (!hasAccess) {
    await insertLog(supa, doc.id, user.id, 'suspicious_activity', 'unauthorized_access_attempt', req)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  /* ── 5. Génération URL signée (Supabase Storage) ── */
  const { data: signedData, error: signErr } = await supa
    .storage
    .from('data-room')
    .createSignedUrl(doc.file_path, SIGNED_URL_EXPIRY_SECONDS)

  if (signErr || !signedData?.signedUrl) {
    console.error('[data-room/signed-url] Storage error:', signErr)
    return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })
  }

  /* ── 6. Log de la consultation ── */
  await insertLog(supa, doc.id, user.id, 'signed_url_generated', null, req)

  return NextResponse.json({
    url:         signedData.signedUrl,
    fileName:    doc.file_name,
    mimeType:    doc.mime_type ?? 'application/octet-stream',
    isSensitive: doc.is_sensitive,
    expiresIn:   SIGNED_URL_EXPIRY_SECONDS,
  })
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

async function checkAccess(
  supa: ReturnType<typeof createServiceClient>,
  userId: string,
  doc: DataRoomDocument,
): Promise<boolean> {
  /* Admin : toujours autorisé */
  const { data: profile } = await supa
    .from('profiles')
    .select('role, roles, email')
    .eq('id', userId)
    .single() as { data: { role: string; roles: string[] | null; email: string } | null }

  if (!profile) return false

  const isAdmin = profile.role === 'admin' || (profile.roles ?? []).some((r) => ['admin', 'super_admin'].includes(r))
  if (isAdmin) return true

  /* Vendeur : email match sur assets.seller_email */
  const { data: asset } = await supa
    .from('assets')
    .select('seller_email')
    .eq('id', doc.asset_id)
    .single() as { data: { seller_email: string } | null }

  if (asset?.seller_email === profile.email) return true

  /* Partenaire assigné */
  if (doc.visible_to === 'assigned_partner' || doc.visible_to === 'nda_buyers') {
    const { data: cert } = await supa
      .from('partner_certifications')
      .select('id')
      .eq('asset_id', doc.asset_id)
      .eq('partner_id', userId)
      .in('status', ['assigned', 'in_review', 'submitted', 'validated'])
      .maybeSingle()
    if (cert) return true
  }

  /* Acheteur light : KYC approuvé + demande light approved */
  if (doc.visible_to === 'light_buyers') {
    const { data: lightProfile } = await supa
      .from('profiles')
      .select('kyc_status')
      .eq('id', userId)
      .single() as { data: { kyc_status: string | null } | null }

    if (lightProfile?.kyc_status === 'approved') {
      const { data: lightReq } = await supa
        .from('data_room_light_requests')
        .select('id')
        .eq('asset_id', doc.asset_id)
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle()
      if (lightReq) return true
    }
  }

  /* Acheteur NDA : le NDA est global — auction_nda_signed_at suffit */
  if (doc.visible_to === 'nda_buyers') {
    const { data: ndaProfile } = await supa
      .from('profiles')
      .select('auction_nda_signed_at')
      .eq('id', userId)
      .single() as { data: { auction_nda_signed_at: string | null } | null }

    if (ndaProfile?.auction_nda_signed_at) return true
  }

  return false
}

async function insertLog(
  supa: ReturnType<typeof createServiceClient>,
  documentId: string,
  userId: string,
  action: string,
  detail: string | null,
  req: NextRequest,
) {
  const ip        = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = req.headers.get('user-agent') ?? null

  await supa.from('data_room_access_log').insert({
    document_id: documentId,
    user_id:     userId,
    action,
    detail,
    ip_address:  ip,
    user_agent:  userAgent,
  })
}
