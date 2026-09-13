import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/adminAuth'
import { refreshCifsoIndex } from '@/lib/cifsoIndexRefresh'

/** POST : rafraîchissement à la demande du CIFSO Valuation Index (admin). Le cron hebdomadaire reste la voie normale. */
export const maxDuration = 60

export async function POST(req: NextRequest) {
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const token = new URL(req.url).searchParams.get('token')
  const adminUser = await getAdminUser()
  if (!(adminToken && token === adminToken) && !adminUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const result = await refreshCifsoIndex('manual')
  return NextResponse.json(result, { status: result.ok ? 200 : 500 })
}
