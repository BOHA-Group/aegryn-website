import { checkAdminAccess }    from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }        from 'next'
import Link                     from 'next/link'

export const metadata: Metadata = {
  title: 'Wishlist Magazine — Aegryn Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

/* Labels courts pour afficher les clés de thèmes */
const THEME_LABELS: Record<string, string> = {
  market:      'The Market',
  techAi:      'Tech & IA',
  build:       'Build',
  transaction: 'Transaction',
  buyers:      'Buyers',
  outlook:     'Outlook 2027',
  index:       'AEGRYN Index',
  people:      'People',
  life:        'Life',
}

type Row = {
  id:           number
  created_at:   string
  civility:     string | null
  first_name:   string | null
  last_name:    string | null
  name:         string
  email:        string
  phone:        string | null
  company:      string | null
  address:      string | null
  city:         string | null
  postal_code:  string | null
  country:      string | null
  interests:    string | null
  rgpd_consent: boolean | null
  locale:       string | null
}

export default async function AdminMagazineWishlistPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams
  await checkAdminAccess(token)

  const supa = createServiceClient()

  const { data: rows, error } = await supa
    .from('print_wishlist')
    .select('id, created_at, civility, first_name, last_name, name, email, phone, company, address, city, postal_code, country, interests, rgpd_consent, locale')
    .order('created_at', { ascending: false })

  /* Calcul des stats par thème */
  const themeCounts: Record<string, number> = {}
  for (const row of (rows ?? []) as Row[]) {
    const keys = (row.interests ?? '').split(',').map(s => s.trim()).filter(Boolean)
    for (const k of keys) {
      themeCounts[k] = (themeCounts[k] ?? 0) + 1
    }
  }
  const totalRows = (rows ?? []).length
  const sortedThemes = Object.entries(themeCounts).sort((a, b) => b[1] - a[1])

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-6 md:px-10 md:py-10">
      <div className="max-w-7xl mx-auto w-full">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN · Magazine</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Wishlist édition papier</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              {totalRows} inscription{totalRows !== 1 ? 's' : ''} — centres d&apos;intérêt consolidés
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/magazine"
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
              ← Magazine
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message} — vérifiez que la migration 085 est appliquée.
          </div>
        )}

        {/* Carte stats thèmes */}
        {sortedThemes.length > 0 && (
          <div className="bg-white border border-gray-200 p-6 mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">
              Centres d&apos;intérêt — répartition
            </p>
            <div className="flex flex-wrap gap-2">
              {sortedThemes.map(([key, count]) => (
                <div key={key} className="flex items-center gap-2 border border-gray-200 px-3 py-1.5 bg-gray-50">
                  <span className="text-[11px] font-semibold text-gray-800">
                    {THEME_LABELS[key] ?? key}
                  </span>
                  <span className="text-[10px] font-mono bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-sm">
                    {count}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {totalRows > 0 ? Math.round((count / totalRows) * 100) : 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Table liste */}
        {totalRows === 0 && !error ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucune inscription pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200 min-w-[700px]">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Date', 'Civilité', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Adresse', 'Intérêts', 'RGPD'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(rows as Row[]).map(r => {
                  const keys = (r.interests ?? '').split(',').map(s => s.trim()).filter(Boolean)
                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-[10px] text-gray-400 whitespace-nowrap">
                        {new Date(r.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-4 py-3 text-gray-400 text-[10px]">{r.civility ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-800">{r.first_name ?? '—'}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800">{r.last_name ?? r.name}</td>
                      <td className="px-4 py-3 text-gray-500">{r.email}</td>
                      <td className="px-4 py-3 text-gray-400 text-[11px]">{r.phone ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-400 text-[11px] leading-snug">
                        {[r.address, r.postal_code && r.city ? `${r.postal_code} ${r.city}` : (r.city ?? r.postal_code), r.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {keys.length === 0 ? (
                            <span className="text-gray-300">—</span>
                          ) : keys.map(k => (
                            <span key={k} className="text-[9px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-600 px-1.5 py-0.5 border border-gray-200">
                              {THEME_LABELS[k] ?? k}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {r.rgpd_consent
                          ? <span className="text-[9px] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5">✓</span>
                          : <span className="text-[9px] text-gray-300">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </main>
  )
}
