/**
 * GET /api/client/nda/pdf?id=<signatoryId>
 * Téléchargement de l'exemplaire signé depuis l'espace compte : réservé au
 * propriétaire de l'e-mail du lien de signature.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { createDownloadUrl } from '@/lib/nda/service'

export const runtime = 'nodejs'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const id = req.nextUrl.searchParams.get('id') ?? ''
  const { data } = await createServiceClient()
    .from('nda_signatories').select('email, status, pdf_path, nda_agreements(reference)').eq('id', id).maybeSingle()
  const row = data as { email: string; status: string; pdf_path: string | null; nda_agreements: { reference: string } | { reference: string }[] | null } | null
  if (!row || row.status !== 'signed' || !row.pdf_path || row.email.toLowerCase() !== user.email.toLowerCase()) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }
  const ref = (Array.isArray(row.nda_agreements) ? row.nda_agreements[0]?.reference : row.nda_agreements?.reference) ?? 'NDA'
  const url = await createDownloadUrl(row.pdf_path, `${ref}.pdf`)
  return url ? NextResponse.redirect(url, 302) : NextResponse.json({ error: 'not_found' }, { status: 404 })
}
