'use client'

import { useState }          from 'react'
import { useRouter }         from 'next/navigation'
import { useTranslations }   from 'next-intl'
import { supabase }          from '@/lib/supabase'
import { ArrowUpRight, Eye, EyeOff } from 'lucide-react'

export default function LoginForm() {
  const t        = useTranslations('clientArea.login')
  const router   = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [show,     setShow]     = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let err
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1500))
        const result = await supabase.auth.signInWithPassword({ email, password })
        err = result.error
        if (!err || !err.message?.toLowerCase().includes('database error')) break
      }

      if (err) {
        setError(t('errorInvalid'))
        return
      }

      // Récupérer les rôles via l'API pour rediriger vers le bon espace
      try {
        const res = await fetch('/api/client/me/roles')
        if (res.ok) {
          const { roles } = await res.json() as { roles: string[] }
          if (roles.includes('admin') || roles.includes('super_admin')) {
            router.push('/admin')
          } else if (roles.includes('partner')) {
            router.push('/client/partner')
          } else if (roles.includes('seller') && !roles.includes('buyer')) {
            router.push('/client/seller')
          } else {
            router.push('/client/buyer')
          }
        } else {
          router.push('/client/buyer')
        }
      } catch {
        router.push('/client/my-assets')
      }
    } catch {
      setError(t('errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="font-sans text-[12px] text-red-400 bg-red-900/20 border border-red-800/30 px-4 py-3">
          {error}
        </p>
      )}

      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/55 mb-2">
          {t('emailLabel')}
        </label>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={t('emailPlaceholder')}
          className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#050a1a] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
        />
      </div>

      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/55 mb-2">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            required
            autoComplete="current-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 pr-12 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#050a1a] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
          />
          <button
            type="button"
            onClick={() => setShow(v => !v)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 font-semibold hover:bg-ag-apex hover:text-ag-navy transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? t('submitting') : t('submit')}
        {!loading && <ArrowUpRight size={13} />}
      </button>
    </form>
  )
}
