'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'

const PROFESSIONS = [
  'M&A Advisor', 'Lawyer', 'Accountant', 'CTO',
  'Cybersecurity', 'HR & Social', 'Insurance', 'Tax', 'Investor', 'Other',
]

const LANGUAGES = ['FR', 'EN', 'DE', 'ES', 'IT', 'NL', 'PT', 'ZH', 'AR']

const SPECIALTIES = [
  'M&A Tech', 'Due Diligence', 'SPA / Share deal', 'Asset deal',
  'IP & Droits logiciels', 'Finance SaaS', 'Cybersécurité', 'RGPD / nLPD',
  'RH & Social', 'W&I Insurance', 'Fiscalité exit', 'FinTech / DORA',
  'HealthTech / HDS', 'IA / EU AI Act',
]

type ExpertProfileData = {
  id?:           string
  first_name?:   string
  last_name?:    string
  profession?:   string
  specialties?:  string[]
  city?:         string | null
  country_code?: string
  bio?:          string | null
  organization?: string | null
  email_public?: string | null
  phone?:        string | null
  website?:      string | null
  min_rate_eur?: number | null
  languages?:    string[]
}

const inputCls  = 'w-full border border-gray-200 bg-white px-4 py-3 font-sans text-[13px] text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-gray-900 transition-colors'
const selectCls = inputCls + ' appearance-none'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-gray-400 mb-2'

export default function ExpertProfileForm({ initialData }: { initialData: ExpertProfileData | null }) {
  const isNew     = !initialData?.id
  const [saved,   setSaved]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  const [form, setForm] = useState({
    first_name:   initialData?.first_name   ?? '',
    last_name:    initialData?.last_name    ?? '',
    profession:   initialData?.profession   ?? '',
    organization: initialData?.organization ?? '',
    city:         initialData?.city         ?? '',
    country_code: initialData?.country_code ?? 'CH',
    bio:          initialData?.bio          ?? '',
    email_public: initialData?.email_public ?? '',
    phone:        initialData?.phone        ?? '',
    website:      initialData?.website      ?? '',
    min_rate_eur: initialData?.min_rate_eur?.toString() ?? '',
    specialties:  initialData?.specialties  ?? [] as string[],
    languages:    initialData?.languages    ?? [] as string[],
  })

  function toggleArr(field: 'specialties' | 'languages', value: string) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(value)
        ? f[field].filter(v => v !== value)
        : [...f[field], value],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = {
        ...form,
        min_rate_eur: form.min_rate_eur ? parseInt(form.min_rate_eur, 10) : null,
        organization: form.organization || undefined,
        city:         form.city         || undefined,
        bio:          form.bio          || undefined,
        email_public: form.email_public || undefined,
        phone:        form.phone        || undefined,
        website:      form.website      || undefined,
      }
      const res = await fetch('/api/experts/profile', {
        method:  isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error ?? 'Erreur')
      } else {
        setSaved(true)
        setTimeout(() => setSaved(false), 4000)
      }
    } catch { setError('Erreur réseau') }
    finally  { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-5">Identité</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Prénom *</label>
            <input
              type="text" required
              value={form.first_name}
              onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Nom *</label>
            <input
              type="text" required
              value={form.last_name}
              onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Spécialité principale *</label>
            <select
              required
              value={form.profession}
              onChange={e => setForm(f => ({ ...f, profession: e.target.value }))}
              className={selectCls}
            >
              <option value="">—</option>
              {PROFESSIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Cabinet / Organisation</label>
            <input
              type="text"
              value={form.organization}
              onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
              className={inputCls}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-5">Localisation</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Ville</label>
            <input
              type="text"
              value={form.city}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Code pays</label>
            <input
              type="text"
              maxLength={4}
              value={form.country_code}
              onChange={e => setForm(f => ({ ...f, country_code: e.target.value.toUpperCase() }))}
              className={inputCls}
              placeholder="CH"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-5">Présentation</p>
        <div>
          <label className={labelCls}>Bio (max 1200 caractères)</label>
          <textarea
            rows={5}
            maxLength={1200}
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            className={`${inputCls} resize-none`}
          />
          <p className="font-mono text-[9px] text-gray-300 mt-1 text-right">{form.bio.length}/1200</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-5">Contact public</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Email public</label>
            <input
              type="email"
              value={form.email_public}
              onChange={e => setForm(f => ({ ...f, email_public: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Téléphone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Site web</label>
            <input
              type="url"
              value={form.website}
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
              className={inputCls}
              placeholder="https://"
            />
          </div>
          <div>
            <label className={labelCls}>Tarif indicatif (€/h) <span className="font-normal text-gray-400 normal-case tracking-normal">— optionnel, librement défini</span></label>
            <input
              type="number"
              min={0}
              max={99999}
              value={form.min_rate_eur}
              onChange={e => setForm(f => ({ ...f, min_rate_eur: e.target.value }))}
              className={inputCls}
              placeholder="Ex : 250 , affiché « À partir de X €/h » sur votre fiche"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-5">Langues de travail</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => toggleArr('languages', lang)}
              className={`font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2 border transition-colors ${
                form.languages.includes(lang)
                  ? 'border-ag-navy bg-ag-navy text-white'
                  : 'border-gray-200 text-gray-400 hover:border-gray-400'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-5">Domaines d&apos;expertise</p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => toggleArr('specialties', s)}
              className={`font-mono text-[9px] tracking-[0.12em] uppercase px-3 py-1.5 border transition-colors ${
                form.specialties.includes(s)
                  ? 'border-ag-apex bg-ag-apex/10 text-ag-apex'
                  : 'border-gray-200 text-gray-400 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-500 border border-red-200 bg-red-50 px-4 py-3">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-8 py-3.5 hover:bg-ag-navy transition-colors disabled:opacity-60"
        >
          {loading ? 'Enregistrement…' : isNew ? 'Créer ma fiche' : 'Enregistrer les modifications'} {!loading && <ArrowUpRight size={13} />}
        </button>
        {saved && (
          <span className="inline-flex items-center gap-1.5 font-sans text-[12px] text-emerald-600">
            <CheckCircle2 size={14} /> Enregistré
          </span>
        )}
      </div>

      {!isNew && (
        <p className="font-sans text-[11px] text-gray-400">
          Toute modification remet votre fiche en attente de validation par l&apos;équipe Aegryn.
        </p>
      )}
    </form>
  )
}
