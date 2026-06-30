'use client'

import { useState }    from 'react'
import { supabase }    from '@/lib/supabase'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

export default function LoginForm() {
  const [email,   setEmail]   = useState('')
  const [sent,    setSent]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/client/my-assets`,
        shouldCreateUser: false, // Pas d'auto-inscription — invitation uniquement
      },
    })
    setLoading(false)
    if (err) {
      setError("Cet email n'est pas enregistré. L'accès est sur invitation uniquement.")
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="bg-white/5 border border-white/10 p-8 text-center">
        <CheckCircle2 size={32} className="text-ag-apex mx-auto mb-4" />
        <h2 className="font-sans font-semibold text-white text-[17px] mb-2">Lien envoyé</h2>
        <p className="font-sans text-[13px] text-white/50 leading-relaxed">
          Vérifiez votre boîte <span className="text-white/80">{email}</span>.<br />
          Cliquez sur le lien magique pour accéder à votre espace.
        </p>
        <p className="font-sans text-[11px] text-white/25 mt-4">
          Valable 1 heure. Pas reçu ? Vérifiez vos spams.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
          Adresse email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
          className="w-full border border-white/15 bg-white/5 text-white placeholder:text-white/20 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors"
        />
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-400 bg-red-900/20 border border-red-800/30 px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 font-semibold hover:bg-ag-apex/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'Envoi en cours...' : 'Recevoir mon lien de connexion'}
        {!loading && <ArrowUpRight size={13} />}
      </button>
    </form>
  )
}
