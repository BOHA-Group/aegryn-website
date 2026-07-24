import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { notFound }  from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'
import TransactionForm         from './TransactionForm'

export const metadata: Metadata = {
  title: 'Transaction — AEGRYN Admin',
  robots: { index: false, follow: false },
}

export default async function AdminTransactionDetailPage({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id } = await paramsPromise
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const { data: transaction, error } = await supa
    .from('transactions')
    .select('*, assets(name, official_grade, asset_type)')
    .eq('id', id)
    .maybeSingle()

  const { data: auditLog } = await supa
    .from('transaction_audit_log')
    .select('id, event_type, old_amount_chf, new_amount_chf, old_status, new_status, eur_rate, eur_rate_date, amount_eur_approx, note, actor_role, created_at')
    .eq('transaction_id', id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (!transaction && !error) notFound()

  const asset = (transaction?.assets ?? null) as Record<string, unknown> | null

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        <Link href={`/admin/transactions${tokenQs}`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">
          ← Retour aux transactions
        </Link>

        {error || !transaction ? (
          <div className="bg-red-50 border border-red-200 p-4 text-[12px] text-red-700">
            Transaction introuvable ou migration 017 non appliquée.
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">TRANSACTION PTT</p>
              <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
                {String(asset?.name ?? 'Actif')} <span className="font-mono text-gray-400 text-[16px]">— {String(asset?.official_grade ?? '')}</span>
              </h1>
              <p className="text-[12px] text-gray-400 mt-1 font-mono">{id}</p>
            </div>

            <TransactionForm transaction={transaction as Record<string, unknown>} adminToken={params.token} />

            {/* Audit log escrow */}
            {auditLog && auditLog.length > 0 && (
              <section className="mt-8">
                <h2 className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-3">
                  Historique escrow &amp; statuts
                </h2>
                <div className="flex flex-col gap-1.5">
                  {auditLog.map(log => {
                    const EVENT_LABELS: Record<string, { label: string; color: string }> = {
                      escrow_amount_set:     { label: 'Montant fixé',        color: 'text-blue-600 bg-blue-50 border-blue-200' },
                      escrow_amount_updated: { label: 'Montant modifié',     color: 'text-amber-600 bg-amber-50 border-amber-200' },
                      escrow_confirmed:      { label: 'Séquestre confirmé',  color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                      bid_registered:        { label: 'Offre enregistrée',   color: 'text-gray-600 bg-gray-50 border-gray-200' },
                      bid_accepted:          { label: 'Offre acceptée',      color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
                      status_changed:        { label: 'Statut modifié',      color: 'text-gray-600 bg-gray-50 border-gray-200' },
                      closing:               { label: 'Closing',             color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
                      cancelled:             { label: 'Annulée',             color: 'text-red-600 bg-red-50 border-red-200' },
                    }
                    const ev = EVENT_LABELS[log.event_type] ?? { label: log.event_type, color: 'text-gray-500 bg-gray-50 border-gray-200' }
                    const fmtChf = (n: number | null) => n != null
                      ? new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
                      : null
                    const fmtDate = (s: string) => new Date(s).toLocaleString('fr-CH', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit',
                    })
                    return (
                      <div key={log.id} className="bg-white border border-gray-200 px-4 py-3 flex flex-wrap items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest shrink-0 ${ev.color}`}>
                            {ev.label}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            {(log.new_amount_chf != null) && (
                              <p className="font-mono text-[11px] text-gray-800">
                                {log.old_amount_chf != null && (
                                  <span className="line-through text-gray-400 mr-2">{fmtChf(log.old_amount_chf as number)}</span>
                                )}
                                <strong>{fmtChf(log.new_amount_chf as number)}</strong>
                                {log.amount_eur_approx != null && (
                                  <span className="text-gray-400 ml-2 text-[10px]">
                                    ≈ {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(log.amount_eur_approx as number)}
                                    {log.eur_rate_date && <span className="ml-1">au {String(log.eur_rate_date).split('-').reverse().join('.')}</span>}
                                  </span>
                                )}
                              </p>
                            )}
                            {(log.old_status || log.new_status) && (
                              <p className="font-mono text-[10px] text-gray-500">
                                {log.old_status && <span className="text-gray-400 mr-1">{log.old_status}</span>}
                                {log.old_status && log.new_status && <span className="mr-1">→</span>}
                                {log.new_status && <strong className="text-gray-700">{log.new_status}</strong>}
                              </p>
                            )}
                            {log.note && (
                              <p className="font-sans text-[11px] text-gray-400 italic">{String(log.note)}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-mono text-[9px] text-gray-300">{fmtDate(log.created_at as string)}</p>
                          <p className="font-mono text-[8px] uppercase text-gray-300">{String(log.actor_role)}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>
            )}
          </>
        )}

      </div>
    </main>
  )
}
