/**
 * POST /api/data-room/watermarked-pdf
 *
 * Proxy sécurisé : récupère le PDF depuis Supabase Storage,
 * grave un filigrane nominatif (nom + email + date) sur chaque page via pdf-lib,
 * et le sert en streaming inline (Content-Disposition: inline).
 *
 * Ainsi, même si l'acquéreur parvient à télécharger le fichier,
 * le watermark est gravé dans le PDF lui-même — non supprimable sans outil spécialisé.
 *
 * Body: { documentId: string }
 * Returns: PDF binaire (application/pdf, Content-Disposition: inline)
 */

import { NextRequest, NextResponse } from 'next/server'
import { PDFDocument, rgb, degrees } from 'pdf-lib'
import { createServiceClient } from '@/lib/supabase'
import { getUser } from '@/lib/supabaseServer'
import { SIGNED_URL_EXPIRY_SECONDS, type DataRoomDocument } from '@/lib/dataRoom'

export const runtime = 'nodejs'
export const maxDuration = 30

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

  /* ── 3. Fetch document metadata ── */
  const { data: doc, error: docErr } = await supa
    .from('data_room_documents')
    .select('*')
    .eq('id', documentId)
    .single() as { data: DataRoomDocument | null; error: unknown }

  if (docErr || !doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 })
  }

  /* ── 4. Vérification des droits ── */
  const hasAccess = await checkAccess(supa, user.id, doc)
  if (!hasAccess) {
    await insertLog(supa, doc.id, user.id, 'suspicious_activity', 'unauthorized_watermark_attempt', req)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  /* ── 5. Récupérer le profil pour le filigrane ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single() as { data: { full_name: string | null; email: string } | null }

  const userName  = profile?.full_name ?? user.email ?? 'Inconnu'
  const userEmail = profile?.email ?? user.email ?? ''
  const dateStr   = new Date().toLocaleDateString('fr-CH')

  /* ── 6. Générer URL signée (courte — usage interne uniquement) ── */
  const { data: signedData, error: signErr } = await supa
    .storage
    .from('data-room')
    .createSignedUrl(doc.file_path, SIGNED_URL_EXPIRY_SECONDS)

  if (signErr || !signedData?.signedUrl) {
    return NextResponse.json({ error: 'Could not generate signed URL' }, { status: 500 })
  }

  /* ── 7. Télécharger le PDF original ── */
  let pdfBytes: ArrayBuffer
  try {
    const response = await fetch(signedData.signedUrl)
    if (!response.ok) throw new Error(`fetch failed: ${response.status}`)
    pdfBytes = await response.arrayBuffer()
  } catch (e) {
    console.error('[watermarked-pdf] fetch PDF:', e)
    return NextResponse.json({ error: 'Could not fetch PDF' }, { status: 502 })
  }

  /* ── 8. Graver le filigrane sur chaque page via pdf-lib ── */
  let watermarkedBytes: Uint8Array
  try {
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages  = pdfDoc.getPages()

    const watermarkLine1 = `Aegryn CONFIDENTIEL — ${userName} <${userEmail}>`
    const watermarkLine2 = `Consultation autorisée — ${dateStr} — Reproduction interdite`

    for (const page of pages) {
      const { width, height } = page.getSize()
      const fontSize = Math.min(width, height) * 0.022  // ~2.2% de la dimension la plus petite

      /* Ligne 1 — centrée, diagonale */
      page.drawText(watermarkLine1, {
        x:        width * 0.05,
        y:        height * 0.52,
        size:     fontSize,
        color:    rgb(0.1, 0.1, 0.1),
        opacity:  0.08,
        rotate:   degrees(-35),
      })

      /* Ligne 2 — légèrement décalée */
      page.drawText(watermarkLine2, {
        x:        width * 0.08,
        y:        height * 0.45,
        size:     fontSize * 0.85,
        color:    rgb(0.1, 0.1, 0.1),
        opacity:  0.07,
        rotate:   degrees(-35),
      })

      /* Répétition en bas de page pour couverture complète */
      page.drawText(watermarkLine1, {
        x:        width * 0.05,
        y:        height * 0.22,
        size:     fontSize,
        color:    rgb(0.1, 0.1, 0.1),
        opacity:  0.06,
        rotate:   degrees(-35),
      })
    }

    watermarkedBytes = await pdfDoc.save()
  } catch (e) {
    console.error('[watermarked-pdf] pdf-lib error:', e)
    return NextResponse.json({ error: 'Could not watermark PDF' }, { status: 500 })
  }

  /* ── 9. Log ── */
  await insertLog(supa, doc.id, user.id, 'signed_url_generated', 'watermarked_pdf_served', req)

  /* ── 10. Servir le PDF inline (non téléchargeable) ── */
  const safeName = doc.file_name.replace(/[^a-zA-Z0-9._-]/g, '_')
  return new NextResponse(watermarkedBytes.buffer as ArrayBuffer, {
    status: 200,
    headers: {
      'Content-Type':        'application/pdf',
      'Content-Disposition': `inline; filename="${safeName}"`,
      'Cache-Control':       'no-store, no-cache, must-revalidate, private',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options':    'DENY',
    },
  })
}

/* ── Helpers ── */

async function checkAccess(
  supa: ReturnType<typeof createServiceClient>,
  userId: string,
  doc: DataRoomDocument,
): Promise<boolean> {
  const { data: profile } = await supa
    .from('profiles')
    .select('role, roles, email, kyc_status, auction_nda_signed_at')
    .eq('id', userId)
    .single() as { data: { role: string; roles: string[] | null; email: string; kyc_status: string | null; auction_nda_signed_at: string | null } | null }

  if (!profile) return false

  const isAdmin = profile.role === 'admin' || (profile.roles ?? []).some((r) => ['admin', 'super_admin'].includes(r))
  if (isAdmin) return true

  const { data: asset } = await supa
    .from('assets')
    .select('seller_email')
    .eq('id', doc.asset_id)
    .single() as { data: { seller_email: string } | null }

  if (asset?.seller_email === profile.email) return true

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

  if (doc.visible_to === 'light_buyers') {
    if (profile.kyc_status === 'approved') {
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

  if (doc.visible_to === 'nda_buyers' && profile.auction_nda_signed_at) return true

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
