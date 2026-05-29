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
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
            Notre écosystème
          </p>
          <h2
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.95]"
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
                  <span className="font-display font-bold text-[11px] tracking-[0.18em] uppercase text-ag-black">
                    {ASSET_CATEGORIES[cat].label}
                  </span>
                  <span className="font-mono text-[11px] text-ag-gray-light">
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
  const status = STATUS_CONFIG[asset.status]

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform =
      `perspective(1000px) rotateY(${x * 3}deg) rotateX(${-y * 3}deg) translateY(-1px)`
  }

  const onLeave = (_e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ref.current) ref.current.style.transform = ''
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
        <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light border border-ag-border px-2.5 py-1 group-hover:border-ag-border-h group-hover:text-ag-gray transition-all duration-200">
          {asset.badge}
        </span>
        <span className="w-8 h-8 border border-ag-border flex items-center justify-center text-ag-gray group-hover:border-ag-black group-hover:bg-ag-black group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
          <ArrowUpRight size={13} />
        </span>
      </div>

      <div className="mt-16">
        <h3
          className="font-display font-black text-ag-black tracking-[-0.03em] leading-none mb-2"
          style={{ fontSize: 'clamp(22px,2vw,28px)' }}
        >
          {asset.name}
        </h3>
        <p className="font-mono text-[12px] text-ag-gray leading-relaxed">
          {asset.tagline}
        </p>
        <div className="flex items-center gap-2 mt-5">
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} />
          <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
            {status.label}
          </span>
        </div>
      </div>
    </Link>
  )
}
