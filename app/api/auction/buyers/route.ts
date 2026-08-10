import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

async function sendEmail(to: string, subject: string, text: string) {
  const key  = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM ?? 'no-reply@boha-group.com'
  if (!key) return
  await fetch('https://api.resend.com/emails', {
    method:  'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from:     `${process.env.RESEND_FROM_NAME ?? 'Aegryn'} <${from}>`,
      reply_to: process.env.RESEND_REPLY_TO ?? 'contact@boha-group.com',
      to:       [to],
      subject,
      text,
    }),
  })
}

const schema = z.object({
  full_name:       z.string().min(2).max(100),
  email:           z.string().email(),
  organization:    z.string().max(150).optional(),
  country:         z.string().max(4).default('CH'),
  buyer_type:      z.enum(['founder', 'fund', 'family_office', 'corporate', 'other']),
  ticket_min_eur:  z.number().int().min(0).optional(),
  ticket_max_eur:  z.number().int().min(0).optional(),
  sectors:         z.array(z.string().max(60)).max(10).default([]),
  geographies:     z.array(z.string().max(60)).max(10).default([]),
  operation_types: z.array(z.string().max(60)).max(5).default([]),
  funds_proof:     z.enum(['bank_statement', 'fund_commitment', 'self_declared', 'other']),
  funds_amount:    z.string().max(100).optional(),
  message:         z.string().max(1000).optional(),
  locale:          z.string().max(10).default('fr'),
  source_url:      z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  const body   = await req.json().catch(() => null)
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'validation', issues: parsed.error.issues }, { status: 400 })
  }

  const data = parsed.data
  const supa = createServiceClient()

  const { error } = await supa.from('buyer_profiles').insert({
    full_name:       data.full_name,
    email:           data.email,
    organization:    data.organization ?? null,
    country:         data.country,
    buyer_type:      data.buyer_type,
    ticket_min_eur:  data.ticket_min_eur ?? null,
    ticket_max_eur:  data.ticket_max_eur ?? null,
    sectors:         data.sectors,
    geographies:     data.geographies,
    operation_types: data.operation_types,
    funds_proof:     data.funds_proof,
    funds_amount:    data.funds_amount ?? null,
    message:         data.message ?? null,
    locale:          data.locale,
    source_url:      data.source_url ?? null,
  })

  if (error) {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }

  /* Notif admin cloche */
  const { data: admins } = await supa
    .from('profiles')
    .select('id')
    .contains('roles', ['admin'])

  if (admins && admins.length > 0) {
    await supa.from('user_notifications').insert(
      admins.map(a => ({
        user_id: a.id,
        type:    'broadcast_action',
        title:   `Nouvel acheteur qualifié — ${data.full_name}`,
        body:    `${data.organization ? data.organization + ' · ' : ''}${data.buyer_type} · ${data.country}. Ticket : ${data.ticket_min_eur ? `€${data.ticket_min_eur.toLocaleString()}` : '?'} – ${data.ticket_max_eur ? `€${data.ticket_max_eur.toLocaleString()}` : '?'}. À valider dans l'espace Admin.`,
        link:    '/admin/buyers',
      }))
    )
  }

  /* Email confirmation acheteur */
  await sendEmail(
    data.email,
    'Aegryn — Demande d\'accès reçue',
    `Bonjour ${data.full_name},\n\nVotre demande d'accès au deal flow Aegryn a bien été reçue.\n\nNotre équipe examinera votre profil sous 48h ouvrées et vous contactera pour finaliser votre pré-qualification.\n\nPour toute question : contact@boha-group.com\n\nL'équipe Aegryn\nhttps://aegryn.com`,
  )

  /* Email interne */
  const internalEmail = process.env.RESEND_INTERNAL_TO ?? 'contact@boha-group.com'
  await sendEmail(
    internalEmail,
    `[Aegryn] Nouvel acheteur — ${data.full_name} (${data.buyer_type})`,
    `Nouvelle demande d'accès acheteur\n\nNom : ${data.full_name}\nEmail : ${data.email}\nOrganisation : ${data.organization ?? '—'}\nPays : ${data.country}\nType : ${data.buyer_type}\nTicket : ${data.ticket_min_eur ? `€${data.ticket_min_eur.toLocaleString()}` : '?'} – ${data.ticket_max_eur ? `€${data.ticket_max_eur.toLocaleString()}` : '?'}\nSecteurs : ${data.sectors.join(', ') || '—'}\nGéographies : ${data.geographies.join(', ') || '—'}\nOpérations : ${data.operation_types.join(', ') || '—'}\nPreuve fonds : ${data.funds_proof}\nMontant : ${data.funds_amount ?? '—'}\n\nMessage :\n${data.message ?? '—'}`,
  )

  return NextResponse.json({ ok: true })
}
