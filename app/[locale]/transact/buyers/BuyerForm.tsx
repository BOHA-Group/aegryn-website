'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'
const selectCls = inputCls + ' appearance-none cursor-pointer'

const BUYER_TYPES = [
  { value: 'founder',      label: 'Fondateur / Entrepreneur' },
  { value: 'fund',         label: 'Fonds d\'investissement' },
  { value: 'family_office',label: 'Family Office' },
  { value: 'corporate',    label: 'Corporate / Groupe' },
  { value: 'other',        label: 'Autre' },
]

const FUNDS_PROOF = [
  { value: 'bank_statement',  label: 'Relevé bancaire' },
  { value: 'fund_commitment', label: 'Commitment de fonds' },
  { value: 'self_declared',   label: 'Déclaration sur l\'honneur' },
  { value: 'other',           label: 'Autre document' },
]

const SECTORS = [
  'SaaS B2B', 'SaaS B2C', 'Marketplace', 'E-commerce', 'App mobile',
  'Agence digitale', 'IA / Data', 'Fintech', 'Proptech', 'Healthtech',
  'Cybersécurité', 'Infrastructure', 'Contenu / Media',
]

const GEOGRAPHIES = ['Suisse', 'France', 'Allemagne', 'Benelux', 'Europe du Sud', 'Europe de l\'Est', 'Europe (toute)', 'International']

const OPERATION_TYPES = [
  { value: 'full_acquisition',  label: 'Acquisition totale' },
  { value: 'majority',          label: 'Majoritaire' },
  { value: 'minority',          label: 'Minoritaire' },
  { value: 'lbo',               label: 'LBO' },
]

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3 py-1.5 font-sans text-[11px] transition-colors whitespace-nowrap ${
        active ? 'border-ag-black bg-ag-black text-white' : 'border-ag-border text-ag-black hover:border-ag-black'
      }`}
    >
      {label}
    </button>
  )
}

export default function BuyerForm() {
  const [form, setForm] = useState({
    full_name:    '',
    email:        '',
    organization: '',
    country:      'CH',
    buyer_type:   '',
    ticket_min:   '',
    ticket_max:   '',
    funds_proof:  '',
    funds_amount: '',
    message:      '',
  })
  const [sectors,    setSectors]    = useState<string[]>([])
  const [geos,       setGeos]       = useState<string[]>([])
  const [opTypes,    setOpTypes]    = useState<string[]>([])
  const [submitted,  setSubmitted]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState<string | null>(null)

  function toggle<T extends string>(arr: T[], setArr: (v: T[]) => void, val: T) {
    setArr(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const canSubmit = form.full_name && form.email && form.buyer_type && form.funds_proof && sectors.length > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/transact/buyers', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name:       form.full_name,
          email:           form.email,
          organization:    form.organization || undefined,
          country:         form.country,
          buyer_type:      form.buyer_type,
          ticket_min_eur:  form.ticket_min ? parseInt(form.ticket_min) : undefined,
          ticket_max_eur:  form.ticket_max ? parseInt(form.ticket_max) : undefined,
          sectors,
          geographies:     geos,
          operation_types: opTypes,
          funds_proof:     form.funds_proof,
          funds_amount:    form.funds_amount || undefined,
          message:         form.message || undefined,
          locale:          document.documentElement.lang || 'fr',
          source_url:      window.location.href,
        }),
      })
      if (res.ok) setSubmitted(true)
      else        setError('Une erreur est survenue. Veuillez réessayer.')
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="border border-emerald-200 bg-emerald-50 p-10 flex flex-col items-center gap-4 text-center">
        <CheckCircle2 size={32} className="text-emerald-500" />
        <h3 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em]">
          Demande reçue
        </h3>
        <p className="font-sans text-[14px] text-ag-gray max-w-md leading-relaxed">
          Notre équipe examinera votre profil sous 48h ouvrées et vous contactera pour finaliser votre pré-qualification.
        </p>
        <Link
          href="/transact/sessions"
          className="inline-flex items-center gap-2 border border-ag-border text-ag-black font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-6 py-3 hover:border-ag-black transition-colors mt-2"
        >
          Voir les sessions TRANSACT <ArrowUpRight size={11} />
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">

      {/* Identité */}
      <div className="border border-ag-border bg-ag-white p-7 flex flex-col gap-5">
        <p className={labelCls}>Identité</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelCls}>Nom complet *</label>
            <input
              type="text" required value={form.full_name}
              onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
              placeholder="Jean Dupont" className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Email professionnel *</label>
            <input
              type="email" required value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="jean@organisation.com" className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Organisation</label>
            <input
              type="text" value={form.organization}
              onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
              placeholder="Nom de la société ou fonds" className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Pays *</label>
            <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))} className={selectCls}>
              {['CH','FR','DE','BE','LU','GB','US','SG','AE','Other'].map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Profil acheteur */}
      <div className="border border-ag-border bg-ag-white p-7 flex flex-col gap-5">
        <p className={labelCls}>Profil acheteur</p>

        <div>
          <label className={labelCls}>Type d'acquéreur *</label>
          <select required value={form.buyer_type} onChange={e => setForm(f => ({ ...f, buyer_type: e.target.value }))} className={selectCls}>
            <option value="">Sélectionner…</option>
            {BUYER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Ticket min (€)</label>
            <input
              type="number" min="0" value={form.ticket_min}
              onChange={e => setForm(f => ({ ...f, ticket_min: e.target.value }))}
              placeholder="100 000" className={inputCls}
            />
          </div>
          <div>
            <label className={labelCls}>Ticket max (€)</label>
            <input
              type="number" min="0" value={form.ticket_max}
              onChange={e => setForm(f => ({ ...f, ticket_max: e.target.value }))}
              placeholder="5 000 000" className={inputCls}
            />
          </div>
        </div>

        <div>
          <label className={labelCls}>Secteurs cibles * <span className="normal-case text-ag-gray-light font-normal">(au moins 1)</span></label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SECTORS.map(s => (
              <Chip key={s} label={s} active={sectors.includes(s)} onClick={() => toggle(sectors, setSectors, s)} />
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Géographies cibles</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {GEOGRAPHIES.map(g => (
              <Chip key={g} label={g} active={geos.includes(g)} onClick={() => toggle(geos, setGeos, g)} />
            ))}
          </div>
        </div>

        <div>
          <label className={labelCls}>Types d'opération</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {OPERATION_TYPES.map(o => (
              <Chip key={o.value} label={o.label} active={opTypes.includes(o.value)} onClick={() => toggle(opTypes, setOpTypes, o.value)} />
            ))}
          </div>
        </div>
      </div>

      {/* Capacité financière */}
      <div className="border border-ag-border bg-ag-white p-7 flex flex-col gap-5">
        <p className={labelCls}>Capacité financière</p>
        <div>
          <label className={labelCls}>Preuve de capacité *</label>
          <select required value={form.funds_proof} onChange={e => setForm(f => ({ ...f, funds_proof: e.target.value }))} className={selectCls}>
            <option value="">Sélectionner…</option>
            {FUNDS_PROOF.map(fp => <option key={fp.value} value={fp.value}>{fp.label}</option>)}
          </select>
          <p className="font-sans text-[11px] text-ag-gray-light mt-1.5">
            Un document justificatif sera demandé lors de la validation de votre profil.
          </p>
        </div>
        <div>
          <label className={labelCls}>Montant disponible (indicatif)</label>
          <input
            type="text" value={form.funds_amount}
            onChange={e => setForm(f => ({ ...f, funds_amount: e.target.value }))}
            placeholder="ex : €2M, $5M–$10M…" className={inputCls}
          />
        </div>
      </div>

      {/* Message */}
      <div className="border border-ag-border bg-ag-white p-7">
        <label className={labelCls}>Message (optionnel)</label>
        <textarea
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          placeholder="Précisez vos critères, votre historique d'acquisitions, ou toute information utile à notre équipe."
          rows={4}
          className={inputCls + ' resize-none'}
        />
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-500">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="font-sans text-[11px] text-ag-gray-light max-w-xs leading-relaxed">
          Vos données sont traitées de façon strictement confidentielle et ne sont jamais transmises à des tiers.
        </p>
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-7 py-3.5 hover:bg-ag-navy-mid transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
        >
          {loading ? <Loader2 size={13} className="animate-spin" /> : <ArrowUpRight size={13} />}
          Soumettre ma demande
        </button>
      </div>
    </form>
  )
}
