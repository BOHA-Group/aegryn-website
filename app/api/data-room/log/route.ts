/**
 * POST /api/data-room/log
 *
 * Insère un événement dans data_room_access_log depuis le client
 * (view_start, view_end, suspicious_activity).
 *
 * Body: { documentId, action, detail?, sessionDurationSeconds? }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }        from '@/lib/supabase'
import { getUser }                    from '@/lib/supabaseServer'

const ALLOWED_ACTIONS = ['view_start', 'view_end', 'suspicious_activity', 'session_end'] as const

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  let documentId: string, action: string, detail: string | null, sessionDurationSeconds: number | null
  try {
    const body = await req.json() as {
      documentId?: string
      action?: string
      detail?: string | null
      sessionDurationSeconds?: number | null
    }
    if (!body.documentId || !body.action) throw new Error()
    if (!ALLOWED_ACTIONS.includes(body.action as typeof ALLOWED_ACTIONS[number])) throw new Error()
    documentId            = body.documentId
    action                = body.action
    detail                = body.detail ?? null
    sessionDurationSeconds = body.sessionDurationSeconds ?? null
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 })
  }

  const ip        = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null
  const userAgent = req.headers.get('user-agent') ?? null

  const supa = createServiceClient()
  await supa.from('data_room_access_log').insert({
    document_id:               documentId,
    user_id:                   user.id,
    action,
    detail,
    ip_address:                ip,
    user_agent:                userAgent,
    session_duration_seconds:  sessionDurationSeconds,
  })

  return NextResponse.json({ ok: true })
}
