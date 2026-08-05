import { redirect } from 'next/navigation'
import Link          from 'next/link'
import { getUser }  from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export default async function ExpertClientLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles')
    .eq('id', user.id)
    .single()

  const isExpert = Array.isArray(profile?.roles) && profile.roles.includes('expert')
  if (!isExpert) redirect('/client/account')

  const displayName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex pt-16 min-h-screen">
        <aside className="w-56 bg-ag-navy flex-shrink-0 flex flex-col fixed top-16 left-0 bottom-0 z-40 overflow-y-auto">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex font-bold">Espace Expert</p>
            <p className="font-sans text-[11px] text-white/60 mt-0.5 truncate">{displayName}</p>
          </div>

          <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto">
            <div className="flex flex-col gap-0.5">
              <Link
                href="/client/expert"
                className="flex items-center px-3 py-2 font-sans text-[12px] text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                Ma fiche expert
              </Link>
              <Link
                href="/client/expert/account"
                className="flex items-center px-3 py-2 font-sans text-[12px] text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors"
              >
                Mon compte
              </Link>
            </div>
          </nav>

          <div className="mt-auto px-5 py-4 border-t border-white/10">
            <form action="/api/client/logout" method="POST">
              <button
                type="submit"
                className="font-mono text-[10px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors"
              >
                Déconnexion
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 ml-56 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  )
}
