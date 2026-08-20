/**
 * PATCH /api/admin/auction/update-lot
 * Met à jour un lot transaction : status, session dates, reserve_price, grade, buyer_premium_pct.
 * Auth : session admin (cookie) uniquement.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'
import { z }                         from 'zod'
import { getAdminUser }              from '@/lib/adminAuth'

const schema = z.object({
  id:               z.string().uuid(),
  status:           z.enum(['draft', 'published', 'archived', 'withdrawn']).optional(),
  session_opens_at: z.string().datetime().nullable().optional(),
  session_closes_at:z.string().datetime().nullable().optional(),
  reserve_price:    z.number().positive().nullable().optional(),
  buyer_premium_pct:z.number().min(0).max(50).optional(),
  grade_letter:     z.enum(['★', 'AAA', 'AA', 'A', 'B']).optional(),
  grade_label:      z.string().max(500).optional(),
})

export async function PATCH(req: NextRequest) {
  const adminUser = await getAdminUser()
  if (!adminUser) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 })

  const body   = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides.', details: parsed.error.flatten() }, { status: 400 })
  }

  const { id, grade_letter, grade_label, ...rest } = parsed.data
  const supa = createServiceClient()

  /* Construire l'objet de mise à jour */
  const update: Record<string, unknown> = { ...rest }

  /* Mise à jour du grade JSONB si fourni */
  if (grade_letter !== undefined) {
    /* Récupérer le grade actuel pour ne pas écraser le label si non fourni */
    const { data: current } = await supa
      .from('auction_assets')
      .select('grade')
      .eq('id', id)
      .single() as unknown as { data: { grade: { letter?: string; label?: string } | null } | null }

    const currentGrade = current?.grade ?? {}
    update.grade = {
      letter: grade_letter,
      label:  grade_label ?? currentGrade.label ?? '',
    }
  }

  const { error } = await supa
    .from('auction_assets')
    .update(update)
    .eq('id', id)

  if (error) {
    console.error('[update-lot]', error)
    return NextResponse.json({ error: 'Erreur serveur.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
