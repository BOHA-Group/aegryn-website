import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowUpRight, ArrowRightLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Transactions — Buyer Space Aegryn',
  robots: { index: false, follow: false },
}

const TX_STEPS = [
  { key: 'ei_submitted',   label: 'EI reçue' },
  { key: 'ap_signed',      label: 'AP signé' },
  { key: 'escrow_paid',    label: 'Séquestre' },
  { key: 'dd_in_progress', label: 'Due Diligence' },
  { key: 'signing',        label: 'Signing' },
  { key: 'closed',         label: 'Clôturé' },
]

function getStepIndex(status: string) {
  return TX_STEPS.findIndex(s => s.key === status)
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

type Transaction = {
  id: string
  status: string
  created_at: string
  escrow_amount_chf: number | null
  ap_accepted_buyer: boolean
  ap_accepted_seller: boolean
  dd_deadline_at: string | null
  signing_date: string | null
  closed_at: string | null
  assets: { company_name: string | null; official_grade: string | null } | null
}

export default async function BuyerTransactionsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'

  const t = await getTranslations({ locale, namespace: 'client.buyer' })

  const supa = createServiceClient()
  const { data: transactions } = await supa
    .from('transactions')
    .select('id, status, created_at, escrow_amount_chf, ap_accepted_buyer, ap_accepted_seller, dd_deadline_at, signing_date, closed_at, assets(company_name, official_grade)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="p-8 max-w-4xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">{t('areaLabel')}</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">{t('kpiTransactions')}</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Pipeline PTT (Promesse-To-Transfer) de vos acquisitions en cours.
        </p>
      </div>

      {!transactions || transactions.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <ArrowRightLeft size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400 mb-4">
            {t('noTransactions')} Soumettez une offre pour démarrer un processus d&apos;acquisition.
          </p>
          <Link href="/client/buyer/catalogue"
            className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors">
            Explorer le catalogue <ArrowUpRight size={10} />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {(transactions as unknown as Transaction[]).map(tx => {
            const stepIdx = getStepIndex(tx.status)
            const isCancelled = tx.status === 'cancelled'

            return (
              <Link key={tx.id} href={`/client/buyer/transactions/${tx.id}`}
                className="bg-white border border-gray-200 hover:border-ag-navy/30 hover:shadow-sm transition-all block group">

                {/* Header */}
                <div className="p-5 pb-4 flex items-start justify-between gap-4 border-b border-gray-100">
                  <div>
                    <h2 className="font-sans font-semibold text-gray-900 text-[14px]">
                      {tx.assets?.company_name ?? `Transaction #${tx.id.slice(0, 8)}`}
                    </h2>
                    <p className="font-mono text-[10px] text-gray-400 mt-0.5">Créée le {fmtDate(tx.created_at, locale)}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {tx.escrow_amount_chf != null && (
                      <span className="font-mono font-bold text-[13px] text-gray-700">{fmtChf(tx.escrow_amount_chf)}</span>
                    )}
                    <ArrowUpRight size={13} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </div>
                </div>

                {/* Timeline */}
                {!isCancelled ? (
                  <div className="px-5 py-4">
                    <div className="flex items-start">
                      {TX_STEPS.map((step, i) => {
                        const done    = i < stepIdx
                        const current = i === stepIdx
                        return (
                          <div key={step.key} className="flex-1 flex flex-col items-center relative">
                            {i < TX_STEPS.length - 1 && (
                              <div className={`absolute top-2.5 left-1/2 w-full h-px ${done ? 'bg-ag-apex' : 'bg-gray-200'}`} />
                            )}
                            <div className={`relative z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center mb-1.5 ${
                              done    ? 'bg-ag-apex border-ag-apex'
                              : current ? 'bg-white border-ag-apex'
                              : 'bg-white border-gray-200'
                            }`}>
                              {done    && <div className="w-1.5 h-1.5 bg-ag-navy rounded-full" />}
                              {current && <div className="w-1.5 h-1.5 bg-ag-apex rounded-full" />}
                            </div>
                            <p className={`font-sans text-[8px] text-center leading-tight px-0.5 ${
                              current ? 'text-ag-black font-semibold' : done ? 'text-gray-400' : 'text-gray-300'
                            }`}>
                              {step.label}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="px-5 py-3">
                    <p className="font-sans text-[11px] text-gray-400 italic">Transaction annulée.</p>
                  </div>
                )}

                {/* Actions pending */}
                {tx.status === 'ap_signed' && !tx.ap_accepted_buyer && (
                  <div className="mx-5 mb-4 px-4 py-2.5 bg-amber-50 border border-amber-200">
                    <p className="font-sans text-[11px] text-amber-800">
                      ⚠️ Votre validation de l&apos;Accord de Principe est attendue.
                    </p>
                  </div>
                )}

                {/* Dates clés */}
                <div className="px-5 pb-4 flex flex-wrap gap-5">
                  {tx.dd_deadline_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Fin DD</p>
                      <p className="font-sans text-[11px] text-gray-500">{fmtDate(tx.dd_deadline_at, locale)}</p>
                    </div>
                  )}
                  {tx.signing_date && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Signing</p>
                      <p className="font-sans text-[11px] text-gray-500">{fmtDate(tx.signing_date, locale)}</p>
                    </div>
                  )}
                  {tx.closed_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Closing</p>
                      <p className="font-sans text-[11px] text-gray-500">{fmtDate(tx.closed_at, locale)}</p>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
