'use client'

import { useState, useRef } from 'react'
import { Loader2, Upload, CheckCircle2 } from 'lucide-react'

type Props = {
  docType: string
  userId: string
}

export default function SellerKycUploadForm({ docType }: Props) {
  const fileRef  = useRef<HTMLInputElement>(null)
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)
  const [error,    setError]    = useState('')
  const [fileName, setFileName] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const file = fileRef.current?.files?.[0]
    if (!file) { setError('Veuillez sélectionner un fichier.'); return }
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

      const res = await fetch('/api/seller/kyc', { method: 'POST', body: form })
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
    <form onSubmit={handleSubmit} className="flex items-center gap-3">
      <input
        ref={fileRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        className="hidden"
        id={`seller-kyc-${docType}`}
        onChange={() => { const f = fileRef.current?.files?.[0]; if (f) setFileName(f.name) }}
      />
      <label htmlFor={`seller-kyc-${docType}`}
        className="flex items-center gap-2 cursor-pointer font-mono text-[10px] uppercase tracking-widest text-gray-500 hover:text-gray-800 border border-gray-300 hover:border-gray-500 px-4 py-2 transition-colors">
        <Upload size={11} />
        Choisir un fichier
      </label>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ag-black transition-colors disabled:opacity-50"
      >
        {loading && <Loader2 size={11} className="animate-spin" />}
        Envoyer
      </button>
      {fileName && (
        <p className="font-mono text-[10px] text-gray-400 truncate max-w-xs">&#8627; {fileName}</p>
      )}
      {error && <p className="font-sans text-[11px] text-red-500">{error}</p>}
    </form>
  )
}
