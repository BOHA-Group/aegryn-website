/**
 * POST /api/client/nda/request
 * Un utilisateur connecté demande l'envoi du NDA (accès certification ou partenaire).
 * Aucun envoi automatique du NDA : l'équipe reçoit un e-mail avec un lien de
 * création pré-rempli et envoie le NDA à la main depuis /admin/nda.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { sendEmail } from '@/lib/sendEmail'

export const runtime = 'nodejs'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user?.email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const body = await req.json().catch(() => ({})) as { need?: string }
  const role = body.need === 'partner' ? 'partner' : 'certification'

  const { data } = await createServiceClient().from('profiles').select('full_name').eq('id', user.id).maybeSingle()
  const name = (data?.full_name as string | null) ?? user.email
  const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com').replace(/\/$/, '')
  const link = `${site}/admin/nda?${new URLSearchParams({ new: '1', name, email: user.email, role, project: role === 'partner' ? `Partenaire, ${name}` : `Certification CIFSO, ${name}` }).toString()}`

  const html = `<p>${esc(name)} (${esc(user.email)}) demande son NDA depuis l'espace client (profil : ${role}).</p><p><a href="${link}">Préparer le NDA (brouillon, envoi manuel)</a></p>`
  await sendEmail(process.env.AEGRYN_INTERNAL_EMAIL ?? 'contact@boha-group.com', `[NDA demandé] ${name}`, html, 'nda-request')
  return NextResponse.json({ ok: true })
}
