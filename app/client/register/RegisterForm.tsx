'use client'

import { useState }        from 'react'
import { useRouter }       from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase }        from '@/lib/supabase'
import { ArrowUpRight, Eye, EyeOff, CheckCircle } from 'lucide-react'

type Role = 'buyer' | 'seller' | 'partner'

export default function RegisterForm() {
  const t      = useTranslations('clientArea.register')
  const router = useRouter()

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [role,      setRole]      = useState<Role>('buyer')
  const [show,      setShow]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 8) {
      setError(t('errorTooShort'))
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role }),
      })

      const json = await res.json() as { error?: string; ok?: boolean }

      if (!res.ok) {
        if (json.error === 'EMAIL_EXISTS') {
          setError(t('errorEmailExists'))
        } else {
          setError(t('errorGeneric'))
        }
        return
      }

      await supabase.auth.signInWithPassword({ email, password })
      setSuccess(true)

      setTimeout(() => {
        if (role === 'buyer')   router.push('/client/buyer')
        else if (role === 'seller')  router.push('/client/seller')
        else if (role === 'partner') router.push('/client/partner')
        else                         router.push('/client/my-assets')
      }, 3000)
    } catch {
      setError(t('errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle size={40} className="text-ag-apex" />
        <p className="font-sans font-bold text-white text-[18px]">{t('successTitle')}</p>
        <p className="font-sans text-[13px] text-white/50">{t('successDesc')}</p>
      </div>
    )
  }

  const roles: { value: Role; label: string }[] = [
    { value: 'buyer',   label: t('roleBuyer') },
    { value: 'seller',  label: t('roleSeller') },
    { value: 'partner', label: t('rolePartner') },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="font-sans text-[12px] text-red-400 bg-red-900/20 border border-red-800/30 px-4 py-3">
          {error}
        </p>
      )}

      {/* Nom */}
      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/55 mb-2">
          {t('fullNameLabel')}
        </label>
        <input
          type="text"
          required
          autoComplete="name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          placeholder={t('fullNamePlaceholder')}
          className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors"
        />
      </div>

      {/* Email */}
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
          className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors"
        />
      </div>

      {/* Mot de passe */}
      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/55 mb-2">
          {t('passwordLabel')}
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
            className="w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 pr-12 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors"
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

      {/* Rôle */}
      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/55 mb-2">
          {t('roleLabel')}
        </label>
        <div className="flex flex-col gap-2">
          {roles.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-3 px-4 py-3 border cursor-pointer transition-colors ${
                role === value
                  ? 'border-ag-apex bg-ag-apex/10 text-white'
                  : 'border-white/15 bg-white/5 text-white/50 hover:border-white/30 hover:text-white/80'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={value}
                checked={role === value}
                onChange={() => setRole(value)}
                className="sr-only"
              />
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 transition-colors ${
                  role === value ? 'border-ag-apex bg-ag-apex' : 'border-white/30'
                }`}
              />
              <span className="font-sans text-[13px]">{label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 font-semibold hover:bg-ag-apex/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? t('submitting') : t('submit')}
        {!loading && <ArrowUpRight size={13} />}
      </button>
    </form>
  )
}
