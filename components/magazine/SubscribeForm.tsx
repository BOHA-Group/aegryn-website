'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  placeholder: string
  cta:         string
  successMsg:  string
  errorMsg:    string
}

export function SubscribeForm({ placeholder, cta, successMsg, errorMsg }: Props) {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/intelligence/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-body-mag text-magazine-accent font-semibold">{successMsg}</p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 bg-magazine-white border border-magazine-black/20 text-magazine-black text-body-mag px-6 py-4 outline-none focus:border-magazine-black/60 transition-colors placeholder:text-magazine-black/30"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="inline-flex items-center gap-2 bg-magazine-black text-magazine-white font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-8 py-4 hover:bg-magazine-black/80 transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === 'loading' ? '…' : <>{cta} <ArrowUpRight size={13} /></>}
      </button>
      {status === 'error' && (
        <p className="text-label-mag text-red-500 mt-3 sm:mt-0 sm:ml-3 self-center">{errorMsg}</p>
      )}
    </form>
  )
}
