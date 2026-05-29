import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { AegrynLogo } from '@/components/brand/AegrynLogo'

const footerAssets = [
  { name: 'Subblink',    href: '/assets/subblink',    label: 'B2B' },
  { name: 'Neediu',      href: '/assets/neediu',      label: 'B2C' },
  { name: 'Primiom',     href: '/assets/primiom',     label: 'B2C' },
  { name: 'Movtoo',      href: '/assets/movtoo',      label: 'B2C' },
  { name: 'Hobconnect',  href: '/assets/hobconnect',  label: 'B2C' },
]

const legal = [
  { key: 'privacy', href: '/privacy' },
  { key: 'terms',   href: '/terms' },
]

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-ag-navy border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-full lg:col-span-1">
            <AegrynLogo size={24} variant="full" onDark className="mb-4" />
            <p className="font-mono text-[11px] text-white/40 tracking-[0.18em] uppercase mt-1">
              Engineered to Last
            </p>
            <p className="mt-2 font-mono text-[11px] text-white/30">
              Swiss Tech Asset Builder
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4">Aegryn</p>
            <ul className="space-y-3 text-sm text-white/60">
              <li><Link href="/about" className="hover:text-white transition-colors">À propos</Link></li>
              <li><Link href="/what-we-build" className="hover:text-white transition-colors">Nos actifs</Link></li>
              <li><Link href="/advisory" className="hover:text-white transition-colors">Advisory</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Assets */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4">Écosystème</p>
            <ul className="space-y-3">
              {footerAssets.map(({ name, href, label }) => (
                <li key={name}>
                  <Link
                    href={href}
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    {name}
                    <span className="font-mono text-[9px] text-white/30 group-hover:text-ag-apex transition-colors">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Advisory CTA */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase mb-4">Advisory</p>
            <p className="text-sm text-white/60 leading-relaxed mb-4">
              Nous protégeons ce que vous construisez.
            </p>
            <Link
              href="/advisory"
              className="inline-flex items-center gap-2 border border-ag-apex/40 px-4 py-2 font-mono text-xs text-ag-apex hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
            >
              Découvrir
              <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[10px] text-white/30">
            {t('legal')}
          </p>
          <div className="flex items-center gap-6">
            {legal.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="font-mono text-[10px] text-white/30 hover:text-white/60 transition-colors"
              >
                {t(key)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
