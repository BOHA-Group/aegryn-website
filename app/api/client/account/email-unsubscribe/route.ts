/**
 * POST /api/client/account/email-unsubscribe
 * Désactive les notifications email pour l'utilisateur connecté.
 * Aussi accessible via GET avec ?uid= pour les liens de désinscription one-click.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }       from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const uid = new URL(req.url).searchParams.get('uid')
  if (!uid) return NextResponse.json({ error: 'uid requis' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('profiles')
    .update({ email_notifications_enabled: false })
    .eq('id', uid)

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })

  return NextResponse.redirect(new URL('/client/account?unsubscribed=1', req.url))
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const uid  = body?.uid as string | undefined

  if (!uid) return NextResponse.json({ error: 'uid requis' }, { status: 400 })

  const supa = createServiceClient()
  const { error } = await supa
    .from('profiles')
    .update({ email_notifications_enabled: false })
    .eq('id', uid)

  if (error) return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
