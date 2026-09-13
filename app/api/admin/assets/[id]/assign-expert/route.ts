/**
 * POST /api/admin/assets/[id]/assign-expert
 *
 * Mandate un expert (partenaire) sur une dimension CIFSO d'un dossier.
 *   - Si l'email n'a pas de compte : invitation Supabase (magic link) + profil
 *     avec rôle 'partner' → il crée son compte, signe le NDA partenaire, passe le KYC.
 *   - Crée / met à jour partner_certifications (status 'assigned', scope
 *     certification | transaction, deadline).
 *   - L'accès aux pièces se fait UNIQUEMENT via la data room : RLS
 *     "partner_assigned_documents" (documents de la dimension assignée +
 *     transversaux, visible_to = assigned_partner).
 *
 * Body : { email, fullName?, dimension, scope, deadlineDays?, note?, token? }
 * ADMIN UNIQUEMENT.
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                         from 'zod'
import { createServiceClient }       from '@/lib/supabase'
import { getAdminUser }              from '@/lib/adminAuth'
import { sendEmail }                 from '@/lib/sendEmail'

const schema = z.object({
  token:        z.string().optional(),
  email:        z.string().email(),
  fullName:     z.string().max(120).optional(),
  dimension:    z.enum(['code', 'ip', 'finance', 'security', 'organisation']),
  scope:        z.enum(['certification', 'transaction']).default('certification'),
  deadlineDays: z.number().int().min(1).max(90).default(15),
  note:         z.string().max(1000).optional(),
})

const DIM_LABEL: Record<string, string> = {
  code: 'C — Code & Architecture', ip: 'I — IP & Droits', finance: 'F — Finance',
  security: 'S — Sécurité', organisation: 'O — Organisation & Talent',
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: assetId } = await params
  let body: z.infer<typeof schema>
  try { body = schema.parse(await req.json()) }
  catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    return NextResponse.json({ error: 'invalid_body' }, { status: 400 })
  }

  const tokenOk = process.env.ADMIN_LEADS_TOKEN && body.token === process.env.ADMIN_LEADS_TOKEN
  const adminUser = await getAdminUser()
  if (!tokenOk && !adminUser) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const supa = createServiceClient()
  const { data: asset } = await supa
    .from('assets').select('id, company_name, dossier_type').eq('id', assetId).maybeSingle()
  if (!asset) return NextResponse.json({ error: 'asset_not_found' }, { status: 404 })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'
  const email   = body.email.toLowerCase()

  /* ── 1. Compte expert : existant ou invitation ── */
  let partnerId: string | null = null
  let invited = false
  const { data: existing } = await supa.from('profiles').select('id, roles').eq('email', email).maybeSingle()

  if (existing) {
    partnerId = existing.id
    const roles: string[] = Array.isArray(existing.roles) ? existing.roles : []
    if (!roles.includes('partner')) {
      await supa.from('profiles').update({ roles: [...roles, 'partner'] }).eq('id', existing.id)
    }
  } else {
    const { data: inv, error: invErr } = await supa.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${siteUrl}/api/auth/callback?next=/client/set-password`,
      data: { full_name: body.fullName ?? '', role: 'partner', locale: 'fr' },
    })
    if (invErr || !inv.user) {
      console.error('[assign-expert] invite', invErr)
      return NextResponse.json({ error: invErr?.message ?? 'invite_failed' }, { status: 400 })
    }
    partnerId = inv.user.id
    invited   = true
    /* Le trigger handle_new_user crée le profil ; on fixe le rôle principal + roles[] */
    await supa.from('profiles')
      .update({ role: 'partner', roles: ['partner'], full_name: body.fullName ?? null })
      .eq('id', partnerId)
  }

  /* ── 2. Mandat : co-signature sur la dimension, périmètre limité ── */
  const deadline = new Date(Date.now() + body.deadlineDays * 86_400_000).toISOString()
  const { data: cert, error: certErr } = await supa
    .from('partner_certifications')
    .upsert({
      partner_id:    partnerId,
      asset_id:      assetId,
      dimension:     body.dimension,
      scope:         body.scope,
      status:        'assigned',
      deadline_at:   deadline,
      internal_note: body.note ?? null,
    }, { onConflict: 'partner_id,asset_id,dimension' })
    .select('id')
    .single()
  if (certErr) return NextResponse.json({ error: certErr.message }, { status: 500 })

  /* ── 3. Ouvrir la data room de la dimension à l'expert (documents non sensibles
         déjà déposés passent en assigned_partner ; l'admin garde la main sur le reste) ── */
  await supa.from('data_room_documents')
    .update({ visible_to: 'assigned_partner' })
    .eq('asset_id', assetId)
    .eq('dimension', body.dimension)
    .eq('visible_to', 'admin_only')
    .eq('is_sensitive', false)

  /* ── 4. Notification + email ── */
  const orgName = asset.company_name ?? `Dossier ${assetId.slice(0, 8)}`
  const scopeLabel = body.scope === 'certification' ? 'Certification CIFSO 5000' : 'Transaction (cession d\'actif)'
  const link = `/client/partner/certifications/${cert.id}`
  await Promise.allSettled([
    supa.from('user_notifications').insert({
      user_id: partnerId, type: 'certification_update',
      title:   `Nouveau mandat : ${DIM_LABEL[body.dimension]}`,
      body:    `${scopeLabel} · ${orgName}. Échéance : ${new Date(deadline).toLocaleDateString('fr-CH')}. Accès aux pièces via la Data Room uniquement.`,
      link,    payload: { asset_id: assetId, dimension: body.dimension, scope: body.scope },
    }),
    sendEmail(
      email,
      `Aegryn. Mandat d'expertise : ${DIM_LABEL[body.dimension]}`,
      `<p>Bonjour${body.fullName ? ` ${body.fullName}` : ''},</p>
<p>Aegryn vous confie un mandat d'expertise indépendante.</p>
<ul>
  <li>Périmètre : <strong>${scopeLabel}</strong></li>
  <li>Organisation : <strong>${orgName}</strong></li>
  <li>Dimension : <strong>${DIM_LABEL[body.dimension]}</strong></li>
  <li>Échéance : ${new Date(deadline).toLocaleDateString('fr-CH')}</li>
</ul>
${invited
  ? '<p>Un email séparé vous invite à créer votre compte. Après création du mot de passe, vous signerez l\'accord de confidentialité partenaire et compléterez votre identification (KYC).</p>'
  : `<p><a href="${siteUrl}${link}">Ouvrir le mandat</a></p>`}
<p>Les pièces du dossier sont accessibles exclusivement dans la Data Room sécurisée, limitée à votre dimension. Aucun document ne vous sera transmis par email.</p>
<p>Aegryn. Organisme de certification indépendant. Suisse.</p>`,
      'assign-expert',
    ),
  ])

  return NextResponse.json({ ok: true, partnerId, invited, certificationId: cert.id, deadline })
}
