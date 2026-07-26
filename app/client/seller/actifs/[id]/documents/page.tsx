import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Info } from 'lucide-react'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { VISIBILITY_LABELS, DIMENSION_TO_CATEGORY, DIMENSION_LABELS } from '@/lib/dataRoom'
import type { DataRoomDocument, DocumentCatalogEntry, DocumentDimension, DocumentAdminQuality } from '@/lib/dataRoom'
import { DataRoomUploadForm } from '@/components/seller/DataRoomUploadForm'
import { DataRoomVisibilityToggle } from '@/components/seller/DataRoomVisibilityToggle'

export const metadata: Metadata = {
  title: 'Data Room — Espace Cédant AEGRYN',
  robots: { index: false, follow: false },
}

const DIMENSIONS: DocumentDimension[] = ['C', 'I', 'F', 'S', 'T']

const QUALITY_SELLER_LABELS: Record<DocumentAdminQuality, { label: string; cls: string }> = {
  pending_review: { label: 'En attente',    cls: 'text-gray-400' },
  sufficient:     { label: 'Validé ✓',      cls: 'text-emerald-600 font-semibold' },
  insufficient:   { label: 'Insuffisant ⚠', cls: 'text-amber-600 font-semibold' },
  missing:        { label: 'Manquant ✗',    cls: 'text-red-500 font-semibold' },
}

type Props = { params: Promise<{ id: string }> }

export default async function SellerDataRoomPage({ params }: Props) {
  const { id } = await params
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const { data: asset } = await supa
    .from('assets')
    .select('id, name, status, seller_email')
    .eq('id', id)
    .single() as { data: { id: string; name: string; status: string; seller_email: string } | null }

  if (!asset) notFound()

  const { data: profile } = await supa
    .from('profiles')
    .select('email')
    .eq('id', user.id)
    .single() as { data: { email: string } | null }

  if (!profile || profile.email !== asset.seller_email) redirect('/client/seller/actifs')

  /* Catalogue maître */
  const { data: catalogRows } = await supa
    .from('documents_catalog')
    .select('*')
    .order('sort_order')

  const catalog = (catalogRows ?? []) as DocumentCatalogEntry[]

  /* Documents existants */
  const { data: documents } = await supa
    .from('data_room_documents')
    .select('*')
    .eq('asset_id', id)
    .order('uploaded_at', { ascending: false }) as { data: DataRoomDocument[] | null }

  const docs = documents ?? []

  /* Progression globale — bloquants déposés vs total bloquants */
  const blockingTotal   = catalog.filter((c) => c.required_level === 'blocking').length
  const blockingUploaded = catalog.filter((c) =>
    c.required_level === 'blocking' && docs.some((d) => d.document_code === c.code)
  ).length
  const pct = blockingTotal > 0 ? Math.round((blockingUploaded / blockingTotal) * 100) : 100

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href={`/client/seller/actifs/${id}`}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft size={13} /> Retour au dossier
            </Link>
            <span className="text-gray-200">|</span>
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Data Room</p>
              <p className="text-[13px] font-semibold text-gray-900">{asset.name}</p>
            </div>
          </div>
          <Link
            href={`/client/seller/actifs/${id}/documents/consultations`}
            className="text-[11px] font-semibold text-gray-500 hover:text-gray-900 border border-gray-200 px-3 py-1.5 hover:border-gray-400 transition-colors"
          >
            Consultations →
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Barre de progression bloquants */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-gray-700">Documents bloquants déposés</p>
            <span className="text-[13px] font-semibold text-gray-900">
              {blockingUploaded} / {blockingTotal} • {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-amber-400'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-[11px] text-gray-400 leading-relaxed">
            Les documents <span className="font-semibold text-red-500">bloquants</span> sont requis pour que l'équipe AEGRYN puisse émettre le rapport de grade.
            Les documents <span className="font-semibold text-amber-600">recommandés</span> impactent positivement votre score.
            Par défaut, tout document uploadé est <span className="font-semibold">masqué</span> — vous contrôlez la visibilité.
          </p>
        </div>

        {/* Section par dimension CIFS+T */}
        {DIMENSIONS.map((dim) => {
          const dimCatalog = catalog.filter((c) => c.dimension === dim)
          if (dimCatalog.length === 0) return null
          const category = DIMENSION_TO_CATEGORY[dim]
          const existing  = docs.filter((d) => d.category === category)
          const blocking  = dimCatalog.filter((c) => c.required_level === 'blocking')
          const uploaded  = existing.length

          return (
            <section key={dim} className="bg-white border border-gray-200">
              {/* En-tête dimension */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-[14px] font-semibold text-gray-900">{DIMENSION_LABELS[dim]}</h2>
                <span className={`text-[11px] font-semibold px-2.5 py-1 ${
                  uploaded >= blocking.length && blocking.length > 0
                    ? 'bg-emerald-50 text-emerald-700'
                    : uploaded > 0
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  {uploaded} déposé{uploaded !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Checklist catalogue */}
              <div className="px-6 py-4 border-b border-gray-100 space-y-2">
                {dimCatalog.map((entry) => {
                  const docMatch = docs.filter((d) => d.document_code === entry.code)
                  const done     = docMatch.length > 0
                  const quality  = done ? (docMatch[0].admin_quality ?? 'pending_review') : null
                  const qs       = quality ? QUALITY_SELLER_LABELS[quality as DocumentAdminQuality] : null

                  return (
                    <div key={entry.code} className={`flex items-start gap-3 py-2.5 px-3 border text-[12px] ${
                      done && quality === 'sufficient'
                        ? 'border-emerald-100 bg-emerald-50/40'
                        : done && quality === 'insufficient'
                        ? 'border-amber-200 bg-amber-50/40'
                        : done
                        ? 'border-gray-100 bg-gray-50/30'
                        : 'border-gray-100'
                    }`}>
                      <span className={`shrink-0 mt-0.5 font-mono text-[9px] font-bold px-1 py-0.5 border ${
                        entry.required_level === 'blocking'
                          ? 'border-red-200 bg-red-50 text-red-500'
                          : entry.required_level === 'recommended'
                          ? 'border-amber-200 bg-amber-50 text-amber-600'
                          : 'border-gray-200 bg-gray-50 text-gray-400'
                      }`}>
                        {entry.code}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`leading-tight ${done ? 'text-gray-700' : 'text-gray-500'}`}>
                          {entry.label_fr}
                          {entry.required_level === 'blocking' && (
                            <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wider text-red-500">bloquant</span>
                          )}
                        </p>
                        {entry.format_hint && (
                          <p className="text-[10px] text-gray-400 mt-0.5 italic">{entry.format_hint}</p>
                        )}
                        {entry.note_seller && (
                          <p className="text-[10px] text-ag-navy/70 mt-1 flex items-start gap-1">
                            <Info size={9} className="shrink-0 mt-0.5" />
                            {entry.note_seller}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center gap-2">
                        {done ? (
                          <>
                            <span className="font-mono text-[9px] text-emerald-600">✓ Déposé</span>
                            {qs && quality !== 'pending_review' && (
                              <span className={`font-mono text-[9px] ${qs.cls}`}>{qs.label}</span>
                            )}
                          </>
                        ) : (
                          <span className="font-mono text-[9px] text-gray-300">○ Non déposé</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Documents uploadés */}
              {existing.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                    Fichiers déposés ({existing.length})
                  </p>
                  {existing.map((doc) => (
                    <DataRoomDocumentRow key={doc.id} doc={doc} assetId={id} />
                  ))}
                </div>
              )}

              {/* Formulaire upload */}
              <div className="px-6 py-5">
                <DataRoomUploadForm
                  assetId={id}
                  category={category}
                  requiredTypes={dimCatalog.map((e) => ({ type: e.code, label: e.label_fr, sensitive: false }))}
                />
              </div>
            </section>
          )
        })}
      </div>
    </main>
  )
}

/* ── Ligne document existant ─────────────────────────────────────────── */
function DataRoomDocumentRow({ doc, assetId }: { doc: DataRoomDocument; assetId: string }) {
  const fmtSize = (bytes: number | null) => {
    if (!bytes) return ''
    if (bytes < 1024) return `${bytes} o`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
  }

  return (
    <div className="flex items-center justify-between gap-4 py-2.5 px-3 border border-gray-100 hover:border-gray-200 bg-gray-50/50">
      <div className="flex items-center gap-3 min-w-0">
        <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${
          doc.visible_to === 'nda_buyers' ? 'bg-emerald-500'
          : doc.visible_to === 'assigned_partner' ? 'bg-amber-500'
          : 'bg-gray-300'
        }`} />
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-gray-800 truncate">{doc.file_name}</p>
          <p className="text-[10px] text-gray-400">
            {VISIBILITY_LABELS[doc.visible_to]}
            {doc.file_size_bytes ? ` • ${fmtSize(doc.file_size_bytes)}` : ''}
            {doc.is_sensitive ? ' • ⚠ sensible' : ''}
            {doc.document_code ? ` • ${doc.document_code}` : ''}
          </p>
        </div>
      </div>
      <DataRoomVisibilityToggle documentId={doc.id} current={doc.visible_to} assetId={assetId} />
    </div>
  )
}
