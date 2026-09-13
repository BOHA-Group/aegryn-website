/**
 * GET /api/verify/[code] — Vérification publique d'un certificat CIFSO 5000 (JSON).
 * Livrable brochure « vérification en ligne » : utilisable par une banque, un investisseur,
 * un acquéreur ou un auditeur pour confirmer l'authenticité et la validité d'un grade.
 */
import { NextResponse } from 'next/server'
import { getPublicCertificate, normaliseCode } from '@/lib/certificate'

export const revalidate = 300

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const cert = await getPublicCertificate(code)
  if (!cert) {
    return NextResponse.json(
      { code: normaliseCode(code), status: 'not_found', issuer: 'Aegryn. Organisme de certification indépendant. Suisse.' },
      { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } },
    )
  }
  return NextResponse.json(
    { ...cert, issuer: 'Aegryn. Organisme de certification indépendant. Suisse.', verifyUrl: `https://aegryn.com/fr/verify/${cert.code}` },
    { headers: { 'Cache-Control': 'public, max-age=300, s-maxage=300' } },
  )
}
