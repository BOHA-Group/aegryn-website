import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { AegrynLogo } from '@/components/brand/AegrynLogo'

const footerAssets = [
  { name: 'subblink',   href: 'https://subblink.boha-group.com', label: 'B2B', external: true },
  { name: 'neediu',     href: '/assets/neediu',     label: 'B2C', external: false },
  { name: 'primiom',   href: '/assets/primiom',    label: 'B2C', external: false },
  { name: 'movtoo',    href: '/assets/movtoo',     label: 'B2C', external: false },
  { name: 'hobconnect',href: '/assets/hobconnect', label: 'B2C', external: false },
]

const footerNav = [
  { label: 'About',    href: '/about' },
  { label: 'Advisory', href: '/advisory' },
  { label: 'Assets',   href: '/what-we-build' },
  { label: 'Alliances',href: '/grow-with-us' },
  { label: 'Careers',  href: '/career' },
  { label: 'Contact',  href: '/contact' },
]

const socialLinks = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/aegryn/' },
  { label: 'Instagram', href: 'https://www.instagram.com/aegryn/' },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@aegryn' },
  { label: 'YouTube',   href: 'https://www.youtube.com/@aegryn' },
  { label: 'Facebook',  href: 'https://www.facebook.com/aegryn' },
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
            <p className="font-sans font-semibold text-[11px] text-white/60 tracking-[0.18em] uppercase mt-1">
              Engineered to Last
            </p>
            <p className="mt-2 font-sans font-semibold text-[11px] text-white/30">
              Swiss Tech Asset Builder
            </p>
            {/* Social links */}
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-semibold text-[10px] text-white/30 hover:text-ag-apex transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">Aegryn</p>
            <ul className="space-y-3">
              {footerNav.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/60 hover:text-white transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Assets */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">Ecosystem</p>
            <ul className="space-y-2.5">
              {footerAssets.map(({ name, href, label, external }) => (
                <li key={name}>
                  <Link
                    href={href}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="group flex items-center gap-0 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    <span className="flex-1">{name}</span>
                    <span className="w-8 shrink-0 font-sans font-semibold text-[9px] text-white/30 group-hover:text-ag-apex transition-colors text-right">
                      {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Advisory CTA */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">Advisory</p>
            <p className="text-sm text-white/60 leading-relaxed mb-6">
              Strategic clarity in Data, AI and Cybersecurity.
            </p>
            <Link
              href="/advisory"
              className="inline-flex items-center gap-2 border border-ag-apex/40 px-4 py-2 font-sans font-semibold text-xs text-ag-apex hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
            >
              Book a session ↗
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="font-sans font-semibold text-[10px] text-white/30">
            © 2025 Aegryn. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {legal.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="font-sans font-semibold text-[10px] text-white/30 hover:text-white/60 transition-colors"
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
