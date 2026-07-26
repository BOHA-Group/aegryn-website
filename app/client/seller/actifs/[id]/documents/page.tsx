import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { REQUIRED_DOCUMENTS, CATEGORY_LABELS, VISIBILITY_LABELS } from '@/lib/dataRoom'
import type { DataRoomDocument, DataRoomCategory } from '@/lib/dataRoom'
import { DataRoomUploadForm } from '@/components/seller/DataRoomUploadForm'

export const metadata: Metadata = {
  title: 'Data Room — Espace Cédant AEGRYN',
  robots: { index: false, follow: false },
}

type Props = { params: Promise<{ id: string }> }

export default async function SellerDataRoomPage({ params }: Props) {
  const { id } = await params
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  /* Vérifier que l'actif appartient bien au vendeur connecté */
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

  if (!profile || profile.email !== asset.seller_email) {
    redirect('/client/seller/actifs')
  }

  /* Charger les documents existants */
  const { data: documents } = await supa
    .from('data_room_documents')
    .select('*')
    .eq('asset_id', id)
    .order('category')
    .order('uploaded_at', { ascending: false }) as { data: DataRoomDocument[] | null }

  const docs = documents ?? []

  /* Grouper par catégorie */
  const byCategory = (Object.keys(CATEGORY_LABELS) as DataRoomCategory[]).reduce<Record<DataRoomCategory, DataRoomDocument[]>>(
    (acc, cat) => {
      acc[cat] = docs.filter((d) => d.category === cat)
      return acc
    },
    { code: [], ip: [], finance: [], security: [], transversal: [] },
  )

  /* Compter les documents uploadés vs requis */
  const totalRequired = Object.values(REQUIRED_DOCUMENTS).reduce((s, arr) => s + arr.length, 0)
  const totalUploaded = docs.length
  const pct = Math.round((totalUploaded / totalRequired) * 100)

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

        {/* Barre de progression globale */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[13px] font-semibold text-gray-700">
              Complétude du dossier
            </p>
            <span className="text-[13px] font-semibold text-gray-900">
              {totalUploaded} / {totalRequired} documents • {pct}%
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-[11px] text-gray-400 leading-relaxed">
            Les documents marqués <span className="font-semibold text-amber-600">sensibles</span> déclenchent un watermarking renforcé lors de chaque consultation.
            Par défaut, tout document uploadé est <span className="font-semibold">masqué</span> — vous contrôlez la visibilité.
          </p>
        </div>

        {/* Section par dimension CIFS */}
        {(Object.keys(CATEGORY_LABELS) as DataRoomCategory[]).map((category) => {
          const existing = byCategory[category]
          const required = REQUIRED_DOCUMENTS[category]
          const uploaded = existing.length

          return (
            <section key={category} className="bg-white border border-gray-200">
              {/* En-tête catégorie */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                    {category.toUpperCase()}
                  </span>
                  <h2 className="text-[15px] font-semibold text-gray-900">
                    {CATEGORY_LABELS[category]}
                  </h2>
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-1 ${
                  uploaded >= required.length
                    ? 'bg-emerald-50 text-emerald-700'
                    : uploaded > 0
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-50 text-gray-500'
                }`}>
                  {uploaded}/{required.length}
                </span>
              </div>

              {/* Checklist des documents requis */}
              <div className="px-6 py-4 border-b border-gray-100 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                  Documents requis
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {required.map((req) => {
                    const done = existing.some((d) => d.document_type === req.type)
                    return (
                      <div key={req.type} className={`flex items-start gap-2.5 py-1.5 px-3 border text-[12px] ${
                        done
                          ? 'border-emerald-100 bg-emerald-50/50 text-gray-700'
                          : 'border-gray-100 text-gray-500'
                      }`}>
                        <span className={`mt-0.5 shrink-0 w-3.5 h-3.5 flex items-center justify-center text-[10px] font-bold ${
                          done ? 'text-emerald-600' : 'text-gray-300'
                        }`}>
                          {done ? '✓' : '○'}
                        </span>
                        <span className="leading-tight">
                          {req.label}
                          {req.sensitive && (
                            <span className="ml-1.5 text-[9px] font-semibold uppercase tracking-wider text-amber-600">
                              sensible
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Documents déjà uploadés */}
              {existing.length > 0 && (
                <div className="px-6 py-4 border-b border-gray-100 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-3">
                    Uploadés ({existing.length})
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
                  requiredTypes={required}
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
          </p>
        </div>
      </div>
      {/* Toggle visibilité — géré côté client */}
      <DataRoomVisibilityToggle documentId={doc.id} current={doc.visible_to} assetId={assetId} />
    </div>
  )
}

/* ── Toggle visibilité (Server Component shell — client component interactif) */
import { DataRoomVisibilityToggle } from '@/components/seller/DataRoomVisibilityToggle'
