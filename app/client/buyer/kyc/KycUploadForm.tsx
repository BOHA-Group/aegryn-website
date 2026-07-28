'use client'

import { useState, useRef } from 'react'
import { Loader2, Upload, Camera, CheckCircle2 } from 'lucide-react'

type Props = {
  docType: string
  userId: string
}

export default function KycUploadForm({ docType }: Props) {
  const fileRef   = useRef<HTMLInputElement>(null)
  const cameraRef = useRef<HTMLInputElement>(null)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')
  const [fileName, setFileName] = useState('')

  function onFileChange(ref: React.RefObject<HTMLInputElement | null>) {
    const f = ref.current?.files?.[0]
    if (f) setFileName(f.name)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const file = fileRef.current?.files?.[0] ?? cameraRef.current?.files?.[0]
    if (!file) { setError('Veuillez sélectionner un fichier ou prendre une photo.'); return }
    if (file.size > 10 * 1024 * 1024) { setError('Fichier trop volumineux (max 10 Mo).'); return }

    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Format non supporté. Formats acceptés : PDF, JPG, PNG.')
      return
    }

    setLoading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('doc_type', docType)

      const res = await fetch('/api/buyer/kyc', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de l\'envoi.')
      setSuccess(true)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-emerald-600">
        <CheckCircle2 size={14} />
        <span className="font-sans text-[12px]">Document envoyé, en attente de validation.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Fichier local */}
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          id={`kyc-file-${docType}`}
          onChange={() => { if (cameraRef.current) cameraRef.current.value = ''; onFileChange(fileRef) }}
        />
        <label htmlFor={`kyc-file-${docType}`}
          className="flex items-center gap-2 cursor-pointer font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-800 border border-gray-300 hover:border-gray-500 px-4 py-2 transition-colors">
          <Upload size={11} />
          Fichier
        </label>

        {/* Photo caméra (mobile) */}
        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          id={`kyc-camera-${docType}`}
          onChange={() => { if (fileRef.current) fileRef.current.value = ''; onFileChange(cameraRef) }}
        />
        <label htmlFor={`kyc-camera-${docType}`}
          className="flex items-center gap-2 cursor-pointer font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-800 border border-gray-300 hover:border-gray-500 px-4 py-2 transition-colors">
          <Camera size={11} />
          Photo
        </label>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ag-black transition-colors disabled:opacity-50"
        >
          {loading && <Loader2 size={11} className="animate-spin" />}
          Envoyer
        </button>
      </div>

      {fileName && (
        <p className="font-mono text-[10px] text-gray-400 truncate max-w-xs">↳ {fileName}</p>
      )}
      {error && (
        <p className="font-sans text-[11px] text-red-500">{error}</p>
      )}
    </form>
  )
}
