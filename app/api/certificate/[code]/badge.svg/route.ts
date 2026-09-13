/**
 * GET /api/certificate/[code]/badge.svg — Badge officiel « Certifié CIFSO 5000 »
 * Kit de communication : intégrable sur le site du client, dans un rapport annuel
 * ou une présentation investisseurs. Le badge renvoie vers la vérification publique.
 * Variantes : ?theme=light|dark
 */
import { getPublicCertificate } from '@/lib/certificate'

export const revalidate = 300

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

const LOGO = `<g transform="translate(20,18) scale(0.075)">
  <polygon fill="#5adda4" points="297.96 171.32 266.09 100.56 220.57 0 191.6 64.14 254.09 127.04 297.96 171.32"/>
  <polygon fill="CURRENT" points="317.41 214.36 246.64 143.18 184.15 80.28 175.05 100.56 0 487.91 90.63 487.91 220.57 201.12 350.51 487.91 441.14 487.91 317.41 214.36"/>
</g>`

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const theme = new URL(req.url).searchParams.get('theme') === 'dark' ? 'dark' : 'light'
  const cert  = await getPublicCertificate(code)

  const bg     = theme === 'dark' ? '#0F1C3F' : '#FFFFFF'
  const fg     = theme === 'dark' ? '#FFFFFF' : '#0F1C3F'
  const muted  = theme === 'dark' ? 'rgba(255,255,255,0.6)' : '#6B7280'
  const border = theme === 'dark' ? 'rgba(255,255,255,0.15)' : '#E5E7EB'

  const valid  = cert?.status === 'valid'
  const title  = cert ? (valid ? 'CERTIFIÉ CIFSO 5000' : cert.status === 'expired' ? 'CERTIFICAT CIFSO 5000 EXPIRÉ' : 'CERTIFICAT CIFSO 5000 RETIRÉ') : 'CERTIFICAT INTROUVABLE'
  const grade  = cert?.grade ?? '—'
  const org    = cert ? cert.organisation : ''
  const until  = cert?.validUntil ? new Date(cert.validUntil).toLocaleDateString('fr-CH', { month: '2-digit', year: 'numeric' }) : ''
  const gradeColor = valid ? '#5adda4' : '#9CA3AF'

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="96" viewBox="0 0 320 96" role="img" aria-label="${esc(title)} ${esc(grade)}">
  <rect x="0.5" y="0.5" width="319" height="95" rx="10" fill="${bg}" stroke="${border}"/>
  ${LOGO.replace('CURRENT', fg)}
  <text x="64" y="30" font-family="Inter, -apple-system, Segoe UI, sans-serif" font-size="9" font-weight="700" letter-spacing="1.6" fill="${muted}">${esc(title)}</text>
  <text x="64" y="54" font-family="Inter, -apple-system, Segoe UI, sans-serif" font-size="15" font-weight="700" fill="${fg}">${esc(org.length > 26 ? org.slice(0, 25) + '…' : org)}</text>
  <text x="64" y="74" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="9" letter-spacing="1" fill="${muted}">${esc(cert ? `${cert.code}${until ? ` · VALIDE JUSQU'À ${until}` : ''}` : 'AEGRYN.COM/VERIFY')}</text>
  <rect x="252" y="20" width="52" height="56" rx="8" fill="${gradeColor}" opacity="${valid ? 1 : 0.5}"/>
  <text x="278" y="55" text-anchor="middle" font-family="Inter, -apple-system, Segoe UI, sans-serif" font-size="${grade.length > 2 ? 16 : 22}" font-weight="800" fill="#0F1C3F">${esc(grade)}</text>
  <text x="278" y="70" text-anchor="middle" font-family="Inter, -apple-system, Segoe UI, sans-serif" font-size="7" font-weight="700" letter-spacing="1.2" fill="#0F1C3F" opacity="0.7">GRADE</text>
</svg>`

  return new Response(svg, {
    status: cert ? 200 : 404,
    headers: { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=300' },
  })
}
