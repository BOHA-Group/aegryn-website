'use client'

import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { useTranslations } from 'next-intl'
import {
  CRAFT_METIERS, CRAFT_TRANSACT_CYCLES, THINKING_MAGAZINE_LINKS, THINKING_MARKET_LINKS, NEWSLETTER_HREF,
  WHO_GROUP_LINKS, WHO_JOIN_LINKS, INDUSTRY_CLUSTERS, BOUTIQUE_DISCOVER_LINKS, BOUTIQUE_SUBMIT_HREF,
  type DropdownKey, type LinkHref, type NavLink,
} from './navData'

type T = ReturnType<typeof useTranslations>

const LINK = 'font-sans text-[13px] font-medium leading-snug text-ag-black transition-colors hover:text-ag-apex-ink'
const LINK_MUTED = 'font-sans text-[13px] font-medium leading-snug text-ag-gray-light transition-colors hover:text-ag-gray'

function Col({ title, desc, children }: { title: string; desc?: string; children: ReactNode }) {
  return (
    <div className="min-w-[170px]">
      <div className="min-h-[5.75rem]">
        <p className="font-sans text-[12px] text-ag-gray-light">{title}</p>
        {desc && <p className="mt-1 max-w-[230px] font-sans text-[11px] leading-relaxed text-ag-gray-light/80">{desc}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function Links({ items, t, onClose, cols = 1 }: { items: NavLink[]; t: T; onClose: () => void; cols?: 1 | 2 }) {
  return (
    <ul className={cols === 2 ? 'grid grid-cols-2 gap-x-12 gap-y-3' : 'flex flex-col gap-3'}>
      {items.map(({ labelKey, href, muted }) => (
        <li key={labelKey}>
          <Link href={href} onClick={onClose} className={muted ? LINK_MUTED : LINK}>{t(labelKey)}</Link>
        </li>
      ))}
    </ul>
  )
}

/* Bandeau blanc des menus : texte seul, colonnes centrées sur la page, sans bordure ni image */
export function NavPanel({ menu, t, onClose }: { menu: DropdownKey; t: T; onClose: () => void }) {
  return (
    <div className="mx-auto flex max-w-5xl justify-center gap-x-24 px-6 pb-14 pt-6 md:px-12">
      {menu === 'craft' && (
        <>
          <Col title={t('craftFrameDeliver')} desc={t('craftFrameDeliverDesc')}>
            <Links items={CRAFT_METIERS} t={t} onClose={onClose} cols={2} />
          </Col>
          <Col title={t('craftTransact')} desc={t('craftTransactDesc')}>
            <Links items={CRAFT_TRANSACT_CYCLES} t={t} onClose={onClose} />
            <Link href={'/industries' as LinkHref} onClick={onClose} className={`${LINK} mt-6 inline-flex items-center gap-1.5`}>
              {t('whoIndustries')} <ArrowRight size={12} />
            </Link>
          </Col>
        </>
      )}

      {menu === 'thinking' && (
        <>
          <Col title={t('thinkingMagazine')} desc={t('thinkingMagazineDesc')}>
            <Links items={THINKING_MAGAZINE_LINKS} t={t} onClose={onClose} />
          </Col>
          <Col title={t('thinkingMarket')} desc={t('thinkingMarketDesc')}>
            <ul className="flex flex-col gap-3">
              <li><a href={NEWSLETTER_HREF} target="_blank" rel="noopener noreferrer" className={LINK}>{t('thinkingMarketNewsletter')}</a></li>
              {THINKING_MARKET_LINKS.map(({ labelKey, href }) => (
                <li key={labelKey}><Link href={href} onClick={onClose} className={LINK}>{t(labelKey)}</Link></li>
              ))}
            </ul>
          </Col>
        </>
      )}

      {menu === 'who' && (
        <>
          <Col title={t('whoGroup')} desc={t('whoGroupDesc')}>
            <Links items={WHO_GROUP_LINKS} t={t} onClose={onClose} />
            <p className="mt-6 font-sans text-[11px] leading-relaxed text-ag-gray-light">
              {t('whoOffices')}<br />Rue du Centre 142, 1025 St-Sulpice, Switzerland
            </p>
          </Col>
          <Col title={t('whoIndustries')} desc={t('whoIndustriesDesc')}>
            <ul className="flex flex-col gap-3">
              {INDUSTRY_CLUSTERS.map(({ slug, labelKey }) => (
                <li key={slug}><Link href={`/industries/${slug}` as LinkHref} onClick={onClose} className={LINK}>{t(labelKey as Parameters<T>[0])}</Link></li>
              ))}
            </ul>
            <Link href={'/industries' as LinkHref} onClick={onClose} className={`${LINK} mt-6 inline-flex items-center gap-1.5`}>
              {t('whoIndustriesLink')} <ArrowRight size={12} />
            </Link>
          </Col>
          <Col title={t('whoJoin')} desc={t('whoJoinDesc')}>
            <Links items={WHO_JOIN_LINKS} t={t} onClose={onClose} />
          </Col>
        </>
      )}

      {menu === 'boutique' && (
        <>
          <Col title={t('boutiqueDiscover')} desc={t('boutiqueDiscoverDesc')}>
            <Links items={BOUTIQUE_DISCOVER_LINKS} t={t} onClose={onClose} />
          </Col>
          <Col title={t('boutiqueAct')} desc={t('boutiqueActDesc')}>
            <ul className="flex flex-col gap-3">
              <li className="flex items-center gap-2 font-sans text-[13px] font-medium text-ag-gray-light/70" aria-disabled="true">
                {t('boutiquePlaces')}
                <span className="rounded-full bg-ag-off-white px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ag-gray">{t('boutiqueSoon')}</span>
              </li>
              <li><Link href={BOUTIQUE_SUBMIT_HREF} onClick={onClose} className={LINK}>{t('boutiqueSubmit')}</Link></li>
            </ul>
          </Col>
        </>
      )}
    </div>
  )
}
