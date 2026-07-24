'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftRight } from 'lucide-react'

type Props = {
  hasBuyer:  boolean
  hasSeller: boolean
}

export default function ViewSwitcher({ hasBuyer, hasSeller }: Props) {
  const pathname = usePathname()

  if (!hasBuyer || !hasSeller) return null

  const isBuyerView  = pathname.startsWith('/client/buyer')
  const isSellerView = pathname.startsWith('/client/seller')

  if (!isBuyerView && !isSellerView) return null

  return (
    <div className="px-3 py-3 border-b border-white/10">
      <p className="px-3 mb-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
        Vue active
      </p>
      <div className="flex flex-col gap-0.5">
        <Link
          href="/client/buyer"
          className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
            isBuyerView
              ? 'bg-white/10 text-white'
              : 'text-white/45 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <ArrowLeftRight size={12} className="shrink-0 opacity-60" />
          <span className="font-sans text-[12px]">Acquéreur</span>
          {isBuyerView && (
            <span className="ml-auto font-mono text-[8px] text-ag-apex uppercase tracking-widest">actif</span>
          )}
        </Link>
        <Link
          href="/client/seller"
          className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
            isSellerView
              ? 'bg-white/10 text-white'
              : 'text-white/45 hover:text-white/80 hover:bg-white/5'
          }`}
        >
          <ArrowLeftRight size={12} className="shrink-0 opacity-60" />
          <span className="font-sans text-[12px]">Cédant</span>
          {isSellerView && (
            <span className="ml-auto font-mono text-[8px] text-ag-apex uppercase tracking-widest">actif</span>
          )}
        </Link>
      </div>
    </div>
  )
}
