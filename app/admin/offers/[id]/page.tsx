import { checkAdminAccess } from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import { redirect, notFound }  from 'next/navigation'
import type { Metadata }       from 'next'
import Link                    from 'next/link'

export const metadata: Metadata = {
  title: 'Offre — AEGRYN Admin',
  robots: { index: false, follow: false },
}

const BID_MODEL_LABEL: Record<string, string> = {
  club_deal:    'Club Deal',
  corporate:    'Corporate',
  fund:         'Fonds',
  equity_stake: 'Equity Stake',
}

export default async function AdminOfferDetailPage({
  params: paramsPromise,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ token?: string; action?: string }>
}) {
  const { id }  = await paramsPromise
  const params  = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()
  const tokenQs = params.token ? `?token=${params.token}` : ''

  /* ── Actions ── */
  if (params.action === 'under_review') {
    await supa.from('auction_bids').update({ status: 'under_review', reviewed_at: new Date().toISOString() }).eq('id', id)
    redirect(`/admin/offers/${id}${tokenQs}`)
  }
  if (params.action === 'reject') {
    await supa.from('auction_bids').update({ status: 'rejected', reviewed_at: new Date().toISOString() }).eq('id', id)
    redirect(`/admin/offers/${id}${tokenQs}`)
  }
  if (params.action === 'retain') {
    const { data: bid } = await supa.from('auction_bids').select('asset_id, user_id').eq('id', id).maybeSingle()
    await supa.from('auction_bids').update({ status: 'retained', reviewed_at: new Date().toISOString() }).eq('id', id)
    if (bid) {
      const { data: existingTx } = await supa.from('transactions').select('id').eq('bid_id', id).maybeSingle()
      if (!existingTx) {
        await supa.from('transactions').insert({
          asset_id: bid.asset_id,
          bid_id:   id,
          buyer_id: bid.user_id,
          status:   'ei_submitted',
        })
      }
    }
    redirect(`/admin/offers/${id}${tokenQs}`)
  }

  const { data: bid, error } = await supa
    .from('auction_bids')
    .select('*, auction_assets(name, official_grade, asset_type)')
    .eq('id', id)
    .maybeSingle()

  if (!bid && !error) notFound()

  const asset = (bid?.auction_assets ?? null) as Record<string, unknown> | null
  const { data: transaction } = bid
    ? await supa.from('transactions').select('id').eq('bid_id', id).maybeSingle()
    : { data: null }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        <Link href={`/admin/offers${tokenQs}`} className="text-[11px] font-semibold text-gray-400 hover:text-gray-700 mb-6 inline-block">
          ← Retour aux offres
        </Link>

        {error || !bid ? (
          <div className="bg-red-50 border border-red-200 p-4 text-[12px] text-red-700">Offre introuvable.</div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">OFFRE</p>
              <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
                {String(asset?.name ?? 'Actif')} — {BID_MODEL_LABEL[String(bid.bid_model)] ?? String(bid.bid_model)}
              </h1>
              <p className="text-[12px] text-gray-400 mt-1 font-mono">{id}</p>
            </div>

            <div className="bg-white border border-gray-200 p-6 flex flex-col gap-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-[12px]">
                <div><p className="text-gray-400 text-[10px] uppercase mb-1">Grade</p><p className="font-mono font-bold">{String(asset?.official_grade ?? '—')}</p></div>
                <div><p className="text-gray-400 text-[10px] uppercase mb-1">Montant</p><p className="font-mono">{bid.bid_amount_chf} CHF</p></div>
                <div><p className="text-gray-400 text-[10px] uppercase mb-1">Statut</p><p className="font-semibold">{String(bid.status)}</p></div>
                <div><p className="text-gray-400 text-[10px] uppercase mb-1">Soumise le</p><p className="font-mono">{String(bid.submitted_at ?? '').slice(0,10)}</p></div>
              </div>
              {bid.conditions && Object.keys(bid.conditions as object).length > 0 && (
                <div>
                  <p className="text-gray-400 text-[10px] uppercase mb-2">Conditions</p>
                  <pre className="text-[11px] bg-gray-50 border border-gray-100 p-3 whitespace-pre-wrap">{JSON.stringify(bid.conditions, null, 2)}</pre>
                </div>
              )}
            </div>

            <div className="bg-white border border-gray-200 p-6 flex flex-col gap-4">
              <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Actions</h2>
              <div className="flex gap-3 flex-wrap">
                {bid.status === 'submitted' && (
                  <Link href={`/admin/offers/${id}?action=under_review${params.token ? `&token=${params.token}` : ''}`}
                    className="text-[11px] font-semibold text-blue-600 border border-blue-200 px-4 py-2 hover:border-blue-400 transition-colors">
                    Passer en revue
                  </Link>
                )}
                {(bid.status === 'submitted' || bid.status === 'under_review') && (
                  <>
                    <Link href={`/admin/offers/${id}?action=retain${params.token ? `&token=${params.token}` : ''}`}
                      className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2 hover:border-emerald-400 transition-colors">
                      Retenir l'offre → créer la transaction
                    </Link>
                    <Link href={`/admin/offers/${id}?action=reject${params.token ? `&token=${params.token}` : ''}`}
                      className="text-[11px] font-semibold text-red-500 border border-red-200 px-4 py-2 hover:border-red-400 transition-colors">
                      Rejeter
                    </Link>
                  </>
                )}
                {transaction && (
                  <Link href={`/admin/transactions/${transaction.id}${tokenQs}`}
                    className="text-[11px] font-semibold text-gray-700 border border-gray-300 px-4 py-2 hover:border-gray-500 transition-colors ml-auto">
                    Voir la transaction →
                  </Link>
                )}
              </div>
              <p className="text-[11px] text-gray-400">
                Note : l'identité de l'acquéreur n'est révélée au vendeur qu'après accord des deux parties, décidé manuellement par l'équipe AEGRYN.
              </p>
            </div>
          </>
        )}

      </div>
    </main>
  )
}
