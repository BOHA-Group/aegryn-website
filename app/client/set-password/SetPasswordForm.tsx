'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase }  from '@/lib/supabase'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function SetPasswordForm() {
  const router  = useRouter()
  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [show,      setShow]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [done,      setDone]      = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.')
      return
    }
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    const { error: err } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (err) {
      setError('Session expirée. Demandez un nouvel email d\'invitation.')
      return
    }

    setDone(true)
    setTimeout(() => router.push('/client/my-assets'), 3000)
  }

  if (done) {
    return (
      <div className="bg-white/5 border border-white/10 p-8 text-center">
        <CheckCircle2 size={32} className="text-ag-apex mx-auto mb-4" />
        <h2 className="font-sans font-semibold text-white text-[17px] mb-2">
          Compte activé
        </h2>
        <p className="font-sans text-[13px] text-white/50">
          Redirection vers votre espace dans 3 secondes…
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
          Choisir un mot de passe
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            className="w-full border border-white/15 bg-white/5 text-white placeholder:text-white/20 px-4 py-3.5 pr-12 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors"
          />
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 mb-2">
          Confirmer le mot de passe
        </label>
        <input
          type={show ? 'text' : 'password'}
          required
          autoComplete="new-password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="••••••••••••"
          className="w-full border border-white/15 bg-white/5 text-white placeholder:text-white/20 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors"
        />
      </div>

      {password.length > 0 && (
        <div className="flex gap-1">
          {[1,2,3,4].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                password.length >= i * 3
                  ? i <= 2 ? 'bg-red-500' : i === 3 ? 'bg-yellow-500' : 'bg-ag-apex'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 font-semibold hover:bg-ag-apex/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Activation...' : 'Activer mon compte'}
      </button>
    </form>
  )
}
