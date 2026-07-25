'use client'

import { useState }        from 'react'
import { useRouter }       from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase }        from '@/lib/supabase'
import { ArrowUpRight, Eye, EyeOff, CheckCircle } from 'lucide-react'

type Role = 'buyer' | 'seller'

function getPasswordStrength(pwd: string): { score: number; rules: boolean[] } {
  const rules = [
    pwd.length >= 8,
    /[A-Z]/.test(pwd),
    /[a-z]/.test(pwd),
    /[0-9]/.test(pwd),
    /[^A-Za-z0-9]/.test(pwd),
  ]
  return { score: rules.filter(Boolean).length, rules }
}

export default function RegisterForm() {
  const t      = useTranslations('clientArea.register')
  const router = useRouter()

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [role,      setRole]      = useState<Role | null>(null)
  const [show,      setShow]      = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  const strength = getPasswordStrength(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password.length < 8) {
      setError(t('errorTooShort'))
      setLoading(false)
      return
    }
    if (strength.score < 3) {
      setError(t('errorStrength'))
      setLoading(false)
      return
    }

    try {
      const effectiveRole: Role = role ?? 'buyer'
      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName, role: effectiveRole }),
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

      /* Auto-login avec retry sur database error (GoTrue instabilité transitoire) */
      let loginErr
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1500))
        const result = await supabase.auth.signInWithPassword({ email, password })
        loginErr = result.error
        if (!loginErr || !loginErr.message?.toLowerCase().includes('database error')) break
      }

      setSuccess(true)

      setTimeout(() => {
        if (effectiveRole === 'seller') router.push('/client/seller')
        else                            router.push('/client/buyer')
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

  const roleOptions: { value: Role; label: string; desc: string }[] = [
    { value: 'buyer',  label: t('roleBuyer'),  desc: t('roleBuyerDesc')  },
    { value: 'seller', label: t('roleSeller'), desc: t('roleSellerDesc') },
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

      {/* Indicateur de force mot de passe */}
      {password.length > 0 && (
        <div className="flex gap-1 -mt-2">
          {[1,2,3,4,5].map(i => (
            <div
              key={i}
              className={`h-1 flex-1 transition-colors ${
                strength.score >= i
                  ? strength.score <= 2 ? 'bg-red-500' : strength.score <= 3 ? 'bg-yellow-500' : 'bg-ag-apex'
                  : 'bg-white/10'
              }`}
            />
          ))}
        </div>
      )}

      {/* Rôle — optionnel, buyer par défaut */}
      <div>
        <div className="flex items-baseline justify-between mb-2">
          <label className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/55">
            {t('roleLabel')}
          </label>
          <span className="font-sans text-[10px] text-white/25">{t('roleOptional')}</span>
        </div>
        <div className="flex flex-col gap-2">
          {roleOptions.map(({ value, label, desc }) => (
            <label
              key={value}
              className={`flex items-start gap-3 px-4 py-3 border cursor-pointer transition-colors ${
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
                onChange={() => setRole(v => v === value ? null : value)}
                className="sr-only"
              />
              <span
                className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 transition-colors ${
                  role === value ? 'border-ag-apex bg-ag-apex' : 'border-white/30'
                }`}
              />
              <span className="flex flex-col">
                <span className="font-sans font-semibold text-[13px]">{label}</span>
                <span className="font-sans text-[11px] text-white/35 mt-0.5">{desc}</span>
              </span>
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
