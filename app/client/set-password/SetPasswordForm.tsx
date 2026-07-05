'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { supabase }  from '@/lib/supabase'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function SetPasswordForm() {
  const t       = useTranslations('clientArea.setPassword')
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
      setError(t('errorTooShort'))
      return
    }
    if (password !== confirm) {
      setError(t('errorMismatch'))
      return
    }

    setLoading(true)

    try {
      let err
      for (let attempt = 0; attempt < 3; attempt++) {
        if (attempt > 0) await new Promise(r => setTimeout(r, 1500))
        const result = await supabase.auth.updateUser({ password })
        err = result.error
        if (!err || !err.message?.toLowerCase().includes('database error')) break
      }

      if (err) {
        setError(t('errorExpired'))
        return
      }

      setDone(true)
      setTimeout(() => router.push('/client/my-assets'), 3000)
    } catch {
      setError(t('errorNetwork'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="bg-white/5 border border-white/10 p-8 text-center">
        <CheckCircle2 size={32} className="text-ag-apex mx-auto mb-4" />
        <h2 className="font-sans font-semibold text-white text-[17px] mb-2">
          {t('doneTitle')}
        </h2>
        <p className="font-sans text-[13px] text-white/50">
          {t('doneDesc')}
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
          {t('chooseLabel')}
        </label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            required
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder={t('passwordPlaceholder')}
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
          {t('confirmLabel')}
        </label>
        <input
          type={show ? 'text' : 'password'}
          required
          autoComplete="new-password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder={t('confirmPlaceholder')}
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
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}
