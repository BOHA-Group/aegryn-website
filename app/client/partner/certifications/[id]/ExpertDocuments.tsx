'use client'

import { useState } from 'react'
import { FileText, Eye, Lock } from 'lucide-react'
import { DataRoomViewer } from '@/components/DataRoomViewer'

export type ExpertDoc = { id: string; document_code: string | null; file_name: string; uploaded_at: string; admin_quality: string | null; is_sensitive: boolean }

const QUALITY: Record<string, string> = { sufficient: 'Vérifiée', pending_review: 'À vérifier', insufficient: 'Insuffisante', missing: 'Manquante' }

export default function ExpertDocuments({ docs, userName, userEmail, dimensionLabel }: { docs: ExpertDoc[]; userName: string; userEmail: string; dimensionLabel: string }) {
  const [open, setOpen] = useState<ExpertDoc | null>(null)

  return (
    <div className="bg-white border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between gap-3 mb-1">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Data Room : pièces de votre dimension</p>
        <span className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-gray-400"><Lock size={10} /> Lecture seule, filigranée, journalisée</span>
      </div>
      <p className="font-sans text-[12px] text-gray-500 mb-4">{dimensionLabel} et pièces transversales. Aucun téléchargement, aucune transmission par email.</p>

      {docs.length === 0 ? (
        <p className="font-sans text-[12px] text-gray-400 italic">Aucune pièce ouverte pour le moment. Aegryn vous notifie dès que des pièces sont disponibles.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {docs.map(d => (
            <div key={d.id} className="flex items-center justify-between gap-3 border border-gray-100 px-3 py-2.5">
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={14} className="text-gray-400 shrink-0" />
                <div className="min-w-0">
                  <p className="font-sans text-[12px] text-gray-800 truncate">{d.document_code ? <span className="font-mono text-[10px] text-ag-navy mr-2">{d.document_code}</span> : null}{d.file_name}</p>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">{QUALITY[d.admin_quality ?? 'pending_review']} · {new Date(d.uploaded_at).toLocaleDateString('fr-CH')}</p>
                </div>
              </div>
              <button onClick={() => setOpen(d)} className="rounded-lg shrink-0 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 hover:bg-ag-navy hover:text-white transition-colors">
                <Eye size={11} /> Consulter
              </button>
            </div>
          ))}
        </div>
      )}

      {open && <DataRoomViewer documentId={open.id} fileName={open.file_name} userName={userName} userEmail={userEmail} onClose={() => setOpen(null)} />}
    </div>
  )
}
