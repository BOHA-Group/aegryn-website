'use client'

import { useLocale, useTranslations } from 'next-intl'
import { usePathname as useNextPathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Globe } from 'lucide-react'
import { setLocaleCookie } from '@/app/actions/setLocale'

const locales = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
  { code: 'it', label: 'Italiano' },
  { code: 'es', label: 'Español' },
  { code: 'nl', label: 'Nederlands' },
]

const KNOWN_LOCALES = locales.map(l => l.code)

export default function LanguageSwitcher({ dark = false }: { dark?: boolean }) {
  const locale       = useLocale()
  const t            = useTranslations('languageSwitcher')
  const nextPathname = useNextPathname()
  const [pending, setPending] = useState(false)
  const [open, setOpen]       = useState(false)
  const wrapRef   = useRef<HTMLDivElement>(null)
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setOpen(true)
  }
  const closeMenu = () => {
    leaveTimer.current = setTimeout(() => setOpen(false), 150)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('mousedown', onClickOutside)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('mousedown', onClickOutside)
    }
  }, [open])

  const handleSelect = async (newLocale: string) => {
    if (newLocale === locale) { setOpen(false); return }
    setPending(true)
    setOpen(false)

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

  const wrapCls   = dark ? 'text-white/70' : 'text-ag-gray'
  const btnCls    = dark
    ? 'bg-transparent font-mono text-[12px] uppercase tracking-[0.12em] text-white/70 cursor-pointer hover:text-white transition-colors focus:outline-none disabled:opacity-50'
    : 'bg-transparent font-mono text-[12px] uppercase tracking-[0.12em] text-ag-gray cursor-pointer hover:text-ag-black transition-colors focus:outline-none disabled:opacity-50'
  const listCls   = dark
    ? 'absolute left-0 top-full mt-2 min-w-[110px] rounded-lg border border-white/15 bg-ag-navy py-1 shadow-xl z-50'
    : 'absolute left-0 top-full mt-2 min-w-[110px] rounded-lg border border-ag-border bg-white py-1 shadow-lg z-50'

  return (
    <div
      ref={wrapRef}
      className={`relative flex items-center gap-1.5 ${wrapCls}`}
      onMouseEnter={openMenu}
      onMouseLeave={closeMenu}
    >
      <Globe size={13} className={`opacity-60 ${pending ? 'animate-spin' : ''}`} aria-hidden="true" />
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        disabled={pending}
        aria-label={t('select')}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={btnCls}
      >
        {locale.toUpperCase()}
      </button>

      {open && (
        <ul role="listbox" aria-label={t('select')} className={listCls}>
          {locales.map(({ code, label }) => {
            const current = code === locale
            return (
              <li key={code} role="option" aria-selected={current}>
                <button
                  type="button"
                  onClick={() => handleSelect(code)}
                  className={`w-full text-left px-4 py-2 font-sans text-[13px] transition-colors ${
                    current
                      ? 'text-ag-apex-ink'
                      : dark
                        ? 'text-white/60 hover:text-white'
                        : 'text-ag-gray hover:text-ag-black'
                  }`}
                >
                  {label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
