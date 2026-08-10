'use client'

import { useState }          from 'react'
import { useRouter }         from 'next/navigation'
import { supabase }          from '@/lib/supabase'
import { Eye, EyeOff, LogIn } from 'lucide-react'

export default function AdminLoginForm({ errorParam }: { errorParam?: string }) {
  const router   = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(
    errorParam === 'not_admin' ? 'Ce compte n\'a pas les droits administrateur.' : ''
  )

  /* Étape MFA (double authentification) */
  const [mfaStep,     setMfaStep]     = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState('')
  const [mfaCode,     setMfaCode]     = useState('')

  async function finishLogin() {
    router.push('/admin/auction')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    let data, signInErr
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1500))
      const result = await supabase.auth.signInWithPassword({ email, password })
      data = result.data
      signInErr = result.error
      if (!signInErr || !signInErr.message?.toLowerCase().includes('database error')) break
    }

    if (signInErr || !data?.user) {
      setLoading(false)
      setError('Identifiant ou mot de passe incorrect.')
      return
    }

    /* Vérifier le rôle côté client (double check serveur via requireAdmin dans les pages) */
    const role = data.user.app_metadata?.role
    if (role !== 'admin') {
      await supabase.auth.signOut()
      setLoading(false)
      setError('Ce compte n\'a pas les droits administrateur.')
      return
    }

    /* Vérifie si le compte a activé la double authentification (TOTP) et si
       la session actuelle n'a pas encore atteint le niveau AAL2 requis. */
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal && aal.nextLevel === 'aal2' && aal.currentLevel !== aal.nextLevel) {
      const { data: factorsData } = await supabase.auth.mfa.listFactors()
      const factor = factorsData?.totp?.find(f => f.status === 'verified')
      if (factor) {
        setMfaFactorId(factor.id)
        setMfaStep(true)
        setLoading(false)
        return
      }
    }

    setLoading(false)
    await finishLogin()
  }

  async function handleMfaSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (mfaCode.length !== 6) return
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.mfa.challengeAndVerify({
      factorId: mfaFactorId,
      code:     mfaCode,
    })
    if (err) {
      setLoading(false)
      setError('Code invalide.')
      return
    }
    setLoading(false)
    await finishLogin()
  }

  if (mfaStep) {
    return (
      <form onSubmit={handleMfaSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
            Code de double authentification
          </label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            autoFocus
            required
            value={mfaCode}
            onChange={e => setMfaCode(e.target.value.replace(/\D/g, ''))}
            placeholder="123456"
            className="w-full border border-gray-200 bg-white text-gray-900 px-4 py-3 text-[16px] text-center tracking-widest font-mono focus:outline-none focus:border-gray-600 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading || mfaCode.length !== 6}
          className="w-full bg-[#0C0C0C] text-white text-[11px] font-bold uppercase tracking-[0.18em] px-6 py-4 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Vérification...' : 'Vérifier'}
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3">
          {error}
        </div>
      )}

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
          Email
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="admin@boha-group.com"
          className="w-full border border-gray-200 bg-white text-gray-900 placeholder:text-gray-300 px-4 py-3 text-[14px] focus:outline-none focus:border-gray-600 transition-colors"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">
          Mot de passe
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full border border-gray-200 bg-white text-gray-900 px-4 py-3 pr-12 text-[14px] focus:outline-none focus:border-gray-600 transition-colors"
          />
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0C0C0C] text-white text-[11px] font-bold uppercase tracking-[0.18em] px-6 py-4 hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? 'Connexion...' : (
          <>
            <LogIn size={13} />
            Accéder au tableau de bord
          </>
        )}
      </button>
    </form>
  )
}
