/**
 * GET /api/admin/nda/signatories/[sid]/pdf
 * Téléchargement admin de l'exemplaire signé (lien temporaire).
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { createDownloadUrl } from '@/lib/nda/service'

export const runtime = 'nodejs'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ sid: string }> }) {
  const admin = await getAdminUser()
  if (!admin) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const { sid } = await params
  const { data } = await createServiceClient().from('nda_signatories').select('pdf_path, nda_agreements(reference)').eq('id', sid).maybeSingle()
  const row = data as { pdf_path: string | null; nda_agreements: { reference: string } | { reference: string }[] | null } | null
  if (!row?.pdf_path) return NextResponse.json({ error: 'not_found' }, { status: 404 })
  const ref = Array.isArray(row.nda_agreements) ? row.nda_agreements[0]?.reference : row.nda_agreements?.reference
  const url = await createDownloadUrl(row.pdf_path, `${ref ?? 'NDA'}.pdf`)
  return url ? NextResponse.redirect(url, 302) : NextResponse.json({ error: 'not_found' }, { status: 404 })
}
