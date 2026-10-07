/**
 * /api/admin/talent
 * Mutations admin sur le vivier talent.
 *
 * PATCH  { kind: 'candidate' | 'hiring', id, status }
 *        Statuts : new | in_progress | closed
 *
 * DELETE { kind: 'candidate', id }
 *        Supprime le CV du bucket privé 'talent-cvs' puis la ligne.
 *        (suppression manuelle admin, RGPD)
 */
import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser, hasAdminTokenCookie } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'

const STATUSES = new Set(['new', 'in_progress', 'closed'])
const TABLES = { candidate: 'talent_candidates', hiring: 'talent_hiring_requests' } as const
type Kind = keyof typeof TABLES

async function adminOk(): Promise<boolean> {
  return Boolean((await getAdminUser()) || (await hasAdminTokenCookie()))
}

export async function PATCH(req: NextRequest) {
  if (!(await adminOk())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { kind, id, status } = await req.json() as { kind?: Kind; id?: string; status?: string }
  if (!kind || !(kind in TABLES) || !id || !status || !STATUSES.has(status)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const supa = createServiceClient()
  const { error } = await supa
    .from(TABLES[kind])
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!(await adminOk())) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const { kind, id } = await req.json() as { kind?: Kind; id?: string }
  if (kind !== 'candidate' || !id) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  const supa = createServiceClient()

  const { data: row } = await supa
    .from('talent_candidates')
    .select('cv_url')
    .eq('id', id)
    .single()

  if (row?.cv_url) {
    await supa.storage.from('talent-cvs').remove([row.cv_url])
  }

  const { error } = await supa.from('talent_candidates').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
