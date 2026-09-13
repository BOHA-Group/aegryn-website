/**
 * POST /api/admin/assets/[id]/prescore
 * Recalcule le pré-scoring documentaire automatique (lib/prescore) et le persiste.
 * ADMIN UNIQUEMENT.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser }              from '@/lib/adminAuth'
import { refreshPrescore }           from '@/lib/prescoreServer'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json().catch(() => ({})) as { token?: string }
  const tokenOk = process.env.ADMIN_LEADS_TOKEN && body.token === process.env.ADMIN_LEADS_TOKEN
  if (!tokenOk && !(await getAdminUser())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  try {
    return NextResponse.json({ ok: true, prescore: await refreshPrescore(id) })
  } catch (err) {
    console.error('[prescore]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
