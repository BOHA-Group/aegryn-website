'use client'

import { useState }  from 'react'
import { supabase }  from '@/lib/supabase'
import Link          from 'next/link'
import { CheckCircle2, ArrowLeft } from 'lucide-react'

export default function AdminForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const base = process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${base}/admin/reset-password`,
    })

    setLoading(false)
    if (err) { setError('Adresse email introuvable.'); return }
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white border border-[#D9D2C2] p-8 text-center">
          <CheckCircle2 size={28} className="text-green-600 mx-auto mb-4" />
          <h2 className="font-bold text-[#0C0C0C] text-[17px] mb-2">Email envoyé</h2>
          <p className="text-[13px] text-gray-500">
            Lien de réinitialisation envoyé à <strong>{email}</strong>. Valable 1 heure.
          </p>
          <Link href="/admin/login" className="mt-6 inline-block text-[12px] text-gray-400 hover:text-gray-700">
            ← Retour à la connexion
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9C7A3C] mb-2">AEGRYN Admin</p>
          <h1 className="text-2xl font-bold text-[#0C0C0C]">Mot de passe oublié</h1>
        </div>

        <div className="bg-white border border-[#D9D2C2] p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
            )}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@aegryn.com"
                className="w-full border border-gray-200 bg-white text-gray-900 px-4 py-3 text-[14px] focus:outline-none focus:border-gray-600 transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0C0C0C] text-white text-[11px] font-bold uppercase tracking-[0.18em] px-6 py-4 hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
          </form>
        </div>

        <p className="text-center mt-4">
          <Link href="/admin/login" className="flex items-center justify-center gap-1 text-[12px] text-gray-400 hover:text-gray-700">
            <ArrowLeft size={11} />
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}
