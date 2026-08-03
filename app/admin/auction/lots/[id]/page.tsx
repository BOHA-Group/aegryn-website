import { requireAdmin }       from '@/lib/adminAuth'
import { createServiceClient }  from '@/lib/supabase'
import { notFound }             from 'next/navigation'
import Link                     from 'next/link'
import LotEditForm              from './LotEditForm'

export default async function EditLotPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params

  const supa = createServiceClient()
  const { data: lot } = await supa
    .from('auction_assets')
    .select('id, slug, lot_number, name, tagline, catalog_context, status, session_opens_at, session_closes_at, reserve_price, buyer_premium_pct, access_circle')
    .eq('id', id)
    .single()

  if (!lot) notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/auction/lots" className="font-sans text-[12px] text-gray-400 hover:text-gray-700 transition-colors">
          ← Lots
        </Link>
        <span className="text-gray-200">|</span>
        <h1 className="font-sans font-bold text-gray-900 text-[15px]">
          Modifier le lot — {lot.name}
        </h1>
        <span className="ml-2 font-mono text-[10px] text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-0.5">
          #{lot.lot_number}
        </span>
      </header>
      <div className="max-w-3xl mx-auto px-6 py-10">
        <LotEditForm lot={lot as Record<string, unknown>} />
      </div>
    </div>
  )
}
