'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { CheckCircle2, Loader2, Upload, Eye, EyeOff } from 'lucide-react'
import { ExpertiseSelector, type ExpertiseValue } from '@/components/partner/ExpertiseSelector'
import type { Dimension } from '@/lib/expertiseTaxonomy'
import { ExpertCardPreview, type ExpertCardPreviewData } from '@/components/experts/ExpertCardPreview'

const COUNTRY_OPTIONS = [
  { code: 'CH', label: 'Suisse',      dial: '+41',  maxLen: 9  },
  { code: 'FR', label: 'France',      dial: '+33',  maxLen: 9  },
  { code: 'DE', label: 'Allemagne',   dial: '+49',  maxLen: 11 },
  { code: 'BE', label: 'Belgique',    dial: '+32',  maxLen: 9  },
  { code: 'LU', label: 'Luxembourg',  dial: '+352', maxLen: 9  },
  { code: 'ES', label: 'Espagne',     dial: '+34',  maxLen: 9  },
  { code: 'IT', label: 'Italie',      dial: '+39',  maxLen: 10 },
  { code: 'NL', label: 'Pays-Bas',    dial: '+31',  maxLen: 9  },
  { code: 'AT', label: 'Autriche',    dial: '+43',  maxLen: 13 },
  { code: 'PT', label: 'Portugal',    dial: '+351', maxLen: 9  },
  { code: 'PL', label: 'Pologne',     dial: '+48',  maxLen: 9  },
  { code: 'SE', label: 'Suède',       dial: '+46',  maxLen: 9  },
  { code: 'DK', label: 'Danemark',    dial: '+45',  maxLen: 8  },
  { code: 'FI', label: 'Finlande',    dial: '+358', maxLen: 12 },
  { code: 'NO', label: 'Norvège',     dial: '+47',  maxLen: 8  },
  { code: 'IE', label: 'Irlande',     dial: '+353', maxLen: 9  },
  { code: 'CZ', label: 'Tchéquie',    dial: '+420', maxLen: 9  },
  { code: 'HU', label: 'Hongrie',     dial: '+36',  maxLen: 9  },
  { code: 'RO', label: 'Roumanie',    dial: '+40',  maxLen: 9  },
  { code: 'GR', label: 'Grèce',       dial: '+30',  maxLen: 10 },
]

const LANGUAGE_OPTIONS = [
  { code: 'fr', label: 'Français'   },
  { code: 'en', label: 'Anglais'    },
  { code: 'de', label: 'Allemand'   },
  { code: 'es', label: 'Espagnol'   },
  { code: 'it', label: 'Italien'    },
  { code: 'nl', label: 'Néerlandais'},
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
  phone_country: string
  website: string
  min_rate_eur: number | null
  rate_currency: string
  languages: string[]
  avatar_url: string | null
  is_visible: boolean
  verified_at: string | null
  hidden_reason: string | null
  review_status: string | null
}

type Props = {
  existing:   ExpertProfileData | null
  canPublish: boolean
}

/* Supprime l'indicatif préfixé en DB (ex: "+33 633..." ou "+33633...") pour n'afficher que les chiffres locaux */
function stripDial(phone: string | undefined): string {
  if (!phone) return ''
  return phone.replace(/^\+\d{1,4}\s*/, '').trim()
}

export default function ExpertProfileForm({ existing, canPublish }: Props) {
  const [form, setForm] = useState({
    first_name:    existing?.first_name    ?? '',
    last_name:     existing?.last_name     ?? '',
    profession:    existing?.profession    ?? '',
    specialties:   existing?.specialties   ?? [] as string[],
    city:          existing?.city          ?? '',
    country_code:  existing?.country_code  ?? 'CH',
    bio:           existing?.bio           ?? '',
    organization:  existing?.organization  ?? '',
    email_public:  existing?.email_public  ?? '',
    phone:         stripDial(existing?.phone),
    phone_country: existing?.phone_country ?? 'CH',
    website:       existing?.website       ?? '',
    min_rate_eur:  existing?.min_rate_eur  ?? null as number | null,
    rate_currency: existing?.rate_currency ?? 'CHF',
    languages:     existing?.languages     ?? [] as string[],
  })

  const [expertise, setExpertise] = useState<ExpertiseValue>({
    dimension:   ((existing as Record<string, unknown>)?.expertise_dimension as Dimension | null) ?? null,
    categories:  ((existing as Record<string, unknown>)?.expertise_categories as string[]) ?? [],
    specialties: ((existing as Record<string, unknown>)?.expertise_specialties as string[]) ?? [],
  })

  const [saving,        setSaving]        = useState(false)
  const [submitting,    setSubmitting]    = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [submitted,     setSubmitted]     = useState(false)
  const [pendingReview, setPendingReview] = useState(
    existing?.review_status === 'pending_review'
  )
  const [error,         setError]         = useState<string | null>(null)
  const [avatarUrl,     setAvatarUrl]     = useState<string | null>(existing?.avatar_url ?? null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [showPreview,   setShowPreview]   = useState(true)
  const fileRef = useRef<HTMLInputElement>(null)

  const previewData: ExpertCardPreviewData = {
    first_name:             form.first_name,
    last_name:              form.last_name,
    profession:             form.profession,
    organization:           form.organization,
    city:                   form.city,
    country_code:           form.country_code,
    bio:                    form.bio,
    email_public:           form.email_public,
    website:                form.website,
    min_rate_eur:           form.min_rate_eur,
    rate_currency:          form.rate_currency,
    languages:              form.languages,
    avatar_url:             avatarUrl,
    expertise_dimension:    expertise.dimension,
    expertise_categories:   expertise.categories,
    expertise_specialties:  expertise.specialties,
  }

  const isNew = !existing?.id

  /* Indicatif du pays de téléphone sélectionné */
  const phoneCountryData = COUNTRY_OPTIONS.find(c => c.code === form.phone_country) ?? COUNTRY_OPTIONS[0]

  function toggleLanguage(code: string) {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(code)
        ? prev.languages.filter(x => x !== code)
        : [...prev.languages, code],
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
    const json = await res.json() as { url?: string; error?: string }
    setAvatarLoading(false)
    if (res.ok && json.url) {
      setAvatarUrl(json.url)
    } else {
      setError(json.error ?? 'Erreur upload photo')
    }
  }

  function buildPayload() {
    const localDigits    = form.phone.replace(/\s/g, '')
    const phoneFormatted = localDigits ? `${phoneCountryData.dial} ${localDigits}` : ''
    return {
      ...form,
      phone:                  phoneFormatted,
      min_rate_eur:           form.min_rate_eur ?? null,
      expertise_dimension:    expertise.dimension,
      expertise_categories:   expertise.categories,
      expertise_specialties:  expertise.specialties,
      avatar_url:             avatarUrl,
    }
  }

  /* Enregistrer en brouillon — sans notification admin, sans changer review_status */
  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setSubmitted(false)
    setError(null)

    const payload = buildPayload()

    const res  = await fetch('/api/experts/profile', {
      method:  isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(isNew ? payload : { ...payload, submit: false }),
    })
    const json = await res.json() as { error?: string }
    setSaving(false)

    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } else {
      setError(json.error ?? 'Erreur lors de la sauvegarde')
    }
  }

  /* Dépublier volontairement la fiche (masquage self_hidden) */
  async function handleUnpublish() {
    if (!confirm('Masquer votre fiche de l\'annuaire ? Elle ne sera plus visible jusqu\'à ce que vous la réafficherez.')) return
    setSaving(true)
    setError(null)
    const res = await fetch('/api/experts/profile', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ unpublish: true }),
    })
    setSaving(false)
    if (res.ok) {
      window.location.reload()
    } else {
      const json = await res.json() as { error?: string }
      setError(json.error ?? 'Erreur lors du masquage')
    }
  }

  /* Réafficher la fiche après un masquage self_hidden */
  async function handleRepublish() {
    setSaving(true)
    setError(null)
    const res = await fetch('/api/experts/profile', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ republish: true }),
    })
    setSaving(false)
    if (res.ok) {
      window.location.reload()
    } else {
      const json = await res.json() as { error?: string }
      setError(json.error ?? 'Erreur lors de la réactivation')
    }
  }

  /* Réinitialiser complètement la fiche — repartir d'une fiche vierge */
  async function handleReset() {
    if (!confirm('Vider toute votre fiche expert pour repartir de zéro ? Cette action est irréversible.')) return
    setSaving(true)
    setError(null)
    const res = await fetch('/api/experts/profile', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ reset: true }),
    })
    if (res.ok) {
      window.location.reload()
    } else {
      const json = await res.json() as { error?: string }
      setError(json.error ?? 'Erreur lors de la réinitialisation')
      setSaving(false)
    }
  }

  /* Soumettre pour validation admin — pose review_status=pending_review + notifie */
  async function handleSubmitForReview() {
    setSubmitting(true)
    setSubmitted(false)
    setSaved(false)
    setError(null)

    const payload = buildPayload()

    const res  = await fetch('/api/experts/profile', {
      method:  isNew ? 'POST' : 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ ...payload, submit: true }),
    })
    const json = await res.json() as { error?: string }
    setSubmitting(false)

    if (res.ok) {
      setSubmitted(true)
      setPendingReview(true)
      setTimeout(() => setSubmitted(false), 6000)
    } else {
      setError(json.error ?? 'Erreur lors de la soumission')
    }
  }

  const isVisible    = Boolean(existing?.is_visible) && !pendingReview
  const hiddenReason = pendingReview ? null : (existing?.hidden_reason ?? null)
  const isPending    = pendingReview
  const isRefused    = !pendingReview && !isNew && !Boolean(existing?.is_visible) && existing?.review_status === 'rejected'
  const isSelfHidden = !pendingReview && !isNew && !isVisible && hiddenReason === 'self_hidden'
  const isApprovedWaiting = !pendingReview && !isNew && !isVisible && !isRefused && !isSelfHidden && existing?.review_status === 'approved'
  const isDraft      = !isNew && !isPending && !isVisible && !isRefused && !isApprovedWaiting && !isSelfHidden

  const canSubmit = canPublish

  return (
    <div>

    {/* ── Formulaire ── */}
    <form onSubmit={handleSave} className="space-y-8 max-w-2xl">

      {/* Statut */}
      <div className={`border p-4 flex items-start gap-3 ${
        isVisible       ? 'border-emerald-200 bg-emerald-50'
        : isSelfHidden  ? 'border-gray-200 bg-gray-50'
        : isApprovedWaiting ? 'border-blue-200 bg-blue-50'
        : isPending     ? 'border-blue-200 bg-blue-50'
        : isRefused     ? 'border-red-200 bg-red-50'
        : isDraft       ? 'border-gray-200 bg-gray-50'
        : 'border-amber-200 bg-amber-50'
      }`}>
        <CheckCircle2 size={15} className={`mt-0.5 shrink-0 ${
          isVisible ? 'text-emerald-500' : isPending || isApprovedWaiting ? 'text-blue-500' : isRefused ? 'text-red-400' : 'text-gray-400'
        }`} />
        <div>
          <p className={`font-sans font-semibold text-[12px] ${
            isVisible ? 'text-emerald-800' : isPending || isApprovedWaiting ? 'text-blue-800' : isRefused ? 'text-red-700' : 'text-gray-700'
          }`}>
            {isVisible
              ? 'Fiche publiée dans l\'annuaire'
              : isSelfHidden
              ? 'Fiche masquée de l\'annuaire'
              : isApprovedWaiting
              ? 'Fiche validée par AEGRYN — en attente de publication'
              : isPending
              ? 'Fiche soumise — en attente de validation AEGRYN'
              : isRefused
              ? 'Fiche refusée par l\'équipe AEGRYN'
              : isDraft
              ? 'Fiche enregistrée en brouillon — non soumise à l\'admin'
              : 'Nouvelle fiche — enregistrez puis soumettez pour validation'}
          </p>
          {isSelfHidden && (
            <p className="font-sans text-[11px] text-gray-500 mt-0.5">
              Vous avez masqué votre fiche. Cliquez sur <strong>Réafficher ma fiche</strong> pour la republier dans l\'annuaire.
            </p>
          )}
          {isApprovedWaiting && (
            <p className="font-sans text-[11px] text-blue-600 mt-0.5">
              Votre contenu a été validé. La publication se fera automatiquement dès que votre KYC et votre abonnement seront actifs.
            </p>
          )}
          {isPending && (
            <p className="font-sans text-[11px] text-blue-600 mt-0.5">
              L&apos;équipe AEGRYN examinera votre fiche sous 48h. Vous recevrez une notification dès la décision.
            </p>
          )}
          {isDraft && (
            <p className="font-sans text-[11px] text-gray-500 mt-0.5">
              Enregistrez vos modifications puis cliquez sur <strong>Soumettre pour publication</strong> pour déclencher la revue admin.
            </p>
          )}
          {isRefused && hiddenReason && hiddenReason !== 'admin_hidden' && (
            <p className="font-sans text-[11px] text-red-600 mt-0.5">
              Motif : {hiddenReason}. Corrigez puis soumettez à nouveau.
            </p>
          )}
        </div>
      </div>

      {/* Photo de profil */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Photo de profil</p>
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
            {avatarUrl
              ? <Image src={avatarUrl} alt="avatar" fill className="object-cover" unoptimized />
              : <span className="font-mono text-[10px] text-gray-300">avatar</span>
            }
            {avatarLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarLoading}
              className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest border border-gray-200 px-3 py-2 text-gray-600 hover:border-gray-400 disabled:opacity-50 transition-colors"
            >
              <Upload size={12} />
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
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white appearance-none">
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

      {/* Domaines d'expertise — sélecteur 3 étapes */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Domaines d&apos;expertise</p>
        <p className="font-sans text-[11px] text-gray-400 mb-4">
          Ces informations déterminent les mandats qui vous seront proposés.
          Soyez précis — vous pouvez les modifier ultérieurement.
        </p>
        <ExpertiseSelector value={expertise} onChange={setExpertise} />
      </div>

      {/* Langues — 6 langues UI */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">Langues pratiquées</p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map(l => (
            <button key={l.code} type="button" onClick={() => toggleLanguage(l.code)}
              className={`font-sans text-[11px] px-3 py-1.5 border transition-colors ${
                form.languages.includes(l.code)
                  ? 'border-ag-apex bg-ag-apex/10 text-ag-apex'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}>
              {l.label}
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

          {/* Téléphone avec indicatif */}
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Téléphone</label>
            <div className="flex gap-2">
              <select
                value={form.phone_country}
                onChange={e => setForm(p => ({ ...p, phone_country: e.target.value, phone: '' }))}
                className="border border-gray-200 px-2 py-2 font-sans text-[12px] focus:outline-none focus:border-gray-400 bg-white shrink-0"
              >
                {COUNTRY_OPTIONS.map(c => (
                  <option key={c.code} value={c.code}>{c.dial} {c.label}</option>
                ))}
              </select>
              <input
                type="tel"
                value={form.phone}
                onChange={e => {
                  const digits = e.target.value.replace(/[^\d\s]/g, '')
                  if (digits.replace(/\s/g, '').length <= phoneCountryData.maxLen) {
                    setForm(p => ({ ...p, phone: digits }))
                  }
                }}
                placeholder={`${phoneCountryData.maxLen} chiffres max`}
                maxLength={phoneCountryData.maxLen + 4}
                className="flex-1 border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white"
              />
            </div>
            <p className="font-sans text-[10px] text-gray-400 mt-1">
              Indicatif : {phoneCountryData.dial} — {phoneCountryData.maxLen} chiffres max
            </p>
          </div>

          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">Site web</label>
            <input type="url" value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
              placeholder="https://…"
              className="w-full border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
          </div>

          {/* Honoraires EUR ou CHF */}
          <div>
            <label className="font-sans text-[11px] text-gray-600 block mb-1">
              Honoraires indicatifs <span className="text-gray-400">(par heure — optionnel)</span>
            </label>
            <div className="flex gap-2">
              <select
                value={form.rate_currency}
                onChange={e => setForm(p => ({ ...p, rate_currency: e.target.value }))}
                className="border border-gray-200 px-2 py-2 font-sans text-[12px] focus:outline-none focus:border-gray-400 bg-white shrink-0"
              >
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
              </select>
              <input
                type="number" min={0} max={9999}
                value={form.min_rate_eur ?? ''}
                onChange={e => setForm(p => ({ ...p, min_rate_eur: e.target.value ? Number(e.target.value) : null }))}
                placeholder="ex: 250"
                className="flex-1 border border-gray-200 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-gray-400 bg-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Erreur / Succès */}
      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">{error}</div>
      )}
      {saved && (
        <div className="bg-gray-50 border border-gray-200 px-4 py-3 text-[12px] text-gray-700 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-gray-400" />
          Modifications enregistrées en brouillon. Cliquez sur &quot;Soumettre pour publication&quot; pour déclencher la revue admin.
        </div>
      )}
      {submitted && (
        <div className="bg-blue-50 border border-blue-200 px-4 py-3 text-[12px] text-blue-700 flex items-center gap-2">
          <CheckCircle2 size={14} className="text-blue-500" />
          Fiche soumise pour validation — l&apos;équipe AEGRYN vous répondra sous 48h.
        </div>
      )}

      {!canSubmit && (
        <div className="bg-amber-50 border border-amber-200 px-4 py-3 text-[12px] text-amber-700">
          La soumission est temporairement indisponible. Contactez l&apos;équipe AEGRYN.
        </div>
      )}

      {/* 2 boutons distincts pour les fiches existantes */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving || submitting}
          className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-6 py-3 border border-gray-300 bg-white text-gray-700 hover:border-gray-500 disabled:opacity-50 transition-colors"
        >
          {saving && <Loader2 size={13} className="animate-spin" />}
          {isNew ? 'Enregistrer la fiche' : 'Enregistrer les modifications'}
        </button>

        {!isNew && (
          <button
            type="button"
            disabled={saving || submitting || isPending}
            onClick={handleSubmitForReview}
            title={isPending ? 'Fiche déjà soumise — en attente de validation' : undefined}
            className={`flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-6 py-3 transition-colors ${
              isPending
                ? 'bg-blue-50 text-blue-400 border border-blue-200 cursor-not-allowed opacity-70'
                : canSubmit
                ? 'bg-ag-navy text-white hover:bg-gray-800 disabled:opacity-50'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
            }`}
          >
            {submitting && <Loader2 size={13} className="animate-spin" />}
            {isPending ? 'Soumise — en attente' : 'Soumettre pour publication'}
          </button>
        )}

        {isNew && (
          <button
            type="button"
            disabled={saving || submitting}
            onClick={handleSubmitForReview}
            className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest px-6 py-3 bg-ag-navy text-white hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {submitting && <Loader2 size={13} className="animate-spin" />}
            Soumettre pour publication
          </button>
        )}

        {isVisible && (
          <button
            type="button"
            disabled={saving || submitting}
            onClick={handleUnpublish}
            className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-50 transition-colors"
          >
            Masquer ma fiche
          </button>
        )}

        {isSelfHidden && (
          <button
            type="button"
            disabled={saving || submitting}
            onClick={handleRepublish}
            className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
          >
            Réafficher ma fiche
          </button>
        )}

        {!isNew && (
          <button
            type="button"
            disabled={saving || submitting}
            onClick={handleReset}
            className="ml-auto font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-100 text-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 transition-colors"
          >
            Repartir de zéro
          </button>
        )}
      </div>
    </form>

    {/* ── Preview flottante fixe ── */}
    <div
      className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 transition-all duration-300`}
      style={{ maxWidth: '340px', width: 'calc(100vw - 1.5rem)' }}
    >
      {/* Bouton toggle */}
      <button
        type="button"
        onClick={() => setShowPreview(v => !v)}
        className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest bg-ag-navy text-white px-3 py-2 shadow-lg hover:bg-gray-800 transition-colors"
      >
        {showPreview ? <EyeOff size={11} /> : <Eye size={11} />}
        {showPreview ? 'Masquer l\'aperçu' : 'Voir l\'aperçu'}
      </button>

      {/* Panneau preview */}
      {showPreview && (
        <div className="w-full bg-white border border-gray-200 shadow-2xl overflow-hidden flex flex-col"
          style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 shrink-0">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
              Aperçu · non sauvegardé
            </p>
          </div>
          <div className="overflow-y-auto flex-1">
            <ExpertCardPreview data={previewData} locale="fr" />
          </div>
        </div>
      )}
    </div>

    </div>
  )
}
