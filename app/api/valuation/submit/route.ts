import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { captureLead, fmtEur }      from '@/lib/leadCapture'

/* ─── Validation ─────────────────────────────────────────── */
const schema = z.object({
  email: z.string().email(),

  // Métriques financières
  arr:          z.number().min(0).optional(),
  growth_yoy:   z.number().optional(),
  churn_monthly: z.number().optional(),
  nrr:          z.number().optional(),
  gross_margin: z.number().optional(),
  seniority:    z.enum(['under1', 'one_to_three', 'above3']).optional(),
  arr_audited:  z.enum(['yes', 'no', 'not_yet']).optional(),

  // Résultat simulateur
  estimated_grade: z.enum(['★', 'AAA', 'AA', 'A', 'B', 'NG']),
  score_total:     z.number().int().min(0).max(100),
  score_breakdown: z.object({
    finance:  z.number(),
    code:     z.number(),
    ip:       z.number(),
    security: z.number(),
  }),
  valuation_low:    z.number().optional(),
  valuation_high:   z.number().optional(),
  valuation_median: z.number().optional(),
  pre_revenue:      z.boolean().optional(),

  // Metadata
  locale:     z.string().optional(),
  source_url: z.string().optional(),
})

type Payload = z.infer<typeof schema>

/* ─── Email body builders ────────────────────────────────── */
function reportText(d: Payload): string {
  return `
Aegryn VALUATION — RAPPORT INDICATIF
======================================

Grade estimé   : ${d.estimated_grade}
Score total    : ${d.score_total} / 100

Détail par dimension :
  Finance       : ${d.score_breakdown.finance} / 25
  Code          : ${d.score_breakdown.code} / 25
  IP & Droits   : ${d.score_breakdown.ip} / 25
  Sécurité      : ${d.score_breakdown.security} / 25

${d.pre_revenue ? 'Mode pre-revenue — valorisation IP+Code uniquement' : `Fourchette de valorisation indicative :
  Basse  : ${fmtEur(d.valuation_low)}
  Haute  : ${fmtEur(d.valuation_high)}
  Médiane: ${fmtEur(d.valuation_median)}
  Basé sur ARR : ${fmtEur(d.arr)}`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AVERTISSEMENT : Cette estimation est indicative, générée par
algorithme à partir de vos données déclarées sans vérification.
Elle ne constitue pas un Grade Aegryn officiel.

Pour démarrer une certification officielle :
→ https://aegryn.com/grade/submit

Pour réserver un Assessment Day gratuit :
→ https://aegryn.com/transact/assessment-days
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  `.trim()
}

function internalNotifText(d: Payload): string {
  return `
[Aegryn] Nouveau lead Valuation
================================
Email          : ${d.email}
Grade estimé   : ${d.estimated_grade}
Score          : ${d.score_total}/100
ARR déclaré    : ${fmtEur(d.arr)}
Pre-revenue    : ${d.pre_revenue ? 'Oui' : 'Non'}
Fourchette     : ${fmtEur(d.valuation_low)} — ${fmtEur(d.valuation_high)}
Locale         : ${d.locale ?? '—'}

Breakdown : F${d.score_breakdown.finance}/C${d.score_breakdown.code}/I${d.score_breakdown.ip}/S${d.score_breakdown.security}

→ Voir leads : https://aegryn.com/admin/leads
  `.trim()
}

/* ─── Route handler ──────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    await captureLead(
      'valuation_leads',
      {
        email:            data.email,
        arr:              data.arr,
        growth_yoy:       data.growth_yoy,
        churn_monthly:    data.churn_monthly,
        nrr:              data.nrr,
        gross_margin:     data.gross_margin,
        seniority:        data.seniority,
        arr_audited:      data.arr_audited,
        estimated_grade:  data.estimated_grade,
        score_total:      data.score_total,
        score_breakdown:  data.score_breakdown,
        valuation_low:    data.valuation_low,
        valuation_high:   data.valuation_high,
        valuation_median: data.valuation_median,
        pre_revenue:      data.pre_revenue ?? false,
        locale:           data.locale,
        source_url:       data.source_url,
      },
      {
        to:              data.email,
        subjectFounder:  `Votre estimation Aegryn — Grade ${data.estimated_grade} (${data.score_total}/100)`,
        textFounder:     reportText(data),
        subjectInternal: `[Lead Valuation] ${data.estimated_grade} — ${data.email}`,
        textInternal:    internalNotifText(data),
      },
    )

    return NextResponse.json({ ok: true })

  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[valuation/submit] Unexpected error', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
