/**
 * GET /api/admin/assets/[id]/grade-autofill
 *
 * Lit les documents data room d'un actif (avec admin_quality)
 * et retourne les sous-codes + GradeInput overrides déduits.
 *
 * ADMIN UNIQUEMENT — protégé par token.
 * Ne renvoie jamais la logique de pondération du moteur.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { inferGradeFromDocs }        from '@/lib/gradeAutoFill'
import type { DocSummary }           from '@/lib/gradeAutoFill'

export const runtime = 'nodejs'

export async function GET(
  req:     NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id }    = await params
  const token     = req.nextUrl.searchParams.get('token')
  const adminToken = process.env.ADMIN_LEADS_TOKEN

  if (adminToken && token !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supa = createServiceClient()

  const { data, error } = await supa
    .from('data_room_documents')
    .select('id, document_code, file_name, admin_quality, category, required_level')
    .eq('asset_id', id)
    .not('document_code', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const docs: DocSummary[] = (data ?? []).map(d => ({
    code:      d.document_code as string,
    file_name: d.file_name,
    quality:   (d.admin_quality ?? 'pending_review') as DocSummary['quality'],
    category:  d.category,
  }))

  const result = inferGradeFromDocs(docs)

  return NextResponse.json(result)
}
