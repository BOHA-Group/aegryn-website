import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = { title: 'Benchmark marché — Aegryn Admin', robots: { index: false, follow: false } }

export default async function AdminSettingsBenchmarkPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const params = await searchParams
  await checkAdminAccess(params.token)
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const supa = createServiceClient()
  const { data, error } = await supa.from('benchmark_data').select('*').order('category', { ascending: true }).limit(100)
  const rows = (data ?? []) as Record<string, unknown>[]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">
        <Link href={`/admin/settings${tokenQs}`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">← Retour aux paramètres</Link>
        <h1 className="text-[24px] font-bold text-gray-900 tracking-tight mb-2">Benchmark marché</h1>
        <p className="text-[12px] text-gray-400 mb-6">Données utilisées pour comparer les métriques d'un actif à son marché lors du grading.</p>

        {error && <div className="bg-red-50 border border-red-200 p-4 text-[12px] text-red-700">Erreur : {(error as { message: string }).message}</div>}

        {rows.length === 0 && !error ? (
          <div className="bg-white border border-gray-200 p-16 text-center text-[13px] text-gray-400">Aucune donnée de benchmark.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{Object.keys(rows[0] ?? {}).map(k => (
                  <th key={k} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{k}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    {Object.values(r).map((v, j) => (
                      <td key={j} className="px-4 py-3 font-mono text-[11px] text-gray-600 whitespace-nowrap">{v == null ? '—' : String(v)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[11px] text-gray-400 mt-4">Édition directe en base (Supabase Studio) pour l'instant — un formulaire d'édition inline pourra être ajouté ensuite.</p>
      </div>
    </main>
  )
}
