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
        html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
  <div style="padding:28px 32px 20px;border-bottom:1px solid #e5e7eb;">
    <p style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#5ADDA4;margin:0;font-weight:700;">AEGRYN</p>
  </div>
  <div style="padding:32px;">
    <p style="font-size:22px;font-weight:700;color:#0a0f1e;margin:0 0 12px 0;line-height:1.2;">Bienvenue, ${fullName}</p>
    <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 8px 0;">Votre compte <strong style="color:#0a0f1e;">${roleLabel[role] ?? role}</strong> a été créé avec succès.</p>
    <p style="font-size:14px;color:#6b7280;line-height:1.7;margin:0 0 28px 0;">Vous pouvez dès maintenant accéder à votre espace client et compléter votre profil.</p>
    <p style="margin:0 0 32px 0;">
      <a href="https://aegryn.com/client/login" style="display:inline-block;padding:12px 28px;background:#0a0f1e;color:#ffffff;text-decoration:none;font-weight:600;font-size:13px;letter-spacing:0.08em;text-transform:uppercase;">ACCÉDER À MON ESPACE →</a>
    </p>
  </div>
  <div style="padding:16px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;">
    <p style="font-size:11px;color:#9ca3af;margin:0;">AEGRYN Sàrl — Suisse · <a href="https://aegryn.com" style="color:#9ca3af;">aegryn.com</a></p>
  </div>
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
        html: `<div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
  <div style="padding:20px 24px 16px;border-bottom:1px solid #e5e7eb;">
    <p style="font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#5ADDA4;margin:0;font-weight:700;">AEGRYN ADMIN</p>
  </div>
  <div style="padding:24px;">
    <p style="font-size:17px;font-weight:700;color:#0a0f1e;margin:0 0 20px 0;">Nouveau compte créé</p>
    <table style="font-size:13px;color:#374151;border-collapse:collapse;width:100%;">
      <tr><td style="padding:6px 0;font-weight:600;color:#6b7280;width:80px;vertical-align:top;">Nom</td><td style="padding:6px 0;color:#0a0f1e;">${fullName}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;color:#6b7280;vertical-align:top;">Email</td><td style="padding:6px 0;color:#0a0f1e;">${normalizedEmail}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;color:#6b7280;vertical-align:top;">Rôle</td><td style="padding:6px 0;color:#0a0f1e;">${roleLabel[role] ?? role}</td></tr>
      <tr><td style="padding:6px 0;font-weight:600;color:#6b7280;vertical-align:top;">ID</td><td style="padding:6px 0;color:#9ca3af;font-size:11px;">${userId}</td></tr>
    </table>
    <p style="margin:20px 0 0 0;">
      <a href="https://aegryn.com/admin/members" style="font-size:12px;color:#0a0f1e;text-decoration:underline;">Voir dans l'admin →</a>
    </p>
  </div>
</div>`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true, userId })
}
