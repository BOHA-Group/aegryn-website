import { NextRequest, NextResponse } from 'next/server'
import { createAuthClient }         from '@/lib/supabaseServer'

export async function POST(_req: NextRequest) {
  const client = await createAuthClient()
  await client.auth.signOut()
  return NextResponse.redirect(new URL('/client/login', _req.url))
}
