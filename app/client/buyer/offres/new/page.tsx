import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import NewOfferForm from './NewOfferForm'

export const metadata: Metadata = {
  title: 'Soumettre une offre — Espace Acquéreur AEGRYN',
  robots: { index: false, follow: false },
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

export default async function NewOfferPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { asset: assetId } = await searchParams
  if (!assetId) redirect('/client/buyer/catalogue')

  const supa = createServiceClient()

  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, status')
    .eq('id', assetId)
    .eq('status', 'published')
    .single()

  if (!asset) notFound()

  const { data: existingBid } = await supa
    .from('auction_bids')
    .select('id')
    .eq('asset_id', assetId)
    .eq('bidder_id', user.id)
    .in('status', ['draft', 'submitted', 'retained'])
    .single()

  if (existingBid) redirect(`/client/buyer/offres/${existingBid.id}`)

  return (
    <div className="p-8 max-w-2xl">
      <Link href={`/client/buyer/catalogue/${assetId}`}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft size={12} /> Retour à la fiche
      </Link>

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Nouvelle offre</p>
        <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
          Expression d&apos;Intérêt — {asset.company_name ?? `Actif #${assetId.slice(0, 8)}`}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          {asset.asset_type && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">
              {asset.asset_type}
            </span>
          )}
          {asset.official_grade && (
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-gray-300 px-2 py-0.5">
              Grade {asset.official_grade}
            </span>
          )}
          {asset.arr != null && (
            <span className="font-sans text-[11px] text-gray-400">ARR {fmtChf(asset.arr)}</span>
          )}
        </div>
      </div>

      {/* Info processus */}
      <div className="bg-ag-navy/5 border border-ag-navy/20 px-5 py-4 mb-8">
        <p className="font-mono text-[9px] uppercase tracking-widest text-ag-navy/60 mb-2">Processus AEGRYN</p>
        <ol className="flex flex-col gap-1.5">
          {[
            'Votre EI est transmise à l\'équipe AEGRYN',
            'Analyse de votre dossier KYC et de votre capacité d\'acquisition',
            'Réponse dans les 48h ouvrables',
            'Si retenue : accès à la data room et processus PTT',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="font-mono text-[9px] text-ag-navy/40 shrink-0 mt-0.5">{String(i + 1).padStart(2, '0')}.</span>
              <span className="font-sans text-[11px] text-gray-600">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <NewOfferForm assetId={assetId} userId={user.id} assetName={asset.company_name ?? `Actif #${assetId.slice(0, 8)}`} />
    </div>
  )
}
