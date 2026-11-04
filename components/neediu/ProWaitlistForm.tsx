'use client'

import { useMemo, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ChevronDown } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { countryName, sortAlpha } from '@/lib/countries'
import { NEEDIU_CITIES } from '@/lib/neediuPro'
import { PHONE_COUNTRIES as ALL_PHONE_COUNTRIES, phoneExample } from '@/content/neediu/phoneCountries'

/** Indicatifs limités aux pays des villes proposées (France, Belgique, Suisse). */
const PHONE_COUNTRIES = ALL_PHONE_COUNTRIES.filter(c => NEEDIU_CITIES.some(v => v.country === c.code))
import { NEEDIU_SERVICES, NEEDIU_THEMES, NEEDIU_THEME_LABELS, type NeediuLocale } from '@/content/neediu/services'

const inputCls = 'w-full rounded-lg border border-ag-border bg-ag-white px-4 py-3 font-sans text-[14px] text-ag-black placeholder:text-ag-gray-light transition-colors focus:border-ag-black focus:outline-none read-only:bg-ag-off-white read-only:text-ag-gray'
const labelCls = 'mb-1.5 block font-sans text-[12px] font-semibold text-ag-black'

type Status = 'idle' | 'sending' | 'done' | 'test' | 'validation' | 'phone' | 'error'

/** Formulaire de préinscription des pros : champs alignés sur provider_profiles (société, TVA, ville, services). */
export function ProWaitlistForm() {
  const t = useTranslations('neediuPro')
  const locale = useLocale() as NeediuLocale
  const [services, setServices] = useState<string[]>([])
  const [cityKey, setCityKey] = useState('')
  const [dial, setDial] = useState('CH')
  const [status, setStatus] = useState<Status>('idle')

  const city = NEEDIU_CITIES.find(c => c.key === cityKey)
  const dialCountries = useMemo(() => sortAlpha(PHONE_COUNTRIES, c => countryName(c.code, locale), locale), [locale])
  const phoneCountry = PHONE_COUNTRIES.find(c => c.code === dial) ?? PHONE_COUNTRIES[0]
  const groups = useMemo(() => NEEDIU_THEMES.map(theme => ({
    theme,
    items: sortAlpha(NEEDIU_SERVICES.filter(s => s.theme === theme), s => s.label[locale], locale),
  })), [locale])

  const toggle = (k: string) => setServices(s => (s.includes(k) ? s.filter(x => x !== k) : [...s, k]))
  const pickCity = (k: string) => {
    setCityKey(k)
    const c = NEEDIU_CITIES.find(x => x.key === k)
    if (c) setDial(c.country)
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return
    const f = new FormData(e.currentTarget)
    const get = (k: string) => String(f.get(k) ?? '').trim()
    const national = get('phone').replace(/\D/g, '').replace(/^0+/, '')
    if (national.length !== phoneCountry.digits) { setStatus('phone'); return }
    if (!services.length) { setStatus('validation'); return }
    setStatus('sending')
    try {
      const res = await fetch('/api/neediu/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: get('firstName'), lastName: get('lastName'), email: get('email'), phone: phoneCountry.dial + national,
          companyName: get('companyName'), vat: get('vat'), cityKey,
          services, consent: f.get('consent') === 'on', website: get('website'), locale,
        }),
      })
      const body = res.ok ? await res.json().catch(() => ({})) : {}
      setStatus(res.ok ? (body.dryRun ? 'test' : 'done') : res.status === 400 ? 'validation' : 'error')
    } catch { setStatus('error') }
  }

  if (status === 'done' || status === 'test') {
    return (
      <div role="status" className="space-y-3">
        <p className="rounded-xl bg-ag-apex/15 px-5 py-4 font-sans text-[15px] font-semibold text-ag-navy">{t('form.success')}</p>
        {status === 'test' && <p className="font-sans text-[13px] text-ag-gray">{t('form.testMode')}</p>}
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-describedby="pro-form-note">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label htmlFor="pro-first" className={labelCls}>{t('form.firstName')}</label><input id="pro-first" name="firstName" required autoComplete="given-name" maxLength={80} className={inputCls} /></div>
        <div><label htmlFor="pro-last" className={labelCls}>{t('form.lastName')}</label><input id="pro-last" name="lastName" required autoComplete="family-name" maxLength={80} className={inputCls} /></div>
        <div><label htmlFor="pro-company" className={labelCls}>{t('form.companyName')}</label><input id="pro-company" name="companyName" required autoComplete="organization" maxLength={160} className={inputCls} /></div>
        <div><label htmlFor="pro-vat" className={labelCls}>{t('form.vat')}</label><input id="pro-vat" name="vat" required maxLength={30} className={inputCls} /></div>
        <div><label htmlFor="pro-email" className={labelCls}>{t('form.email')}</label><input id="pro-email" name="email" type="email" required autoComplete="email" maxLength={160} className={inputCls} /></div>
        <div>
          <label htmlFor="pro-phone" className={labelCls}>{t('form.phone')}</label>
          <div className="grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-2">
            <select aria-label={t('form.dialCode')} value={dial} onChange={e => setDial(e.target.value)} className={`${inputCls} appearance-none px-3`}>
              {dialCountries.map(c => <option key={c.code} value={c.code}>{c.dial} {countryName(c.code, locale)}</option>)}
            </select>
            <input id="pro-phone" name="phone" type="tel" required autoComplete="tel-national" inputMode="tel" placeholder={phoneExample(phoneCountry.fmt)} maxLength={20} className={inputCls} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="pro-city" className={labelCls}>{t('form.city')}</label>
          <select id="pro-city" required value={cityKey} onChange={e => pickCity(e.target.value)} className={`${inputCls} appearance-none`}>
            <option value="" disabled>{t('form.cityPlaceholder')}</option>
            {NEEDIU_CITIES.map(c => <option key={c.key} value={c.key}>{t(`form.cities.${c.key}`)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="pro-country" className={labelCls}>{t('form.country')}</label>
          <input id="pro-country" readOnly tabIndex={-1} value={city ? countryName(city.country, locale) : ''} placeholder={t('form.countryAuto')} className={inputCls} />
        </div>
      </div>

      <details className="group rounded-lg border border-ag-border bg-ag-white open:border-ag-black">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-sans text-[14px] text-ag-black [&::-webkit-details-marker]:hidden">
          <span><span className="font-semibold">{t('form.services')}</span>
            <span className="ml-2 text-ag-gray-light">{services.length ? `${services.length} ${t('form.servicesCount')}` : t('form.servicesHint')}</span></span>
          <ChevronDown size={16} className="shrink-0 transition-transform group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="space-y-5 border-t border-ag-border px-4 py-4">
          {groups.map(({ theme, items }) => (
            <fieldset key={theme} className="min-w-0 border-0 p-0">
              <legend className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{NEEDIU_THEME_LABELS[theme][locale]}</legend>
              <div className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                {items.map(s => (
                  <label key={s.key} className="flex items-center gap-2.5 font-sans text-[14px] text-ag-dark">
                    <input type="checkbox" checked={services.includes(s.key)} onChange={() => toggle(s.key)} className="accent-ag-navy" />
                    {s.label[locale]}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>
      </details>

      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      <label className="flex items-start gap-3 font-sans text-[13px] leading-relaxed text-ag-gray">
        <input type="checkbox" name="consent" required className="mt-0.5 accent-ag-navy" />
        <span>
          {t('form.consentBefore')}
          <Link href={{ pathname: '/data-protection-notice-neediu', hash: 'notice' }} className="font-semibold text-ag-navy underline underline-offset-2">{t('form.consentLink')}</Link>
          {t('form.consentAfter')}
        </span>
      </label>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-ag-apex px-6 py-3.5 font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-ag-navy transition-colors hover:bg-ag-apex/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === 'sending' ? t('form.sending') : t('form.submit')}
      </button>

      <p id="pro-form-note" role="status" className="min-h-5 font-sans text-[13px] text-ag-grade-refused">
        {status === 'phone' ? t('form.phoneInvalid') : status === 'validation' ? t('form.validation') : status === 'error' ? t('form.error') : ''}
      </p>
    </form>
  )
}
