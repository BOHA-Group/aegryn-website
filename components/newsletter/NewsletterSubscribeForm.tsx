'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Props { locale: string }

type Status = 'idle' | 'loading' | 'success' | 'error'

export function NewsletterSubscribeForm({ locale }: Props) {
  const t = useTranslations('discover')
  const [email,        setEmail]        = useState('')
  const [isLoggedIn,   setIsLoggedIn]   = useState<boolean | null>(null)
  const [status,       setStatus]       = useState<Status>('idle')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: isLoggedIn ? undefined : email, locale }),
      })
      if (!res.ok) throw new Error('subscribe_failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-sans text-[13px] text-ag-apex-ink font-semibold shrink-0">
        {t('newsletterSuccess')}
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="shrink-0 flex items-center gap-3 flex-wrap">
      {isLoggedIn === false && (
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('newsletterEmailPlaceholder')}
          className="border border-ag-border bg-ag-white text-ag-black placeholder:text-ag-gray-light px-4 py-3 font-sans text-[13px] focus:outline-none focus:border-ag-black transition-colors w-56"
        />
      )}
      <button
        type="submit"
        disabled={status === 'loading' || isLoggedIn === null}
        className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors disabled:opacity-50"
      >
        {status === 'loading' ? t('newsletterSubscribing') : t('newsletterCta')}
        {status !== 'loading' && <ArrowUpRight size={12} />}
      </button>
      {status === 'error' && (
        <p className="w-full font-sans text-[12px] text-red-600">{t('newsletterError')}</p>
      )}
    </form>
  )
}
