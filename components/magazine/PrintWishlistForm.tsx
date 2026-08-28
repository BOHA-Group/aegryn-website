'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  namePlaceholder:    string
  emailPlaceholder:   string
  companyPlaceholder: string
  interestsLabel:     string
  interests:          { key: string; label: string; desc?: string }[]
  cta:                string
  successMsg:         string
  errorMsg:           string
  clientNote:         string
}

export function PrintWishlistForm({
  namePlaceholder,
  emailPlaceholder,
  companyPlaceholder,
  interestsLabel,
  interests,
  cta,
  successMsg,
  errorMsg,
  clientNote,
}: Props) {
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [company,  setCompany]  = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [status,   setStatus]   = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function toggleInterest(key: string) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !name) return
    setStatus('loading')
    try {
      const res = await fetch('/api/magazine/print-wishlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name, email, company, interests: selected }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setName('')
      setEmail('')
      setCompany('')
      setSelected([])
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder={namePlaceholder}
          required
          className="flex-1 bg-magazine-white border border-magazine-black/20 text-magazine-black text-body-mag px-6 py-4 outline-none focus:border-magazine-black/60 transition-colors placeholder:text-magazine-black/30"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder={emailPlaceholder}
          required
          className="flex-1 bg-magazine-white border border-magazine-black/20 text-magazine-black text-body-mag px-6 py-4 outline-none focus:border-magazine-black/60 transition-colors placeholder:text-magazine-black/30"
        />
      </div>
      <input
        type="text"
        value={company}
        onChange={e => setCompany(e.target.value)}
        placeholder={companyPlaceholder}
        className="bg-magazine-white border border-magazine-black/20 text-magazine-black text-body-mag px-6 py-4 outline-none focus:border-magazine-black/60 transition-colors placeholder:text-magazine-black/30"
      />

      <div className="mt-2">
        <p className="text-label-mag text-magazine-black/60 uppercase tracking-[0.12em] mb-3">
          {interestsLabel}
        </p>
        <div className="flex flex-wrap gap-2">
          {interests.map(({ key, label, desc }) => (
            <div key={key} className="relative group/interest">
              <button
                type="button"
                onClick={() => toggleInterest(key)}
                className={`text-label-mag font-sans font-semibold uppercase tracking-[0.1em] px-4 py-2 border transition-colors ${
                  selected.includes(key)
                    ? 'bg-magazine-black text-magazine-white border-magazine-black'
                    : 'bg-transparent text-magazine-black/60 border-magazine-black/20 hover:border-magazine-black/50'
                }`}
              >
                {label}
              </button>
              {desc && (
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap bg-magazine-black text-magazine-white font-sans text-[10px] font-normal normal-case tracking-normal px-3 py-1.5 opacity-0 group-hover/interest:opacity-100 transition-opacity duration-150">
                  {desc}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <p className="text-label-mag text-magazine-black/40 leading-relaxed mt-1">
        {clientNote}
      </p>

      <div className="flex items-center gap-4 mt-2">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center gap-2 bg-magazine-black text-magazine-white font-sans font-semibold text-label-mag uppercase tracking-[0.12em] px-8 py-4 hover:bg-magazine-black/80 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? '…' : <>{cta} <ArrowUpRight size={13} /></>}
        </button>
        {status === 'error' && (
          <p className="text-label-mag text-red-500">{errorMsg}</p>
        )}
      </div>
    </form>
  )
}
