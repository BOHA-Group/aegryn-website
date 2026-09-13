import { NextRequest, NextResponse } from 'next/server'
import { refreshCifsoIndex } from '@/lib/cifsoIndexRefresh'

/**
 * Cron hebdomadaire : rafraîchissement du moteur de benchmarks CIFSO Valuation Index.
 * Lundi 06:00 Europe/Zurich (vercel.json : "0 4 * * 1" en UTC l'été, 05:00 UTC l'hiver ;
 * la planification Vercel étant en UTC, 04:00 UTC couvre 06:00 CEST ; un second passage
 * à 05:00 UTC garantit 06:00 CET). Protégé par CRON_SECRET.
 */
export const maxDuration = 60

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret && req.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const result = await refreshCifsoIndex()
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
