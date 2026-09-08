'use client'

import { Link, usePathname } from '@/i18n/navigation'
import NextLink          from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useState, useRef, useEffect, type ComponentProps } from 'react'
import { Menu, X, ChevronDown, User, UserCircle } from 'lucide-react'
import LanguageSwitcher   from '@/components/layout/LanguageSwitcher'
import NotificationBell   from '@/components/client/NotificationBell'
import Image             from 'next/image'
import { gsap }          from '@/lib/gsap'

type DropdownKey = 'craft' | 'solutions' | 'thinking' | 'who' | null
type LinkHref = ComponentProps<typeof Link>['href']

// Nos métiers - Build section
const CRAFT_BUILD_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'craftBuildAssets',      href: '/assets' },
  { labelKey: 'craftBuildEngineering', href: '/services/build' },
]

// Nos métiers - Support section
const CRAFT_SUPPORT_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'craftSupportStrategy',      href: '/advisory/strategy' as LinkHref },
  { labelKey: 'craftSupportTechnology',    href: '/advisory/technology' as LinkHref },
  { labelKey: 'craftSupportMA',            href: '/advisory/ma' as LinkHref },
  { labelKey: 'craftSupportNetworkNew',    href: '/network' as LinkHref },
  { labelKey: 'craftSupportInvestors',     href: '/investisseurs' as LinkHref },
]

// Nos métiers - Transaction M&A section
const CRAFT_TRANSACT_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'craftTransactOverview',     href: '/transact' as LinkHref },
  { labelKey: 'craftTransactGradeNew',     href: '/grade' },
  { labelKey: 'craftTransactAuditors',     href: '/grade/partners' as LinkHref },
  { labelKey: 'craftTransactCatalog',      href: '/transact/catalog' },
  { labelKey: 'craftTransactSell',         href: '/transact/how-to-sell' },
  { labelKey: 'craftTransactBuy',          href: '/transact/how-to-buy' },
]

// Nos métiers - Recruter section
const CRAFT_RECRUIT_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'craftRecruitBoard',        href: '/talent' as LinkHref },
  { labelKey: 'craftRecruitExecutiveTech', href: '/talent' as LinkHref },
  { labelKey: 'craftRecruitExecutiveMA',   href: '/talent' as LinkHref },
]

// Nos convictions - Magazine
const THINKING_MAGAZINE_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'thinkingMagazineIssues', href: '/magazine' },
]

// Nos convictions - Notre regard sur le marché
const THINKING_MARKET_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'thinkingMarketArticles',   href: '/blog' },
  { labelKey: 'thinkingMarketGlossary',   href: '/glossaire' as LinkHref },
  { labelKey: 'thinkingMarketFAQ',        href: '/help/faq' as LinkHref },
]

// Qui sommes-nous - Le groupe (hors fondateur qui a un hash natif)
const WHO_GROUP_LINKS_BASE: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'whoAbout',     href: '/about' },
  { labelKey: 'whoPortfolio', href: '/portfolio' as LinkHref },
  { labelKey: 'whoContact',   href: '/contact' },
]

// Qui sommes-nous - Nous rejoindre
const WHO_JOIN_LINKS: { labelKey: string; href: LinkHref }[] = [
  { labelKey: 'whoCareers',   href: '/career' },
  { labelKey: 'whoAlliances', href: '/alliances' },
]

// Mega-menu Nos métiers (4 sections)
function CraftMegaMenu({ t, onClose }: { t: ReturnType<typeof useTranslations>; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-[860px] bg-ag-white border border-ag-border shadow-lg z-50">
      <div className="grid grid-cols-4 gap-px bg-ag-border">
        {/* Support — ACCOMPAGNER en 1er */}
        <div className="bg-ag-white p-4">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('craftSupport')}
          </p>
          <div className="h-10 font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed overflow-hidden">
            {t('craftSupportDesc')}
          </div>
          <div className="flex flex-col gap-1">
            {CRAFT_SUPPORT_LINKS.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>

        {/* Build — CONSTRUIRE en 2ème */}
        <div className="bg-ag-white p-4">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('craftBuild')}
          </p>
          <div className="h-10 font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed overflow-hidden">
            {t('craftBuildDesc')}
          </div>
          <div className="flex flex-col gap-1">
            {CRAFT_BUILD_LINKS.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>

        {/* Transaction M&A */}
        <div className="bg-ag-white p-4">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('craftTransact')}
          </p>
          <div className="h-10 font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed overflow-hidden">
            {t('craftTransactDesc')}
          </div>
          <div className="flex flex-col gap-1">
            {CRAFT_TRANSACT_LINKS.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>

        {/* Recruter */}
        <div className="bg-ag-white p-4">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('craftRecruit')}
          </p>
          <div className="h-10 font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed overflow-hidden">
            {t('craftRecruitDesc')}
          </div>
          <div className="flex flex-col gap-1">
            {CRAFT_RECRUIT_LINKS.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mega-menu Nos convictions (2 colonnes Magazine + Notre regard)
function ThinkingMegaMenu({ t, onClose }: { t: ReturnType<typeof useTranslations>; onClose: () => void }) {
  return (
    <div className="absolute top-full left-0 mt-2 w-[640px] bg-ag-white border border-ag-border shadow-lg z-50">
      <div className="grid grid-cols-2 gap-px bg-ag-border">
        {/* The Aegryn Magazine */}
        <div className="bg-ag-white p-4">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('thinkingMagazine')}
          </p>
          <div className="h-10 font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed overflow-hidden">
            {t('thinkingMagazineDesc')}
          </div>
          <div className="flex flex-col gap-1">
            {THINKING_MAGAZINE_LINKS.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1 whitespace-nowrap"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>

        {/* Notre regard sur le marché */}
        <div className="bg-ag-white p-4">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('thinkingMarket')}
          </p>
          <div className="h-10 font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed overflow-hidden">
            {t('thinkingMarketDesc')}
          </div>
          <div className="flex flex-col gap-1">
            <a
              href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7449391102052257793"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
            >
              {t('thinkingMarketNewsletter')}
            </a>
            {THINKING_MARKET_LINKS.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mega-menu Qui sommes-nous (3 colonnes: Groupe | Industries | Rejoindre)
function WhoMegaMenu({ t, onClose }: { t: ReturnType<typeof useTranslations>; onClose: () => void }) {
  const tInd = useTranslations('industries')
  const locale = useLocale()
  const [openCluster, setOpenCluster] = useState<number | null>(null)
  const clusters = tInd.raw('clusters') as { cluster: string; items: { name: string }[] }[]
  const founderHref = `/${locale}/about#fondateur`

  function goToFounder() {
    onClose()
    const el = document.getElementById('fondateur')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    } else {
      window.location.assign(founderHref)
    }
  }

  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[820px] bg-ag-white border border-ag-border shadow-lg z-50">
      <div className="grid gap-px bg-ag-border" style={{ gridTemplateColumns: '1fr 2fr 1fr' }}>
        {/* Le groupe */}
        <div className="bg-ag-white p-3">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('whoGroup')}
          </p>
          <p className="font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed">
            {t('whoGroupDesc')}
          </p>
          <div className="flex flex-col gap-1">
            {WHO_GROUP_LINKS_BASE.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
              >
                {t(labelKey)}
              </Link>
            ))}
            <button
              onClick={goToFounder}
              style={{ fontWeight: 400 }}
              className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1 text-left w-full"
            >
              {t('whoFounder')}
            </button>
          </div>
          {/* Nos bureaux */}
          <div className="mt-4 pt-4 border-t border-ag-border">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-ag-gray-light mb-2">
              {t('whoOffices')}
            </p>
            <p className="font-sans text-[11px] text-ag-gray leading-relaxed">
              Switzerland<br />
              Rue du Centre 142<br />
              1025 St-Sulpice
            </p>
          </div>
        </div>

        {/* Nos industries — clusters dépliables */}
        <div className="bg-ag-white p-4 overflow-y-auto" style={{ maxHeight: 420 }}>
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-1">
            {t('whoIndustries')}
          </p>
          <p className="font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed">
            {t('whoIndustriesDesc')}
          </p>
          <div className="divide-y divide-ag-border border-t border-ag-border">
            {clusters.map((cluster, ci) => {
              const isOpen = openCluster === ci
              return (
                <div key={ci}>
                  <button
                    onClick={() => setOpenCluster(isOpen ? null : ci)}
                    style={{ fontWeight: 400 }}
                    className="w-full flex items-center justify-between py-2 text-left group font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors"
                  >
                    <span>{cluster.cluster}</span>
                    <span className="text-ag-gray-light leading-none">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="pb-2 pl-1 flex flex-col gap-1">
                      {cluster.items.map(item => (
                        <span key={item.name} className="font-sans text-[12px] text-ag-gray leading-snug">{item.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Nous rejoindre */}
        <div className="bg-ag-white p-3">
          <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-ag-gray-light mb-3">
            {t('whoJoin')}
          </p>
          <p className="font-sans text-[10px] text-ag-gray-light mb-3 leading-relaxed">
            {t('whoJoinDesc')}
          </p>
          <div className="flex flex-col gap-1">
            {WHO_JOIN_LINKS.map(({ labelKey, href }) => (
              <Link
                key={labelKey}
                href={href}
                onClick={onClose}
                className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors py-1"
              >
                {t(labelKey)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export interface NavUser {
  name: string
  label: string
}

export default function Nav({ user }: { user?: NavUser | null } = {}) {
  const t = useTranslations('nav')
  const tInd = useTranslations('industries')
  const pathname = usePathname()
  const locale = useLocale()
  const clusters = tInd.raw('clusters') as { cluster: string; items: { name: string }[] }[]
  const [mobileOpenCluster, setMobileOpenCluster] = useState<number | null>(null)
  
  const isActive = (href: string) => href === '/' ? pathname === '/' : pathname.startsWith(href)
  
  const isCraftActive = 
    isActive('/assets') || isActive('/services/build') || 
    isActive('/advisory') || isActive('/services/acquisition-support') || 
    isActive('/alliances') || isActive('/experts') ||
    isActive('/grade') || isActive('/transact')
  
  
  const isThinkingActive = 
    isActive('/magazine') || isActive('/blog')
  
  const isContactActive = isActive('/contact')

  const isWhoActive = 
    isActive('/about') || 
    isActive('/career')

  const [mobileOpen, setMobileOpen] = useState(false)
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

          {/* Nos métiers */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('craft')}
              className={`relative flex items-center gap-1 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isCraftActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'craft'}
              aria-current={isCraftActive ? 'page' : undefined}
            >
              {t('ourCraft')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'craft' ? 'rotate-180' : ''}`} />
              {isCraftActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'craft' && <CraftMegaMenu t={t} onClose={() => setActiveDropdown(null)} />}
          </div>

          {/* Nos convictions */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('thinking')}
              className={`relative flex items-center gap-1 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isThinkingActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'thinking'}
              aria-current={isThinkingActive ? 'page' : undefined}
            >
              {t('ourThinking')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'thinking' ? 'rotate-180' : ''}`} />
              {isThinkingActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'thinking' && <ThinkingMegaMenu t={t} onClose={() => setActiveDropdown(null)} />}
          </div>

          {/* Qui sommes-nous */}
          <div className="nav-link-item relative">
            <button
              onClick={() => toggleDropdown('who')}
              className={`relative flex items-center gap-1 font-mono text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isWhoActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-expanded={activeDropdown === 'who'}
              aria-current={isWhoActive ? 'page' : undefined}
            >
              {t('whoWeAre')}
              <ChevronDown size={11} className={`transition-transform duration-200 ${activeDropdown === 'who' ? 'rotate-180' : ''}`} />
              {isWhoActive && <span className="absolute left-0 -bottom-0 w-full h-[2px] bg-ag-apex" />}
            </button>
            {activeDropdown === 'who' && <WhoMegaMenu t={t} onClose={() => setActiveDropdown(null)} />}
          </div>

          {/* Contact */}
          <div className="nav-link-item relative flex items-center">
            <Link
              href="/contact"
              className={`relative flex items-center font-mono text-[12px] tracking-[0.12em] uppercase transition-colors duration-200 pb-1 ${
                isContactActive ? 'text-ag-black' : 'text-ag-gray hover:text-ag-black'
              }`}
              aria-current={isContactActive ? 'page' : undefined}
            >
              {t('navContact')}
              {isContactActive && <span className="absolute left-0 bottom-0 w-full h-[2px] bg-ag-apex" />}
            </Link>
          </div>
        </nav>

        {/* Right side: locale + client + CTA */}
        <div ref={rightRef} className="hidden lg:flex items-center gap-5">
          {user && <NotificationBell />}
          <LanguageSwitcher />

          {user ? (
            <NextLink href="/client/account" className="flex items-center gap-2 pl-1 group" aria-label="Mon compte">
              <UserCircle size={16} className="text-ag-apex-ink shrink-0" aria-hidden="true" />
              <div className="leading-tight">
                <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-ag-gray-light">{user.label}</p>
                <p className="font-sans text-[12px] font-semibold text-ag-black truncate max-w-[150px] group-hover:text-ag-apex-ink transition-colors">{user.name}</p>
              </div>
            </NextLink>
          ) : (
            <NextLink
              href="/client/login"
              className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.12em] uppercase text-ag-gray hover:text-ag-black transition-colors duration-200"
            >
              <User size={13} />
              {t('clientSpace')}
            </NextLink>
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div ref={drawerRef} className="lg:hidden fixed inset-0 top-16 z-40 bg-ag-navy overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 flex flex-col gap-1">

            {/* Nos métiers accordion */}
            <div className="mobile-nav-item">
              <button
                onClick={() => toggleMobileAccordion('craft')}
                aria-current={isCraftActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[13px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isCraftActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('ourCraft')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'craft' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'craft' && (
                <div className="py-2 pl-4 flex flex-col gap-2">
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-2">{t('craftSupport')}</p>
                  {CRAFT_SUPPORT_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-3">{t('craftBuild')}</p>
                  {CRAFT_BUILD_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-3">{t('craftTransact')}</p>
                  {CRAFT_TRANSACT_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-3">{t('craftRecruit')}</p>
                  {CRAFT_RECRUIT_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
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
                  isThinkingActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('ourThinking')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'thinking' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'thinking' && (
                <div className="py-2 pl-4 flex flex-col gap-2">
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-2">{t('thinkingMagazine')}</p>
                  {THINKING_MAGAZINE_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-3">{t('thinkingMarket')}</p>
                  <a
                    href="https://www.linkedin.com/build-relation/newsletter-follow?entityUrn=7449391102052257793"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors"
                  >
                    {t('thinkingMarketNewsletter')}
                  </a>
                  {THINKING_MARKET_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
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
                  isWhoActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('whoWeAre')}
                <ChevronDown size={14} className={`transition-transform duration-200 ${mobileAccordion === 'who' ? 'rotate-180' : ''}`} />
              </button>
              {mobileAccordion === 'who' && (
                <div className="py-2 pl-4 flex flex-col gap-2">

                  {/* Le groupe */}
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-2">{t('whoGroup')}</p>
                  {WHO_GROUP_LINKS_BASE.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                  <button
                    onClick={() => {
                      closeMobile()
                      const el = document.getElementById('fondateur')
                      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
                      else { window.location.assign(`/${locale}/about#fondateur`) }
                    }}
                    className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors text-left w-full"
                  >
                    {t('whoFounder')}
                  </button>

                  {/* Nos bureaux */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mb-1.5">{t('whoOffices')}</p>
                    <p className="font-sans text-[12px] text-white/40 leading-relaxed">
                      Switzerland, Rue du Centre 142, 1025 St-Sulpice
                    </p>
                  </div>

                  {/* Nos industries — clusters dépliables */}
                  <div className="mt-2 pt-2 border-t border-white/10">
                    <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mb-2">{t('whoIndustries')}</p>
                    <div className="divide-y divide-white/10">
                      {clusters.map((cluster, ci) => {
                        const isOpen = mobileOpenCluster === ci
                        return (
                          <div key={ci}>
                            <button
                              onClick={() => setMobileOpenCluster(isOpen ? null : ci)}
                              style={{ fontWeight: 400 }}
                              className="w-full flex items-center justify-between py-2 font-sans text-[13px] text-white/50 hover:text-white transition-colors text-left"
                            >
                              <span>{cluster.cluster}</span>
                              <span className="text-white/30 leading-none">{isOpen ? '−' : '+'}</span>
                            </button>
                            {isOpen && (
                              <div className="pb-2 pl-3 flex flex-col gap-1">
                                {cluster.items.map(item => (
                                  <span key={item.name} className="font-sans text-[12px] text-white/35 leading-snug">{item.name}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Nous rejoindre */}
                  <p className="font-mono text-[9px] tracking-[0.24em] uppercase text-white/40 mt-3">{t('whoJoin')}</p>
                  {WHO_JOIN_LINKS.map(({ labelKey, href }) => (
                    <Link key={labelKey} href={href} onClick={closeMobile}
                      className="py-1.5 font-sans text-[14px] text-white/50 hover:text-white transition-colors">
                      {t(labelKey)}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="mobile-nav-item">
              <Link
                href="/contact"
                onClick={closeMobile}
                aria-current={isContactActive ? 'page' : undefined}
                className={`w-full flex items-center justify-between py-4 font-mono text-[13px] tracking-[0.18em] uppercase transition-colors border-b ${
                  isContactActive ? 'text-white border-ag-apex' : 'text-white/70 hover:text-white border-white/10'
                }`}
              >
                {t('navContact')}
              </Link>
            </div>

            {/* Bottom CTAs */}
            <div className="mt-8 flex flex-col gap-3">
              {user ? (
                <div className="flex items-center gap-2.5 border border-white/15 px-4 py-3">
                  <UserCircle size={18} className="text-ag-apex shrink-0" aria-hidden="true" />
                  <div className="leading-tight">
                    <p className="font-mono text-[8px] uppercase tracking-[0.18em] text-white/45">{user.label}</p>
                    <p className="font-sans text-[14px] font-semibold text-white truncate max-w-[200px]">{user.name}</p>
                  </div>
                </div>
              ) : (
                <NextLink
                  href="/client/login"
                  onClick={closeMobile}
                  className="flex items-center justify-center gap-2 border border-white/20 px-4 py-3 font-mono text-[12px] tracking-[0.14em] uppercase text-white/70 hover:border-white/50 hover:text-white transition-all"
                >
                  <User size={13} />
                  {t('clientSpace')}
                </NextLink>
              )}
            </div>

            {/* Language */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <LanguageSwitcher dark />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
