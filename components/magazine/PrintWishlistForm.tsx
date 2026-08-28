'use client'

import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

interface Props {
  /* Labels */
  civilityLabel:         string
  civilityM:             string
  civilityMme:           string
  firstNamePlaceholder:  string
  lastNamePlaceholder:   string
  emailPlaceholder:      string
  phonePlaceholder:      string
  companyPlaceholder:    string
  addressLabel:          string
  addressPlaceholder:    string
  postalCodePlaceholder: string
  cityPlaceholder:       string
  countryPlaceholder:    string
  interestsLabel:        string
  interests:             { key: string; label: string; desc?: string }[]
  rgpdLabel:             string
  legalNotice:           string
  cta:                   string
  successMsg:            string
  errorMsg:              string
  clientNote:            string
}

const INPUT = 'w-full bg-white border border-magazine-black/20 rounded-md text-magazine-black text-sm px-4 py-2.5 outline-none focus:border-magazine-black/60 focus:ring-2 focus:ring-magazine-black/5 transition-colors placeholder:text-magazine-black/30'
const LABEL = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.18em] text-magazine-black/50 mb-1.5'

export function PrintWishlistForm({
  civilityLabel, civilityM, civilityMme,
  firstNamePlaceholder, lastNamePlaceholder,
  emailPlaceholder, phonePlaceholder, companyPlaceholder,
  addressLabel, addressPlaceholder, postalCodePlaceholder, cityPlaceholder, countryPlaceholder,
  interestsLabel, interests,
  rgpdLabel, legalNotice,
  cta, successMsg, errorMsg, clientNote,
}: Props) {
  const [civility,    setCivility]    = useState<'M'|'Mme'|''>('')
  const [firstName,   setFirstName]   = useState('')
  const [lastName,    setLastName]    = useState('')
  const [email,       setEmail]       = useState('')
  const [phone,       setPhone]       = useState('')
  const [company,     setCompany]     = useState('')
  const [address,     setAddress]     = useState('')
  const [postalCode,  setPostalCode]  = useState('')
  const [city,        setCity]        = useState('')
  const [country,     setCountry]     = useState('')
  const [selected,    setSelected]    = useState<string[]>([])
  const [rgpd,        setRgpd]        = useState(false)
  const [status,      setStatus]      = useState<'idle'|'loading'|'success'|'error'>('idle')

  function toggleInterest(key: string) {
    setSelected(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !firstName || !lastName || !rgpd) return
    setStatus('loading')
    try {
      const res = await fetch('/api/magazine/print-wishlist', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          civility: civility || null,
          first_name: firstName, last_name: lastName,
          email, phone: phone || null, company: company || null,
          address: address || null, postal_code: postalCode || null,
          city: city || null, country: country || null,
          interests: selected, rgpd_consent: rgpd,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setStatus('success')
      setCivility(''); setFirstName(''); setLastName(''); setEmail('')
      setPhone(''); setCompany(''); setAddress(''); setPostalCode('')
      setCity(''); setCountry(''); setSelected([]); setRgpd(false)
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return <p className="text-sm text-magazine-black font-semibold">{successMsg}</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* Civilité */}
      <div>
        <p className={LABEL}>{civilityLabel}</p>
        <div className="flex gap-3">
          {([['M', civilityM], ['Mme', civilityMme]] as const).map(([val, lbl]) => (
            <button
              key={val} type="button"
              onClick={() => setCivility(civility === val ? '' : val)}
              className={`text-[11px] font-sans font-semibold px-5 py-2 border transition-colors ${
                civility === val
                  ? 'bg-magazine-black text-white border-magazine-black'
                  : 'text-magazine-black/60 border-magazine-black/20 hover:border-magazine-black/50'
              }`}
            >{lbl}</button>
          ))}
        </div>
      </div>

      {/* Nom / Prénom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>{firstNamePlaceholder} *</label>
          <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
            placeholder={firstNamePlaceholder} required className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>{lastNamePlaceholder} *</label>
          <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
            placeholder={lastNamePlaceholder} required className={INPUT} />
        </div>
      </div>

      {/* Email / Téléphone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Email *</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder={emailPlaceholder} required className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>{phonePlaceholder}</label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
            placeholder={phonePlaceholder} className={INPUT} />
        </div>
      </div>

      {/* Entreprise */}
      <div>
        <label className={LABEL}>{companyPlaceholder}</label>
        <input type="text" value={company} onChange={e => setCompany(e.target.value)}
          placeholder={companyPlaceholder} className={INPUT} />
      </div>

      {/* Adresse */}
      <div>
        <p className={LABEL}>{addressLabel} *</p>
        <div className="flex flex-col gap-3">
          <input type="text" value={address} onChange={e => setAddress(e.target.value)}
            placeholder={addressPlaceholder} required className={INPUT} />
          <div className="grid grid-cols-[8rem_1fr] gap-3">
            <input type="text" value={postalCode} onChange={e => setPostalCode(e.target.value)}
              placeholder={postalCodePlaceholder} required className={INPUT} />
            <input type="text" value={city} onChange={e => setCity(e.target.value)}
              placeholder={cityPlaceholder} required className={INPUT} />
          </div>
          <input type="text" value={country} onChange={e => setCountry(e.target.value)}
            placeholder={countryPlaceholder} required className={INPUT} />
        </div>
      </div>

      {/* Centres d'intérêt */}
      <div>
        <p className={LABEL}>{interestsLabel}</p>
        <div className="flex flex-wrap gap-2">
          {interests.map(({ key, label, desc }) => (
            <div key={key} className="relative group/interest">
              <button
                type="button"
                onClick={() => toggleInterest(key)}
                className={`text-[10px] font-sans font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors ${
                  selected.includes(key)
                    ? 'bg-magazine-black text-white border-magazine-black'
                    : 'text-magazine-black/60 border-magazine-black/20 hover:border-magazine-black/50'
                }`}
              >{label}</button>
              {desc && (
                <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-10 whitespace-nowrap bg-magazine-black text-white text-[10px] px-3 py-1.5 opacity-0 group-hover/interest:opacity-100 transition-opacity">
                  {desc}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Note client */}
      <p className="text-[11px] text-magazine-black/40 leading-relaxed border-l-2 border-magazine-black/10 pl-3">
        {clientNote}
      </p>

      {/* RGPD / LPD */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <div className="relative mt-0.5 shrink-0">
          <input
            type="checkbox"
            checked={rgpd}
            onChange={e => setRgpd(e.target.checked)}
            required
            className="sr-only"
          />
          <div className={`w-4 h-4 border transition-colors ${rgpd ? 'bg-magazine-black border-magazine-black' : 'border-magazine-black/30 group-hover:border-magazine-black/60'}`}>
            {rgpd && (
              <svg viewBox="0 0 16 16" className="w-4 h-4 text-white" fill="none">
                <polyline points="3,8 6.5,12 13,4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        </div>
        <span className="text-[11px] text-magazine-black/70 leading-relaxed">{rgpdLabel}</span>
      </label>

      {/* Mention légale */}
      <p className="text-[10px] text-magazine-black/35 leading-relaxed border-t border-magazine-black/8 pt-4">
        {legalNotice}
      </p>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === 'loading' || !rgpd}
          className="inline-flex items-center gap-2 bg-magazine-black text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:bg-magazine-black/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '…' : <>{cta} <ArrowUpRight size={12} /></>}
        </button>
        {status === 'error' && <p className="text-[11px] text-red-500">{errorMsg}</p>}
      </div>
    </form>
  )
}
