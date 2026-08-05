import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import SellerNav from './SellerNav'
import ViewSwitcher    from '@/app/client/ViewSwitcher'
import { NDA_VERSIONS } from '@/lib/ndaVersions'
import KycBanner from '@/components/client/KycBanner'
import { LogOut } from 'lucide-react'

type AssetSummary = { id: string; company_name: string | null }

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles, kyc_status, seller_nda_accepted_at, seller_nda_version')
    .eq('id', user.id)
    .single()

  const roles = Array.isArray(profile?.roles) ? profile.roles as string[] : []
  const canAccessSeller = roles.includes('seller')
  if (!canAccessSeller) redirect('/client/buyer')

  const ndaOk = (profile as Record<string,unknown> | null)?.seller_nda_accepted_at
    && (profile as Record<string,unknown> | null)?.seller_nda_version === NDA_VERSIONS.seller
  if (!ndaOk) redirect('/client/nda/seller')

  const hasBuyer   = roles.includes('buyer')
  const hasPartner = roles.includes('partner')

  const [{ count: unreadCount }, { data: byEmail }, { data: byUid }] = await Promise.all([
    supa.from('user_notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).is('read_at', null),
    supa.from('assets').select('id, company_name').eq('seller_email', user.email!).not('status', 'eq', 'pending_payment').order('submitted_at', { ascending: false }),
    supa.from('assets').select('id, company_name').eq('seller_uid', user.id).not('status', 'eq', 'pending_payment').order('submitted_at', { ascending: false }),
  ])

  const seen = new Set<string>()
  const assets = ([...(byEmail ?? []), ...(byUid ?? [])] as AssetSummary[]).filter(a => {
    if (seen.has(a.id)) return false
    seen.add(a.id)
    return true
  })

  const displayName = profile?.full_name ?? user.email ?? ''
  const t = await getTranslations('clientSpace')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex pt-16 min-h-screen">
        <aside className="w-56 bg-ag-navy flex-shrink-0 flex flex-col fixed top-16 left-0 bottom-0 z-40 overflow-y-auto">
          <div className="px-5 py-4 border-b border-white/10">
            <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex font-bold">{t('spaceNameSeller')}</p>
            <p className="font-sans text-[11px] text-white/60 mt-0.5 truncate">{displayName}</p>
          </div>

          <ViewSwitcher hasBuyer={hasBuyer} hasSeller={true} hasPartner={hasPartner} />
          <SellerNav unreadCount={unreadCount ?? 0} assets={assets} />

          <div className="mt-auto px-4 py-4 border-t border-white/10">
            <form action="/api/client/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-red-400 hover:text-white hover:bg-red-600 border border-red-500/40 hover:border-red-600 transition-colors"
              >
                <LogOut size={12} className="shrink-0" />
                {t('logout')}
              </button>
            </form>
          </div>
        </aside>

        <main className="flex-1 ml-56 min-h-[calc(100vh-4rem)]">
          <KycBanner kycStatus={(profile as { kyc_status?: string } | null)?.kyc_status} role="seller" kycPath="/client/seller/kyc" />
          {children}
        </main>
      </div>
    </div>
  )
}
