import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import MagazinePublishToggle   from './MagazinePublishToggle'

export const metadata: Metadata = {
  title: 'Magazine — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminMagazinePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()
  const { data } = await supa
    .from('site_settings')
    .select('key, value')
    .in('key', ['magazine_issue_01_public'])

  function getBool(key: string) {
    const row = (data ?? []).find(r => r.key === key)
    if (!row) return false
    return row.value === true || row.value === 'true'
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-6 md:px-10 md:py-10">
      <div className="max-w-3xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Publication Magazine</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              Contrôle de l&apos;accès public aux numéros du magazine — QR code, flipbook, web edition.
            </p>
          </div>
          <Link
            href="/admin/assets"
            className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors"
          >
            ← Soumissions
          </Link>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-4">Numéros</p>

          <MagazinePublishToggle
            issueKey="magazine_issue_01_public"
            issueLabel="Issue 01 — Built to Last. (Janvier 2027)"
            initialValue={getBool('magazine_issue_01_public')}
          />

          <p className="text-[11px] text-gray-400 mt-4 leading-relaxed">
            Quand un numéro est activé : le QR code sur la couverture ouvre directement le magazine,
            les boutons &quot;Explorer en ligne&quot; et &quot;Feuilleter le PDF&quot; deviennent actifs,
            les abonnés reçoivent une notification.
          </p>
        </div>

      </div>
    </main>
  )
}
