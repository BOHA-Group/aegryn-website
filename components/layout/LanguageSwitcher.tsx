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
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1.5 text-aegryn-cream2">
      <Globe size={13} className="opacity-60" aria-hidden="true" />
      <select
        value={locale}
        onChange={handleChange}
        aria-label="Sélectionner la langue"
        className="bg-transparent font-mono text-xs uppercase tracking-widest text-aegryn-cream2 cursor-pointer hover:text-aegryn-cream transition-colors appearance-none pr-1 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aegryn-apex"
      >
        {locales.map(({ code, label }) => (
          <option key={code} value={code} className="bg-white text-aegryn-obsidian">
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
