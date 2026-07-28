import type { Metadata } from 'next'
import { createServiceClient } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Newsletter — AEGRYN Admin',
  robots: { index: false, follow: false },
}

function fmtDate(v: unknown): string {
  if (!v) return '—'
  return new Date(v as string).toLocaleDateString('fr-CH', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default async function AdminNewsletterPage() {
  const supa = createServiceClient()

  const { data: subscribers, error } = await supa
    .from('newsletter_subscribers')
    .select('id, email, user_id, locale, status, last_sent_slug, last_sent_at, subscribed_at, unsubscribed_at')
    .order('subscribed_at', { ascending: false })

  const rows = subscribers ?? []

  const counts = {
    total:        rows.length,
    active:       rows.filter(r => r.status === 'active').length,
    unsubscribed: rows.filter(r => r.status === 'unsubscribed').length,
    prospects:    rows.filter(r => !r.user_id).length,
    withAccount:  rows.filter(r => !!r.user_id).length,
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Newsletter</h1>
          <p className="text-[12px] text-gray-400 mt-1">Abonnés actifs, prospects sans compte, historique d'envoi</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total',        count: counts.total,        color: 'border-gray-200 bg-white' },
            { label: 'Actifs',       count: counts.active,       color: 'border-emerald-200 bg-emerald-50' },
            { label: 'Désabonnés',   count: counts.unsubscribed, color: 'border-red-100 bg-red-50' },
            { label: 'Prospects',    count: counts.prospects,    color: 'border-amber-200 bg-amber-50' },
            { label: 'Avec compte',  count: counts.withAccount,  color: 'border-blue-200 bg-blue-50' },
          ].map(({ label, count, color }) => (
            <div key={label} className={`border p-5 ${color}`}>
              <p className="text-[28px] font-bold text-gray-900">{count}</p>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur Supabase : {(error as { message: string }).message}
          </div>
        )}

        {rows.length === 0 ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucun abonné pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Email', 'Type', 'Langue', 'Statut', 'Dernier article envoyé', 'Envoyé le', 'Inscrit le'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-mono text-[9px] uppercase tracking-widest text-gray-500 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-sans text-gray-800">{sub.email}</td>
                    <td className="px-4 py-3">
                      {sub.user_id ? (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-blue-50 text-blue-700 font-bold">
                          Membre
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-700 font-bold">
                          Prospect
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] uppercase text-gray-500">
                      {sub.locale ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      {sub.status === 'active' ? (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold">
                          Actif
                        </span>
                      ) : (
                        <span className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 bg-red-50 text-red-500 font-bold">
                          Désabonné
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-gray-500 max-w-[180px] truncate" title={sub.last_sent_slug ?? ''}>
                      {sub.last_sent_slug ?? <span className="text-gray-300">Aucun</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-gray-500 whitespace-nowrap">
                      {fmtDate(sub.last_sent_at)}
                    </td>
                    <td className="px-4 py-3 font-mono text-[10px] text-gray-500 whitespace-nowrap">
                      {fmtDate(sub.subscribed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-100 p-4 text-[11px] text-blue-600">
          <strong>Prospects</strong> = abonnés sans compte AEGRYN (user_id null) — inscrits via le formulaire newsletter public.<br />
          <strong>Membres</strong> = abonnés avec un compte connecté au moment de l&apos;inscription.
        </div>

      </div>
    </main>
  )
}
