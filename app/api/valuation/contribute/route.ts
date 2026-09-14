import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

/**
 * POST /api/valuation/contribute
 *
 * Capture ANONYME des données saisies dans le test gratuit /valuation/index (étape 1) :
 * industrie, vertical, scores CIFSO, métriques financières. AUCUN nom d'entreprise, AUCUN
 * email — jamais lié à valuation_leads (qui reste réservé au suivi commercial optionnel côté
 * client). Alimente cifso_index_contributed_data, agrégée par le refresh hebdomadaire
 * (lib/cifsoIndexRefresh.ts) une fois un échantillon minimal atteint par industrie/vertical.
 */
const schema = z.object({
  industry: z.enum(['tech_innovation', 'finance_capital', 'sante_sciences', 'industrie_infra', 'commerce_services']),
  vertical: z.string().optional(),

  score_capital:   z.number().int().min(0).max(20),
  score_integrity: z.number().int().min(0).max(20),
  score_finance:   z.number().int().min(0).max(20),
  score_security:  z.number().int().min(0).max(20),
  score_org:       z.number().int().min(0).max(20),
  score_total:     z.number().int().min(0).max(100),
  grade:           z.enum(['★', 'AAA', 'AA', 'A', 'B', 'NG']),

  arr:           z.number().min(0).optional(),
  growth_yoy:    z.number().optional(),
  churn_monthly: z.number().optional(),
  nrr:           z.number().optional(),
  gross_margin:  z.number().optional(),
  ebitda_margin: z.number().optional(),

  locale:     z.string().optional(),
  source_url: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const data = schema.parse(await req.json())
    const db = createServiceClient()
    const { error } = await db.from('cifso_index_contributed_data').insert(data)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[/api/valuation/contribute]', err)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
