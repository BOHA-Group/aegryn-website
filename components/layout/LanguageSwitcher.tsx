'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from 'next/navigation'
import { useTransition } from 'react'
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

export default function LanguageSwitcher() {
  const locale   = useLocale()
  const pathname = usePathname()
  const router   = useRouter()
  const [pending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    const segments  = pathname.split('/')
    const knownLocales = locales.map(l => l.code)

    if (knownLocales.includes(segments[1])) {
      /* Site public : URL préfixée — swap du segment + cookie via Server Action */
      segments[1] = newLocale
      const newPath = segments.join('/')
      startTransition(async () => {
        await setLocaleCookie(newLocale, newPath)
        router.push(newPath)
      })
    } else {
      /* /client/* et /admin/* : pas de préfixe URL — Server Action pose le cookie
         et redirige vers la même URL. Pas de popup "Recharger la page ?". */
      startTransition(() => setLocaleCookie(newLocale, pathname))
    }
  }

  return (
    <div className="flex items-center gap-1.5 text-ag-gray">
      <Globe size={13} className={`opacity-60 ${pending ? 'animate-spin' : ''}`} aria-hidden="true" />
      <select
        value={locale}
        onChange={handleChange}
        disabled={pending}
        aria-label="Sélectionner la langue"
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
