'use client'

import { useEffect, useRef } from 'react'
import Link                   from 'next/link'
import { ArrowUpRight }       from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { AEGRYN_ASSETS, ASSET_CATEGORIES } from '@/data/assets'
import type { Asset } from '@/data/assets'

const STATUS_CONFIG = {
  live:  { label: 'Live',              dot: 'bg-ag-live',  pulse: true },
  beta:  { label: 'Bêta',             dot: 'bg-ag-beta',  pulse: true },
  dev:   { label: 'En développement', dot: 'bg-ag-dev',   pulse: false },
} as const

export function AssetGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.asset-tile', {
        opacity: 0, y: 24, stagger: 0.07,
        ease: 'expo.out', duration: 0.65,
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="py-32 bg-ag-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="mb-20">
          <p className="font-sans font-semibold text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
            Notre écosystème
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[0.95]"
            style={{ fontSize: 'clamp(36px,4.5vw,64px)' }}
          >
            Ce que nous<br />construisons.
          </h2>
        </div>

        <div ref={gridRef} className="space-y-0">
          {(Object.keys(ASSET_CATEGORIES) as Array<keyof typeof ASSET_CATEGORIES>).map((cat) => {
            const catAssets = AEGRYN_ASSETS.filter((a) => a.category === cat)
            if (!catAssets.length) return null

            return (
              <div key={cat}>
                <div className="flex items-center justify-between border-y border-ag-border py-4">
                  <span className="font-sans font-bold text-[11px] tracking-[0.18em] uppercase text-ag-black">
                    {ASSET_CATEGORIES[cat].label}
                  </span>
                  <span className="font-sans font-semibold text-[11px] text-ag-gray-light">
                    {String(catAssets.length).padStart(2, '0')}
                  </span>
                </div>

                <div className={`grid border-b border-ag-border ${
                  catAssets.length <= 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                }`}>
                  {catAssets.map((asset) => (
                    <AssetTile key={asset.id} asset={asset as Asset} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

function AssetTile({ asset }: { asset: Asset }) {
  const ref    = useRef<HTMLAnchorElement>(null)
  const divRef = useRef<HTMLDivElement>(null)
  const status = STATUS_CONFIG[asset.status]
  const isKryv = asset.id === 'kryv'

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current || divRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) translateY(-1px)`
  }
  const onLeave = () => {
    const el = ref.current || divRef.current
    if (el) el.style.transform = ''
  }

  if (isKryv) {
    return (
      <div
        ref={divRef}
        className="asset-tile group relative flex flex-col border-r border-ag-border p-10 min-h-[260px] bg-ag-white overflow-hidden will-change-transform last:border-r-0"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="flex justify-between items-start mb-auto">
          <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-gray-light border border-ag-border px-2.5 py-1">
            CLASSIFIÉ
          </span>
          <span className="w-8 h-8 border border-ag-border flex items-center justify-center text-ag-gray">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
          </span>
        </div>
        <div className="mt-16">
          <h3
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-none mb-2"
            style={{ fontSize: 'clamp(22px,2vw,28px)' }}
          >
            {asset.name}
          </h3>
          <p className="font-sans font-normal text-[12px] text-ag-gray leading-relaxed">
            {asset.tagline}
          </p>
          <div className="flex items-center gap-2 mt-5">
            <span className="w-1.5 h-1.5 rounded-full bg-ag-dev" />
            <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
              Restricted
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      ref={ref}
      href={`/assets/${asset.slug}`}
      className="asset-tile group relative flex flex-col border-r border-ag-border p-10 min-h-[260px] bg-ag-white overflow-hidden transition-colors duration-300 hover:bg-ag-off-white will-change-transform last:border-r-0"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div className="flex justify-between items-start mb-auto">
        <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-gray-light border border-ag-border px-2.5 py-1 group-hover:border-ag-border-h group-hover:text-ag-gray transition-all duration-200">
          {asset.badge}
        </span>
        <span className="w-8 h-8 border border-ag-border flex items-center justify-center text-ag-gray group-hover:border-ag-black group-hover:bg-ag-black group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
          <ArrowUpRight size={13} />
        </span>
      </div>
      <div className="mt-16">
        <h3
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-none mb-2"
          style={{ fontSize: 'clamp(22px,2vw,28px)' }}
        >
          {asset.name}
        </h3>
        <p className="font-sans font-normal text-[12px] text-ag-gray leading-relaxed">
          {asset.tagline}
        </p>
        <div className="flex items-center gap-2 mt-5">
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} />
          <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
            {status.label}
          </span>
        </div>
      </div>
    </Link>
  )
}
