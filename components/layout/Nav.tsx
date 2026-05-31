'use client'

import Link             from 'next/link'
import Image            from 'next/image'
import { useTranslations } from 'next-intl'
import { useState }     from 'react'
import { usePathname, useParams } from 'next/navigation'
import { Menu, X }      from 'lucide-react'
import LanguageSwitcher  from '@/components/layout/LanguageSwitcher'
import { MusicPlayer }  from '@/components/ui/MusicPlayer'

const navLinks = [
  { key: 'home',        href: '/' },
  { key: 'about',       href: '/about' },
  { key: 'advisory',    href: '/advisory' },
  { key: 'whatWeBuild', href: '/what-we-build' },
  { key: 'growWithUs',  href: '/grow-with-us' },
  { key: 'career',      href: '/career' },
] as const

export default function Nav() {
  const t      = useTranslations('nav')
  const params = useParams()
  const locale = (params?.locale as string) ?? 'fr'
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  /* Strip locale prefix to get bare path, e.g. /fr/about → /about */
  const barePath = pathname.replace(new RegExp(`^/${locale}`), '') || '/'

  const isActive = (href: string) =>
    href === '/' ? barePath === '/' : barePath === href || barePath.startsWith(href + '/')

  return (
    <header className="sticky top-0 z-50 bg-ag-white border-b border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" aria-label="Aegryn — Accueil" className="hover:opacity-80 transition-opacity duration-200">
          <Image
            src="/images/logo-aegryn.png"
            alt="Aegryn"
            width={120}
            height={52}
            className="h-9 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <nav className="hidden lg:flex items-center gap-10" aria-label="Navigation principale">
          {navLinks.map(({ key, href }) => {
            const active = isActive(href)
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`link-underline font-sans font-semibold text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 ${
                  active
                    ? 'text-ag-black link-active'
                    : 'text-ag-gray hover:text-ag-black'
                }`}
              >
                {t(key)}
              </Link>
            )
          })}
        </nav>

        {/* Right side: player + locale + contact CTA */}
        <div className="hidden lg:flex items-center gap-6">
          <MusicPlayer />
          <span className="w-px h-4 bg-ag-border" />
          <LanguageSwitcher />
          <Link
            href="/contact"
            className="font-sans font-semibold text-[11px] tracking-[0.14em] uppercase border border-ag-border px-4 py-2 text-ag-dark hover:border-ag-black hover:text-ag-black transition-all duration-200"
          >
            {t('contact')}
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
            {navLinks.map(({ key, href }) => {
              const active = isActive(href)
              return (
                <Link
                  key={key}
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`link-underline font-sans font-semibold text-[11px] tracking-[0.12em] uppercase transition-colors ${
                    active
                      ? 'text-ag-black link-active'
                      : 'text-ag-gray hover:text-ag-black'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(key)}
                </Link>
              )
            })}
            <Link
              href="/contact"
              className="font-sans font-semibold text-[11px] tracking-[0.14em] uppercase border border-ag-border px-4 py-2.5 text-ag-dark text-center hover:border-ag-black transition-all"
              onClick={() => setOpen(false)}
            >
              {t('contact')}
            </Link>
            <div className="pt-2 border-t border-ag-border">
              <LanguageSwitcher />
            </div>
            <div className="pt-2 border-t border-ag-border">
              <MusicPlayer />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
