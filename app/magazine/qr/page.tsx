import { redirect }         from 'next/navigation'
import { createServiceClient } from '@/lib/supabase'
import { cookies }           from 'next/headers'
import type { Metadata }     from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Aegryn Magazine',
  robots: { index: false, follow: false },
}

const COMING_SOON: Record<string, string> = {
  fr: 'Publication prochainement',
  en: 'Coming soon',
  de: 'Demnächst verfügbar',
  it: 'Prossimamente',
  es: 'Próximamente',
  nl: 'Binnenkort beschikbaar',
}

const SUBTITLE: Record<string, string> = {
  fr: 'Le premier numéro arrive bientôt.',
  en: 'The first issue is coming soon.',
  de: 'Die erste Ausgabe erscheint bald.',
  it: 'Il primo numero arriverà presto.',
  es: 'El primer número llegará pronto.',
  nl: 'Het eerste nummer komt binnenkort.',
}

export default async function MagazineQrPage() {
  const cookieStore  = await cookies()
  const localePref   = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const locale       = ['fr','en','de','it','es','nl'].includes(localePref) ? localePref : 'fr'

  let isPublic = false
  try {
    const supa = createServiceClient()
    const { data } = await supa
      .from('site_settings')
      .select('value')
      .eq('key', 'magazine_issue_01_public')
      .single()
    isPublic = data?.value === true || data?.value === 'true'
  } catch { /* fail safe */ }

  if (isPublic) {
    redirect(`/${locale}/magazine`)
  }

  const heading = COMING_SOON[locale] ?? COMING_SOON.fr
  const sub     = SUBTITLE[locale]    ?? SUBTITLE.fr

  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Aegryn Magazine</title>
      </head>
      <body style={{ margin: 0, background: '#0F1A2B', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: 420 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 32 }}>
            AEGRYN MAGAZINE
          </p>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: '#5ADDA4', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 16 }}>
            {heading}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
            {sub}
          </p>
          <div style={{ marginTop: 48, width: 28, height: 2, background: '#5ADDA4', margin: '48px auto 0' }} />
          <p style={{ fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.2)', marginTop: 24 }}>
            aegryn.com
          </p>
        </div>
      </body>
    </html>
  )
}
