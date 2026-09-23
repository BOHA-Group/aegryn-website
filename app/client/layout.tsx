import { cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import Nav, { type NavUser } from '@/components/layout/Nav'
import '@/styles/globals.css'

const SUPPORTED_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const cookieStore   = await cookies()
  const preferred      = cookieStore.get('ag-locale-pref')?.value
  const locale: SupportedLocale = isSupportedLocale(preferred) ? preferred : 'fr'
  const messages       = (await import(`@/i18n/messages/${locale}.json`)).default

  /* Identité connectée pour la navbar (null sur les pages auth) */
  let navUser: NavUser | null = null
  try {
    const user = await getUser()
    if (user) {
      const supa = createServiceClient()
      const { data: profile } = await supa
        .from('profiles').select('full_name, roles').eq('id', user.id).single()
      const roles: string[] = Array.isArray(profile?.roles) ? profile.roles : []
      const t = await getTranslations({ locale, namespace: 'clientSpace' })
      let label: string
      if (roles.includes('admin') || roles.includes('super_admin'))    label = 'Admin'
      else if (roles.includes('client'))                                label = 'Mon espace'
      else if (roles.includes('partner'))                               label = t('spaceNamePartner')
      else if (roles.includes('seller') && !roles.includes('buyer'))   label = t('spaceNameSeller')
      else                                                               label = t('spaceNameBuyer')
      navUser = { name: profile?.full_name ?? user.email ?? '', label }
    }
  } catch { /* pages auth : pas de session, navbar publique */ }

  /* html/body rendus par le root layout — ne pas les re-rendre ici */
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Nav user={navUser} />
      {children}
    </NextIntlClientProvider>
  )
}
