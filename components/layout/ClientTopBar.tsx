'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AegrynLogo } from '@/components/brand/AegrynLogo'
import { ExternalLink } from 'lucide-react'

const NAV_LINKS = [
  { href: '/auction/catalog', label: 'Catalogue' },
  { href: '/grade',           label: 'Grade' },
  { href: '/assets',          label: 'Actifs' },
  { href: '/advisory',        label: 'Advisory' },
  { href: '/blog',            label: 'Blog' },
]

export default function ClientTopBar() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-gray-200 flex items-center px-5 gap-6">
      {/* Logo */}
      <Link href="/" className="shrink-0 hover:opacity-70 transition-opacity" aria-label="AEGRYN — Accueil">
        <AegrynLogo size={22} variant="full" />
      </Link>

      {/* Séparateur */}
      <div className="h-5 w-px bg-gray-200 shrink-0" aria-hidden="true" />

      {/* Liens site public */}
      <nav className="hidden md:flex items-center gap-5 flex-1" aria-label="Navigation site AEGRYN">
        {NAV_LINKS.map(({ href, label }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
                isActive ? 'text-ag-navy' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Lien "Retour au site" visible sur mobile */}
      <div className="ml-auto flex items-center gap-1">
        <Link
          href="/"
          className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors"
        >
          <ExternalLink size={10} />
          <span className="hidden sm:inline">Site AEGRYN</span>
        </Link>
      </div>
    </header>
  )
}
