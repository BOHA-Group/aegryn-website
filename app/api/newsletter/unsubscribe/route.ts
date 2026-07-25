import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'

function htmlPage(title: string, message: string): NextResponse {
  return new NextResponse(
    `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"/><title>${title} — AEGRYN</title>
<meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#0F1C3F;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="min-height:100vh;">
    <tr><td align="center" valign="middle" style="padding:24px;">
      <div style="max-width:420px;text-align:center;">
        <p style="font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:#5ADDA4;margin:0 0 16px;">AEGRYN</p>
        <h1 style="font-size:20px;font-weight:700;color:#ffffff;margin:0 0 12px;">${title}</h1>
        <p style="font-size:14px;color:rgba(255,255,255,0.6);line-height:1.6;margin:0 0 24px;">${message}</p>
        <a href="https://aegryn.com" style="display:inline-block;padding:11px 28px;background:#5ADDA4;color:#0F1C3F;text-decoration:none;font-weight:700;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;">Retour au site →</a>
      </div>
    </td></tr>
  </table>
</body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  )
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return htmlPage('Lien invalide', "Ce lien de désabonnement n'est pas valide.")
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token)
    .select('id')
    .maybeSingle()

  if (error || !data) {
    return htmlPage('Lien invalide', "Ce lien de désabonnement n'est pas ou plus valide.")
  }

  return htmlPage('Désabonnement confirmé', 'Vous ne recevrez plus la newsletter AEGRYN. Vous pouvez vous réabonner à tout moment depuis le blog.')
}
