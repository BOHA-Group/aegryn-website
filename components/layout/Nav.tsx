'use client'

import { Link, usePathname } from '@/i18n/navigation'
import NextLink          from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useRef, useEffect, type ComponentProps } from 'react'
import { Menu, X, ChevronDown, User, UserCircle } from 'lucide-react'
import LanguageSwitcher   from '@/components/layout/LanguageSwitcher'
import NotificationBell   from '@/components/client/NotificationBell'
import Image             from 'next/image'
import { gsap }          from '@/lib/gsap'

type DropdownKey = 'transact' | 'grade' | 'build' | 'advisory' | 'about' | null
type LinkHref = ComponentProps<typeof Link>['href']

const TRANSACT_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'transactCatalog',    href: '/transact/catalog' },
  { labelKey: 'transactSell',       href: '/transact/how-to-sell' },
  { labelKey: 'transactBuy',        href: '/transact/how-to-buy' },
  { labelKey: 'transactResults',    href: '/transact/results' },
]

const GRADE_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'gradeSystem',     href: '/grade' },
  { labelKey: 'gradeMethod',     href: '/grade/methodology' },
  { labelKey: 'gradeSubmit',     href: '/grade/submit' },
]

const BUILD_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'buildAssets',      href: '/assets' },
  { labelKey: 'buildEngineering', href: '/services/build' },
]

const ABOUT_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'magazine',          href: '/magazine' },
  { labelKey: 'articles',          href: '/blog' },
  { labelKey: 'aboutGroup',        href: '/about' },
  { labelKey: 'aboutCareers',      href: '/career' },
]

const ADVISORY_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'servicesAdvisory',    href: '/advisory' },
  { labelKey: 'servicesAcquisition', href: '/services/acquisition-support' },
  { labelKey: 'servicesAlliances',   href: '/alliances' },
  { labelKey: 'servicesExperts',     href: '/experts' },
]

function DropdownMenu({ links, t }: { links: { labelKey: string; href: LinkHref }[]; t: ReturnType<typeof useTranslations> }) {
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
    { label: 'AEG ★', key: 'star', cls: 'border-ag-apex/40  bg-ag-apex/[0.06]  text-ag-apex-ink'      },
    { label: 'AAA',    key: 'aaa',  cls: 'border-ag-navy/35  bg-ag-navy/[0.05]  text-ag-navy'         },
    { label: 'AA',     key: 'aa',   cls: 'border-ag-navy/20  bg-ag-navy/[0.03]  text-ag-navy/80'      },
    { label: 'A',      key: 'a',    cls: 'border-ag-border   bg-ag-off-white    text-ag-gray'          },
    { label: 'B',      key: 'b',    cls: 'border-ag-border/50 bg-ag-white       text-ag-gray-light'   },
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
            <span className="text-ag-apex-ink text-[11px] font-semibold">→</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export interface NavUser {
  /** Nom complet ou email de l'utilisateur connecté */
  name: string
  /** Libellé de l'espace : "Acquéreur", "Vendeur", "Partenaire", "Admin" */
  label: string
}

export default function Nav({ user }: { user?: NavUser | null } = {}) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  const isTransactActive = TRANSACT_LINKS.some(({ href }) => isActive(href as string))
  const isGradeActive    = GRADE_LINKS.some(({ href }) => isActive(href as string))
  const isBuildActive    = BUILD_LINKS.some(({ href }) => isActive(href as string))
  const isAdvisoryActive = ADVISORY_LINKS.some(({ href }) => isActive(href as string))
  const isAboutActive    = isActive('/about') || isActive('/magazine') || isActive('/blog') || isActive('/career')
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
    /* Logo — toujours pleinement opaque, sans animation d'entrée ni filtre */
    if (logoRef.current) gsap.set(logoRef.current, { opacity: 1, x: 0, clearProps: 'opacity,transform,filter' })

    if (!linksRef.current || !rightRef.current) return

    /* gsap.context() scope les sélecteurs au conteneur ref — évite que GSAP
       sélectionne des nœuds en dehors du composant ou avant la fin de l'hydratation
       React 19, ce qui provoquait le crash removeChild. */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 0.6 } })
      tl.from('.nav-link-item', { opacity: 0, y: -8, stagger: 0.06, delay: 0.1 })
        .from(rightRef.current, { opacity: 0, x: 12 }, '-=0.4')
        .call(() => {
          gsap.set('.nav-link-item', { clearProps: 'opacity,transform' })
          if (rightRef.current) gsap.set(rightRef.current, { clearProps: 'opacity,transform' })
        })
    }, linksRef)

    return () => { ctx.revert() }
  }, [])

  useEffect(() => {
    if (!drawerRef.current || !mobileOpen) return
    const el = drawerRef.current
    const ctx = gsap.context(() => {
      gsap.fromTo(el,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'expo.out' }
      )
      gsap.from('.mobile-nav-item', {
        opacity: 0, x: -16, stagger: 0.05,
        duration: 0.35, ease: 'expo.out', delay: 0.1,
      })
    }, el)
    return () => ctx.revert()
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
    <header ref={navRef} className="fixed top-0 left-0 right-0 z-50 bg-ag-white border-b border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">

        {/* Logo */}
        <Link ref={logoRef} href="/" aria-label="AEGRYN | Accueil" className="block hover:opacity-70 transition-opacity duration-200 shrink-0 leading-none">
          <Image
            src="/images/logo-aegryn-navbar.jpg"
            alt="AEGRYN"
            width={64}
            height={64}
            className="h-16 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav ref={linksRef} className="hidden lg:flex items-center gap-8" aria-label="Navigation principale">

          {/* Build dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('build')}
              className={`relative flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isBuildActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'build'}
              aria-current={isBuildActive ? 'page' : undefined}
            >
              {t('build')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'build' ? 'rotate-180' : ''}`} />
              {isBuildActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'build' && <DropdownMenu links={BUILD_LINKS} t={t} />}
          </div>

          {/* Advisory dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('advisory')}
              className={`relative flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isAdvisoryActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'advisory'}
              aria-current={isAdvisoryActive ? 'page' : undefined}
            >
              {t('advisory')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'advisory' ? 'rotate-180' : ''}`} />
              {isAdvisoryActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'advisory' && <DropdownMenu links={ADVISORY_LINKS} t={t} />}
          </div>

          {/* Grade dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('grade')}
              className={`relative flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isGradeActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'grade'}
              aria-current={isGradeActive ? 'page' : undefined}
            >
              {t('grade')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'grade' ? 'rotate-180' : ''}`} />
              {isGradeActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'grade' && <GradeMegaMenu t={t} onClose={() => setActiveDropdown(null)} />}
          </div>

          {/* Transact dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('transact')}
              className={`relative flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isTransactActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'transact'}
              aria-current={isTransactActive ? 'page' : undefined}
            >
              {t('transact')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'transact' ? 'rotate-180' : ''}`} />
              {isTransactActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'transact' && <DropdownMenu links={TRANSACT_LINKS} t={t} />}
          </div>

          {/* About dropdown */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('about')}
              className={`relative flex items-center gap-1 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isAboutActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'about'}
              aria-current={isAboutActive ? 'page' : undefined}
            >
              {t('about')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'about' ? 'rotate-180' : ''}`} />
              {isAboutActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'about' && <DropdownMenu links={ABOUT_LINKS} t={t} />}
          </div>
        </nav>

        {/* Right side: locale + client + CTA */}
        <div ref={rightRef} className="hidden lg:flex items-center gap-5">
          {user && <NotificationBell />}
          <LanguageSwitcher />

          {user ? (
            <>
              {/* Identité connectée — accès au compte */}
              <NextLink href="/client/account" className="flex items-center gap-2 pl-1 group" aria-label="Mon compte">
                <UserCircle size={16} className="text-ag-apex-ink shrink-0" aria-hidden="true" />
                <div className="leading-tight">
                  <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ag-gray-light">{user.label}</p>
                  <p className="font-sans text-[12px] font-semibold text-ag-black truncate max-w-[150px] group-hover:text-ag-apex-ink transition-colors">{user.name}</p>
                </div>
              </NextLink>
            </>
          ) : (
            <>
              <NextLink
                  href="/client/login"
                  className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
                >
                  <User size={13} />
                  {t('clientSpace')}
                </NextLink>
            </>
          )}
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

            {/* Build accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('build')}
                aria-current={isBuildActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isBuildActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('build')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'build' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'build' && (
                <div className="py-2 pl-4 flex flex-col gap-1">
                  {BUILD_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href as LinkHref} onClick={closeMobile}
                      className="py-2.5 font-sans text-[13px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Advisory accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('advisory')}
                aria-current={isAdvisoryActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isAdvisoryActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('advisory')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'advisory' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'advisory' && (
                <div className="py-2 pl-4 flex flex-col gap-1">
                  {ADVISORY_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href as LinkHref} onClick={closeMobile}
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
                aria-current={isGradeActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isGradeActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('grade')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'grade' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'grade' && (
                <div className="py-3 flex flex-col gap-3">
                  {/* Grade scale — 2 rows × 3 / 2 cols */}
                  <div className="flex flex-col gap-1">
                    <div className="grid grid-cols-3 gap-1">
                      {[
                        { label: 'AEG ★', cls: 'border-ag-apex/40 text-ag-apex' },
                        { label: 'AAA',    cls: 'border-white/20  text-white/80' },
                        { label: 'AA',     cls: 'border-white/15  text-white/60' },
                      ].map(({ label, cls }) => (
                        <div key={label} className={`border p-2 text-center ${cls}`}>
                          <p className="font-mono text-[10px] font-semibold tracking-[0.04em]">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1">
                      {[
                        { label: 'A', cls: 'border-white/10 text-white/40' },
                        { label: 'B', cls: 'border-white/8  text-white/30' },
                      ].map(({ label, cls }) => (
                        <div key={label} className={`border p-2 text-center ${cls}`}>
                          <p className="font-mono text-[10px] font-semibold tracking-[0.04em]">{label}</p>
                        </div>
                      ))}
                    </div>
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

            {/* Transact accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('transact')}
                aria-current={isTransactActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isTransactActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('transact')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'transact' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'transact' && (
                <div className="py-2 pl-4 flex flex-col gap-1">
                  {TRANSACT_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-2.5 font-sans text-[13px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* About accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('about')}
                aria-current={isAboutActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[12px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isAboutActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('about')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'about' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'about' && (
                <div className="py-2 pl-4 flex flex-col gap-1">
                  {ABOUT_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href as LinkHref} onClick={closeMobile}
                      className="py-2.5 font-sans text-[13px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom CTAs */}
            <div className="mt-8 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5 border border-white/15 px-4 py-3">
                    <UserCircle size={18} className="text-ag-apex shrink-0" aria-hidden="true" />
                    <div className="leading-tight">
                      <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/45">{user.label}</p>
                      <p className="font-sans text-[13px] font-semibold text-white truncate max-w-[200px]">{user.name}</p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <NextLink
                      href="/client/login"
                      onClick={closeMobile}
                      className="flex items-center justify-center gap-2 border border-white/20 px-4 py-3 font-mono text-[11px] tracking-[0.14em] uppercase text-white/70 hover:border-white/50 hover:text-white transition-all"
                    >
                      <User size={13} />
                      {t('clientSpace')}
                    </NextLink>
                </>
              )}
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
