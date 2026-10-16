'use client'

import { Link, usePathname } from '@/i18n/navigation'
import NextLink          from 'next/link'
import { useTranslations } from 'next-intl'
import { useState, useRef, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, ChevronDown, User, UserCircle, ArrowUpRight, HelpCircle } from 'lucide-react'
import LanguageSwitcher   from '@/components/layout/LanguageSwitcher'
import NotificationBell   from '@/components/client/NotificationBell'
import Image             from 'next/image'
import { gsap }          from '@/lib/gsap'
import { NavPanel }      from '@/components/layout/NavPanel'
import {
  CRAFT_METIERS, CRAFT_TRANSACT_CYCLES, THINKING_MAGAZINE_LINKS, THINKING_MARKET_LINKS, NEWSLETTER_HREF,
  WHO_GROUP_LINKS, WHO_JOIN_LINKS, INDUSTRY_CLUSTERS, BOUTIQUE_DISCOVER_LINKS, BOUTIQUE_SUBMIT_HREF,
  type DropdownKey, type LinkHref,
} from '@/components/layout/navData'

const ICON_BTN = 'flex h-9 w-9 items-center justify-center rounded-full text-ag-gray transition-colors hover:bg-ag-off-white hover:text-ag-black'

export interface NavUser {
  name: string
  label: string
}

export default function Nav({ user }: { user?: NavUser | null } = {}) {
  const t = useTranslations('nav')
  const pathname = usePathname()
  
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  
  const isCraftActive =
    isActive('/assets') ||
    isActive('/advisory') || isActive('/services/acquisition-support') ||
    isActive('/grade') || isActive('/accompagner') ||
    isActive('/valuation') || isActive('/verify')


  const isThinkingActive =
    isActive('/magazine') || isActive('/blog')

  const isPortfolioActive = isActive('/boutique')

  /* Pages à hero vidéo plein cadre : barre transparente, fond blanc progressif au scroll */
  const heroPage = pathname === '/' || pathname === '/boutique'

  const isWhoActive =
    isActive('/about') ||
    isActive('/career') || isActive('/alliances') ||
    isActive('/experts') || isActive('/investisseurs') ||
    isActive('/audit') || isActive('/industries')

  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey>(null)
  const [mobileAccordion, setMobileAccordion] = useState<DropdownKey>(null)
  const [scrollP, setScrollP] = useState(0)
  
  const navRef    = useRef<HTMLElement>(null)
  const logoRef   = useRef<HTMLAnchorElement>(null)
  const linksRef  = useRef<HTMLElement>(null)
  const rightRef  = useRef<HTMLDivElement>(null)
  const drawerRef = useRef<HTMLDivElement>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openMenu = useCallback((key: DropdownKey) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setActiveDropdown(key)
  }, [])

  const closeMenu = useCallback(() => {
    hoverTimer.current = setTimeout(() => setActiveDropdown(null), 150)
  }, [])

  const cancelClose = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
  }, [])

  useEffect(() => {
    if (logoRef.current) gsap.set(logoRef.current, { opacity: 1, x: 0, clearProps: 'opacity,transform,filter' })
    if (!linksRef.current || !rightRef.current) return

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

  /* Le fond blanc n'apparaît qu'une fois le hero sorti : il se fond sur ~140 px de scroll à partir
     du moment où le bas du hero atteint le bas de la barre (64 px). Tant que le hero est sous la barre,
     elle reste transparente avec textes et logo blancs. */
  const [overHero, setOverHero] = useState(true)
  useEffect(() => {
    if (!heroPage) { setScrollP(1); setOverHero(false); return }
    const NAV_H = 64, FADE = 140
    let raf = 0
    const update = () => {
      raf = 0
      const hero = document.querySelector('[data-nav-hero]')
      const bottom = hero ? hero.getBoundingClientRect().bottom : 0
      setScrollP(Math.min(1, Math.max(0, (NAV_H - bottom) / FADE)))
      setOverHero(bottom > NAV_H)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [heroPage, pathname])

  /* Fond : transparent sur le hero, blanc dès que le menu est ouvert ou qu'on a défilé */
  const barAlpha = !heroPage || activeDropdown !== null || mobileOpen ? 1 : scrollP
  const menuOpen = activeDropdown !== null
  const onHero   = heroPage && overHero && activeDropdown === null && !mobileOpen

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveDropdown(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const toggleMobileAccordion = (key: DropdownKey) =>
    setMobileAccordion(prev => (prev === key ? null : key))

  const closeMobile = () => {
    setMobileOpen(false)
    setMobileAccordion(null)
  }

  return (
    <>
      <AnimatePresence>
        {activeDropdown !== null && (
          <motion.div
            key="nav-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ag-black/25 backdrop-blur-md"
            onClick={() => setActiveDropdown(null)}
          />
        )}
      </AnimatePresence>
    <header
      ref={navRef}
      data-onhero={onHero ? 'true' : 'false'}
      onMouseEnter={cancelClose}
      onMouseLeave={closeMenu}
      className={`fixed top-0 left-0 right-0 z-50 border-b ${heroPage ? '' : `bg-ag-white ${menuOpen ? 'border-transparent' : 'border-ag-border'}`}`}
      style={heroPage ? { backgroundColor: `rgba(255,255,255,${barAlpha})`, borderColor: menuOpen ? 'transparent' : `rgba(226,232,240,${barAlpha})`, transition: 'background-color 0.25s, border-color 0.25s' } : undefined}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">

        {/* Logo */}
        <Link ref={logoRef} href="/" aria-label="AEGRYN | Accueil" className="relative block hover:opacity-70 transition-opacity duration-200 shrink-0 leading-none">
          <Image
            src="/images/brand/logo-aegryn-navbar-black.png"
            alt="AEGRYN"
            width={1024}
            height={751}
            className="h-11 w-auto object-contain transition-opacity duration-300"
            style={heroPage ? { opacity: onHero ? 0 : 1 } : undefined}
            priority
          />
          {heroPage && (
            <Image
              src="/images/brand/logo-aegryn-navbar-white.png"
              alt=""
              width={1024}
              height={751}
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-11 w-auto object-contain transition-opacity duration-300"
              style={{ opacity: onHero ? 1 : 0 }}
              priority
            />
          )}
        </Link>

        {/* Desktop nav : libellés seuls, le bandeau blanc s'ouvre sous la barre */}
        <nav ref={linksRef} className="hidden lg:flex items-center gap-1" aria-label="Navigation principale">
          {([
            { key: 'craft',    label: t('ourCraft'),     active: isCraftActive },
            { key: 'thinking', label: t('ourThinking'),  active: isThinkingActive },
            { key: 'who',      label: t('whoWeAre'),     active: isWhoActive },
            { key: 'boutique', label: t('navPortfolio'), active: isPortfolioActive, bold: true },
          ] as { key: Exclude<DropdownKey, null>; label: string; active: boolean; bold?: boolean }[]).map(({ key, label, active, bold }) => (
            <div key={key} className="nav-link-item relative" onMouseEnter={() => openMenu(key)}>
              <button
                type="button"
                onClick={() => openMenu(key)}
                className={`relative rounded-md px-3.5 py-2 font-sans text-[12px] uppercase tracking-[0.08em] ${bold ? 'font-semibold' : 'font-medium'} transition-colors duration-200 ${
                  activeDropdown === key ? 'bg-ag-off-white text-ag-black' : active ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
                }`}
                aria-expanded={activeDropdown === key}
                aria-current={active ? 'page' : undefined}
              >
                {label}
                {active && <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] bg-ag-apex" />}
              </button>
            </div>
          ))}
        </nav>

        {/* Côté droit : FAQ, langue, espace compte (icônes) */}
        <div ref={rightRef} data-nav-right className="hidden lg:flex items-center gap-1">
          {user && <NotificationBell />}
          <Link href="/help/faq" aria-label="FAQ" title="FAQ" className={ICON_BTN}>
            <HelpCircle size={18} strokeWidth={1.75} />
          </Link>
          <LanguageSwitcher dark={onHero} />
          {user ? (
            <NextLink href="/client/account" aria-label={`${user.label} : ${user.name}`} title={`${user.label} : ${user.name}`} className={ICON_BTN}>
              <UserCircle size={18} strokeWidth={1.75} aria-hidden="true" />
            </NextLink>
          ) : (
            <NextLink href="/client/login" aria-label={t('clientSpace')} title={t('clientSpace')} className={ICON_BTN}>
              <User size={18} strokeWidth={1.75} aria-hidden="true" />
            </NextLink>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          data-nav-burger
          className="lg:hidden rounded-lg p-2 text-ag-gray hover:text-ag-black transition-colors"
          onClick={() => setMobileOpen(o => !o)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Bandeau blanc des menus (bureau) : même fond que la barre, sans bordure */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="nav-panel"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block bg-ag-white"
          >
            <NavPanel menu={activeDropdown} t={t} onClose={() => setActiveDropdown(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div ref={drawerRef} data-lenis-prevent className="lg:hidden fixed inset-0 top-16 z-40 bg-ag-white overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col gap-1">

            {/* Nos métiers accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('craft')}
                aria-current={isCraftActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[13px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isCraftActive ? 'text-ag-black border-ag-apex' : 'text-ag-gray hover:text-ag-black border-ag-border'
                }`}
              >
                {t('ourCraft')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'craft' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'craft' && (
                <div className="py-2 pl-4 flex flex-col gap-2">
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-2">{t('craftFrameDeliver')}</p>
                  {CRAFT_METIERS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-ag-gray hover:text-ag-black transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-3">{t('craftTransact')}</p>
                  {CRAFT_TRANSACT_CYCLES.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-ag-gray hover:text-ag-black transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Nos convictions accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('thinking')}
                aria-current={isThinkingActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[13px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isThinkingActive ? 'text-ag-black border-ag-apex' : 'text-ag-gray hover:text-ag-black border-ag-border'
                }`}
              >
                {t('ourThinking')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'thinking' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'thinking' && (
                <div className="py-2 pl-4 flex flex-col gap-2">
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-2">{t('thinkingMagazine')}</p>
                  {THINKING_MAGAZINE_LINKS.map(({ labelKey, href, muted }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className={`py-1.5 font-sans text-[14px] transition-colors ${muted ? 'text-ag-gray-light hover:text-ag-gray' : 'text-ag-gray hover:text-ag-black'}`}>
                      {t(labelKey)}
                    </Link>
                  ))}
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-3">{t('thinkingMarket')}</p>
                  <a
                    href={NEWSLETTER_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 font-sans text-[14px] text-ag-gray hover:text-ag-black transition-colors"
                  >
                    {t('thinkingMarketNewsletter')}
                  </a>
                  {THINKING_MARKET_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-ag-gray hover:text-ag-black transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Qui sommes-nous accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('who')}
                aria-current={isWhoActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[13px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isWhoActive ? 'text-ag-black border-ag-apex' : 'text-ag-gray hover:text-ag-black border-ag-border'
                }`}
              >
                {t('whoWeAre')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'who' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'who' && (
                <div className="py-2 pl-4 flex flex-col gap-2">

                  {/* Le groupe */}
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-2">{t('whoGroup')}</p>
                  {WHO_GROUP_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-ag-gray hover:text-ag-black transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}

                  {/* Nos bureaux */}
                  <div className="mt-2 pt-2 border-t border-ag-border">
                    <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mb-1.5">{t('whoOffices')}</p>
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                      Switzerland, Rue du Centre 142, 1025 St-Sulpice
                    </p>
                  </div>

                  {/* Nos industries — liste statique mobile */}
                  <div className="mt-2 pt-2 border-t border-ag-border">
                    <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mb-2">{t('whoIndustries')}</p>
                    <div className="flex flex-col">
                      {INDUSTRY_CLUSTERS.map(({ slug, labelKey }) => (
                        <Link key={slug} href={`/industries/${slug}` as LinkHref} onClick={closeMobile}
                          className="py-1.5 font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors flex items-center justify-between group">
                          <span>{t(labelKey as Parameters<typeof t>[0])}</span>
                          <ArrowUpRight size={11} className="text-ag-gray group-hover:text-ag-black transition-colors shrink-0" />
                        </Link>
                      ))}
                    </div>
                    <Link href={'/industries' as LinkHref} onClick={closeMobile}
                      className="inline-flex items-center gap-1 mt-2 font-mono text-[9px] tracking-[0.18em] uppercase text-ag-apex-ink hover:text-ag-black transition-colors">
                      {t('whoIndustriesLink')} <ArrowUpRight size={10} />
                    </Link>
                  </div>

                  {/* Nous rejoindre */}
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-3">{t('whoJoin')}</p>
                  {WHO_JOIN_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-ag-gray hover:text-ag-black transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* La Boutique */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('boutique')}
                aria-current={isPortfolioActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[13px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isPortfolioActive ? 'text-ag-black border-ag-apex' : 'text-ag-gray hover:text-ag-black border-ag-border'
                }`}
              >
                {t('navPortfolio')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'boutique' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'boutique' && (
                <div className="py-2 pl-4 flex flex-col gap-2">
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-2">{t('boutiqueDiscover')}</p>
                  {BOUTIQUE_DISCOVER_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile} className="py-1.5 font-sans text-[14px] text-ag-gray hover:text-ag-black transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                  <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-gray mt-3">{t('boutiqueAct')}</p>
                  <span className="py-1.5 font-sans text-[14px] text-ag-gray-light">{t('boutiquePlaces')} · {t('boutiqueSoon')}</span>
                  <Link href={BOUTIQUE_SUBMIT_HREF} onClick={closeMobile} className="py-1.5 font-sans text-[14px] font-semibold text-ag-apex-ink hover:text-ag-black transition-colors">
                    {t('boutiqueSubmit')}
                  </Link>
                </div>
              )}
            </div>

            {/* Bottom CTAs */}
            <div className="mt-8 flex flex-col gap-3">
              <Link href="/help/faq" onClick={closeMobile} className="rounded-lg flex items-center justify-center gap-2 border border-ag-border px-4 py-3 font-mono text-[12px] tracking-[0.14em] uppercase text-ag-gray hover:border-ag-navy hover:text-ag-black transition-all">
                <HelpCircle size={13} />
                FAQ
              </Link>
              {user ? (
                <div className="rounded-lg flex items-center gap-2.5 border border-ag-border px-4 py-3">
                  <UserCircle size={18} className="text-ag-apex-ink shrink-0" aria-hidden="true" />
                  <div className="leading-tight">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ag-gray">{user.label}</p>
                    <p className="font-sans text-[14px] font-semibold text-ag-black truncate max-w-[200px]">{user.name}</p>
                  </div>
                </div>
              ) : (
                <NextLink
                  href="/client/login"
                  onClick={closeMobile}
                  className="rounded-lg flex items-center justify-center gap-2 border border-ag-border px-4 py-3 font-mono text-[12px] tracking-[0.14em] uppercase text-ag-gray hover:border-ag-navy hover:text-ag-black transition-all"
                >
                  <User size={13} />
                  {t('clientSpace')}
                </NextLink>
              )}
            </div>

            {/* Language */}
            <div className="mt-6 pt-6 border-t border-ag-border">
              <LanguageSwitcher variant="text" />
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  )
}
