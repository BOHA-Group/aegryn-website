'use client'

import Link             from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useRef, useEffect } from 'react'
import { Menu, X, ChevronDown, User } from 'lucide-react'
import LanguageSwitcher  from '@/components/layout/LanguageSwitcher'
import { AegrynLogo }   from '@/components/brand/AegrynLogo'
import { gsap }          from '@/lib/gsap'

type DropdownKey = 'auction' | 'grade' | 'services' | null

const AUCTION_LINKS = [
  { labelKey: 'auctionCatalog',  href: '/auction/catalog' },
  { labelKey: 'auctionSell',     href: '/auction/how-to-sell' },
  { labelKey: 'auctionBuy',      href: '/auction/how-to-buy' },
  { labelKey: 'auctionSession',  href: '/auction' },
  { labelKey: 'auctionResults',  href: '/auction/results' },
]

const GRADE_LINKS = [
  { labelKey: 'gradeSystem',     href: '/grade' },
  { labelKey: 'gradeMethod',     href: '/grade/methodology' },
  { labelKey: 'gradeSubmit',     href: '/contact' },
]

const SERVICES_LINKS = [
  { labelKey: 'servicesAdvisory',   href: '/advisory' },
  { labelKey: 'servicesAlliances',  href: '/alliances' },
  { labelKey: 'servicesAcquisition',href: '/services/acquisition-support' },
]

function DropdownMenu({ links, t }: { links: { labelKey: string; href: string }[]; t: ReturnType<typeof useTranslations> }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-ag-white border border-ag-border shadow-lg z-50">
      {links.map(({ labelKey, href }) => (
        <Link
          key={labelKey}
          href={href}
          className="block px-5 py-3 font-sans text-[12px] text-ag-gray hover:text-ag-black hover:bg-ag-off-white transition-colors border-b border-ag-border/50 last:border-0"
        >
          {t(labelKey)}
        </Link>
      ))}
    </div>
  )
}

function GradeMegaMenu({
  t,
  onClose,
}: {
  t: ReturnType<typeof useTranslations>
  onClose: () => void
}) {
  const tg = useTranslations('gradeShowcase')

  const GRADES = [
    { label: 'AEG ★',   key: 'star', cls: 'border-ag-apex/40  bg-ag-apex/[0.06]  text-ag-apex'         },
    { label: 'AEG AAA', key: 'aaa',  cls: 'border-ag-navy/35  bg-ag-navy/[0.05]  text-ag-navy'         },
    { label: 'AEG AA',  key: 'aa',   cls: 'border-ag-navy/20  bg-ag-navy/[0.03]  text-ag-navy/80'      },
    { label: 'AEG A',   key: 'a',    cls: 'border-ag-border   bg-ag-off-white    text-ag-gray'          },
    { label: 'AEG B',   key: 'b',    cls: 'border-ag-border/50 bg-ag-white       text-ag-gray-light'   },
  ] as const

  const DIMS = [
    { letter: 'C', tKey: 'gradeDimC' },
    { letter: 'I', tKey: 'gradeDimI' },
    { letter: 'F', tKey: 'gradeDimF' },
    { letter: 'S', tKey: 'gradeDimS' },
  ] as const

  return (
    <div className="absolute top-full left-0 mt-2 w-[500px] bg-ag-white border border-ag-border shadow-lg z-50">

      {/* Header */}
      <div className="px-5 py-3 border-b border-ag-border">
        <p className="font-mono text-[9px] tracking-[0.30em] uppercase text-ag-gray-light">
          {tg('label')}
        </p>
      </div>

      {/* Grade scale — 5 slots inspired by Antiquorum watch grading */}
      <div className="p-3.5 grid grid-cols-5 gap-1.5">
        {GRADES.map(({ label, key, cls }) => (
          <div key={key} className={`border p-2.5 text-center ${cls}`}>
            <p className="font-mono text-[10px] font-semibold tracking-[0.04em] leading-none mb-1.5 whitespace-nowrap">
              {label}
            </p>
            <p className="font-sans text-[9px] leading-tight opacity-80">
              {tg(`grades.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>

      {/* 4 dimensions */}
      <div className="px-3.5 pb-3 flex gap-1.5">
        {DIMS.map(({ letter, tKey }) => (
          <span
            key={letter}
            className="inline-flex items-center gap-1.5 border border-ag-border px-2.5 py-1 font-mono text-[9px] tracking-[0.08em] text-ag-gray"
          >
            <span className="text-ag-navy font-bold text-[10px]">{letter}</span>
            {t(tKey)}
          </span>
        ))}
      </div>

      {/* Nav links */}
      <div className="border-t border-ag-border">
        {GRADE_LINKS.map(({ labelKey, href }) => (
          <Link
            key={labelKey}
            href={href}
            onClick={onClose}
            className="flex items-center justify-between px-5 py-3 font-sans text-[12px] text-ag-gray hover:text-ag-black hover:bg-ag-off-white transition-colors border-b border-ag-border/50 last:border-0"
          >
            {t(labelKey)}
            <span className="text-ag-apex text-[11px] font-semibold">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function Nav() {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)
  const [mobileAccordion, setMobileAccordion] = useState<DropdownKey>(null)
  const navRef    = useRef<HTMLElement>(null)
  const logoRef   = useRef<HTMLAnchorElement>(null)
  const linksRef  = useRef<HTMLElement>(null)
  const rightRef  = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.6 } })
      tl.from(logoRef.current,  { opacity: 0, x: -12, delay: 0.1 })
        .from('.nav-link-item', { opacity: 0, y: -8, stagger: 0.06 }, '-=0.4')
        .from(rightRef.current,  { opacity: 0, x: 12 }, '-=0.4')
    }, navRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!drawerRef.current) return
    if (mobileOpen) {
      gsap.fromTo(drawerRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }
      )
      gsap.from('.mobile-nav-item', {
        opacity: 0, x: -16, stagger: 0.05,
        duration: 0.35, ease: 'expo.out', delay: 0.1,
      })
    }
  }, [mobileOpen])

  const toggleDropdown = (key: DropdownKey) =>
    setActiveDropdown(prev => (prev === key ? null : key))

  const toggleMobileAccordion = (key: DropdownKey) =>
    setMobileAccordion(prev => (prev === key ? null : key))

  const closeMobile = () => {
    setMobileOpen(false)
    setMobileAccordion(null)
  }

  return (
    <header ref={navRef} className="sticky top-0 z-50 bg-ag-white border-b border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">

        {/* Logo */}
        <Link ref={logoRef} href="/" aria-label="AEGRYN — Accueil" className="hover:opacity-70 transition-opacity duration-200 shrink-0">
          <AegrynLogo size={28} variant="full" />
        </Link>

        {/* Desktop nav */}
        <nav ref={linksRef} className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">

          {/* Auction dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('auction')}
              className="flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
              aria-expanded={activeDropdown === 'auction'}
            >
              {t('auction')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'auction' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'auction' && <DropdownMenu links={AUCTION_LINKS} t={t} />}
          </div>

          {/* Grade dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('grade')}
              className="flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
              aria-expanded={activeDropdown === 'grade'}
            >
              {t('grade')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'grade' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'grade' && <GradeMegaMenu t={t} onClose={() => setActiveDropdown(null)} />}
          </div>

          {/* Assets */}
          <Link
            href="/assets"
            className="nav-link-item font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
          >
            {t('assets')}
          </Link>

          {/* Services dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('services')}
              className="flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
              aria-expanded={activeDropdown === 'services'}
            >
              {t('services')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
            </button>
            {activeDropdown === 'services' && <DropdownMenu links={SERVICES_LINKS} t={t} />}
          </div>

          {/* Discover */}
          <Link
            href="/discover"
            className="nav-link-item font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
          >
            {t('discover')}
          </Link>

          {/* About */}
          <Link
            href="/about"
            className="nav-link-item font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
          >
            {t('about')}
          </Link>
        </nav>

        {/* Right side: locale + client + CTA */}
        <div ref={rightRef} className="hidden lg:flex items-center gap-5">
          <LanguageSwitcher />
          <Link
            href="/client/login"
            className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
          >
            <User size={13} />
            {t('clientSpace')}
          </Link>
          <Link
            href="/contact"
            className="font-mono text-[11px] tracking-[0.14em] uppercase bg-ag-navy text-white px-4 py-2 hover:bg-ag-navy-mid transition-colors duration-200"
          >
            {t('submitAsset')} →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden rounded p-2 text-ag-gray hover:text-ag-black transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer — full-screen navy */}
      {mobileOpen && (
        <div ref={drawerRef} className="lg:hidden fixed inset-0 top-16 z-40 bg-ag-navy overflow-y-auto">
          <div className="px-6 py-8 flex flex-col gap-1">

            {/* Auction accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('auction')}
                className="w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/10"
              >
                {t('auction')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'auction' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'auction' && (
                <div className="py-2 pl-4 flex flex-col gap-1">
                  {AUCTION_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-2.5 font-sans text-[13px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Grade accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('grade')}
                className="w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/10"
              >
                {t('grade')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'grade' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'grade' && (
                <div className="py-3 flex flex-col gap-3">
                  {/* Grade scale — 2 rows × 3 / 2 cols */}
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { label: 'AEG ★',   key: 'star', cls: 'border-ag-apex/40 text-ag-apex'      },
                      { label: 'AEG AAA', key: 'aaa',  cls: 'border-white/20  text-white/80'      },
                      { label: 'AEG AA',  key: 'aa',   cls: 'border-white/15  text-white/60'      },
                      { label: 'AEG A',   key: 'a',    cls: 'border-white/10  text-white/40'      },
                      { label: 'AEG B',   key: 'b',    cls: 'border-white/8   text-white/30'      },
                    ].map(({ label, cls }) => (
                      <div key={label} className={`border p-2 text-center ${cls}`}>
                        <p className="font-mono text-[10px] font-semibold tracking-[0.04em]">{label}</p>
                      </div>
                    ))}
                  </div>
                  {/* Dimensions */}
                  <div className="flex gap-1.5 flex-wrap">
                    {(['C','I','F','S'] as const).map((letter, i) => {
                      const keys = ['gradeDimC','gradeDimI','gradeDimF','gradeDimS'] as const
                      return (
                        <span key={letter} className="inline-flex items-center gap-1 border border-white/15 px-2 py-0.5 font-mono text-[9px] text-white/40">
                          <span className="text-ag-apex font-bold">{letter}</span>
                          {t(keys[i])}
                        </span>
                      )
                    })}
                  </div>
                  {/* Nav links */}
                  <div className="flex flex-col gap-0 border-t border-white/10 pt-2">
                    {GRADE_LINKS.map(({ labelKey, href }) => (
                      <Link key={labelKey} href={href} onClick={closeMobile}
                        className="flex items-center justify-between py-2.5 font-sans text-[13px] text-white/50 hover:text-white transition-colors border-b border-white/5 last:border-0">
                        {t(labelKey)}
                        <span className="text-ag-apex text-[10px]">→</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Assets */}
            <Link href="/assets" onClick={closeMobile}
              className="mobile-nav-item py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/10">
              {t('assets')}
            </Link>

            {/* Services accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('services')}
                className="w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/10"
              >
                {t('services')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'services' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'services' && (
                <div className="py-2 pl-4 flex flex-col gap-1">
                  {SERVICES_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-2.5 font-sans text-[13px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Discover */}
            <Link href="/discover" onClick={closeMobile}
              className="mobile-nav-item py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/10">
              {t('discover')}
            </Link>

            {/* About */}
            <Link href="/about" onClick={closeMobile}
              className="mobile-nav-item py-4 font-mono text-[12px] tracking-[0.18em] uppercase text-white/70 hover:text-white transition-colors border-b border-white/10">
              {t('about')}
            </Link>

            {/* Bottom CTAs */}
            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/client/login"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 border border-white/20 px-4 py-3 font-mono text-[11px] tracking-[0.14em] uppercase text-white/70 hover:border-white/50 hover:text-white transition-all"
              >
                <User size={13} />
                {t('clientSpace')}
              </Link>
              <Link
                href="/contact"
                onClick={closeMobile}
                className="flex items-center justify-center gap-2 bg-ag-apex px-4 py-3 font-mono text-[11px] tracking-[0.14em] uppercase text-ag-navy font-semibold hover:bg-ag-apex/90 transition-colors"
              >
                {t('submitAsset')} →
              </Link>
            </div>

            {/* Language */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
