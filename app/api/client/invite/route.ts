/**
 * POST /api/client/invite
 * Admin invite un vendeur : crée le user Supabase Auth + son profil
 * Corps JSON : { email, fullName?, company?, role?, token }
 */
import { NextRequest, NextResponse } from 'next/server'
import { z }                        from 'zod'
import { createServiceClient }      from '@/lib/supabase'

const schema = z.object({
  email:      z.string().email(),
  fullName:   z.string().max(100).optional(),
  company:    z.string().max(150).optional(),
  role:       z.enum(['seller', 'buyer', 'partner', 'expert']).default('buyer'),
  assetId:         z.string().uuid().optional(), // lier l'invitation à un actif existant
  waitlistId:      z.string().uuid().optional(), // marquer catalog_waitlist.status = 'converted'
  prospectId:      z.string().uuid().optional(), // marquer prospects.status = 'invited'
  accessRequestId: z.string().uuid().optional(), // marquer auction_access_requests.status = 'approved'
  token:           z.string(),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    const adminToken = process.env.ADMIN_LEADS_TOKEN
    if (adminToken && body.token !== adminToken) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }

    const supa = createServiceClient()

    /* ── 1. Invite le user via Supabase Admin API (magic link auto-envoyé) ── */
    const { data: userData, error: inviteError } = await supa.auth.admin.inviteUserByEmail(
      body.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'}/api/auth/callback?next=/client/set-password`,
        data: {
          full_name: body.fullName ?? '',
          company:   body.company  ?? '',
          role:      body.role,
        },
      }
    )

    if (inviteError) {
      /* Si l'utilisateur existe déjà : envoyer un magic link de reconnexion */
      if (inviteError.message.includes('already been registered')) {
        if (body.waitlistId) {
          await supa.from('catalog_waitlist').update({ status: 'converted' }).eq('id', body.waitlistId)
        }
        /* Générer un magic link OTP vers l'espace client selon le rôle */
        const redirectPath = body.role === 'seller'
          ? '/client/seller'
          : (body.role === 'partner' || body.role === 'expert')
            ? '/client/partner'
            : '/client/buyer/catalogue'
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'
        const { error: otpError } = await supa.auth.admin.generateLink({
          type:        'magiclink',
          email:       body.email,
          options:     { redirectTo: `${siteUrl}/api/auth/callback?next=${redirectPath}` },
        })
        if (otpError) console.error('[invite] magic link for existing user:', otpError)
        return NextResponse.json({ ok: true, note: 'user_already_exists_link_sent' })
      }
      return NextResponse.json({ error: inviteError.message }, { status: 400 })
    }

    /* ── 2. Créer le profil user ── */
    if (userData.user) {
      const { error: profileError } = await supa.from('user_profiles').upsert({
        id:          userData.user.id,
        role:        body.role,
        full_name:   body.fullName  ?? null,
        company:     body.company   ?? null,
        invited_by:  'admin',
      })
      if (profileError) console.error('[invite] profile insert:', profileError)

      /* ── 3. Lier l'actif au seller_uid si fourni ── */
      if (body.assetId) {
        const { error: linkError } = await supa
          .from('assets')
          .update({ seller_uid: userData.user.id })
          .eq('id', body.assetId)
        if (linkError) console.error('[invite] asset link:', linkError)
      }
    }

    /* ── 4. Marquer le prospect catalog_waitlist comme converti ── */
    if (body.waitlistId) {
      const { error: waitlistError } = await supa
        .from('catalog_waitlist')
        .update({ status: 'converted' })
        .eq('id', body.waitlistId)
      if (waitlistError) console.error('[invite] waitlist status update:', waitlistError)
    }

    /* ── 5. Marquer le prospect (waitlist session) comme invité ── */
    if (body.prospectId) {
      const { error: prospectError } = await supa
        .from('prospects')
        .update({ status: 'invited' })
        .eq('id', body.prospectId)
      if (prospectError) console.error('[invite] prospect status update:', prospectError)
    }

    /* ── 6. Approuver la demande d'accès catalogue ── */
    if (body.accessRequestId) {
      const { error: accessError } = await supa
        .from('auction_access_requests')
        .update({ status: 'approved', reviewed_at: new Date().toISOString() })
        .eq('id', body.accessRequestId)
      if (accessError) console.error('[invite] access request approval:', accessError)
    }

    return NextResponse.json({ ok: true, userId: userData.user?.id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: 'validation', issues: err.issues }, { status: 400 })
    }
    console.error('[invite]', err)
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  }
}
