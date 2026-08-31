import { checkAdminAccess }  from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }        from 'next'
import { MembersClient }        from './MembersClient'

export const metadata: Metadata = {
  title: 'Members — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const sp = await searchParams
  await checkAdminAccess(sp.token)

  const supa = createServiceClient()

  /* ── Tous les profils, triés par date de création décroissante ── */
  const { data: profiles } = await supa
    .from('profiles')
    .select('id, email, full_name, roles, created_at, updated_at, admin_note')
    .order('created_at', { ascending: false })
    .limit(500)

  /* ── Demandes NDA ── */
  const { data: ndaData } = await supa
    .from('nda_requests')
    .select('id, buyer_name, buyer_email, buyer_company, buyer_type, capacity, status, created_at, asset_id')
    .order('created_at', { ascending: false })
    .limit(200)

  const ndaRows = (ndaData ?? []) as {
    id: string
    buyer_name: string | null
    buyer_email: string | null
    buyer_company: string | null
    buyer_type: string | null
    capacity: string | null
    status: string | null
    created_at: string | null
    asset_id: string | null
  }[]

  /* ── Map email → profile.id pour les liens NDA → Profil ── */
  const allEmails = [...new Set(ndaRows.map(r => r.buyer_email).filter(Boolean) as string[])]
  const { data: emailProfiles } = allEmails.length
    ? await supa.from('profiles').select('id, email').in('email', allEmails)
    : { data: [] }
  const profileIdByEmail = Object.fromEntries(
    (emailProfiles ?? []).map((p: { id: string; email: string }) => [p.email, p.id])
  )

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN · Utilisateurs</p>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Members</h1>
          <p className="text-[12px] text-gray-400 mt-1">
            Tous les comptes enregistrés en base de données — rôles, données déclarées, suppression manuelle.
          </p>
        </div>

        <MembersClient
          profiles={(profiles ?? []) as {
            id: string
            email: string
            full_name: string | null
            roles: string[] | null
            created_at: string | null
            updated_at: string | null
            admin_note: string | null
          }[]}
          ndaRows={ndaRows}
          profileIdByEmail={profileIdByEmail}
        />

      </div>
    </main>
  )
}
