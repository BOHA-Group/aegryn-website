import { redirect }          from 'next/navigation'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import InternalNav            from './InternalNav'
import { LogOut }             from 'lucide-react'

export default async function InternalLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles')
    .eq('id', user.id)
    .single()

  const roles: string[] = Array.isArray(profile?.roles) ? profile.roles : []

  /* Guard : seul le rôle 'internal' peut accéder à cet espace */
  if (!roles.includes('internal')) {
    if (roles.includes('buyer'))   redirect('/client/buyer')
    if (roles.includes('seller'))  redirect('/client/seller')
    if (roles.includes('partner')) redirect('/client/partner')
    redirect('/client/login')
  }

  /* Récupérer les permissions attribuées à cet utilisateur */
  const { data: permsData } = await supa
    .from('user_admin_permissions')
    .select('permission_id')
    .eq('user_id', user.id)
  const permissions: string[] = (permsData ?? []).map((p: { permission_id: string }) => p.permission_id)

  const displayName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex pt-16 min-h-screen">
        {/* Sidebar */}
        <aside className="w-56 bg-ag-navy flex-shrink-0 flex flex-col fixed top-16 left-0 bottom-0 z-40 overflow-y-auto">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex font-bold">Accès interne</p>
            <p className="font-sans text-[11px] text-white/60 mt-0.5 truncate">{displayName}</p>
          </div>

          <InternalNav permissions={permissions} />

          <div className="mt-auto px-4 py-4 border-t border-white/10">
            <form action="/api/client/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-red-400 hover:text-white hover:bg-red-600 border border-red-500/40 hover:border-red-600 transition-colors"
              >
                <LogOut size={12} className="shrink-0" />
                Déconnexion
              </button>
            </form>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 ml-56 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
