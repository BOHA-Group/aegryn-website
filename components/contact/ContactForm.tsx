'use client'

import { useTranslations }  from 'next-intl'
import { useMemo, useState } from 'react'
import { useSearchParams }  from 'next/navigation'
import { Aegryn_ASSETS }    from '@/data/assets'
import { countryName, sortAlpha } from '@/lib/countries'
import {
  CONTACT_SUBJECTS, LEGACY_SUBJECT_ALIAS, TYPE_TO_SUBJECT, NDA_SUBJECTS, SUBJECT_FIELDS,
  FIELD_LABELS, OPTION_LABELS, UI, normalizeLang, type FieldDef,
} from '@/content/contact/fields'

type Props = { locale: string }

const subjects   = CONTACT_SUBJECTS
const MSG_LIMIT  = 1000
const PROJECT_IDS = Aegryn_ASSETS.map(a => a.id)
const PORTFOLIO_PROJECTS = Aegryn_ASSETS.filter(a => a.id !== 'subblink')

const COUNTRY_OPTIONS = [
  { code: 'CH', label: 'Suisse',      dial: '+41',  maxLen: 9  },
  { code: 'FR', label: 'France',      dial: '+33',  maxLen: 9  },
  { code: 'DE', label: 'Allemagne',   dial: '+49',  maxLen: 11 },
  { code: 'BE', label: 'Belgique',    dial: '+32',  maxLen: 9  },
  { code: 'LU', label: 'Luxembourg',  dial: '+352', maxLen: 9  },
  { code: 'MC', label: 'Monaco',      dial: '+377', maxLen: 9  },
  { code: 'ES', label: 'Espagne',     dial: '+34',  maxLen: 9  },
  { code: 'IT', label: 'Italie',      dial: '+39',  maxLen: 10 },
  { code: 'NL', label: 'Pays-Bas',    dial: '+31',  maxLen: 9  },
  { code: 'AT', label: 'Autriche',    dial: '+43',  maxLen: 13 },
  { code: 'PT', label: 'Portugal',    dial: '+351', maxLen: 9  },
  { code: 'GB', label: 'Royaume-Uni', dial: '+44',  maxLen: 10 },
  { code: 'US', label: 'États-Unis',  dial: '+1',   maxLen: 10 },
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
] as const

const inputCls   = 'w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-sm text-ag-dark placeholder-ag-gray-light outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10'
const selectCls  = 'rounded-xl border border-ag-border bg-white px-4 py-3 h-[46px] text-sm text-ag-dark outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10'
const labelCls   = 'mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light'

export default function ContactForm({ locale }: Props) {
  const t = useTranslations('contact.form')

  const [status, setStatus]         = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorCode, setErrorCode]   = useState<string | null>(null)
  const [phoneCountry, setPhoneCountry] = useState('FR')
  const [phone, setPhone]           = useState('')

  /* tracking champs pour débloquer le bouton */
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [company, setCompany] = useState('')
  /* Pré-sélection du sujet via ?subject= (liens depuis les pages métiers) */
  const params = useSearchParams()
  const [subject, setSubject] = useState<string>(() => {
    const q = params.get('subject')
    if (q && (subjects as readonly string[]).includes(q)) return q
    if (q && LEGACY_SUBJECT_ALIAS[q]) return LEGACY_SUBJECT_ALIAS[q]
    const ty = params.get('type')
    return ty ? (TYPE_TO_SUBJECT[ty] ?? '') : ''
  })
  /* Pré-remplissage du message quand on vient d'une fiche projet (?projet=<id>) */
  const tItems = useTranslations('assets.items')
  const projet = params.get('projet') ?? ''
  const [message, setMessage] = useState(() =>
    PROJECT_IDS.includes(projet)
      ? t('projectMessage', { project: tItems(`${projet}.tagline` as Parameters<typeof tItems>[0]) })
      : ''
  )
  const [msgLen, setMsgLen]     = useState(() => message.length)
  const cycle = params.get('cycle') ?? ''
  const lang  = normalizeLang(locale)

  /* Champs additionnels selon le sujet, tous facultatifs */
  const [extra, setExtra] = useState<Record<string, string>>(() => (cycle ? { cycle } : ({} as Record<string, string>)))
  const [ndaRequested, setNdaRequested] = useState(false)
  const fields: readonly FieldDef[] = SUBJECT_FIELDS[subject as keyof typeof SUBJECT_FIELDS] ?? []
  const showNda = (NDA_SUBJECTS as readonly string[]).includes(subject)
  const setExtraValue = (key: string, value: string) => setExtra(prev => ({ ...prev, [key]: value }))

  const phoneCountries = useMemo(() => sortAlpha(COUNTRY_OPTIONS.map(c => ({ ...c, label: countryName(c.code, locale) })), c => c.label, locale), [locale])
  const subjectList = useMemo(() => [...sortAlpha(subjects.filter(s => s !== 'other'), s => t(`subjects.${s}`), locale), 'other' as const], [locale, t])
  const phoneCountryData = phoneCountries.find(c => c.code === phoneCountry) ?? phoneCountries[0]

  /* Le bouton s'active seulement quand tous les champs sont remplis */
  const phoneDigits = phone.replace(/\D/g, '')
  const isComplete  =
    name.trim().length > 0 &&
    email.trim().length > 0 &&
    subject !== '' &&
    phoneDigits.length > 0 &&
    message.trim().length > 0

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!isComplete) return
    setStatus('sending')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    const visibleKeys = new Set(fields.map(f => f.key))
    const extraPayload = Object.fromEntries(Object.entries(extra).filter(([k, v]) => visibleKeys.has(k) && v))
    const phoneFormatted = phoneDigits ? `${phoneCountryData.dial} ${phoneDigits}` : ''

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, phone: phoneFormatted, locale, cycle: cycle || undefined, extra: extraPayload, ndaRequested: showNda && ndaRequested, subjectLabel: subject ? t(`subjects.${subject}` as Parameters<typeof t>[0]) : undefined }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setErrorCode(body?.error ?? 'send_failed')
        setStatus('error')
        return
      }
      setStatus('sent')
      setMsgLen(0)
      setName(''); setEmail(''); setCompany(''); setSubject(''); setPhone(''); setMessage(''); setExtra({}); setNdaRequested(false)
      form.reset()
    } catch {
      setErrorCode('network')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start justify-center gap-4 rounded-2xl border border-ag-apex/30 bg-ag-apex/5 p-10">
        <span className="font-sans font-semibold text-2xl text-ag-apex-ink">✓</span>
        <p className="font-sans text-xl font-bold text-ag-dark">{t('success.title')}</p>
        <p className="text-sm text-ag-gray">{t('success.desc')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Nom + Email */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className={labelCls}>{t('name')} *</label>
          <input
            id="name" name="name" type="text" required
            value={name} onChange={e => setName(e.target.value)}
            className={inputCls} placeholder={t('name')}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelCls}>{t('email')} *</label>
          <input
            id="email" name="email" type="email" required
            value={email} onChange={e => setEmail(e.target.value)}
            className={inputCls} placeholder={t('email')}
          />
        </div>
      </div>

      {/* Société */}
      <div>
        <label htmlFor="company" className={labelCls}>{t('company')}</label>
        <input
          id="company" name="company" type="text"
          value={company} onChange={e => setCompany(e.target.value)}
          className={inputCls} placeholder={t('company')}
        />
      </div>

      {/* Téléphone avec indicatif */}
      <div>
        <label htmlFor="phone" className={labelCls}>{t('phone')} *</label>
        <div className="flex gap-2">
          <select
            value={phoneCountry}
            onChange={e => { setPhoneCountry(e.target.value); setPhone('') }}
            className={`${selectCls} shrink-0 w-auto pr-8`}
          >
            {phoneCountries.map(c => (
              <option key={c.code} value={c.code}>{c.dial} {c.label}</option>
            ))}
          </select>
          <input
            id="phone" name="phone_local" type="tel"
            value={phone}
            onChange={e => {
              const digits = e.target.value.replace(/[^\d\s]/g, '')
              if (digits.replace(/\s/g, '').length <= phoneCountryData.maxLen)
                setPhone(digits)
            }}
            placeholder={`ex. ${phoneCountryData.maxLen} chiffres`}
            maxLength={phoneCountryData.maxLen + 4}
            className={`${inputCls} flex-1`}
          />
        </div>
        <p className="font-sans text-[10px] text-ag-gray-light mt-1">
          Indicatif : {phoneCountryData.dial} — {phoneCountryData.maxLen} chiffres max
        </p>
      </div>

      {/* Sujet */}
      <div>
        <label htmlFor="subject" className={labelCls}>{t('subject')} *</label>
        <select
          id="subject" name="subject" required
          value={subject} onChange={e => setSubject(e.target.value)}
          className={`${selectCls} w-full`}
        >
          <option value="" disabled className="text-ag-gray-light">
            {t('subjectPlaceholder')}
          </option>
          {subjectList.map((s) => (
            <option key={s} value={s} className="bg-ag-off-white">
              {t(`subjects.${s}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Champs additionnels selon le sujet (facultatifs) */}
      {fields.length > 0 && (
        <div className="space-y-5 rounded-2xl border border-ag-border bg-ag-off-white/60 p-5">
          <p className="font-sans text-[11px] text-ag-gray-light">{UI.detailsHint[lang]}</p>
          <div className={`grid gap-5 ${fields.length > 1 ? 'sm:grid-cols-2' : ''}`}>
            {fields.map(f => (
              <div key={f.key}>
                <label htmlFor={`extra-${f.key}`} className={labelCls}>
                  {FIELD_LABELS[f.key][lang]} <span className="normal-case tracking-normal">({UI.optional[lang]})</span>
                </label>
                {f.kind === 'text' ? (
                  <input
                    id={`extra-${f.key}`} type="text" maxLength={200}
                    value={extra[f.key] ?? ''} onChange={e => setExtraValue(f.key, e.target.value)}
                    className={inputCls}
                  />
                ) : (
                  <select
                    id={`extra-${f.key}`}
                    value={extra[f.key] ?? ''} onChange={e => setExtraValue(f.key, e.target.value)}
                    className={`${selectCls} w-full`}
                  >
                    <option value="">{UI.choose[lang]}</option>
                    {f.key === 'portfolioProject'
                      ? [
                          ...PORTFOLIO_PROJECTS.map(a => <option key={a.id} value={a.id}>{a.name}</option>),
                          <option key="none" value="none">{OPTION_LABELS['portfolioProject.none'][lang]}</option>,
                        ]
                      : (f.options ?? []).map(o => (
                          <option key={o} value={o}>{OPTION_LABELS[`${f.key}.${o}`]?.[lang] ?? o}</option>
                        ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message */}
      <div>
        <label htmlFor="message" className={labelCls}>{t('message')} *</label>
        <textarea
          id="message" name="message" rows={5} required
          maxLength={MSG_LIMIT}
          value={message}
          onChange={e => { setMessage(e.target.value); setMsgLen(e.target.value.length) }}
          className={`${inputCls} resize-none`}
          placeholder={t('message')}
        />
        <p className={`text-right font-sans text-[10px] mt-1 tabular-nums ${
          msgLen >= MSG_LIMIT ? 'text-red-400' : 'text-ag-gray-light'
        }`}>
          {msgLen}/{MSG_LIMIT}
        </p>
      </div>

      {showNda && (
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox" checked={ndaRequested} onChange={e => setNdaRequested(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 rounded border-ag-border accent-ag-navy"
          />
          <span className="font-sans text-[13px] text-ag-black leading-relaxed">
            {UI.ndaLabel[lang]}
            <span className="mt-1 block text-[12px] text-ag-gray leading-relaxed">{UI.ndaHelp[lang]}</span>
          </span>
        </label>
      )}

      {status === 'error' && (
        <p className="font-sans text-xs text-red-400">
          {t('error')}{' '}
          <a
            href="mailto:contact@boha-group.com"
            className="underline underline-offset-2 hover:text-red-300 transition-colors"
          >
            contact@boha-group.com
          </a>
          {errorCode && process.env.NODE_ENV === 'development' && (
            <span className="ml-2 opacity-50">({errorCode})</span>
          )}
        </p>
      )}

      {/* Bouton — vert uniquement quand tous les champs sont remplis */}
      <button
        type="submit"
        disabled={!isComplete || status === 'sending'}
        className={`group flex items-center gap-3 rounded-full px-7 py-3.5 font-sans text-sm font-bold transition-all ${
          isComplete
            ? 'bg-ag-apex text-ag-navy hover:bg-ag-navy hover:text-white cursor-pointer'
            : 'bg-ag-border text-ag-gray-light cursor-not-allowed'
        } disabled:opacity-70`}
      >
        {status === 'sending' ? t('sending') : t('submit')}
        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </button>
    </form>
  )
}
