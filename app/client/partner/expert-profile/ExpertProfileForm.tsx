'use client'

import { useState, useRef } from 'react'
import { CheckCircle2, Loader2, Upload } from 'lucide-react'

const SPECIALTIES_OPTIONS = [
  'Cybersécurité', 'Intelligence artificielle', 'M&A', 'Valorisation',
  'Droit des affaires', 'Expertise comptable', 'Due diligence',
  'Audit technique', 'Propriété intellectuelle', 'Finance structurée',
  'Fiscalité', 'Immobilier', 'Assurance', 'ESG / RSE',
]

const COUNTRY_OPTIONS = [
  { code: 'CH', label: 'Suisse' }, { code: 'FR', label: 'France' },
  { code: 'DE', label: 'Allemagne' }, { code: 'BE', label: 'Belgique' },
  { code: 'LU', label: 'Luxembourg' }, { code: 'GB', label: 'Royaume-Uni' },
  { code: 'US', label: 'États-Unis' }, { code: 'CA', label: 'Canada' },
  { code: 'ES', label: 'Espagne' }, { code: 'IT', label: 'Italie' },
  { code: 'NL', label: 'Pays-Bas' }, { code: 'AE', label: 'EAU' },
  { code: 'SG', label: 'Singapour' }, { code: 'OTHER', label: 'Autre' },
]

const LANGUAGE_OPTIONS = [
  'Français', 'Anglais', 'Allemand', 'Espagnol', 'Italien',
  'Néerlandais', 'Portugais', 'Arabe', 'Mandarin', 'Japonais',
]

type ExpertProfileData = {
  id?: string
  first_name: string
  last_name: string
  profession: string
  specialties: string[]
  city: string
  country_code: string
  bio: string
  organization: string
  email_public: string
  phone: string
  website: string
  min_rate_eur: number | null
  languages: string[]
  avatar_url: string | null
  is_visible: boolean
  verified_at: string | null
}

type Props = {
  existing: ExpertProfileData | null
}

export default function ExpertProfileForm({ existing }: Props) {
  const [form, setForm] = useState({
    first_name:   existing?.first_name   ?? '',
    last_name:    existing?.last_name    ?? '',
    profession:   existing?.profession   ?? '',
    specialties:  existing?.specialties  ?? [] as string[],
    city:         existing?.city         ?? '',
    country_code: existing?.country_code ?? 'CH',
    bio:          existing?.bio          ?? '',
    organization: existing?.organization ?? '',
    email_public: existing?.email_public ?? '',
    phone:        existing?.phone        ?? '',
    website:      existing?.website      ?? '',
    min_rate_eur: existing?.min_rate_eur ?? null as number | null,
    languages:    existing?.languages    ?? [] as string[],
  })

  const [saving,        setSaving]        = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [error,         setError]         = useState<string | null>(null)
  const [avatarUrl,     setAvatarUrl]     = useState<string | null>(existing?.avatar_url ?? null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const isNew = !existing?.id

  function toggleSpecialty(s: string) {
    setForm(prev => ({
      ...prev,
      specialties: prev.specialties.includes(s)
        ? prev.specialties.filter(x => x !== s)
        : [...prev.specialties, s],
    }))
  }

  function toggleLanguage(l: string) {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(l)
        ? prev.languages.filter(x => x !== l)
        : [...prev.languages, l],
    }))
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Photo max 5 MB'); return }
    setAvatarLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/experts/avatar', { method: 'POST', body: fd })
    const json = await res.json()
    setAvatarLoading(false)
    if (res.ok && json.url) {
      setAvatarUrl(json.url)
    } else {
      setError(json.error ?? 'Erreur upload photo')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)

    const payload = {
      ...form,
      min_rate_eur: form.min_rate_eur ?? null,
    }

    const res = await fetch('/api/experts/profile', {
      method:  isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })
    const json = await res.json()
    setSaving(false)

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } else {
      setError(json.error ?? 'Erreur lors de la sauvegarde')
    }
  }

  const isVerified  = Boolean(existing?.verified_at)
  const isVisible   = Boolean(existing?.is_visible)

  return (
    <form onSubmit={handleSubmit} className="space-y-8">

      {/* Statut publication */}
      <div className={`border p-4 flex items-start gap-3 ${
        isVisible ? 'border-emerald-200 bg-emerald-50'
        : isVerified ? 'border-blue-200 bg-blue-50'
        : 'border-amber-200 bg-amber-50'
      }`}>
        <CheckCircle2 size={15} className={isVisible ? 'text-emerald-500 mt-0.5' : 'text-amber-500 mt-0.5'} />
        <div>
          <p className={`font-sans font-semibold text-[12px] ${isVisible ? 'text-emerald-800' : isVerified ? 'text-blue-800' : 'text-amber-800'}`}>
            {isVisible ? 'Fiche publiée dans l\'annuaire'
             : isVerified ? 'Fiche soumise — en attente de validation admin'
             : isNew ? 'Nouvelle fiche — sera soumise pour validation après enregistrement'
             : 'Fiche enregistrée — en attente de validation admin'}
          </p>
          {!isVerified && !isNew && (
            <p className="font-sans text-[11px] text-amber-700 mt-0.5">
              L&apos;équipe AEGRYN validera votre fiche sous 48h après la soumission.
            </p>
          )}
        </div>
      </div>

      {/* Photo de profil */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Photo de profil</p>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl
              ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              : <span className="font-mono text-[10px] text-gray-300">Photo</span>
            }
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarLoading}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest border border-gray-200 px-3 py-2 text-gray-600 hover:border-gray-400 disabled:opacity-50 transition-colors"
            >
              {avatarLoading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
              {avatarUrl ? 'Changer la photo' : 'Ajouter une photo'}
            </button>
            <p className="font-sans text-[11px] text-gray-400 mt-1">JPG ou PNG · max 5 MB · format carré recommandé</p>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarUpload} />
          </div>
        </div>
      </div>

      {/* Identité */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Identité professionnelle</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Prénom *</label>
            <input required value={form.first_name} onChange={e => setForm(p => ({ ...p, first_name: e.target.value }))}
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
          </div>
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Nom *</label>
            <input required value={form.last_name} onChange={e => setForm(p => ({ ...p, last_name: e.target.value }))}
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
          </div>
        </div>
        <div className="mb-4">
          <label className="font-sans text-[11px] text-gray-600 block mb-1">Titre / Profession * <span className="text-gray-400">(ex: Avocat M&A, Expert-comptable)</span></label>
          <input required value={form.profession} onChange={e => setForm(p => ({ ...p, profession: e.target.value }))}
            maxLength={100}
            className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
        </div>
        <div className="mb-4">
          <label className="font-sans text-[11px] text-gray-600 block mb-1">Cabinet / Organisation</label>
          <input value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))}
            maxLength={150}
            className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Ville</label>
            <input value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
              maxLength={100}
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
          </div>
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Pays</label>
            <select value={form.country_code} onChange={e => setForm(p => ({ ...p, country_code: e.target.value }))}
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white">
              {COUNTRY_OPTIONS.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Bio */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Biographie</p>
        <label className="font-sans text-[11px] text-gray-600 block mb-1">
          Présentation professionnelle <span className="text-gray-400">({form.bio.length}/1200)</span>
        </label>
        <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
          maxLength={1200} rows={5}
          placeholder="Décrivez votre parcours, votre expertise et la valeur ajoutée que vous apportez aux transactions AEGRYN…"
          className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white resize-none" />
      </div>

      {/* Spécialités */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Spécialités</p>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES_OPTIONS.map(s => (
            <button
              key={s} type="button" onClick={() => toggleSpecialty(s)}
              className={`font-sans text-[11px] px-3 py-1.5 border transition-colors ${
                form.specialties.includes(s)
                  ? 'border-ag-navy bg-ag-navy text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Langues */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Langues pratiquées</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map(l => (
            <button
              key={l} type="button" onClick={() => toggleLanguage(l)}
              className={`font-sans text-[11px] px-3 py-1.5 border transition-colors ${
                form.languages.includes(l)
                  ? 'border-ag-apex bg-ag-apex/10 text-ag-apex'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Contact public</p>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Email public <span className="text-gray-400">(visible dans l&apos;annuaire)</span></label>
            <input type="email" value={form.email_public} onChange={e => setForm(p => ({ ...p, email_public: e.target.value }))}
              placeholder="contact@cabinet.ch"
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-sans text-[11px] text-gray-600 block mb-1">Téléphone</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                maxLength={30}
                className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
            </div>
            <div>
              <label className="font-sans text-[11px] text-gray-600 block mb-1">Site web</label>
              <input type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
                placeholder="https://…"
                className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
            </div>
          </div>
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Honoraires indicatifs <span className="text-gray-400">(€/heure — optionnel)</span></label>
            <input
              type="number" min={0} max={9999}
              value={form.min_rate_eur ?? ''}
              onChange={e => setForm(p => ({ ...p, min_rate_eur: e.target.value ? Number(e.target.value) : null }))}
              placeholder="ex: 250"
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
          </div>
        </div>
      </div>

      {/* Erreur / Succès */}
      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">{error}</div>
      )}
      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 px-4 py-3 text-[12px] text-emerald-700 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-emerald-500" />
          Fiche {isNew ? 'soumise' : 'mise à jour'} — l&apos;équipe AEGRYN validera votre fiche sous 48h.
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-gray-800 disabled:opacity-50 transition-colors"
      >
        {saving && <Loader2 size={13} className="animate-spin" />}
        {isNew ? 'Soumettre ma fiche' : 'Enregistrer les modifications'}
      </button>
    </form>
  )
}
