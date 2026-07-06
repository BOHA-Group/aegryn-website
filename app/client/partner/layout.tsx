import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
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
    <div className="flex min-h-screen bg-gray-50">
          <aside className="w-60 bg-ag-navy flex-shrink-0 flex flex-col">
            <div className="px-6 py-5 border-b border-white/10">
              <Link href="/" className="font-mono text-[11px] tracking-[0.22em] uppercase text-ag-apex font-bold">
                AEGRYN
              </Link>
              <p className="font-sans text-[10px] text-white/30 mt-0.5">{t('spaceNamePartner')}</p>
            </div>

            <PartnerNav unreadCount={unreadCount ?? 0} />

            <div className="mt-auto px-5 py-5 border-t border-white/10">
              <p className="font-sans text-[11px] text-white/40 truncate mb-3">{displayName}</p>
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

          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
    </div>
  )
}
