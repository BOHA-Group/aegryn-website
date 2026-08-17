/**
 * /admin/transaction/sequesters/[id]
 * Gestion détaillée d'un séquestre — statut, note admin, déclenchement due diligence.
 */
import { notFound }              from 'next/navigation'
import Link                      from 'next/link'
import { createServiceClient }   from '@/lib/supabase'
import { requireAdmin }          from '@/lib/adminAuth'
import type { Metadata }         from 'next'
import SequesterStatusForm       from './SequesterStatusForm'

export const metadata: Metadata = { title: 'Séquestre — Transact Admin', robots: { index: false, follow: false } }

export default async function SequesterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const supa = createServiceClient()

  const { data: seq } = await supa
    .from('auction_sequesters')
    .select('id, asset_id, user_id, bid_id, amount_chf, status, reference, received_at, bank_ref, admin_note, created_at, updated_at, auction_assets(name, lot_number, reserve_price)')
    .eq('id', id)
    .single() as unknown as {
      data: {
        id: string
        asset_id: string
        user_id: string
        bid_id: string | null
        amount_chf: number | null
        status: string
        reference: string | null
        received_at: string | null
        bank_ref: string | null
        admin_note: string | null
        created_at: string
        updated_at: string | null
        auction_assets: { name: string; lot_number: string; reserve_price: number | null } | null
      } | null
    }

  if (!seq) notFound()

  /* Fetch buyer profile */
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, email')
    .eq('id', seq.user_id)
    .single() as unknown as { data: { full_name: string | null; email: string | null } | null }

  /* Fetch linked bid */
  const { data: bid } = seq.bid_id ? await supa
    .from('auction_bids')
    .select('id, amount_chf, status')
    .eq('id', seq.bid_id)
    .single() as unknown as { data: { id: string; amount_chf: number | null; status: string } | null }
  : { data: null }

  const fmtChf = (n: number | null) =>
    n == null ? '—' : `CHF ${new Intl.NumberFormat('fr-CH').format(n)}`

  const fmtDate = (d: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'

  const lot = seq.auction_assets

  const STATUS_BADGE: Record<string, string> = {
    awaited:  'bg-amber-50 text-amber-700 border-amber-200',
    received: 'bg-green-50 text-green-700 border-green-200',
    released: 'bg-gray-100 text-gray-500 border-gray-200',
    applied:  'bg-blue-50 text-blue-700 border-blue-200',
    forfeited:'bg-red-50 text-red-600 border-red-200',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/transaction/sequesters" className="font-sans text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
          ← Séquestres
        </Link>
        <span className="text-gray-200">|</span>
        <h1 className="font-sans font-bold text-gray-900 text-[15px]">
          Séquestre — {lot?.name ?? seq.id.slice(0, 8)}
        </h1>
        {lot?.lot_number && (
          <span className="ml-1 font-mono text-[10px] text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-0.5">
            Lot #{lot.lot_number}
          </span>
        )}
        <span className={`ml-auto font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border ${STATUS_BADGE[seq.status] ?? 'bg-gray-50 text-gray-400 border-gray-200'}`}>
          {seq.status}
        </span>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Left: infos */}
        <div className="md:col-span-2 space-y-6">

          {/* Actif + Acquéreur */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">Détails du séquestre</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <p className="font-mono text-[9px] text-gray-400 mb-1">Actif</p>
                <p className="font-sans font-semibold text-gray-900 text-[14px]">{lot?.name ?? '—'}</p>
                <p className="font-mono text-[10px] text-gray-400">Lot #{lot?.lot_number ?? '—'}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-gray-400 mb-1">Acquéreur</p>
                <p className="font-sans font-semibold text-gray-900 text-[14px]">{profile?.full_name ?? '—'}</p>
                <p className="font-mono text-[10px] text-gray-400">{profile?.email ?? seq.user_id.slice(0, 16)}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-gray-400 mb-1">Montant séquestre</p>
                <p className="font-sans font-bold text-[20px] text-gray-900">{fmtChf(seq.amount_chf)}</p>
                {lot?.reserve_price && (
                  <p className="font-mono text-[10px] text-gray-400">
                    Prix de réserve : {fmtChf(lot.reserve_price)} — {seq.amount_chf && lot.reserve_price ? Math.round((seq.amount_chf / lot.reserve_price) * 100) : '?'}%
                  </p>
                )}
              </div>
              <div>
                <p className="font-mono text-[9px] text-gray-400 mb-1">Référence virement</p>
                <p className="font-mono text-[12px] text-gray-700">{seq.reference ?? '—'}</p>
                {seq.bank_ref && <p className="font-mono text-[10px] text-gray-400">{seq.bank_ref}</p>}
              </div>
              <div>
                <p className="font-mono text-[9px] text-gray-400 mb-1">Créé le</p>
                <p className="font-sans text-[12px] text-gray-600">{fmtDate(seq.created_at)}</p>
              </div>
              <div>
                <p className="font-mono text-[9px] text-gray-400 mb-1">Reçu le</p>
                <p className="font-sans text-[12px] text-gray-600">{fmtDate(seq.received_at)}</p>
              </div>
            </div>

            {seq.admin_note && (
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Note admin</p>
                <p className="font-sans text-[12px] text-gray-700 leading-relaxed">{seq.admin_note}</p>
              </div>
            )}
          </div>

          {/* Offre liée */}
          {bid && (
            <div className="bg-white border border-gray-200 p-6">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">Offre liée</p>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-sans font-bold text-gray-900 text-[16px]">{fmtChf(bid.amount_chf)}</p>
                  <p className="font-mono text-[10px] text-gray-400 mt-0.5">{bid.id}</p>
                </div>
                <span className={`font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 border ${
                  bid.status === 'due_diligence' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                  bid.status === 'retained' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  'bg-gray-50 text-gray-400 border-gray-200'
                }`}>
                  {bid.status}
                </span>
              </div>
              {bid.status === 'due_diligence' && (
                <div className="mt-4 p-3 bg-purple-50 border border-purple-100 flex items-start gap-2">
                  <span className="text-purple-600 text-[11px] mt-0.5">●</span>
                  <p className="font-sans text-[11px] text-purple-700">
                    Due diligence active — l&apos;acquéreur a accès à la data room.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: action */}
        <div className="md:col-span-1">
          <SequesterStatusForm
            sequesters_id={seq.id}
            currentStatus={seq.status}
            currentNote={seq.admin_note ?? ''}
            currentBankRef={seq.bank_ref ?? ''}
          />
        </div>
      </div>
    </div>
  )
}
