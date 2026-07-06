import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import ClientTopBar from '@/components/layout/ClientTopBar'
import PartnerNav from './PartnerNav'

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles')
    .eq('id', user.id)
    .single()

  const isPartner = Array.isArray(profile?.roles) && profile.roles.includes('partner')
  if (!isPartner) redirect('/client/my-assets')

  const { count: unreadCount } = await supa
    .from('user_notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .is('read_at', null)

  const displayName = profile?.full_name ?? user.email ?? ''
  const t = await getTranslations('clientSpace')

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientTopBar userName={displayName} userLabel="Partenaire" />

      <div className="flex pt-14 min-h-screen">
        <aside className="w-56 bg-ag-navy flex-shrink-0 flex flex-col fixed top-14 left-0 bottom-0 z-40 overflow-y-auto">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex font-bold">Espace Partenaire</p>
            <p className="font-sans text-[11px] text-white/60 mt-0.5 truncate">{displayName}</p>
          </div>

          <PartnerNav unreadCount={unreadCount ?? 0} />

          <div className="mt-auto px-5 py-4 border-t border-white/10">
            <form action="/api/client/logout" method="POST">
              <button
                type="submit"
                className="font-mono text-[10px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors"
              >
                {t('logout')}
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 ml-56 overflow-y-auto min-h-[calc(100vh-3.5rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
