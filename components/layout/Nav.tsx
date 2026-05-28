'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import AegrynLogo from '@/components/ui/AegrynLogo'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'

const navLinks = [
  { key: 'about',        href: '/about' },
  { key: 'whatWeBuild',  href: '/what-we-build' },
  { key: 'advisory',    href: '/advisory' },
  { key: 'contact',     href: '/contact' },
] as const

export default function Nav() {
  const t = useTranslations('nav')
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.08] bg-white/90 backdrop-blur-xl">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        aria-label="Navigation principale"
      >
        <Link href="/" aria-label="Aegryn — Accueil">
          <AegrynLogo className="h-7 w-auto" variant="navy" />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 text-sm md:flex">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="font-mono text-xs tracking-widest text-aegryn-cream2 uppercase transition-colors hover:text-aegryn-cream"
            >
              {t(key)}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="group flex items-center gap-2 rounded-full border border-aegryn-apex/40 px-5 py-2 text-xs font-bold text-aegryn-apex transition-all hover:border-aegryn-apex hover:bg-aegryn-apex hover:text-aegryn-obsidian"
          >
            Contact
            <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-aegryn-cream2 transition-colors hover:text-aegryn-cream md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-black/[0.08] bg-aegryn-bg2 px-6 py-6 md:hidden">
          <div className="flex flex-col gap-5">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="font-mono text-xs tracking-widest text-aegryn-cream2 uppercase hover:text-aegryn-cream"
                onClick={() => setOpen(false)}
              >
                {t(key)}
              </Link>
            ))}
            <div className="mt-2 pt-4 border-t border-black/[0.08]">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
