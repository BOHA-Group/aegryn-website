'use client'

import Link            from 'next/link'
import Image           from 'next/image'
import { useEffect, useRef } from 'react'
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
  { label: 'LinkedIn', href: 'https://www.linkedin.com/company/106273747/' },
]

const legal = [
  { key: 'privacy', href: '/privacy', external: false },
]

const footerNavLinks = [
  { navKey: 'about'      as const, href: '/about' },
  { navKey: 'auction'    as const, href: '/auction' },
  { navKey: 'grade'      as const, href: '/grade' },
  { navKey: 'advisory'   as const, href: '/advisory' },
  { navKey: 'whatWeBuild'as const, href: '/what-we-build' },
  { navKey: 'growWithUs' as const, href: '/alliances' },
  { navKey: 'career'     as const, href: '/career' },
  { navKey: 'contact'    as const, href: '/contact' },
]

export default function Footer() {
  const t    = useTranslations('footer')
  const tNav = useTranslations('nav')

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
            <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
              {socialLinks.map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="font-sans font-semibold text-[10px] text-white/30 hover:text-ag-apex transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">
              {t('navLabel')}
            </p>
            <ul className="space-y-2.5">
              {footerNavLinks.map(({ navKey, href }) => (
                <li key={href}>
                  <Link href={href} className="text-sm text-white/75 hover:text-white transition-colors">
                    {tNav(navKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ecosystem — single catalogue link */}
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
            </ul>
          </div>

          {/* Roadmap — single link */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/60 uppercase mb-4">
              {t('roadmap.title')}
            </p>
            <ul className="space-y-2.5">
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
              <Link
                key={key}
                href={href}
                {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="font-sans font-semibold text-[10px] text-white/45 hover:text-white transition-colors"
              >
                {t(key as 'privacy')}
              </Link>
            ))}
          </div>
        </div>
      </div>

    </footer>
  )
}
