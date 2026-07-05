import { createServiceClient } from '@/lib/supabase'
import { redirect, notFound }  from 'next/navigation'
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
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && params.token !== adminToken) redirect('/')

  const supa = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  const { data: transaction, error } = await supa
    .from('transactions')
    .select('*, assets(name, official_grade, asset_type)')
    .eq('id', id)
    .maybeSingle()

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
          </>
        )}

      </div>
    </main>
  )
}
