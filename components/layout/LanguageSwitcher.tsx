'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { Globe } from 'lucide-react'

const locales = [
  { code: 'fr', label: 'FR' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'es', label: 'ES' },
  { code: 'nl', label: 'NL' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    /* Persist manual choice — overrides GeoIP for 1 year */
    document.cookie = `ag-locale-pref=${newLocale}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`

    const segments = pathname.split('/')
    const knownLocales = locales.map(l => l.code)
    /* Public site: URL is locale-prefixed (/fr/...) → swap the segment.
       Client / admin spaces: not prefixed → just refresh (cookie drives locale). */
    if (knownLocales.includes(segments[1])) {
      segments[1] = newLocale
      router.push(segments.join('/'))
    } else {
      /* /client/* et /admin/* ne sont pas préfixés par la locale —
         un simple refresh() ne relit pas le cookie côté serveur.
         Un reload complet est nécessaire pour que getTranslations() voie la nouvelle valeur. */
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-ag-gray">
      <Globe size={13} className="opacity-60" aria-hidden="true" />
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Sélectionner la langue"
        className="bg-transparent font-sans font-semibold text-[11px] uppercase tracking-[0.12em] text-ag-gray cursor-pointer hover:text-ag-black transition-colors appearance-none pr-1 focus:outline-none"
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
