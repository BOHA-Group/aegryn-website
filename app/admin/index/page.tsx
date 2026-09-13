import type { Metadata } from 'next'
import Link from 'next/link'
import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import RefreshButton from './RefreshButton'

export const metadata: Metadata = { title: 'CIFSO Valuation Index | Aegryn Admin', robots: { index: false, follow: false } }

const KIND: Record<string, string> = { official_api: 'Flux officiel', internal_curated: 'Séries curées', internal_certified: 'Dossiers certifiés', derived: 'Dérivé' }
const fmt = (d: string | null | undefined) => d ? new Date(d).toLocaleString('fr-CH', { dateStyle: 'short', timeStyle: 'short' }) : '·'

/**
 * Statut du moteur de collecte du CIFSO Valuation Index : sources externes et internes,
 * dernières collectes, séries disponibles par périmètre et métrique, prochain passage.
 */
export default async function AdminIndexPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams
  await checkAdminAccess(token)
  const supa = createServiceClient()

  const [{ data: sources }, { data: logs }, { data: series }, { data: macro }] = await Promise.all([
    supa.from('cifso_index_sources').select('*').order('region').order('key'),
    supa.from('cifso_index_refresh_log').select('*').order('started_at', { ascending: false }).limit(12),
    supa.from('cifso_index_benchmarks').select('scope_type, metric, is_public, period').eq('is_active', true),
    supa.from('cifso_index_benchmarks').select('scope_key, metric, period, p50, unit').eq('scope_type', 'market').eq('is_active', true).order('metric'),
  ])
  const S = (sources ?? []) as Record<string, string | number | boolean | null>[]
  const L = (logs ?? []) as Record<string, unknown>[]
  const counts = new Map<string, { n: number; pub: number; latest: string }>()
  for (const r of (series ?? []) as { scope_type: string; metric: string; is_public: boolean; period: string }[]) {
    const k = `${r.scope_type} · ${r.metric}`
    const c = counts.get(k) ?? { n: 0, pub: 0, latest: '' }
    c.n++; if (r.is_public) c.pub++; if (r.period > c.latest) c.latest = r.period
    counts.set(k, c)
  }
  const failing = S.filter(s => s.last_status === 'error')
  const last = L[0]
  const next = (() => { const d = new Date(); const day = d.getDay(); const add = ((1 - day + 7) % 7) || 7; d.setDate(d.getDate() + add); d.setHours(6, 0, 0, 0); return d })()

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Pilotage</p>
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">CIFSO Valuation Index : moteur de collecte</h1>
            <p className="text-[12px] text-gray-500 mt-1 max-w-2xl">
              Collecte automatique chaque lundi à 06:00 (Europe/Zurich) : flux officiels ouverts (BCE, Eurostat, BNS), séries curées Aegryn et dossiers certifiés publiés,
              consolidés en séries p25 / médiane / p75 par cluster, vertical, grade et dimension C, I, F, S, O. Source affichée aux clients : Aegryn CIFSO Valuation Index.
            </p>
          </div>
          <RefreshButton />
        </div>

        {/* Bandeau statut */}
        <div className={`rounded-xl border px-5 py-4 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${failing.length ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <div className="font-sans text-[13px] text-gray-800">
            <strong>{failing.length ? `${failing.length} source(s) en erreur` : 'Toutes les sources répondent'}</strong>
            {last ? <> · dernière collecte {fmt(last.started_at as string)} ({String(last.trigger)}), {String(last.series_upserted)} séries, statut {String(last.status)}</> : <> · aucune collecte enregistrée</>}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Prochain passage : {next.toLocaleString('fr-CH', { dateStyle: 'medium', timeStyle: 'short' })}</span>
        </div>

        {/* Sources */}
        <section className="bg-white border border-gray-200 mb-8">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <p className="font-sans font-bold text-gray-900 text-[14px]">Sources</p>
            <span className="font-mono text-[10px] text-gray-400">{S.length} enregistrées</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-left font-mono text-[9px] uppercase tracking-widest text-gray-400">
                <tr><th className="px-5 py-3">Source</th><th className="px-5 py-3">Zone</th><th className="px-5 py-3">Type</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Dernière collecte</th><th className="px-5 py-3">Séries</th><th className="px-5 py-3">Dernière observation</th><th className="px-5 py-3">Échecs consécutifs</th></tr>
              </thead>
              <tbody>
                {S.length === 0 && <tr><td colSpan={8} className="px-5 py-10 text-center text-gray-400">Aucune source enregistrée. Lancez une collecte.</td></tr>}
                {S.map(s => (
                  <tr key={String(s.key)} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-3"><p className="font-semibold text-gray-900">{String(s.name)}</p><p className="font-mono text-[10px] text-gray-400">{String(s.key)}</p>{s.last_error && <p className="text-[11px] text-red-600 mt-1">{String(s.last_error)}</p>}</td>
                    <td className="px-5 py-3 font-mono text-[10px] text-gray-500">{String(s.region ?? '·')}</td>
                    <td className="px-5 py-3 text-gray-600">{KIND[String(s.kind)] ?? String(s.kind)}</td>
                    <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${s.last_status === 'ok' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : s.last_status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-100 text-gray-500'}`}>{String(s.last_status ?? 'jamais')}</span></td>
                    <td className="px-5 py-3 text-gray-600 font-mono text-[11px]">{fmt(s.last_run_at as string)}</td>
                    <td className="px-5 py-3 font-mono">{String(s.last_rows)}</td>
                    <td className="px-5 py-3 font-mono text-[11px] text-gray-600">{String(s.last_latest_obs ?? '·')}</td>
                    <td className="px-5 py-3 font-mono">{String(s.consecutive_failures)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Contexte de marché collecté */}
          <section className="bg-white border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200"><p className="font-sans font-bold text-gray-900 text-[14px]">Contexte de marché collecté</p><p className="text-[11px] text-gray-500 mt-1">Dernières observations des flux officiels. L'indicateur de conditions de marché (0 à 100) est une lecture pour l'analyste ; il ne modifie pas les multiples automatiquement.</p></div>
            <table className="w-full text-[12px]">
              <tbody>
                {((macro ?? []) as { scope_key: string; metric: string; period: string; p50: number; unit: string }[]).map(m => (
                  <tr key={m.scope_key + m.metric} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-2.5 font-mono text-[11px] text-gray-500">{m.metric}</td>
                    <td className="px-5 py-2.5 text-gray-700">{m.scope_key}</td>
                    <td className="px-5 py-2.5 font-mono text-[11px] text-gray-400">{m.period}</td>
                    <td className="px-5 py-2.5 font-mono font-semibold text-right text-gray-900">{m.p50}{m.unit === '%' ? ' %' : m.unit === 'pts' ? ' / 100' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* Séries disponibles */}
          <section className="bg-white border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-200"><p className="font-sans font-bold text-gray-900 text-[14px]">Séries disponibles</p><p className="text-[11px] text-gray-500 mt-1">Par périmètre et métrique. « Aperçu » = visible en accès libre ; le reste est réservé aux abonnés.</p></div>
            <table className="w-full text-[12px]">
              <tbody>
                {[...counts.entries()].sort().map(([k, c]) => (
                  <tr key={k} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-2.5 font-mono text-[11px] text-gray-700">{k}</td>
                    <td className="px-5 py-2.5 font-mono text-right">{c.n}</td>
                    <td className="px-5 py-2.5 font-mono text-[10px] text-gray-400 text-right">{c.pub} aperçu</td>
                    <td className="px-5 py-2.5 font-mono text-[10px] text-gray-400 text-right">{c.latest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Journal */}
        <section className="bg-white border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-200"><p className="font-sans font-bold text-gray-900 text-[14px]">Journal des collectes</p></div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-200 text-left font-mono text-[9px] uppercase tracking-widest text-gray-400">
                <tr><th className="px-5 py-3">Début</th><th className="px-5 py-3">Déclencheur</th><th className="px-5 py-3">Statut</th><th className="px-5 py-3">Période</th><th className="px-5 py-3">Séries</th><th className="px-5 py-3">Sources</th><th className="px-5 py-3">Détail</th></tr>
              </thead>
              <tbody>
                {L.map(l => {
                  const src = (l.sources_json as { status: string }[] | null) ?? []
                  return (
                    <tr key={String(l.id)} className="border-b border-gray-100 last:border-0">
                      <td className="px-5 py-3 font-mono text-[11px]">{fmt(l.started_at as string)}</td>
                      <td className="px-5 py-3 text-gray-600">{String(l.trigger)}</td>
                      <td className="px-5 py-3"><span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-widest ${l.status === 'ok' ? 'bg-emerald-50 text-emerald-700' : l.status === 'error' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>{String(l.status)}</span></td>
                      <td className="px-5 py-3 font-mono">{String(l.period ?? '·')}</td>
                      <td className="px-5 py-3 font-mono">{String(l.series_upserted)}</td>
                      <td className="px-5 py-3 font-mono">{src.length ? `${src.filter(s => s.status === 'ok').length}/${src.length}` : '·'}</td>
                      <td className="px-5 py-3 text-[11px] text-gray-500">{String(l.error ?? '')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <p className="text-[11px] text-gray-400 mt-6">
          Séries curées : <Link href="/admin/settings/benchmark" className="underline">benchmark marché</Link>. Page publique : <Link href="/fr/valuation" className="underline">/valuation</Link>.
        </p>
      </div>
    </main>
  )
}
