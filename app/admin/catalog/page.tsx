import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import CatalogAdminClient      from './CatalogAdminClient'

export const metadata: Metadata = {
  title: 'Catalogue — Aegryn Admin',
  robots: { index: false, follow: false },
}


export default async function AdminCatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; action?: string; id?: string }>
}) {
  const params     = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  /* ── Action publish/unpublish/withdraw ── */
  if (params.action && params.id) {
    const newStatus =
      params.action === 'publish'   ? 'published'
      : params.action === 'unpublish' ? 'graded'
      : params.action === 'withdraw'  ? 'withdrawn'
      : null

    if (newStatus) {
      const update: Record<string, unknown> = { status: newStatus }
      if (newStatus === 'published') update.published_at = new Date().toISOString()
      await supa.from('assets').update(update).eq('id', params.id)
    }
    redirect(`/admin/catalog${tokenQs}`)
  }

  /* ── Fetch actifs gradés + publiés + retirés ── */
  const { data, error } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, public_summary, status, graded_at, published_at')
    .in('status', ['graded', 'published', 'withdrawn'])
    .order('graded_at', { ascending: false })
    .limit(200)

  const rows = (data ?? []) as Record<string, unknown>[]

  const counts = {
    graded:    rows.filter(r => r.status === 'graded').length,
    published: rows.filter(r => r.status === 'published').length,
    withdrawn: rows.filter(r => r.status === 'withdrawn').length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Catalogue</h1>
            <p className="text-[12px] text-gray-400 mt-1">Publication des actifs gradés vers le catalogue public</p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/assets${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              ← Assets
            </Link>
            <Link href={`/admin/members${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              Members
            </Link>
            <Link href={`/admin/leads${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              Leads
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Gradés (en attente)',  count: counts.graded,    color: 'border-purple-200 bg-purple-50' },
            { label: 'Publiés au catalogue', count: counts.published, color: 'border-emerald-200 bg-emerald-50' },
            { label: 'Retirés',              count: counts.withdrawn, color: 'border-gray-200 bg-gray-50' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`border p-5 ${color}`}>
              <p className="text-[28px] font-bold text-gray-900">{count}</p>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucun actif gradé pour l&apos;instant.</p>
            <p className="text-[11px] text-gray-300 mt-2">Attribuez un grade via /admin/assets/[id]/grade pour qu&apos;un actif apparaîsse ici.</p>
            <Link href={`/admin/assets${tokenQs}`}
              className="inline-block mt-4 text-[11px] font-semibold text-blue-600 hover:text-blue-800">
              → Aller aux assets
            </Link>
          </div>
        ) : (
          <CatalogAdminClient
            rows={rows as Parameters<typeof CatalogAdminClient>[0]['rows']}
            adminToken={params.token ?? ''}
            tokenQs={tokenQs}
          />
        )}

        {/* Info */}
        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
          <strong>Catalogue public (/auction/catalog)</strong> — affiche uniquement les actifs au statut <em>published</em>, avec résumé anonymisé. Le nom du vendeur et l'email ne sont jamais exposés.
        </div>

      </div>
    </main>
  )
}
