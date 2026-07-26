'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { DataRoomCategory } from '@/lib/dataRoom'
import { Upload, Loader2 } from 'lucide-react'

interface Props {
  assetId: string
  category: DataRoomCategory
  requiredTypes: { type: string; label: string; sensitive: boolean }[]
}

export function DataRoomUploadForm({ assetId, category, requiredTypes }: Props) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.append('assetId', assetId)
    fd.append('category', category)

    startTransition(async () => {
      const res = await fetch('/api/data-room/upload', { method: 'POST', body: fd })
      const data = await res.json() as { error?: string }
      if (!res.ok || data.error) {
        setError(data.error ?? 'Erreur lors de l\'upload.')
        return
      }
      setSuccess(true)
      form.reset()
      if (fileRef.current) fileRef.current.value = ''
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-400 mb-2">
        Ajouter un document
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Type de document */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">
            Type de document
          </label>
          <select
            name="document_type"
            required
            className="w-full border border-gray-200 text-[12px] text-gray-800 px-3 py-2 bg-white focus:outline-none focus:border-gray-400"
          >
            <option value="">Sélectionner…</option>
            {requiredTypes.map((req) => (
              <option key={req.type} value={req.type}>
                {req.label}
              </option>
            ))}
            <option value="other">Autre</option>
          </select>
        </div>

        {/* Fichier */}
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">
            Fichier (PDF, DOCX, XLSX, PNG — max 20 Mo)
          </label>
          <input
            ref={fileRef}
            type="file"
            name="file"
            required
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.zip"
            className="w-full border border-gray-200 text-[11px] text-gray-600 px-3 py-1.5 bg-white file:mr-3 file:py-1 file:px-3 file:border-0 file:text-[10px] file:font-semibold file:bg-gray-100 file:text-gray-700 file:uppercase file:tracking-wide"
          />
        </div>
      </div>

      {/* Notes optionnelles */}
      <div>
        <label className="block text-[10px] font-semibold text-gray-500 mb-1.5">
          Note (optionnelle)
        </label>
        <input
          type="text"
          name="notes"
          placeholder="Ex: Exercice 2024 certifié par cabinet X…"
          maxLength={200}
          className="w-full border border-gray-200 text-[12px] text-gray-800 px-3 py-2 placeholder-gray-300 focus:outline-none focus:border-gray-400"
        />
      </div>

      {/* Marquer sensible */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          name="is_sensitive"
          value="true"
          className="w-3.5 h-3.5 accent-amber-600"
        />
        <span className="text-[11px] text-gray-600">
          Document sensible <span className="text-amber-600">(watermark renforcé)</span>
        </span>
      </label>

      {error && (
        <p className="text-[11px] text-red-600 font-medium">{error}</p>
      )}
      {success && (
        <p className="text-[11px] text-emerald-600 font-medium">Document uploadé avec succès.</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] bg-gray-900 text-white px-5 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-60"
      >
        {isPending ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
        {isPending ? 'Upload en cours…' : 'Uploader'}
      </button>
    </form>
  )
}
