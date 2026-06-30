/**
 * /admin/auction/lots
 * Gestion des lots — statut, session, mise à prix, grade
 */
import Link                    from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import { requireAdmin }        from '@/lib/adminAuth'
import type { Metadata }       from 'next'

export const metadata: Metadata = { title: 'Lots — Auction Admin', robots: { index: false, follow: false } }

const GRADE_COLORS: Record<string, string> = {
  '★':  'text-emerald-600', AAA: 'text-yellow-600', AA: 'text-gray-500',
  A:    'text-blue-600',    B:   'text-orange-500',
}

export default async function AuctionLotsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdmin()
  const { status = 'all' } = await searchParams

  const qs   = ''
  const supa = createServiceClient()

  let q = supa
    .from('auction_assets')
    .select('id, slug, lot_number, name, status, grade, session_opens_at, session_closes_at, reserve_price, buyer_premium_pct, created_at')
    .order('session_opens_at', { ascending: false, nullsFirst: false })

  if (status !== 'all') q = q.eq('status', status)

  const { data: lots } = await q as unknown as { data: Record<string, unknown>[] | null }

  const now = new Date()

  const sessionState = (opens: string | null, closes: string | null) => {
    if (!opens && !closes) return { label: 'Non planifiée', cls: 'text-gray-400' }
    if (closes && new Date(closes) < now)  return { label: 'Clôturée', cls: 'text-gray-400' }
    if (opens  && new Date(opens)  > now)  return { label: `Ouvre le ${new Date(opens).toLocaleDateString('fr-CH')}`, cls: 'text-amber-600' }
    return { label: '● Session active', cls: 'text-emerald-600 font-bold' }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-widest mb-1">Auction Admin</p>
            <h1 className="text-xl font-bold text-gray-900">Gestion des lots</h1>
          </div>
          <Link href={`/admin/auction${qs}`} className="text-xs text-gray-400 hover:text-gray-700">← Dashboard</Link>
        </div>

        {/* Filtres statut */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'draft', 'published', 'archived', 'withdrawn'].map(s => (
            <Link
              key={s}
              href={`/admin/auction/lots?status=${s}`}
              className={`text-[11px] font-mono uppercase tracking-wider px-3 py-1.5 border transition-colors ${
                status === s
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s === 'all' ? 'Tous' : s}
            </Link>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-400 font-mono uppercase tracking-wider">
                  <th className="text-left px-6 py-3">Lot</th>
                  <th className="text-left px-4 py-3">Grade</th>
                  <th className="text-left px-4 py-3">Statut</th>
                  <th className="text-left px-4 py-3">Session</th>
                  <th className="text-right px-4 py-3">Mise à prix</th>
                  <th className="text-right px-4 py-3">Commission</th>
                  <th className="text-right px-6 py-3">Gérer</th>
                </tr>
              </thead>
              <tbody>
                {!lots?.length ? (
                  <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Aucun lot</td></tr>
                ) : lots.map(lot => {
                  const grade = (lot.grade as { letter?: string })?.letter ?? '—'
                  const sess  = sessionState(lot.session_opens_at as string | null, lot.session_closes_at as string | null)
                  const fmtChf = (n: unknown) => n == null ? <span className="text-gray-300">—</span> : `CHF ${new Intl.NumberFormat('fr-CH').format(n as number)}`

                  return (
                    <tr key={lot.id as string} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <Link href={`/admin/auction/lots/${lot.id}${qs}`} className="font-semibold text-gray-900 hover:text-blue-600">
                          {lot.name as string}
                        </Link>
                        <span className="ml-2 text-gray-400">#{lot.lot_number as string}</span>
                        <p className="text-gray-400 mt-0.5">{lot.slug as string}</p>
                      </td>
                      <td className={`px-4 py-3 font-mono font-bold ${GRADE_COLORS[grade] ?? 'text-gray-500'}`}>{grade}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          lot.status === 'published' ? 'bg-green-100 text-green-700'
                          : lot.status === 'draft'   ? 'bg-gray-100 text-gray-600'
                          : 'bg-red-50 text-red-500'
                        }`}>
                          {lot.status as string}
                        </span>
                      </td>
                      <td className={`px-4 py-3 ${sess.cls}`}>{sess.label}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-700">{fmtChf(lot.reserve_price)}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{lot.buyer_premium_pct as number ?? 10} %</td>
                      <td className="px-6 py-3 text-right">
                        <Link href={`/admin/auction/lots/${lot.id}${qs}`} className="text-blue-600 hover:underline">
                          Modifier →
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
