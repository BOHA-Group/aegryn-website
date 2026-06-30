'use client'

import { useState }    from 'react'
import { supabase }    from '@/lib/supabase'
import { CheckCircle2, ArrowLeft } from 'lucide-react'
import Link            from 'next/link'

export default function ForgotPasswordForm() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/client/reset-password`,
    })

    setLoading(false)

    if (err) {
      setError('Une erreur est survenue. Vérifiez l\'adresse email.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <div className="bg-white/5 border border-white/10 p-8 text-center">
        <CheckCircle2 size={32} className="text-ag-apex mx-auto mb-4" />
        <h2 className="font-sans font-semibold text-white text-[17px] mb-2">Email envoyé</h2>
        <p className="font-sans text-[13px] text-white/50 leading-relaxed">
          Un lien de réinitialisation a été envoyé à{' '}
          <span className="text-white/80">{email}</span>.<br />
          Valable 1 heure.
        </p>
        <p className="font-sans text-[11px] text-white/25 mt-4">
          Pas reçu ? Vérifiez vos spams ou contactez contact@aegryn.com
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="font-sans text-[12px] text-red-400 bg-red-900/20 border border-red-800/30 px-4 py-3">
          {error}
        </p>
      )}

      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
          Adresse email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="w-full border border-white/15 bg-white/5 text-white placeholder:text-white/20 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 font-semibold hover:bg-ag-apex/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
      </button>

      <Link
        href="/client/login"
        className="flex items-center justify-center gap-1.5 font-sans text-[12px] text-white/30 hover:text-white/60 transition-colors"
      >
        <ArrowLeft size={11} />
        Retour à la connexion
      </Link>
    </form>
  )
}
