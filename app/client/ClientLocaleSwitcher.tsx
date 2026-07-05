'use client'

import { useLocale } from 'next-intl'
import { useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

const locales = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
  { code: 'nl', label: 'NL' },
]

export default function ClientLocaleSwitcher() {
  const locale = useLocale()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    document.cookie = `ag-locale-pref=${newLocale}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`
    router.refresh()
  }

  return (
    <div className="absolute top-6 right-6 flex items-center gap-1.5 text-white/40">
      <Globe size={13} className="opacity-60" aria-hidden="true" />
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Sélectionner la langue"
        className="bg-transparent font-sans font-semibold text-[11px] uppercase tracking-[0.12em] text-white/40 cursor-pointer hover:text-white transition-colors appearance-none pr-1 focus:outline-none"
      >
        {locales.map(({ code, label }) => (
          <option key={code} value={code} className="bg-ag-navy text-white">
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
