import { cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import '@/styles/globals.css'
import { getAdminUser }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import Nav from '@/components/layout/Nav'
import AdminSideNav from './AdminSideNav'
import { AdminProofMarker } from '@/components/admin/AdminProofMarker'

const SUPPORTED_LOCALES = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type SupportedLocale = typeof SUPPORTED_LOCALES[number]

export const dynamic = 'force-dynamic'

function isSupportedLocale(value: string | undefined): value is SupportedLocale {
  return !!value && (SUPPORTED_LOCALES as readonly string[]).includes(value)
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const preferred   = cookieStore.get('ag-locale-pref')?.value
  const locale: SupportedLocale = isSupportedLocale(preferred) ? preferred : 'fr'
  const messages    = (await import(`@/i18n/messages/${locale}.json`)).default

  /* Récupère l'user connecté (null si accès par token URL ou page login) */
  const adminUser = await getAdminUser()

  let adminEmail = 'Admin'
  if (adminUser) {
    adminEmail = adminUser.email ?? adminUser.id
    try {
      const supa = createServiceClient()
      const { data } = await supa
        .from('profiles').select('full_name').eq('id', adminUser.id).single()
      if (data?.full_name) adminEmail = data.full_name
    } catch { /* silencieux */ }
  }

  /* html/body rendus par le root layout — ne pas les re-rendre ici */
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AdminProofMarker />
      <Nav user={adminUser ? { name: adminEmail, label: 'Admin' } : null} />

      <div className="flex pt-16 min-h-screen">
        {/* Sidebar admin fixe */}
        <aside className="w-56 bg-ag-navy flex-shrink-0 flex flex-col fixed top-16 left-0 bottom-0 z-40 overflow-y-auto">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex font-bold">Admin</p>
            <p className="font-sans text-[10px] text-white/50 mt-0.5">Aegryn</p>
          </div>
          <AdminSideNav adminEmail={adminEmail} />
        </aside>

        {/* Contenu principal */}
        <main className="flex-1 ml-56 min-h-[calc(100vh-4rem)] bg-gray-50 overflow-x-auto">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  )
}
