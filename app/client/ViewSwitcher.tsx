'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftRight } from 'lucide-react'

type Props = {
  hasBuyer:   boolean
  hasSeller:  boolean
  hasPartner?: boolean
}

export default function ViewSwitcher({ hasBuyer, hasSeller, hasPartner }: Props) {
  const pathname = usePathname()

  const activeSpaces = [hasBuyer, hasSeller, hasPartner].filter(Boolean).length
  if (activeSpaces < 2) return null

  const isBuyerView   = pathname.startsWith('/client/buyer')
  const isSellerView  = pathname.startsWith('/client/seller')
  const isPartnerView = pathname.startsWith('/client/partner')

  if (!isBuyerView && !isSellerView && !isPartnerView) return null

  const views = [
    hasBuyer   && { href: '/client/buyer',   label: 'Acquéreur', active: isBuyerView },
    hasSeller  && { href: '/client/seller',  label: 'Cédant',    active: isSellerView },
    hasPartner && { href: '/client/partner', label: 'Partenaire', active: isPartnerView },
  ].filter(Boolean) as { href: string; label: string; active: boolean }[]

  return (
    <div className="px-3 py-3 border-b border-white/10">
      <p className="px-3 mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
        Vue active
      </p>
      <div className="flex flex-col gap-0.5">
        {views.map(({ href, label, active }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
              active
                ? 'bg-white/10 text-white'
                : 'text-white/45 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <ArrowLeftRight size={12} className="shrink-0 opacity-60" />
            <span className="font-sans text-[12px]">{label}</span>
            {active && (
              <span className="ml-auto font-mono text-[8px] text-ag-apex uppercase tracking-widest">actif</span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
