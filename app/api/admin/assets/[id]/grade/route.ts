import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'
import { estimateGrade }            from '@/lib/valuationEngine'

const schema = z.object({
  score_code:     z.number().int().min(0).max(25),
  score_ip:       z.number().int().min(0).max(25),
  score_finance:  z.number().int().min(0).max(25),
  score_security: z.number().int().min(0).max(25),
  cosigner_legal:        z.string().max(200).optional(),
  cosigner_legal_date:   z.string().optional(),
  cosigner_account:      z.string().max(200).optional(),
  cosigner_account_date: z.string().optional(),
  cosigner_cyber:        z.string().max(200).optional(),
  cosigner_cyber_date:   z.string().optional(),
  kryv_hash:       z.string().max(200).optional(),
  public_summary:  z.string().max(2000).optional(),
  internal_notes:  z.string().max(2000).optional(),
  status:          z.enum(['submitted', 'under_review', 'graded', 'published', 'sold', 'withdrawn']).optional(),
  token:           z.string(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const body = schema.parse(await req.json())

    /* ── Auth admin token ── */
    const adminToken = process.env.ADMIN_LEADS_TOKEN
    if (adminToken && body.token !== adminToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    /* ── Calcul grade ── */
    const total = body.score_code + body.score_ip + body.score_finance + body.score_security
    const { grade } = estimateGrade(total)

    const supa = createServiceClient()

    const updatePayload: Record<string, unknown> = {
      score_code:     body.score_code,
      score_ip:       body.score_ip,
      score_finance:  body.score_finance,
      score_security: body.score_security,
      official_grade: grade,
      graded_at:      new Date().toISOString(),
    }

    if (body.cosigner_legal)        updatePayload.cosigner_legal        = body.cosigner_legal
    if (body.cosigner_legal_date)   updatePayload.cosigner_legal_date   = body.cosigner_legal_date
    if (body.cosigner_account)      updatePayload.cosigner_account      = body.cosigner_account
    if (body.cosigner_account_date) updatePayload.cosigner_account_date = body.cosigner_account_date
    if (body.cosigner_cyber)        updatePayload.cosigner_cyber        = body.cosigner_cyber
    if (body.cosigner_cyber_date)   updatePayload.cosigner_cyber_date   = body.cosigner_cyber_date
    if (body.kryv_hash)             updatePayload.kryv_hash             = body.kryv_hash
    if (body.public_summary)        updatePayload.public_summary        = body.public_summary
    if (body.internal_notes)        updatePayload.internal_notes        = body.internal_notes
    if (body.status)                updatePayload.status                = body.status
    if (body.status === 'published') updatePayload.published_at         = new Date().toISOString()

    const { error } = await supa
      .from('assets')
      .update(updatePayload)
      .eq('id', id)

    if (error) {
      console.error('[admin/assets/grade]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, grade, total })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[admin/assets/grade]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
