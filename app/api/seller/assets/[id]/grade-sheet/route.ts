import { NextRequest, NextResponse } from 'next/server'
import { getUser }                   from '@/lib/supabaseServer'
import { createServiceClient }       from '@/lib/supabase'
import { gradeSheetHtml }            from '@/lib/gradeSheetTemplate'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { id } = await params
  const supa   = createServiceClient()

  const { data: asset } = await supa
    .from('assets')
    .select(
      'id, company_name, asset_type, benchmark_category, arr, ' +
      'official_grade, aeg_grade, score_total, ' +
      'score_code, score_ip, score_finance, score_security, ' +
      'subcodes_code, subcodes_ip, subcodes_finance, subcodes_security, ' +
      'public_summary, graded_at, grading_version, seller_uid, seller_email'
    )
    .eq('id', id)
    .single()

  if (!asset) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const a = asset as unknown as Record<string, unknown>

  const isOwner =
    a.seller_uid === user.id ||
    (a.seller_email && a.seller_email === user.email)

  if (!isOwner) return NextResponse.json({ error: 'forbidden' }, { status: 403 })

  if (!a.official_grade || !a.graded_at) {
    return NextResponse.json({ error: 'not_graded' }, { status: 400 })
  }

  const html = gradeSheetHtml(a as Parameters<typeof gradeSheetHtml>[0])

  return new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type':        'text/html; charset=utf-8',
      'Content-Disposition': `inline; filename="aegryn-grade-${id.slice(0, 8)}.html"`,
      'X-Robots-Tag':        'noindex',
    },
  })
}
