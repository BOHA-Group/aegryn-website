'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Link }                          from '@/i18n/navigation'
import { X, ArrowUpRight }              from 'lucide-react'
import { gsap }                          from '@/lib/gsap'
import { AEGRYN_ASSETS, ASSET_CATEGORIES } from '@/data/assets'
import type { Asset }                    from '@/data/assets'
import { BadgePill, StatusIndicator }    from '@/components/ui/AssetIndicators'
import { useTranslations }              from 'next-intl'

/* ── Drawer ──────────────────────────────────────────────────────── */
function Drawer({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const t = useTranslations('assetDrawer')
  const tStatus = useTranslations('assetStatus')
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

  const assetKey = asset.id
  const hasDetails = ['subblink', 'kryv', 'neediu', 'movtoo', 'primiom', 'hobconnect'].includes(assetKey)

  const getHighlights = (): { label: string; value: string }[] => {
    if (assetKey === 'subblink') return [
      { label: t('highlights.market'),   value: t('assets.subblink.market') },
      { label: t('highlights.tech'),     value: t('assets.subblink.tech') },
      { label: t('highlights.zones'),    value: t('assets.subblink.zones') },
      { label: t('highlights.status'),   value: tStatus('live') },
    ]
    if (assetKey === 'kryv') return [
      { label: t('highlights.category'), value: t('assets.kryv.category') },
      { label: t('highlights.useCase'),  value: t('assets.kryv.useCase') },
      { label: t('highlights.status'),   value: t('assets.kryv.status') },
    ]
    if (assetKey === 'neediu') return [
      { label: t('highlights.market'),   value: t('assets.neediu.market') },
      { label: t('highlights.zone'),     value: t('assets.neediu.zone') },
      { label: t('highlights.status'),   value: tStatus('dev') },
    ]
    if (assetKey === 'movtoo') return [
      { label: t('highlights.market'),   value: t('assets.movtoo.market') },
      { label: t('highlights.tech'),     value: t('assets.movtoo.tech') },
      { label: t('highlights.status'),   value: tStatus('notStarted') },
    ]
    if (assetKey === 'primiom') return [
      { label: t('highlights.market'),   value: t('assets.primiom.market') },
      { label: t('highlights.zones'),    value: t('assets.primiom.zones') },
      { label: t('highlights.status'),   value: tStatus('notStarted') },
    ]
    if (assetKey === 'hobconnect') return [
      { label: t('highlights.market'),   value: t('assets.hobconnect.market') },
      { label: t('highlights.model'),    value: t('assets.hobconnect.model') },
      { label: t('highlights.status'),   value: tStatus('notStarted') },
    ]
    return []
  }

  /* Animate in */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(panelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.55, ease: 'expo.out' },
      )
      gsap.fromTo(backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 },
      )
    })
    return () => ctx.revert()
  }, [])

  const close = useCallback(() => {
    gsap.to(panelRef.current, { x: '100%', duration: 0.4, ease: 'expo.in' })
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.3, onComplete: onClose })
  }, [onClose])

  /* ESC key */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [close])

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{ opacity: 0 }}
        onClick={close}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-y-auto"
        style={{ transform: 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-8 border-b border-ag-border sticky top-0 bg-white z-10">
          <div>
            <BadgePill badge={asset.badge} />
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] mt-3"
              style={{ fontSize: 'clamp(28px,3vw,38px)' }}
            >
              {asset.name}
            </h2>
          </div>
          <button
            onClick={close}
            className="w-9 h-9 flex items-center justify-center border border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black transition-all shrink-0 mt-1"
            aria-label="Fermer"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 p-8 space-y-8">
          {hasDetails ? (
            <>
              <p
                className="font-sans font-bold text-ag-black leading-[1.15] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(16px,1.6vw,20px)' }}
              >
                {t(`assets.${assetKey}.headline`)}
              </p>

              <div className="space-y-4">
                {[t(`assets.${assetKey}.p1`), t(`assets.${assetKey}.p2`)].map((p, i) => (
                  <p key={i} className="font-sans font-normal text-[14px] text-ag-gray leading-[1.8]">
                    {p}
                  </p>
                ))}
              </div>

              {/* Highlights grid */}
              <div className="grid grid-cols-2 gap-px bg-ag-border">
                {getHighlights().map((h) => (
                  <div key={h.label} className="bg-ag-off-white p-4">
                    <p className="font-sans font-semibold text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">
                      {h.label}
                    </p>
                    <p className="font-sans font-semibold text-[13px] text-ag-black">
                      {h.value}
                    </p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-[14px] text-ag-gray leading-relaxed">{asset.description}</p>
          )}

          {/* Status */}
          <div className="pt-2">
            <StatusIndicator status={asset.status} isRestricted={asset.id === 'kryv'} />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-8 border-t border-ag-border">
          {assetKey === 'subblink' ? (
            <a
              href="https://subblink.app"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-4 hover:bg-ag-apex hover:text-ag-navy transition-all duration-300"
            >
              {t('assets.subblink.cta')} <ArrowUpRight size={13} />
            </a>
          ) : asset.id === 'kryv' ? (
            <p className="font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-gray-light text-center">
              {t('accessRestricted')}
            </p>
          ) : (
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-3 border border-ag-border text-ag-black font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-4 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
              onClick={close}
            >
              {t('contactUs')} <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Grille principale avec drawers ─────────────────────────────── */
export function AssetGridWithDrawer() {
  const t = useTranslations('assetDrawer')
  const [openId, setOpenId] = useState<string | null>(null)
  const openAsset = AEGRYN_ASSETS.find((a) => a.id === openId) ?? null

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    document.body.style.overflow = openId ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [openId])

  return (
    <>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">

          {/* Header row avec compteur */}
          <div className="flex items-center justify-between border-y border-ag-border py-4 mb-0">
            <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              {t('allAssets')}
            </span>
            <span className="font-sans font-semibold text-[10px] text-ag-gray-light">
              {String(AEGRYN_ASSETS.length).padStart(2, '0')}
            </span>
          </div>

          {/* Grille 3 colonnes flat — toutes catégories mélangées */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-b border-ag-border">
            {AEGRYN_ASSETS.map((asset, i) => {
              const isRestricted = asset.id === 'kryv'
              const colBorder = i % 3 !== 2 ? 'lg:border-r border-ag-border' : ''
              const colBorderSm = i % 2 !== 1 ? 'md:border-r border-ag-border' : ''
              const rowBorder = 'border-b border-ag-border'

              return (
                <button
                  key={asset.id}
                  onClick={() => setOpenId(asset.id)}
                  className={`group text-left flex flex-col p-10 min-h-[240px] transition-all duration-500
                    bg-ag-white hover:bg-ag-navy
                    ${colBorder} ${colBorderSm} ${rowBorder}`}
                >
                  {/* Top — badge + catégorie + flèche */}
                  <div className="flex justify-between items-start w-full mb-auto">
                    <div className="space-y-2">
                      <span className="font-sans font-semibold text-[10px] tracking-[0.16em] uppercase text-ag-gray-light group-hover:text-white/50 transition-colors duration-500">
                        {ASSET_CATEGORIES[asset.category].label}
                      </span>
                      <br />
                      <BadgePill badge={asset.badge} />
                    </div>
                    <span className="w-8 h-8 border border-ag-border flex items-center justify-center text-ag-gray group-hover:border-white/40 group-hover:text-white transition-all duration-500 shrink-0">
                      <ArrowUpRight size={13} />
                    </span>
                  </div>

                  {/* Bottom — nom + tagline + status */}
                  <div className="mt-12">
                    <h3
                      className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-none mb-2 group-hover:text-white transition-colors duration-500"
                      style={{ fontSize: 'clamp(22px,2vw,28px)' }}
                    >
                      {asset.name}
                    </h3>
                    <p className="font-sans font-normal text-[12px] text-ag-gray leading-relaxed mb-4 group-hover:text-white/65 transition-colors duration-500">
                      {asset.tagline}
                    </p>
                    <StatusIndicator status={asset.status} isRestricted={isRestricted} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {openAsset && (
        <Drawer
          asset={openAsset as Asset}
          onClose={() => setOpenId(null)}
        />
      )}
    </>
  )
}
