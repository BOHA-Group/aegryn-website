'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname as useNextPathname } from 'next/navigation'
import { useState } from 'react'
import { Globe } from 'lucide-react'
import { setLocaleCookie } from '@/app/actions/setLocale'

const locales = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
  { code: 'nl', label: 'NL' },
]

const KNOWN_LOCALES = locales.map(l => l.code)

export default function LanguageSwitcher() {
  const locale       = useLocale()
  const t            = useTranslations('languageSwitcher')
  const nextPathname = useNextPathname()
  const [pending, setPending] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    setPending(true)

    const segments = nextPathname.split('/')
    let targetPath: string
    if (KNOWN_LOCALES.includes(segments[1])) {
      segments[1] = newLocale
      targetPath = segments.join('/')
    } else {
      targetPath = nextPathname
    }

    /* setLocaleCookie pose le cookie et retourne le chemin.
       On navigue ensuite avec window.location.assign pour un rechargement
       propre sans popup "Recharger la page ?" et sans NEXT_REDIRECT crash. */
    const path = await setLocaleCookie(newLocale, targetPath)
    window.location.assign(path)
  }

  return (
    <div className="flex items-center gap-1.5 text-ag-gray">
      <Globe size={13} className={`opacity-60 ${pending ? 'animate-spin' : ''}`} aria-hidden="true" />
      <select
        value={locale}
        onChange={handleChange}
        disabled={pending}
        aria-label={t('select')}
        className="bg-transparent font-sans font-semibold text-[11px] uppercase tracking-[0.12em] text-ag-gray cursor-pointer hover:text-ag-black transition-colors appearance-none pr-1 focus:outline-none disabled:opacity-50"
      >
        {locales.map(({ code, label }) => (
          <option key={code} value={code} className="bg-white text-ag-dark">
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
