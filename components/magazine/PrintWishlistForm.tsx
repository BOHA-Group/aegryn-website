'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  firstNamePlaceholder:  string
  lastNamePlaceholder:   string
  emailPlaceholder:      string
  companyPlaceholder:    string
  addressLabel:          string
  addressPlaceholder:    string
  cityPlaceholder:       string
  postalCodePlaceholder: string
  countryPlaceholder:    string
  interestsLabel:        string
  interests:             { key: string; label: string; desc?: string }[]
  cta:                   string
  successMsg:            string
  errorMsg:              string
  clientNote:            string
}

const INPUT = 'w-full bg-magazine-white border border-magazine-black/20 rounded-lg text-magazine-black text-sm px-4 py-3 outline-none focus:border-magazine-black/60 focus:ring-2 focus:ring-magazine-black/8 transition-colors placeholder:text-magazine-black/30'

export function PrintWishlistForm({
  firstNamePlaceholder,
  lastNamePlaceholder,
  emailPlaceholder,
  companyPlaceholder,
  addressLabel,
  addressPlaceholder,
  cityPlaceholder,
  postalCodePlaceholder,
  countryPlaceholder,
  interestsLabel,
  interests,
  cta,
  successMsg,
  errorMsg,
  clientNote,
}: Props) {
  const [firstName,   setFirstName]   = useState('')
  const [lastName,    setLastName]    = useState('')
  const [email,       setEmail]       = useState('')
  const [company,     setCompany]     = useState('')
  const [address,     setAddress]     = useState('')
  const [city,        setCity]        = useState('')
  const [postalCode,  setPostalCode]  = useState('')
  const [country,     setCountry]     = useState('')
  const [selected,    setSelected]    = useState<string[]>([])
  const [status,      setStatus]      = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  function toggleInterest(key: string) {
    setSelected(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !firstName || !lastName) return
    setStatus('loading')
    try {
      const res = await fetch('/api/magazine/print-wishlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          first_name: firstName,
          last_name:  lastName,
          email,
          company,
          address,
          city,
          postal_code: postalCode,
          country,
          interests:   selected,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setFirstName(''); setLastName(''); setEmail(''); setCompany('')
      setAddress(''); setCity(''); setPostalCode(''); setCountry('')
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
      {/* Identité */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
          placeholder={firstNamePlaceholder} required className={INPUT} />
        <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
          placeholder={lastNamePlaceholder} required className={INPUT} />
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder={emailPlaceholder} required className={INPUT} />
        <input type="text" value={company} onChange={e => setCompany(e.target.value)}
          placeholder={companyPlaceholder} className={INPUT} />
      </div>

      {/* Adresse postale */}
      <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-magazine-black/40 mt-2">{addressLabel}</p>
      <input type="text" value={address} onChange={e => setAddress(e.target.value)}
        placeholder={addressPlaceholder} className={INPUT} />
      <div className="flex flex-col sm:flex-row gap-4">
        <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)}
          placeholder={postalCodePlaceholder} className={INPUT} style={{maxWidth:'10rem'}} />
        <input type="text" value={city} onChange={e => setCity(e.target.value)}
          placeholder={cityPlaceholder} className={INPUT} />
      </div>
      <input type="text" value={country} onChange={e => setCountry(e.target.value)}
        placeholder={countryPlaceholder} className={INPUT} />

      <div className="mt-2">
        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-magazine-black/40 mb-3">
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
          className="inline-flex items-center gap-2 bg-magazine-black text-magazine-white font-sans font-semibold text-[11px] uppercase tracking-[0.12em] px-6 py-3 rounded-lg hover:bg-magazine-black/80 transition-colors disabled:opacity-50"
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
