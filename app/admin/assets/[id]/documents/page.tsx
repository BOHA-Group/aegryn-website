import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createServiceClient } from '@/lib/supabase'
import type {
  DataRoomDocument, DocumentCatalogEntry, DocumentDimension,
} from '@/lib/dataRoom'
import { DIMENSION_LABELS } from '@/lib/dataRoom'
import AdminDocumentsClient from './AdminDocumentsClient'

export const metadata: Metadata = {
  title: 'Documents Data Room — Aegryn Admin',
  robots: { index: false, follow: false },
}

const DIMENSIONS: DocumentDimension[] = ['C', 'I', 'F', 'S', 'T']

export default async function AdminAssetDocumentsPage({
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

  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, seller_name, seller_email, data_room_light_enabled')
    .eq('id', id)
    .single()

  if (!asset) notFound()

  /* Catalogue maître */
  const { data: catalogRows } = await supa
    .from('documents_catalog')
    .select('*')
    .order('sort_order')

  const catalog = (catalogRows ?? []) as DocumentCatalogEntry[]

  /* Documents uploadés pour cet actif */
  const { data: docs } = await supa
    .from('data_room_documents')
    .select('*')
    .eq('asset_id', id)
    .order('uploaded_at', { ascending: false })

  const documents = (docs ?? []) as DataRoomDocument[]

  /* Complétude par dimension — calculée côté server */
  const completeness = DIMENSIONS.map((dim) => {
    const dimCatalog  = catalog.filter((c) => c.dimension === dim)
    const blocking    = dimCatalog.filter((c) => c.required_level === 'blocking')
    const blockingOk  = blocking.filter((c) =>
      documents.some((d) => d.document_code === c.code && d.admin_quality === 'sufficient')
    )
    const hasBlocking = documents.some(
      (d) => dimCatalog.some((c) => c.code === d.document_code) && d.blocks_grading
    )
    return {
      dim,
      label:          DIMENSION_LABELS[dim],
      blocking_total: blocking.length,
      blocking_ok:    blockingOk.length,
      has_blocking:   hasBlocking,
      grading_ok:     blockingOk.length === blocking.length && !hasBlocking,
    }
  })

  const assetName = String(
    (asset as Record<string, unknown>).company_name
    ?? (asset as Record<string, unknown>).seller_name
    ?? 'Actif'
  )

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <Link href={`/admin/assets`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 bg-white transition-colors">
              ← Assets
            </Link>
            <Link href={`/admin/assets/${id}/grade`}
              className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-3 py-1.5 hover:border-gray-400 bg-white transition-colors">
              Grade
            </Link>
          </div>
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">
            Aegryn ADMIN — Data Room Documents
          </p>
          <h1 className="text-[22px] font-bold text-gray-900 tracking-tight">{assetName}</h1>
          <p className="text-[12px] text-gray-400 mt-1">
            {String((asset as Record<string, unknown>).seller_email ?? '')}
          </p>
        </div>

        {/* Tableau de complétude */}
        <div className="bg-white border border-gray-200 mb-8">
          <div className="px-5 py-3 border-b border-gray-100">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">
              Complétude dossier — Indicateur admin
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[12px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Dimension', 'Bloquants OK', 'Recommandés', 'Grading ?'].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {completeness.map((row) => (
                  <tr key={row.dim} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-semibold text-gray-700">{row.label}</td>
                    <td className="px-4 py-3 font-mono">
                      <span className={row.blocking_ok === row.blocking_total ? 'text-emerald-600' : 'text-amber-600'}>
                        {row.blocking_ok}/{row.blocking_total}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-[11px]">
                      {documents.filter((d) =>
                        catalog.some((c) => c.code === d.document_code && c.dimension === row.dim && c.required_level === 'recommended')
                      ).length} uploadés
                    </td>
                    <td className="px-4 py-3">
                      {row.grading_ok ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-mono text-[9px] uppercase font-bold">✓ GO</span>
                      ) : row.has_blocking ? (
                        <span className="px-2 py-0.5 bg-red-50 text-red-600 font-mono text-[9px] uppercase font-bold">✗ BLOQUÉ</span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 font-mono text-[9px] uppercase font-bold">⚠ Incomplet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Liste interactive par dimension */}
        <AdminDocumentsClient
          assetId={id}
          catalog={catalog}
          documents={documents}
          dataRoomLightEnabled={Boolean((asset as Record<string, unknown>).data_room_light_enabled)}
        />

      </div>
    </main>
  )
}
