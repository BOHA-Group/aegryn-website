'use client'

import { useLocale } from 'next-intl'
import { usePathname as useNextPathname } from 'next/navigation'
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

const KNOWN_LOCALES = locales.map(l => l.code)

export default function LanguageSwitcher() {
  const locale       = useLocale()
  const nextPathname = useNextPathname()
  const [pending, startTransition] = useTransition()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value

    /* Swap du segment de locale dans le pathname :
       /fr/a-propos → /en/a-propos (le middleware proxy.ts gère la redirection
       vers le bon pathname localisé via next-intl intlMiddleware) */
    const segments = nextPathname.split('/')
    let targetPath: string

    if (KNOWN_LOCALES.includes(segments[1])) {
      segments[1] = newLocale
      targetPath = segments.join('/')
    } else {
      targetPath = nextPathname
    }

    /* setLocaleCookie pose le cookie + appelle redirect(targetPath) côté serveur.
       Pas de router.replace() supplémentaire — évite le double redirect qui
       provoque "This page couldn't load" en preview. */
    startTransition(() => setLocaleCookie(newLocale, targetPath))
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
