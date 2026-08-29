import { NextResponse } from 'next/server'

const SESSION_TTL_S = 24 * 60 * 60 // 86400 s

/** Pose / renouvelle le cookie httpOnly ag-last-active.
 *  Appelé depuis le client juste après un login réussi.
 *  Le middleware proxy.ts le renouvelle ensuite à chaque navigation. */
export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('ag-last-active', String(Date.now()), {
    maxAge:   SESSION_TTL_S,
    httpOnly: true,
    sameSite: 'lax',
    path:     '/',
  })
  return res
}
