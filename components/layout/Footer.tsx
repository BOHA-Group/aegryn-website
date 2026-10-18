'use client'

import { Link }        from '@/i18n/navigation'
import Image           from 'next/image'
import { useEffect, useRef, type ComponentProps } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { ShareMenu } from '@/components/ui/ShareMenu'
import { FacebookIcon, InstagramIcon, LinkedInIcon, TikTokIcon, YouTubeIcon } from '@/components/ui/socialIcons'

/**
 * Spinning contact medallion.
 * textLength forces the text to span exactly the circumference → no gap, no overlap.
 * Circumference = 2π × R. SIZE=110, R=44 → C ≈ 276.46px used as textLength.
 */
function FooterMedallion({ medallionText, contactLabel }: { medallionText: string; contactLabel: string }) {
  const ringRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(ringRef.current, { rotation: 360, duration: 26, ease: 'none', repeat: -1 })
    })
    return () => mm.revert()
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
      <div className="relative w-12 h-12 rounded-full bg-ag-apex/15 border border-ag-apex/40 flex items-center justify-center group-hover:bg-ag-apex group-hover:border-ag-apex transition-all duration-300">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none"
          className="text-ag-apex group-hover:text-ag-navy transition-colors duration-300">
          <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </Link>
  )
}


const socialLinks = [
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/company/106273747/', icon: <LinkedInIcon /> },
  { label: 'Instagram', href: 'https://www.instagram.com/aegrynhq/',         icon: <InstagramIcon /> },
  { label: 'Facebook',  href: 'https://www.facebook.com/aegrynhq',           icon: <FacebookIcon /> },
  { label: 'TikTok',    href: 'https://www.tiktok.com/@aegrynhq',            icon: <TikTokIcon /> },
  { label: 'YouTube',   href: 'https://www.youtube.com/@aegrynhq',           icon: <YouTubeIcon /> },
]

type LinkHref = ComponentProps<typeof Link>['href']

const legal: { key: string; href: LinkHref; ns: string; external?: boolean }[] = [
  { key: 'termsUse',  href: '/terms/use',       ns: 'legalNav' },
  { key: 'termsCgv',  href: '/terms/cgv',       ns: 'legalNav' },
  { key: 'privacy',   href: '/privacy',         ns: 'legalNav' },
  { key: 'aiUsage',   href: '/terms/ai-usage' as never,  ns: 'legalNav' },
  { key: 'security',  href: '/security',        ns: 'legalNav' },
  { key: 'faq',       href: '/help/faq',        ns: 'legalNav' },
  { key: 'sitemap',   href: '/sitemap',         ns: 'legalNav' },
]

const boutiqueLinks: { navKey: string; href: LinkHref }[] = [
  { navKey: 'boutiqueConcept',  href: '/boutique' },
  { navKey: 'boutiqueProjects', href: '/boutique/projets' as LinkHref },
  { navKey: 'boutiqueKnowHow',  href: { pathname: '/boutique', hash: 'savoir-faire' } as LinkHref },
  { navKey: 'boutiqueSubmit',   href: { pathname: '/contact', query: { subject: 'project' } } as LinkHref },
]

const aegrynLinks: { navKey: string; href: LinkHref }[] = [
  { navKey: 'whoAbout',     href: '/about' },
  { navKey: 'whoCulture',   href: '/culture' as LinkHref },
  { navKey: 'roadmap',      href: '/roadmap' as never },
  { navKey: 'whoAlliances', href: '/alliances' },
  { navKey: 'whoContact',   href: '/contact' },
]

/* Colonne Le cabinet : sections de l'accueil (huit métiers, situations), industries et réseaux */
const metiersLinks: { navNs: 'footer' | 'nav'; key: string; href: LinkHref }[] = [
  { navNs: 'footer', key: 'footerCraftFrameDeliver', href: { pathname: '/', hash: 'cadrer' } as LinkHref },
  { navNs: 'footer', key: 'footerCraftTransact',     href: { pathname: '/', hash: 'cinq-cycles' } as LinkHref },
  { navNs: 'nav',    key: 'whoIndustries',           href: '/industries' as LinkHref },
  { navNs: 'nav',    key: 'craftSupportExperts',     href: '/experts' as LinkHref },
  { navNs: 'nav',    key: 'craftSupportInvestors',   href: '/investisseurs' as LinkHref },
]

export default function Footer() {
  const t    = useTranslations('footer')
  const tNav = useTranslations('nav')
  const tL   = useTranslations('legalNav')

  return (
    <footer className="bg-ag-navy border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 pt-10 pb-10">
        <div className="grid gap-10 grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">

          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Image
              src="/images/brand/logo-aegryn.png"
              alt="Aegryn"
              width={100}
              height={44}
              className="h-8 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="mt-1 font-sans font-semibold text-[11px] text-white/70">
              {t('swissTagline')}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, href, icon }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/70 hover:text-ag-apex transition-colors duration-200">
                  {icon}
                </a>
              ))}
              <ShareMenu variant="icon" />
            </div>
          </div>

          {/* Col 1 — Aegryn (institutionnel) */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/70 uppercase mb-4">
              {t('footerCol1Title')}
            </p>
            <ul className="space-y-2.5">
              {aegrynLinks.map(({ navKey, href }) => (
                <li key={navKey}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {tNav(navKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2 — Le cabinet */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/70 uppercase mb-4">
              {t('footerCol2Title')}
            </p>
            <ul className="space-y-2.5">
              {metiersLinks.map(({ navNs, key, href }) => (
                <li key={key}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {navNs === 'nav' ? tNav(key) : t(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col La Boutique */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/70 uppercase mb-4">
              {tNav('navPortfolio')}
            </p>
            <ul className="space-y-2.5">
              {boutiqueLinks.map(({ navKey, href }) => (
                <li key={navKey}>
                  <Link href={href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {tNav(navKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Plateforme (outils) */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/70 uppercase mb-4">
              {t('footerCol3Title')}
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/assets" className="text-sm text-white/70 hover:text-white transition-colors">
                  {tNav('craftBuildAssets')}
                </Link>
              </li>
              <li>
                <Link href="/valuation" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t('col3Valuation')}
                </Link>
              </li>
              <li>
                <Link href="/grade" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t('col2Code')}
                </Link>
              </li>
              <li>
                <a href="https://subblink.com" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t('col2Subblink')}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 — Publications (éditorial) */}
          <div>
            <p className="font-sans font-semibold text-[10px] tracking-[0.2em] text-white/70 uppercase mb-4">
              {t('footerCol4Title')}
            </p>
            <ul className="space-y-2.5">
              <li>
                <Link href="/magazine" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t('col3Magazine')}
                </Link>
              </li>
              <li>
                <a href="https://www.linkedin.com/newsletters/7449391102052257793/?displayConfirmation=true" target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t('col3Newsletter')}
                </a>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t('col3Blog')}
                </Link>
              </li>
              <li>
                <Link href="/help/faq" className="text-sm text-white/70 hover:text-white transition-colors">
                  {t('col3FAQ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Advisory CTA — macaron contact */}
          <div className="relative">
            {/* Médaillon contact */}
            <div>
              <FooterMedallion
                medallionText={t('medallionText')}
                contactLabel={t('contactLabel')}
              />
            </div>
          </div>
        </div>

        {/* Legal strip — compact, fused above marquee */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 pt-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-1">
            <p className="font-sans font-semibold text-[10px] text-white/70">
              {t('legal')}
            </p>
            <p className="font-sans text-[10px] text-white/70">
              {t('aiNotice')}
            </p>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/70 mt-1">
              {t('taglines')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            {legal.map(({ key, href, external }) => (
              external ? (
                <a
                  key={key}
                  href={href as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans font-semibold text-[10px] text-white/70 hover:text-white transition-colors inline-block py-2"
                >
                  {tL(key as 'termsUse')}
                </a>
              ) : (
                <Link
                  key={key}
                  href={href}
                  className="font-sans font-semibold text-[10px] text-white/70 hover:text-white transition-colors inline-block py-2"
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
