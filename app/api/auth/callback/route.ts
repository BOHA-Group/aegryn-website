/**
 * GET /api/auth/callback
 * Handler Supabase Auth OTP / magic link.
 * Supabase redirige ici avec ?code=... après clic sur le lien email.
 * On échange le code contre une session, puis on redirige vers /client/my-assets.
 */
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient }        from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code     = searchParams.get('code')
  const next     = searchParams.get('next') ?? '/client/my-assets'
  const errorParam = searchParams.get('error')

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

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession:', error.message)
    const url = new URL('/client/login', origin)
    url.searchParams.set('error', 'auth_failed')
    return NextResponse.redirect(url)
  }

  return res
}
