'use client'

import { useState } from 'react'
import { FileText, Eye, Loader2, ShieldAlert } from 'lucide-react'

type Doc = {
  id:            string
  file_name:     string
  document_type: string
  category:      string
  is_sensitive:  boolean
  uploaded_at:   string
}

const CATEGORY_LABELS: Record<string, string> = {
  code:        'C — Code & Architecture',
  ip:          'I — IP & Droits',
  finance:     'F — Finance',
  security:    'S — Sécurité',
  transversal: 'T — Transversal',
}

export default function LightDocumentViewer({ documents }: { documents: Doc[] }) {
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [error,   setError]   = useState<Record<string, string>>({})

  async function openDocument(docId: string) {
    setLoading(p => ({ ...p, [docId]: true }))
    setError(p => ({ ...p, [docId]: '' }))
    try {
      const res  = await fetch('/api/data-room/signed-url', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ documentId: docId }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(p => ({ ...p, [docId]: json.error ?? 'Erreur accès document.' }))
        return
      }
      window.open(json.url, '_blank', 'noopener,noreferrer')
    } catch {
      setError(p => ({ ...p, [docId]: 'Erreur réseau.' }))
    } finally {
      setLoading(p => ({ ...p, [docId]: false }))
    }
  }

  /* Grouper par catégorie */
  const grouped = documents.reduce<Record<string, Doc[]>>((acc, doc) => {
    acc[doc.category] = acc[doc.category] ?? []
    acc[doc.category].push(doc)
    return acc
  }, {})

  return (
    <div className="space-y-4">
      {/* Disclaimer sécurité */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 px-4 py-3">
        <ShieldAlert size={13} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="font-sans text-[11px] text-amber-800 leading-relaxed">
          Ces documents sont confidentiels et soumis au NDA Aegryn. Toute consultation est journalisée.
          Reproduction ou diffusion interdite sous peine de poursuites.
        </p>
      </div>

      {Object.entries(grouped).map(([category, docs]) => (
        <div key={category}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">
            {CATEGORY_LABELS[category] ?? category}
          </p>
          <div className="divide-y divide-gray-100 border border-gray-100">
            {docs.map(doc => (
              <div
                key={doc.id}
                className="flex items-center justify-between gap-4 px-4 py-3 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText size={13} className="text-gray-300 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-sans text-[12px] text-gray-800 truncate">{doc.file_name}</p>
                    <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                      {doc.document_type}
                      {doc.is_sensitive && (
                        <span className="ml-2 text-amber-500">● Sensible</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {error[doc.id] && (
                    <span className="font-sans text-[10px] text-red-500">{error[doc.id]}</span>
                  )}
                  <button
                    type="button"
                    disabled={loading[doc.id]}
                    onClick={() => openDocument(doc.id)}
                    className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest border border-gray-200 px-3 py-1.5 text-gray-600 hover:border-ag-navy hover:text-ag-navy transition-colors disabled:opacity-40"
                  >
                    {loading[doc.id]
                      ? <Loader2 size={10} className="animate-spin" />
                      : <Eye size={10} />}
                    Consulter
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
