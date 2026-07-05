import { NextRequest, NextResponse } from 'next/server'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.redirect(new URL('/client/login', req.url))

  const supa = createServiceClient()
  await supa.from('profiles').update({ email_notifications_enabled: true }).eq('id', user.id)

  return NextResponse.redirect(new URL('/client/account?resubscribed=1', req.url))
}
