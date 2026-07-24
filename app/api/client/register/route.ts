import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'

const schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8),
  fullName: z.string().min(1).max(120),
  role:     z.enum(['buyer', 'seller']).optional().default('buyer'),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch { return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 }) }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    const msg = parsed.error.errors[0]?.message ?? 'Données invalides'
    return NextResponse.json({ error: 'VALIDATION', message: msg }, { status: 400 })
  }

  const { email, password, fullName, role } = parsed.data
  const normalizedEmail = email.toLowerCase().trim()
  const supa = createServiceClient()

  const { data, error } = await supa.auth.admin.createUser({
    email: normalizedEmail,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  })

  if (error) {
    const msg = error.message?.toLowerCase() ?? ''
    if (msg.includes('already') || msg.includes('exists')) {
      return NextResponse.json({ error: 'EMAIL_EXISTS' }, { status: 409 })
    }
    return NextResponse.json({ error: 'SIGNUP_FAILED', message: error.message }, { status: 400 })
  }

  const userId = data.user?.id
  if (!userId) return NextResponse.json({ error: 'SIGNUP_FAILED' }, { status: 500 })

  await supa.from('profiles').update({ full_name: fullName, roles: [role] }).eq('id', userId)

  const resendKey = process.env.RESEND_API_KEY
  if (resendKey) {
    const roleLabel: Record<string, string> = {
      buyer:  'Acquéreur',
      seller: 'Cédant',
    }
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: `AEGRYN <${process.env.RESEND_FROM ?? 'contact@boha-group.com'}>`,
        reply_to: process.env.RESEND_REPLY_TO ?? 'contact@aegryn.com',
        to: [normalizedEmail],
        subject: 'Bienvenue dans l\'espace client AEGRYN',
        html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#050a1a;color:#ffffff;">
<p style="font-family:monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#5ADDA4;margin:0 0 20px 0;">AEGRYN</p>
<p style="font-size:22px;font-weight:700;margin:0 0 8px 0;">Bienvenue, ${fullName}</p>
<p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 8px 0;">Votre compte <strong style="color:#ffffff;">${roleLabel[role] ?? role}</strong> a été créé avec succès.</p>
<p style="font-size:14px;color:#94a3b8;line-height:1.6;margin:0 0 28px 0;">Vous pouvez dès maintenant accéder à votre espace client et compléter votre profil.</p>
<p style="margin:0 0 32px 0;">
  <a href="https://aegryn.com/client/login" style="display:inline-block;padding:12px 28px;background:#5ADDA4;color:#050a1a;text-decoration:none;font-weight:700;font-size:14px;font-family:monospace;letter-spacing:0.08em;">ACCÉDER À MON ESPACE →</a>
</p>
<hr style="border:none;border-top:1px solid #1e293b;margin:0 0 16px 0;" />
<p style="font-size:11px;color:#475569;margin:0;">AEGRYN Sàrl — Suisse · <a href="https://aegryn.com" style="color:#475569;">aegryn.com</a></p>
</div>`,
      }),
    }).catch(() => {})

    const adminEmail = process.env.AEGRYN_ADMIN_EMAIL ?? 'admin@boha-group.com'
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: `AEGRYN <${process.env.RESEND_FROM ?? 'contact@boha-group.com'}>`,
        to: [adminEmail],
        subject: `[AEGRYN] Nouveau compte ${roleLabel[role] ?? role} — ${fullName}`,
        html: `<div style="font-family:monospace;max-width:480px;padding:24px;background:#f8fafc;border:1px solid #e2e8f0;">
<p style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#5ADDA4;margin:0 0 16px 0;">AEGRYN ADMIN</p>
<p style="font-size:16px;font-weight:700;margin:0 0 12px 0;">Nouveau compte créé</p>
<table style="font-size:12px;color:#475569;border-collapse:collapse;width:100%;">
  <tr><td style="padding:4px 0;font-weight:600;width:100px;">Nom</td><td>${fullName}</td></tr>
  <tr><td style="padding:4px 0;font-weight:600;">Email</td><td>${normalizedEmail}</td></tr>
  <tr><td style="padding:4px 0;font-weight:600;">Rôle</td><td>${roleLabel[role] ?? role}</td></tr>
  <tr><td style="padding:4px 0;font-weight:600;">ID</td><td style="font-size:10px;">${userId}</td></tr>
</table>
<p style="margin:16px 0 0 0;"><a href="https://aegryn.com/admin/members" style="font-size:11px;color:#5ADDA4;">Voir dans l'admin →</a></p>
</div>`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, userId })
}
