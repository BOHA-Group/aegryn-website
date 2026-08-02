import { NextRequest, NextResponse } from 'next/server'

/* Endpoint de traçabilité preview-only : reçoit l'état cookie/session vu par
   le NAVIGATEUR et le logge côté serveur (visible dans Vercel Logs), pour le
   corréler avec les logs [MW] du middleware sur la même requête utilisateur. */
export async function POST(req: NextRequest) {
  if (process.env.VERCEL_ENV !== 'preview' && process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ ok: false }, { status: 404 })
  }

  const body = await req.json().catch(() => null) as {
    path?: string
    allCookieNames?: string[]
    sbCookieNames?: string[]
    hasSession?: boolean
    email?: string | null
  } | null

  const cookieHeader = req.headers.get('cookie') ?? ''
  const serverCookieNames = cookieHeader.split(';').map(c => c.trim().split('=')[0]).filter(Boolean)

  console.log(
    `[TRACE] path=${body?.path ?? '?'} ` +
    `browser-cookies=${JSON.stringify(body?.allCookieNames ?? [])} ` +
    `browser-sb=${JSON.stringify(body?.sbCookieNames ?? [])} ` +
    `browser-hasSession=${body?.hasSession} ` +
    `browser-email=${body?.email ?? 'null'} ` +
    `server-received-cookies=${JSON.stringify(serverCookieNames)} ` +
    `sec-fetch-site=${req.headers.get('sec-fetch-site')} ` +
    `sec-fetch-mode=${req.headers.get('sec-fetch-mode')} ` +
    `referer=${req.headers.get('referer')}`
  )

  return NextResponse.json({ ok: true })
}
