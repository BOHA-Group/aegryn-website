'use client'

import Link            from 'next/link'
import { useTranslations } from 'next-intl'
import { useState }    from 'react'
import { Menu, X }     from 'lucide-react'
import LanguageSwitcher from '@/components/layout/LanguageSwitcher'
import { AegrynLogo }  from '@/components/brand/AegrynLogo'

const navLinks = [
  { key: 'about',      href: '/about' },
  { key: 'advisory',   href: '/advisory' },
  { key: 'whatWeBuild', href: '/what-we-build' },
  { key: 'growWithUs', href: '/grow-with-us' },
  { key: 'career',     href: '/career' },
] as const

export default function Nav() {
  const t    = useTranslations('nav')
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-ag-white border-b border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" aria-label="Aegryn — Accueil" className="hover:opacity-70 transition-opacity duration-200">
          <AegrynLogo size={28} variant="full" />
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-10" aria-label="Navigation principale">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* Right side: locale + contact CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="font-mono text-[11px] tracking-[0.14em] uppercase border border-ag-border px-4 py-2 text-ag-dark hover:border-ag-black hover:text-ag-black transition-all duration-200"
          >
            Contact
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden rounded p-2 text-ag-gray hover:text-ag-black transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-ag-border bg-ag-white px-6 py-6">
          <div className="flex flex-col gap-5">
            {navLinks.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors"
                onClick={() => setOpen(false)}
              >
                {t(key)}
              </Link>
            ))}
            <Link
              href="/contact"
              className="font-mono text-[11px] tracking-[0.14em] uppercase border border-ag-border px-4 py-2.5 text-ag-dark text-center hover:border-ag-black transition-all"
              onClick={() => setOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 border-t border-ag-border">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
