/**
 * GET /api/auth/callback
 * Handler Supabase Auth OTP / magic link.
 * Supabase redirige ici avec ?code=... après clic sur le lien email.
 * On échange le code contre une session, puis on redirige vers /client/my-assets.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'
import { createServiceClient }       from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code        = searchParams.get('code')
  const next        = searchParams.get('next') ?? '/client/my-assets'
  const expertAppId = searchParams.get('expert_app_id')
  const errorParam  = searchParams.get('error')

  if (errorParam) {
    const url = new URL('/client/login', origin)
    url.searchParams.set('error', errorParam)
    return NextResponse.redirect(url)
  }

  if (!code) {
    return NextResponse.redirect(new URL('/client/login', origin))
  }

  const res = NextResponse.redirect(new URL(next, origin))

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: ()       => req.cookies.getAll(),
        setAll: (toSet)  => toSet.forEach(({ name, value, options }) =>
          res.cookies.set(name, value, options)
        ),
      },
    }
  )

  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    const url = new URL('/client/login', origin)
    url.searchParams.set('error', 'auth_failed')
    return NextResponse.redirect(url)
  }

  /* Pré-création fiche expert depuis candidature si expert_app_id présent */
  if (expertAppId && sessionData?.user?.id) {
    const userId = sessionData.user.id
    const supa   = createServiceClient()

    const { data: app } = await supa
      .from('expert_applications')
      .select('prenom, nom, profession, specialties, city, country, bio, organization, website')
      .eq('id', expertAppId)
      .maybeSingle()

    if (app) {
      /* Assigner rôles partner + expert */
      const { data: profile } = await supa
        .from('profiles')
        .select('roles')
        .eq('id', userId)
        .maybeSingle() as { data: { roles: string[] | null } | null }

      const currentRoles: string[] = Array.isArray(profile?.roles) ? profile!.roles! : []
      const newRoles = [...new Set([...currentRoles, 'partner', 'expert'])]
      await supa.from('profiles').update({ roles: newRoles }).eq('id', userId)

      /* Pré-créer la fiche si elle n'existe pas */
      const { data: existing } = await supa
        .from('expert_profiles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle()

      if (!existing) {
        await supa.from('expert_profiles').insert({
          user_id:       userId,
          first_name:    app.prenom,
          last_name:     app.nom,
          profession:    app.profession ?? '',
          specialties:   app.specialties ?? [],
          city:          app.city        ?? null,
          country_code:  app.country     ?? 'CH',
          bio:           app.bio         ?? null,
          organization:  app.organization ?? null,
          website:       app.website     ?? null,
          is_visible:    false,
          verified_at:   null,
          review_status: 'pending_review',
        })
      }
    }
  }

  return res
}
