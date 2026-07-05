import { createServiceClient } from '@/lib/supabase'
import { redirect }            from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Commissions — AEGRYN Admin',
  robots: { index: false, follow: false },
}

const TYPE_LABEL: Record<string, string> = {
  cosignature:     'Co-signature',
  referral_asset:  'Apport actif',
  referral_buyer:  'Apport acquéreur',
}

const STATUS_FLOW = ['pending', 'to_invoice', 'invoiced', 'paid'] as const

function statusColor(s: string) {
  return s === 'paid'        ? 'bg-emerald-50 text-emerald-700'
    : s === 'invoiced'       ? 'bg-blue-50 text-blue-700'
    : s === 'to_invoice'     ? 'bg-purple-50 text-purple-700'
    : 'bg-yellow-50 text-yellow-700'
}

export default async function AdminCommissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; action?: string; id?: string; status?: string }>
}) {
  const params     = await searchParams
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  if (params.action === 'update' && params.id && params.status) {
    const update: Record<string, unknown> = { status: params.status }
    if (params.status === 'invoiced') update.invoiced_at = new Date().toISOString()
    if (params.status === 'paid')     update.paid_at     = new Date().toISOString()
    await supa.from('commissions').update(update).eq('id', params.id)
    redirect(`/admin/commissions${tokenQs}`)
  }

  const { data, error } = await supa
    .from('commissions')
    .select('id, type, amount_chf, status, eligible_at, created_at, partner_id')
    .order('created_at', { ascending: false })
    .limit(200)

  const rows = (data ?? []) as Record<string, unknown>[]

  const partnerIds = [...new Set(rows.map(r => String(r.partner_id)).filter(Boolean))]
  const { data: partnerProfiles } = partnerIds.length
    ? await supa.from('profiles').select('id, full_name, email').in('id', partnerIds)
    : { data: [] }
  const partnersById = new Map(
    ((partnerProfiles ?? []) as Record<string, unknown>[]).map(p => [String(p.id), p])
  )

  const totals = {
    pending:    rows.filter(r => r.status === 'pending').reduce((s, r) => s + Number(r.amount_chf ?? 0), 0),
    toInvoice:  rows.filter(r => r.status === 'to_invoice').reduce((s, r) => s + Number(r.amount_chf ?? 0), 0),
    invoiced:   rows.filter(r => r.status === 'invoiced').reduce((s, r) => s + Number(r.amount_chf ?? 0), 0),
    paid:       rows.filter(r => r.status === 'paid').reduce((s, r) => s + Number(r.amount_chf ?? 0), 0),
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Commissions partenaires</h1>
            <p className="text-[12px] text-gray-400 mt-1">Co-signatures et apports d'affaires — versement manuel sous 30 jours date de facture</p>
          </div>
          <Link href={`/admin${tokenQs}`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'En attente',   value: totals.pending,   color: 'border-yellow-200 bg-yellow-50' },
            { label: 'À facturer',   value: totals.toInvoice, color: 'border-purple-200 bg-purple-50' },
            { label: 'Facturées',    value: totals.invoiced,  color: 'border-blue-200 bg-blue-50' },
            { label: 'Versées',      value: totals.paid,      color: 'border-emerald-200 bg-emerald-50' },
          ].map(({ label, value, color }) => (
            <div key={label} className={`border p-5 ${color}`}>
              <p className="text-[22px] font-bold text-gray-900">{value.toLocaleString('fr-CH')} CHF</p>
              <p className="text-[11px] text-gray-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur : {(error as { message: string }).message}. La migration 017 doit être appliquée pour activer cette page.
          </div>
        )}

        {rows.length === 0 && !error ? (
          <div className="bg-white border border-gray-200 p-16 text-center">
            <p className="text-[13px] text-gray-400">Aucune commission enregistrée pour le moment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[12px] bg-white border border-gray-200">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['Partenaire', 'Type', 'Montant', 'Éligible le', 'Statut', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rows.map((r) => {
                  const partner = partnersById.get(String(r.partner_id)) ?? null
                  const nextStatus = STATUS_FLOW[STATUS_FLOW.indexOf(String(r.status) as typeof STATUS_FLOW[number]) + 1]
                  return (
                    <tr key={String(r.id)} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-gray-800">{String(partner?.full_name ?? '—')}</div>
                        <div className="text-[10px] text-gray-400">{String(partner?.email ?? '')}</div>
                      </td>
                      <td className="px-4 py-3 text-[10px] uppercase tracking-wide text-gray-500">{TYPE_LABEL[String(r.type)] ?? String(r.type)}</td>
                      <td className="px-4 py-3 font-mono text-gray-700">{r.amount_chf ? `${r.amount_chf} CHF` : '—'}</td>
                      <td className="px-4 py-3 font-mono text-[11px] text-gray-500">{String(r.eligible_at ?? '—')}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${statusColor(String(r.status ?? ''))}`}>
                          {String(r.status ?? '—')}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {nextStatus ? (
                          <Link href={`/admin/commissions?action=update&id=${r.id}&status=${nextStatus}${params.token ? `&token=${params.token}` : ''}`}
                            className="text-[10px] font-semibold text-gray-700 border border-gray-300 px-2 py-1 hover:border-gray-500 transition-colors">
                            → {nextStatus}
                          </Link>
                        ) : (
                          <span className="text-[10px] text-gray-300">—</span>
                        )}
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
