/**
 * POST /api/admin/notifications/broadcast
 *
 * Envoi groupé d'un email + notification in-app à une cible de rôle.
 * Pattern inspiré de subblink-app/api/notifications.js — resolveTargetIds.
 *
 * Body (JSON) :
 *   target_role    : 'all' | 'buyer' | 'seller' | 'partner'
 *   subject        : string  — sujet email
 *   title          : string  — titre (email + notif in-app)
 *   body_text      : string  — corps (sauts de ligne préservés)
 *   cta_label?     : string  — texte du bouton CTA
 *   cta_url?       : string  — URL du CTA
 *   notif_type?    : 'broadcast_info'|'broadcast_alert'|'broadcast_action'
 *   create_in_app? : boolean (default true) — créer aussi la notif in-app
 *
 * Auth : vérifie le token admin via ADMIN_LEADS_TOKEN (même pattern que /admin/page.tsx)
 */

import { NextRequest, NextResponse } from 'next/server'
import { z }                          from 'zod'
import { Resend }                     from 'resend'
import { render }                     from '@react-email/render'
import { createServiceClient }        from '@/lib/supabase'
import BroadcastEmail                 from '@/emails/BroadcastEmail'

const schema = z.object({
  target_role:   z.enum(['all', 'buyer', 'seller', 'partner']),
  subject:       z.string().min(1).max(200),
  title:         z.string().min(1).max(200),
  body_text:     z.string().min(1).max(5000),
  cta_label:     z.string().max(100).nullable().optional(),
  cta_url:       z.string().url().nullable().optional(),
  notif_type:    z.enum(['broadcast_info', 'broadcast_alert', 'broadcast_action']).optional().default('broadcast_info'),
  create_in_app: z.boolean().optional().default(true),
})

const BATCH_EMAIL = 50   // emails par batch Resend
const BATCH_NOTIF = 100  // inserts notif in-app par batch

const ROLE_LABELS: Record<string, string> = {
  buyer:   'Espace Acquéreur',
  seller:  'Espace Cédant',
  partner: 'Espace Partenaire',
  all:     'Espace Client',
}

// ── Résolution des destinataires (inspiré resolveTargetIds de Subblink) ──────
async function resolveRecipients(
  supa: ReturnType<typeof createServiceClient>,
  targetRole: string
): Promise<{ id: string; email: string; full_name: string | null }[]> {
  let query = supa
    .from('profiles')
    .select('id, email, full_name')
    .eq('email_notifications_enabled', true)

  if (targetRole !== 'all') {
    query = query.contains('roles', [targetRole])
  }

  const { data, error } = await query.limit(2000)
  if (error) throw error
  return (data ?? []).filter(r => r.email) as { id: string; email: string; full_name: string | null }[]
}

export async function POST(req: NextRequest) {
  // Auth : token admin via header X-Admin-Token ou query param
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  const reqToken   = req.headers.get('x-admin-token') ?? new URL(req.url).searchParams.get('token')
  if (adminToken && reqToken !== adminToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body   = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.flatten() }, { status: 400 })
  }

  const {
    target_role, subject, title, body_text,
    cta_label, cta_url, notif_type, create_in_app,
  } = parsed.data

  const supa    = createServiceClient()
  const resend  = new Resend(process.env.RESEND_API_KEY)
  const FROM    = process.env.RESEND_FROM_EMAIL ?? 'AEGRYN <noreply@boha-group.com>'
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'

  // 1. Créer le broadcast en DB (status = sending)
  const { data: broadcast, error: bcErr } = await supa
    .from('email_broadcasts')
    .insert({
      admin_id:       null,
      target_role,
      subject,
      title,
      body_text,
      cta_label:      cta_label ?? null,
      cta_url:        cta_url ?? null,
      notif_type:     notif_type ?? 'broadcast_info',
      create_in_app:  create_in_app ?? true,
      status:         'sending',
    })
    .select('id')
    .single()

  if (bcErr || !broadcast) {
    console.error('[broadcast] insert error:', bcErr)
    return NextResponse.json({ error: 'Failed to create broadcast record' }, { status: 500 })
  }

  const broadcastId = broadcast.id

  // 2. Résoudre les destinataires
  let recipients: { id: string; email: string; full_name: string | null }[]
  try {
    recipients = await resolveRecipients(supa, target_role)
  } catch (err) {
    console.error('[broadcast] resolveRecipients error:', err)
    await supa.from('email_broadcasts').update({ status: 'failed' }).eq('id', broadcastId)
    return NextResponse.json({ error: 'Failed to resolve recipients' }, { status: 500 })
  }

  if (recipients.length === 0) {
    await supa.from('email_broadcasts').update({
      status: 'sent', recipient_count: 0, sent_count: 0, sent_at: new Date().toISOString(),
    }).eq('id', broadcastId)
    return NextResponse.json({ sent: 0, failed: 0, broadcast_id: broadcastId })
  }

  // 3. Envoi emails en batch
  let sentCount   = 0
  let failedCount = 0

  for (let i = 0; i < recipients.length; i += BATCH_EMAIL) {
    const batch = recipients.slice(i, i + BATCH_EMAIL)
    await Promise.allSettled(
      batch.map(async (r) => {
        const unsubUrl = `${baseUrl}/client/account?unsubscribe=1&uid=${r.id}`
        try {
          const html = await render(
            BroadcastEmail({
              title,
              bodyText:      body_text,
              ctaLabel:      cta_label ?? null,
              ctaUrl:        cta_url ?? null,
              recipientRole: target_role as 'buyer' | 'seller' | 'partner' | 'all',
              unsubscribeUrl: unsubUrl,
            })
          )
          await resend.emails.send({
            from:    FROM,
            to:      r.email,
            subject,
            html,
          })
          sentCount++
        } catch (err) {
          console.error(`[broadcast] email failed for ${r.email}:`, err)
          failedCount++
        }
      })
    )
  }

  // 4. Créer les notifications in-app si demandé
  if (create_in_app && recipients.length > 0) {
    const notifRows = recipients.map(r => ({
      user_id:  r.id,
      type:     notif_type ?? 'broadcast_info',
      title,
      body:     body_text.slice(0, 300),
      link:     cta_url ?? null,
      payload:  {
        broadcast_id: broadcastId,
        cta_label:    cta_label ?? null,
        role_label:   ROLE_LABELS[target_role] ?? 'Client',
      } as Record<string, unknown>,
    }))

    for (let i = 0; i < notifRows.length; i += BATCH_NOTIF) {
      const { error: notifErr } = await supa
        .from('user_notifications')
        .insert(notifRows.slice(i, i + BATCH_NOTIF))
      if (notifErr) console.error('[broadcast] notif insert error:', notifErr)
    }
  }

  // 5. Mettre à jour le broadcast
  const finalStatus = failedCount === 0
    ? 'sent'
    : sentCount === 0 ? 'failed' : 'partial'

  await supa.from('email_broadcasts').update({
    status:          finalStatus,
    recipient_count: recipients.length,
    sent_count:      sentCount,
    failed_count:    failedCount,
    sent_at:         new Date().toISOString(),
  }).eq('id', broadcastId)

  return NextResponse.json({
    broadcast_id: broadcastId,
    sent:         sentCount,
    failed:       failedCount,
    total:        recipients.length,
    status:       finalStatus,
  })
}
