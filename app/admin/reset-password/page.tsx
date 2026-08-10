'use client'

import { useState, useEffect } from 'react'
import { useRouter }           from 'next/navigation'
import { supabase }            from '@/lib/supabase'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function AdminResetPasswordPage() {
  const router  = useRouter()
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [done,      setDone]      = useState(false)
  const [ready,     setReady]     = useState(false)
  const [linkError, setLinkError] = useState(false)

  /*
   * Le lien de réinitialisation Supabase peut arriver sous deux formes :
   *  1. PKCE (flow par défaut du projet) : ?code=... en query param
   *     -> nécessite un échange explicite via exchangeCodeForSession()
   *  2. Implicite (fallback) : #access_token=... en hash fragment
   *     -> détecté automatiquement par le SDK, qui émet PASSWORD_RECOVERY.
   * Sans le cas 1, le lien reçu par email reste bloqué indéfiniment sur
   * "Vérification du lien…" (même bug que /client/reset-password).
   */
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    const params  = new URLSearchParams(window.location.search)
    const code    = params.get('code')
    const errParam = params.get('error') ?? params.get('error_code')

    if (errParam) {
      setLinkError(true)
    } else if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error: exchangeErr }) => {
        if (exchangeErr) {
          setLinkError(true)
        } else {
          setReady(true)
        }
      })
    }

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('8 caractères minimum.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }

    setLoading(true)
    let err
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise(r => setTimeout(r, 1500))
      const result = await supabase.auth.updateUser({ password })
      err = result.error
      if (!err || !err.message?.toLowerCase().includes('database error')) break
    }
    setLoading(false)

    if (err) { setError('Lien expiré. Recommencez depuis /admin/forgot-password.'); return }
    setDone(true)
    setTimeout(() => router.push('/admin/login'), 3000)
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white border border-[#D9D2C2] p-8 text-center">
          <CheckCircle2 size={28} className="text-green-600 mx-auto mb-4" />
          <h2 className="font-bold text-[#0C0C0C] text-[17px] mb-2">Mot de passe mis à jour</h2>
          <p className="text-[13px] text-gray-500">Redirection dans 3 secondes…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F3EE] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#9C7A3C] mb-2">Aegryn Admin</p>
          <h1 className="text-2xl font-bold text-[#0C0C0C]">Nouveau mot de passe</h1>
        </div>

        <div className="bg-white border border-[#D9D2C2] p-8">
          {linkError ? (
            <div className="text-center py-6">
              <p className="text-[13px] text-red-600 mb-4">Lien expiré ou invalide. Demandez-en un nouveau.</p>
              <Link href="/admin/forgot-password" className="inline-block bg-[#0C0C0C] text-white text-[11px] font-bold uppercase tracking-[0.18em] px-6 py-3.5 hover:opacity-90">
                Demander un nouveau lien
              </Link>
            </div>
          ) : !ready ? (
            <p className="text-center text-[13px] text-gray-400 py-6">Vérification du lien…</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {error && (
                <p className="text-[12px] text-red-600 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
              )}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
                    className="w-full border border-gray-200 bg-white text-gray-900 px-4 py-3 pr-12 text-[14px] focus:outline-none focus:border-gray-600"
                  />
                  <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Confirmation</label>
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full border border-gray-200 bg-white text-gray-900 px-4 py-3 text-[14px] focus:outline-none focus:border-gray-600"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0C0C0C] text-white text-[11px] font-bold uppercase tracking-[0.18em] px-6 py-4 hover:opacity-90 disabled:opacity-50"
              >
                {loading ? 'Mise à jour...' : 'Enregistrer'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-4">
          <Link href="/admin/login" className="text-[12px] text-gray-400 hover:text-gray-700">
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  )
}
