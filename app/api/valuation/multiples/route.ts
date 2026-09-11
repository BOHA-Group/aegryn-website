import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabaseServer'

// GET /api/valuation/multiples
// Retourne les multiples de marché actifs depuis Supabase
// Données publiques agrégées — pas de données personnelles
export async function GET() {
  try {
    const db = createServiceClient()
    const { data, error } = await db
      .from('cifso_market_multiples')
      .select('cluster_key, cluster_label, ev_revenue_low, ev_revenue_high, ev_ebitda_low, ev_ebitda_high, cifso_coeff_score_40, cifso_coeff_score_60, cifso_coeff_score_80, reference_period')
      .eq('is_active', true)
      .order('cluster_key')

    if (error) throw error

    return NextResponse.json(data ?? [], {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error('[/api/valuation/multiples]', err)
    return NextResponse.json([], { status: 500 })
  }
}
