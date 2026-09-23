import { NextResponse } from 'next/server'
import {
  getAdminUser, hasAdminTokenCookie,
  createAdminProof, ADMIN_PROOF_COOKIE, ADMIN_PROOF_TTL_S,
} from '@/lib/adminAuth'

/**
 * POST /api/admin/proof
 * Pose le cookie signé ag-admin-proof quand l'appelant est un admin vérifié
 * (session Supabase ou cookie token). Appelé une fois par session depuis
 * AdminProofMarker (layout /admin) — la preuve survit à l'expiration du JWT
 * pour les gates de contenu (ex. magazine non publié).
 */
export async function POST() {
  const user    = await getAdminUser()
  const tokenOk = user ? false : await hasAdminTokenCookie()
  if (!user && !tokenOk) {
    return new NextResponse(null, { status: 401 })
  }

  const res = new NextResponse(null, { status: 204 })
  res.cookies.set(ADMIN_PROOF_COOKIE, createAdminProof(user?.id ?? 'token'), {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   ADMIN_PROOF_TTL_S,
  })
  return res
}
