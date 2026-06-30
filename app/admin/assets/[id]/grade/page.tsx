import { createServiceClient } from '@/lib/supabase'
import { redirect, notFound }   from 'next/navigation'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import GradeForm                from './GradeForm'

export const metadata: Metadata = {
  title: 'Attribution de grade — AEGRYN Admin',
  robots: { index: false, follow: false },
}

function fmtEur(n: unknown) {
  if (!n) return '—'
  const v = Number(n)
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)} M€`
  if (v >= 1_000)     return `${(v / 1_000).toFixed(0)} K€`
  return `${Math.round(v)} €`
}

export default async function AdminAssetGradePage({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { id }    = await params
  const { token } = await searchParams

  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && token !== adminToken) redirect('/')

  const supa = createServiceClient()
  const { data: asset, error } = await supa
    .from('assets')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !asset) notFound()

  const a = asset as Record<string, unknown>
  const tokenQs = token ? `?token=${token}` : ''

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Link href={`/admin/assets${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 bg-white transition-colors">
              ← Assets
            </Link>
            <Link href={`/admin/leads${tokenQs}`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 bg-white transition-colors">
              Leads
            </Link>
          </div>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">AEGRYN ADMIN — Attribution de grade officiel</p>
          <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
            {String(a.company_name ?? a.seller_name ?? 'Actif sans nom')}
          </h1>
          <p className="text-[12px] text-gray-400 mt-1">{String(a.seller_email ?? '')} · soumis le {a.submitted_at ? new Date(String(a.submitted_at)).toLocaleDateString('fr-CH') : '—'}</p>
        </div>

        {/* Fiche déclarative vendeur */}
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <h2 className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-4">Données déclaratives vendeur (non vérifiées)</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {([
              { label: 'Type actif',   value: String(a.asset_type   ?? '—') },
              { label: 'Secteur',      value: String(a.sector       ?? '—') },
              { label: 'ARR déclaré',  value: fmtEur(a.arr) },
              { label: 'Croissance',   value: a.arr_growth  != null ? `${a.arr_growth}%`   : '—' },
              { label: 'Équipe',       value: a.team_size   != null ? `${a.team_size} pers.` : '—' },
              { label: 'Fondé en',     value: String(a.founded_year ?? '—') },
              { label: 'Site',         value: String(a.website      ?? '—') },
              { label: 'Prix demandé', value: fmtEur(a.asking_price) },
            ] as { label: string; value: string }[]).map(({ label, value }) => (
              <div key={label}>
                <dt className="text-[10px] text-gray-400 mb-0.5">{label}</dt>
                <dd className="text-[12px] font-semibold text-gray-700">{value}</dd>
              </div>
            ))}
          </dl>
          {!!a.description && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <dt className="text-[10px] text-gray-400 mb-1">Description</dt>
              <dd className="text-[12px] text-gray-600 leading-relaxed">{`${a.description}`}</dd>
            </div>
          )}
        </div>

        {/* Formulaire grade */}
        <GradeForm
          assetId={id}
          adminToken={token ?? ''}
          initialStatus={String(a.status ?? 'submitted')}
        />

      </div>
    </main>
  )
}
