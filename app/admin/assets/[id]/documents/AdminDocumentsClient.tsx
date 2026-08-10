'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, FileText, Upload } from 'lucide-react'
import type {
  DataRoomDocument, DocumentCatalogEntry, DocumentDimension,
  DocumentAdminQuality,
} from '@/lib/dataRoom'
import {
  DIMENSION_LABELS, ADMIN_QUALITY_LABELS, ADMIN_QUALITY_COLORS,
  REQUIRED_LEVEL_LABELS,
} from '@/lib/dataRoom'

const DIMENSIONS: DocumentDimension[] = ['C', 'I', 'F', 'S', 'T']

interface Props {
  assetId:    string
  catalog:    DocumentCatalogEntry[]
  documents:  DataRoomDocument[]
}

export default function AdminDocumentsClient({ assetId: _assetId, catalog, documents }: Props) {
  const router = useRouter()
  const [_isPending, startTransition] = useTransition()
  const [openDims, setOpenDims] = useState<Set<DocumentDimension>>(new Set(DIMENSIONS))
  const [noteOpen, setNoteOpen] = useState<Record<string, boolean>>({})
  const [noteValues, setNoteValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  function toggleDim(dim: DocumentDimension) {
    setOpenDims((prev) => {
      const next = new Set(prev)
      if (next.has(dim)) { next.delete(dim) } else { next.add(dim) }
      return next
    })
  }

  async function patchDoc(docId: string, patch: Record<string, unknown>) {
    setSaving((s) => ({ ...s, [docId]: true }))
    await fetch(`/api/admin/documents/${docId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...patch }),
    })
    setSaving((s) => ({ ...s, [docId]: false }))
    startTransition(() => router.refresh())
  }

  async function saveNote(docId: string) {
    await patchDoc(docId, { admin_note: noteValues[docId] ?? '' })
    setNoteOpen((n) => ({ ...n, [docId]: false }))
  }

  return (
    <div className="space-y-4">
      {DIMENSIONS.map((dim) => {
        const dimCatalog = catalog.filter((c) => c.dimension === dim)
        const isOpen     = openDims.has(dim)

        return (
          <section key={dim} className="bg-white border border-gray-200">
            {/* Header dimension */}
            <button
              type="button"
              onClick={() => toggleDim(dim)}
              className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-[13px] text-gray-900">
                {DIMENSION_LABELS[dim]}
              </span>
              <span className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-gray-400">
                  {dimCatalog.length} documents catalogue
                </span>
                {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
              </span>
            </button>

            {isOpen && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {dimCatalog.map((entry) => {
                  const uploaded = documents.filter((d) => d.document_code === entry.code)
                  const hasDoc   = uploaded.length > 0
                  const quality  = hasDoc ? (uploaded[0].admin_quality ?? 'pending_review') : 'pending_review'

                  return (
                    <div key={entry.code} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4 flex-wrap">

                        {/* Infos document */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <span className={`shrink-0 mt-0.5 font-mono text-[9px] font-bold px-1.5 py-0.5 border ${
                            entry.required_level === 'blocking'
                              ? 'border-red-200 bg-red-50 text-red-600'
                              : entry.required_level === 'recommended'
                              ? 'border-amber-200 bg-amber-50 text-amber-700'
                              : 'border-gray-200 bg-gray-50 text-gray-500'
                          }`}>
                            {entry.code}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-gray-800">{entry.label_fr}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5">
                              {REQUIRED_LEVEL_LABELS[entry.required_level]}
                              {entry.format_hint && (
                                <> · <span className="italic">{entry.format_hint}</span></>
                              )}
                            </p>
                            {entry.note_admin && (
                              <p className="text-[10px] text-ag-navy/70 mt-1 bg-ag-navy/5 px-2 py-1 border-l-2 border-ag-navy/20">
                                {entry.note_admin}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Contrôles admin */}
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          {hasDoc && (
                            <div className="flex items-center gap-1.5">
                              <FileText size={11} className="text-gray-400" />
                              <span className="text-[10px] text-gray-500">{uploaded.length} fichier{uploaded.length > 1 ? 's' : ''}</span>
                            </div>
                          )}

                          {!hasDoc && (
                            <span className="text-[10px] font-mono text-gray-300 flex items-center gap-1">
                              <Upload size={10} /> Non déposé
                            </span>
                          )}

                          {hasDoc && (
                            <select
                              value={quality}
                              disabled={saving[uploaded[0].id]}
                              onChange={(e) => patchDoc(uploaded[0].id, { admin_quality: e.target.value })}
                              className={`text-[10px] font-semibold font-mono uppercase tracking-wider px-2 py-1 border cursor-pointer ${
                                ADMIN_QUALITY_COLORS[quality as DocumentAdminQuality]
                              }`}
                            >
                              {(Object.entries(ADMIN_QUALITY_LABELS) as [DocumentAdminQuality, string][]).map(([k, v]) => (
                                <option key={k} value={k}>{v}</option>
                              ))}
                            </select>
                          )}

                          {hasDoc && (
                            <button
                              type="button"
                              onClick={() => {
                                setNoteOpen((n) => ({ ...n, [uploaded[0].id]: !n[uploaded[0].id] }))
                                setNoteValues((n) => ({ ...n, [uploaded[0].id]: uploaded[0].admin_note ?? '' }))
                              }}
                              className="text-[10px] font-mono text-gray-400 hover:text-gray-700 border border-gray-200 px-2 py-1 hover:border-gray-400 transition-colors"
                            >
                              Note {uploaded[0].admin_note ? '✎' : '+'}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Zone note admin */}
                      {hasDoc && noteOpen[uploaded[0].id] && (
                        <div className="mt-3 pl-11">
                          <textarea
                            rows={3}
                            value={noteValues[uploaded[0].id] ?? ''}
                            onChange={(e) => setNoteValues((n) => ({ ...n, [uploaded[0].id]: e.target.value }))}
                            placeholder="Note interne admin — jamais visible du vendeur"
                            className="w-full text-[12px] border border-gray-200 px-3 py-2 resize-none focus:outline-none focus:border-ag-navy/40 text-gray-700 bg-ag-navy/[0.02]"
                          />
                          <div className="flex gap-2 mt-1.5">
                            <button
                              type="button"
                              onClick={() => saveNote(uploaded[0].id)}
                              disabled={saving[uploaded[0].id]}
                              className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 bg-ag-navy text-white hover:bg-ag-navy/90 transition-colors"
                            >
                              Enregistrer
                            </button>
                            <button
                              type="button"
                              onClick={() => setNoteOpen((n) => ({ ...n, [uploaded[0].id]: false }))}
                              className="font-mono text-[9px] uppercase tracking-wider px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-gray-400 transition-colors"
                            >
                              Annuler
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Fichiers déposés */}
                      {hasDoc && (
                        <div className="mt-2 pl-11 space-y-1">
                          {uploaded.map((doc) => (
                            <div key={doc.id} className="flex items-center gap-2 text-[11px] text-gray-500">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 shrink-0" />
                              <span className="truncate">{doc.file_name}</span>
                              <span className="shrink-0 text-gray-300">
                                {doc.uploaded_at ? new Date(doc.uploaded_at).toLocaleDateString('fr-CH') : ''}
                              </span>
                              {doc.blocks_grading && (
                                <span className="shrink-0 font-mono text-[9px] text-red-500 font-bold uppercase">BLOQUE</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}
