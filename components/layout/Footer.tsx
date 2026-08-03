'use client'

import { Link }        from '@/i18n/navigation'
import Image           from 'next/image'
import { useEffect, useRef, type ComponentProps } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

/**
 * Spinning contact medallion.
 * textLength forces the text to span exactly the circumference → no gap, no overlap.
 * Circumference = 2π × R. SIZE=110, R=44 → C ≈ 276.46px used as textLength.
 */
function FooterMedallion({ medallionText, contactLabel }: { medallionText: string; contactLabel: string }) {
  const ringRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const r = gsap.to(ringRef.current, { rotation: 360, duration: 26, ease: 'none', repeat: -1 })
    return () => { r.kill() }
  }, [])
  const SIZE = 110
  const CX   = 55
  const CY   = 55
  const R    = 44
  const CIRC = Math.round(2 * Math.PI * R * 10) / 10  // ≈ 276.5
  return (
    <Link href="/contact" aria-label={contactLabel}
      className="relative inline-flex items-center justify-center group"
      style={{ width: SIZE, height: SIZE }}>
      <div ref={ringRef} className="absolute inset-0" aria-hidden="true">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full">
          <defs>
            <path
              id="footer-medal-ring"
              d={`M ${CX},${CY} m -${R},0 a ${R},${R} 0 1,1 ${R*2},0 a ${R},${R} 0 1,1 -${R*2},0`}
            />
          </defs>
          <text
            style={{ fontSize: 7.5, fontFamily: 'inherit', fontWeight: 600 }}
            fill="rgba(90,221,164,0.8)"
          >
            <textPath href="#footer-medal-ring" textLength={CIRC} lengthAdjust="spacing">
              {medallionText}
            </textPath>
          </text>
        </svg>
      </div>
      <div className="relative w-12 h-12 rounded-full bg-ag-apex/15 border border-ag-apex/40 flex items-center justify-center
        group-hover:bg-ag-apex group-hover:border-ag-apex transition-all duration-300">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
          className="text-ag-apex group-hover:text-ag-navy transition-colors duration-300">
          <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  )
}


const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/106273747/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/boha_group/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: 'https://www.tiktok.com/@aegryn.auction',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://www.youtube.com/@aegryn.auction',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
]

type LinkHref = ComponentProps<typeof Link>['href']

const legal: { key: string; href: LinkHref; ns: string; external?: boolean }[] = [
  { key: 'termsUse',  href: '/terms/use',  ns: 'legalNav' },
  { key: 'termsCgv',  href: '/terms/cgv',  ns: 'legalNav' },
  { key: 'privacy',   href: '/privacy',    ns: 'legalNav' },
  { key: 'security',  href: '/security',   ns: 'legalNav' },
  { key: 'faq',       href: '/help/faq',   ns: 'legalNav' },
  { key: 'sitemap',   href: '/sitemap',    ns: 'legalNav' },
]

const companyLinks: { navKey: 'about' | 'career' | 'contact'; href: LinkHref }[] = [
  { navKey: 'about',   href: '/about' },
  { navKey: 'career',  href: '/career' },
  { navKey: 'contact', href: '/contact' },
]

const servicesLinks: { navKey: 'auction' | 'grade' | 'advisory' | 'growWithUs' | 'servicesBuild' | 'servicesAdvisory' | 'servicesAcquisition' | 'servicesAlliances'; href: LinkHref }[] = [
  { navKey: 'servicesBuild',       href: '/services/build' },
  { navKey: 'servicesAdvisory',    href: '/advisory' },
  { navKey: 'servicesAcquisition', href: '/services/acquisition-support' },
  { navKey: 'servicesAlliances',   href: '/alliances' },
  { navKey: 'auction',             href: '/auction' },
  { navKey: 'grade',               href: '/grade' },
]

export default function Footer() {
  const t    = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tL   = useTranslations('legalNav')

  return (
    <footer className="bg-ag-navy border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand */}
          <div className="col-span-full lg:col-span-1">
            <Image
              src="/images/logo-aegryn.png"
              alt="Aegryn"
              width={100}
              height={44}
              className="h-8 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="font-sans font-semibold text-[11px] text-white/60 tracking-[0.18em] uppercase mt-1">
              {t('tagline')}
            </p>
            <p className="mt-2 font-sans font-semibold text-[11px] text-white/30">
              {t('swissTagline')}
            </p>
            <div className="mt-5 flex items-center gap-4">
              {socialLinks.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/40 hover:text-ag-apex transition-colors duration-200">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Entreprise */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">
              {t('companyLabel')}
            </p>
            <ul className="space-y-2.5">
              {companyLinks.map(({ navKey, href }) => (
                <li key={navKey}>
                  <Link href={href} className="text-sm text-white/75 hover:text-white transition-colors">
                    {tNav(navKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">
              {t('servicesLabel')}
            </p>
            <ul className="space-y-2.5">
              {servicesLinks.map(({ navKey, href }) => (
                <li key={navKey}>
                  <Link href={href} className="text-sm text-white/75 hover:text-white transition-colors">
                    {tNav(navKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Écosystème — actifs, blog, roadmap */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">
              {t('ecosystemLabel')}
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/what-we-build" className="text-sm text-white/75 hover:text-white transition-colors">
                  {t('ecosystemCatalogLink')}
                </Link>
              </li>
              <li>
                <Link href="/assets" className="text-sm text-white/75 hover:text-white transition-colors">
                  {t('assetsLink')}
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-white/75 hover:text-white transition-colors">
                  {t('blogLink')}
                </Link>
              </li>
              <li>
                <Link href={"/glossaire" as never} className="text-sm text-white/75 hover:text-white transition-colors">
                  {t('glossaryLink')}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-sm text-white/75 hover:text-white transition-colors">
                  {t('roadmap.link')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Advisory CTA — macaron contact */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">
              {t('advisoryLabel')}
            </p>
            <p className="text-sm text-white/75 leading-relaxed mb-5">
              {t('advisoryDesc')}
            </p>
            {/* Medallion inline (static version — no spin here) */}
            <FooterMedallion
              medallionText={t('medallionText')}
              contactLabel={t('contactLabel')}
            />
          </div>
        </div>

        {/* Legal strip — compact, fused above marquee */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
          <p className="font-sans font-semibold text-[10px] text-white/45">
            {t('legal')}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {legal.map(({ key, href, external }) => (
              external ? (
                <a
                  key={key}
                  href={href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-semibold text-[10px] text-white/45 hover:text-white transition-colors"
                >
                  {tL(key as 'termsUse')}
                </a>
              ) : (
                <Link
                  key={key}
                  href={href}
                  className="font-sans font-semibold text-[10px] text-white/45 hover:text-white transition-colors"
                >
                  {tL(key as 'termsUse')}
                </Link>
              )
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
