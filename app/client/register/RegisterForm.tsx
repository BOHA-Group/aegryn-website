'use client'

import { useState }        from 'react'
import { useRouter }       from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase }        from '@/lib/supabase'
import { ArrowUpRight, Eye, EyeOff, CheckCircle, User, Users, Lock } from 'lucide-react'

/** Rôle principal sélectionné lors de l'inscription */
type PrimaryRole = 'client' | 'partner' | 'internal'

/** Sous-rôles optionnels pour un client */
type ClientSubRole = 'buyer' | 'seller'

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

  const [fullName,    setFullName]    = useState('')
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [primaryRole, setPrimaryRole] = useState<PrimaryRole>('client')
  const [subRoles,    setSubRoles]    = useState<Set<ClientSubRole>>(new Set())
  const [show,        setShow]        = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const [success,     setSuccess]     = useState(false)

  const strength = getPasswordStrength(password)

  function toggleSubRole(sr: ClientSubRole) {
    setSubRoles(prev => {
      const next = new Set(prev)
      next.has(sr) ? next.delete(sr) : next.add(sr)
      return next
    })
  }

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
      /* Construire le tableau de rôles à stocker :
         - client → ['client', ...subRoles]
         - partner / internal → tel quel
      */
      const roles: string[] =
        primaryRole === 'client'
          ? ['client', ...Array.from(subRoles)]
          : [primaryRole]

      const res = await fetch('/api/client/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          fullName,
          primaryRole,
          roles,
        }),
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

      /* Auto-login avec retry */
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1500))
        const result = await supabase.auth.signInWithPassword({ email, password })
        if (!result.error?.message?.toLowerCase().includes('database error')) break
      }

      setSuccess(true)

      setTimeout(() => {
        if (primaryRole === 'partner')  router.push('/client/partner/expert-profile')
        else if (primaryRole === 'internal') router.push('/client/internal')
        else                            router.push('/client/account')
      }, 2500)
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

  const primaryOptions: {
    value: PrimaryRole
    label: string
    desc: string
    icon: React.ReactNode
  }[] = [
    {
      value: 'client',
      label: 'Client',
      desc:  'Accès à votre espace général, publications, et optionnellement aux espaces Acquéreur et Cédant.',
      icon:  <User size={15} />,
    },
    {
      value: 'partner',
      label: 'Partenaire',
      desc:  "Accès à l'espace partenaire pour créer votre fiche expert.",
      icon:  <Users size={15} />,
    },
    {
      value: 'internal',
      label: 'Accès interne',
      desc:  'Réservé aux équipes Aegryn.',
      icon:  <Lock size={15} />,
    },
  ]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <p className="rounded-lg font-sans text-[12px] text-red-400 bg-red-900/20 border border-red-800/30 px-4 py-3">
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
          className="rounded-lg w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors [&:-webkit-autofill]:bg-ag-navy [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#050a1a] [&:-webkit-autofill]:text-[white] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
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
          className="rounded-lg w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors [&:-webkit-autofill]:bg-ag-navy [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#050a1a] [&:-webkit-autofill]:text-[white] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
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
            className="rounded-lg w-full border border-white/20 bg-white/5 text-white placeholder:text-white/35 px-4 py-3.5 pr-12 font-sans text-[14px] focus:outline-none focus:border-ag-apex transition-colors [&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_#050a1a] [&:-webkit-autofill]:[-webkit-text-fill-color:white]"
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

      {/* Indicateur force */}
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

      {/* Rôle principal */}
      <div>
        <label className="block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/55 mb-2">
          Type de compte
        </label>
        <div className="flex flex-col gap-2">
          {primaryOptions.map(({ value, label, desc, icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setPrimaryRole(value)}
              className={`flex items-start gap-3 px-4 py-3 border text-left transition-colors rounded-lg ${
                primaryRole === value
                  ? 'border-ag-apex bg-ag-apex/10 text-white'
                  : 'border-white/15 bg-white/5 text-white/50 hover:border-white/30 hover:text-white/80'
              }`}
            >
              <span className={`mt-0.5 shrink-0 ${primaryRole === value ? 'text-ag-apex' : 'text-white/30'}`}>
                {icon}
              </span>
              <span className="flex flex-col">
                <span className="font-sans font-semibold text-[13px]">{label}</span>
                <span className="font-sans text-[11px] text-white/35 mt-0.5">{desc}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Sous-rôles — uniquement si Client */}
      {primaryRole === 'client' && (
        <div className="border border-white/10 rounded-lg px-4 py-4 bg-white/3">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-white/40 mb-3">
            Espaces optionnels (activables plus tard)
          </p>
          <div className="flex flex-col gap-2">
            {([
              { value: 'buyer' as const,  label: 'Acquéreur',  desc: 'Accès au pipeline d\'acquisition et aux offres.' },
              { value: 'seller' as const, label: 'Cédant',     desc: 'Accès à la gestion de vos actifs et mandats de cession.' },
            ] as const).map(({ value, label, desc }) => {
              const active = subRoles.has(value)
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => toggleSubRole(value)}
                  className={`flex items-start gap-3 px-3 py-2.5 border text-left transition-colors rounded-lg ${
                    active
                      ? 'border-ag-apex/60 bg-ag-apex/8 text-white'
                      : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/60'
                  }`}
                >
                  {/* Toggle visuel */}
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                    active ? 'border-ag-apex bg-ag-apex' : 'border-white/20'
                  }`}>
                    {active && (
                      <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                        <path d="M1 3L3 5L7 1" stroke="#0a0f1e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-sans font-semibold text-[12px]">{label}</span>
                    <span className="font-sans text-[10px] text-white/30 mt-0.5">{desc}</span>
                  </span>
                </button>
              )
            })}
          </div>
          <p className="font-sans text-[10px] text-white/20 mt-3 leading-relaxed">
            Ces espaces seront accessibles mais grisés jusqu'à configuration. Vous pourrez les activer ou les ajouter plus tard depuis votre espace compte.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg w-full bg-white text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-4 font-semibold hover:bg-ag-apex hover:text-ag-navy transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? t('submitting') : t('submit')}
        {!loading && <ArrowUpRight size={13} />}
      </button>
    </form>
  )
}
