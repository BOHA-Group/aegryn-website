'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowUpRight, CheckCircle2, Mail, Globe, MapPin, Star } from 'lucide-react'

type ExpertProfile = {
  id:           string
  first_name:   string
  last_name:    string
  profession:   string
  specialties:  string[]
  city:         string | null
  country_code: string
  bio:          string | null
  organization: string | null
  email_public: string | null
  phone:        string | null
  website:      string | null
  min_rate_eur: number | null
  languages:    string[]
  avatar_url:   string | null
  verified_at:  string | null
}

const PROFESSIONS = [
  'M&A Advisor', 'Lawyer', 'Accountant', 'CTO',
  'Cybersecurity', 'HR & Social', 'Insurance', 'Tax', 'Investor', 'Other',
]

const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const selectCls = inputCls + ' appearance-none'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

function ExpertCard({ profile, t }: { profile: ExpertProfile; t: ReturnType<typeof useTranslations> }) {
  const initials = `${profile.first_name[0] ?? ''}${profile.last_name[0] ?? ''}`.toUpperCase()
  return (
    <div className="bg-ag-white border border-ag-border p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        {profile.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={`${profile.first_name} ${profile.last_name}`}
            className="w-12 h-12 object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 bg-ag-off-white border border-ag-border flex items-center justify-center shrink-0">
            <span className="font-mono text-[13px] font-bold text-ag-gray">{initials}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-tight">
              {profile.first_name} {profile.last_name}
            </h3>
            {profile.verified_at && (
              <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 bg-ag-apex/10 text-ag-apex border border-ag-apex/30">
                <CheckCircle2 size={9} /> {t('card.verifiedBadge')}
              </span>
            )}
          </div>
          <p className="font-sans text-[12px] text-ag-apex font-semibold">{profile.profession}</p>
          {profile.organization && (
            <p className="font-sans text-[12px] text-ag-gray mt-0.5">{profile.organization}</p>
          )}
        </div>
      </div>

      {profile.bio && (
        <p className="font-sans text-[12px] text-ag-gray leading-relaxed line-clamp-3">{profile.bio}</p>
      )}

      {profile.specialties.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {profile.specialties.slice(0, 4).map(s => (
            <span key={s} className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 bg-ag-off-white border border-ag-border text-ag-gray">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-ag-border mt-auto">
        {(profile.city || profile.country_code) && (
          <span className="inline-flex items-center gap-1 font-sans text-[11px] text-ag-gray-light">
            <MapPin size={10} />
            {[profile.city, profile.country_code].filter(Boolean).join(', ')}
          </span>
        )}
        {profile.min_rate_eur != null && (
          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ag-gray-light ml-auto">
            <Star size={9} /> {t('card.rateFrom')} {profile.min_rate_eur} {t('card.rateUnit')}
          </span>
        )}
      </div>

      <div className="flex gap-3">
        {profile.email_public && (
          <a
            href={`mailto:${profile.email_public}`}
            className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border border-ag-navy text-ag-navy hover:bg-ag-navy hover:text-white transition-colors"
          >
            <Mail size={10} /> {t('card.contact')}
          </a>
        )}
        {profile.website && (
          <a
            href={profile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black transition-colors"
          >
            <Globe size={10} /> Site
          </a>
        )}
      </div>
    </div>
  )
}

function WaitlistForm({ t }: { t: ReturnType<typeof useTranslations> }) {
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const raw = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const res = await fetch('/api/experts/apply', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          prenom:       raw.prenom,
          nom:          raw.nom,
          email:        raw.email,
          profession:   raw.profession,
          organization: raw.organization || undefined,
          city:         raw.city         || undefined,
          country:      raw.country      || undefined,
          bio:          raw.bio          || undefined,
          website:      raw.website      || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === 'duplicate') setError(t('waitlist.duplicateMsg'))
        else setError(t('waitlist.errorMsg'))
      } else {
        setSubmitted(true)
      }
    } catch { setError(t('waitlist.errorMsg')) }
    finally  { setLoading(false) }
  }

  if (submitted) {
    return (
      <div className="border border-ag-apex/30 bg-ag-off-white p-10 flex flex-col items-start gap-4">
        <CheckCircle2 size={28} className="text-ag-apex" />
        <p className="font-sans font-bold text-ag-black text-[18px]">{t('waitlist.successTitle')}</p>
        <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('waitlist.successDesc')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t('waitlist.fieldPrenom')} *</label>
          <input name="prenom" type="text" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t('waitlist.fieldNom')} *</label>
          <input name="nom" type="text" required className={inputCls} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t('waitlist.fieldEmail')} *</label>
          <input name="email" type="email" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t('waitlist.fieldProfession')} *</label>
          <select name="profession" required className={selectCls}>
            <option value="">—</option>
            {PROFESSIONS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className={labelCls}>{t('waitlist.fieldOrg')}</label>
          <input name="organization" type="text" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t('waitlist.fieldCity')}</label>
          <input name="city" type="text" className={inputCls} />
        </div>
      </div>
      <div>
        <label className={labelCls}>{t('waitlist.fieldBio')}</label>
        <textarea name="bio" rows={4} maxLength={1200} className={`${inputCls} resize-none`} />
      </div>
      <div>
        <label className={labelCls}>{t('waitlist.fieldWebsite')}</label>
        <input name="website" type="url" className={inputCls} placeholder="https://" />
      </div>
      {error && <p className="font-sans text-[11px] text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-ag-navy transition-colors disabled:opacity-60"
      >
        {loading ? t('waitlist.submitting') : t('waitlist.submit')} {!loading && <ArrowUpRight size={13} />}
      </button>
    </form>
  )
}

export default function ExpertsContent() {
  const t = useTranslations('experts')
  const [profiles,   setProfiles]   = useState<ExpertProfile[]>([])
  const [loadingGrid, setLoadingGrid] = useState(true)
  const [profession, setProfession] = useState('')

  useEffect(() => {
    setLoadingGrid(true)
    const qs = profession ? `?profession=${encodeURIComponent(profession)}` : ''
    fetch(`/api/experts/profiles${qs}`)
      .then(r => r.json())
      .then(d => setProfiles(d.profiles ?? []))
      .catch(() => setProfiles([]))
      .finally(() => setLoadingGrid(false))
  }, [profession])

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(44px,6vw,80px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Filtres + grille */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        {/* Filtre professions */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setProfession('')}
            className={`font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors ${
              profession === ''
                ? 'border-ag-black bg-ag-black text-white'
                : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black'
            }`}
          >
            {t('filters.all')}
          </button>
          {PROFESSIONS.map(p => (
            <button
              key={p}
              onClick={() => setProfession(p)}
              className={`font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors ${
                profession === p
                  ? 'border-ag-black bg-ag-black text-white'
                  : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Grille */}
        {loadingGrid ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-ag-white h-64 animate-pulse" />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="border border-ag-border bg-ag-off-white p-16 text-center">
            <p className="font-sans font-semibold text-ag-black text-[16px] mb-2">{t('empty.title')}</p>
            <p className="font-sans text-[13px] text-ag-gray">{t('empty.desc')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            {profiles.map(p => (
              <ExpertCard key={p.id} profile={p} t={t} />
            ))}
          </div>
        )}
      </section>

      {/* Section liste d'attente / candidature */}
      <section className="bg-ag-off-white border-t border-ag-border py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-16">
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-6">
              {t('waitlist.label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-6"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              {t('waitlist.title')}
            </h2>
            <p className="text-[13px] text-ag-gray leading-relaxed">
              {t('waitlist.desc')}
            </p>
          </div>
          <WaitlistForm t={t} />
        </div>
      </section>
    </>
  )
}
