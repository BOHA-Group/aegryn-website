'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link                              from 'next/link'
import { X, ArrowUpRight }              from 'lucide-react'
import { gsap }                          from '@/lib/gsap'
import { AEGRYN_ASSETS, ASSET_CATEGORIES } from '@/data/assets'
import type { Asset }                    from '@/data/assets'
import { BadgePill, StatusIndicator }    from '@/components/ui/AssetIndicators'

/* ── Contenu détaillé par actif ─────────────────────────────────── */
const ASSET_DETAILS: Record<string, {
  headline: string
  paragraphs: string[]
  highlights: { label: string; value: string }[]
  cta?: { label: string; href: string; external?: boolean }
}> = {
  subblink: {
    headline: 'L\'IA qui lit vos contrats à votre place.',
    paragraphs: [
      'Subblink analyse instantanément tout type de contrat — NDAs, CGV, baux, contrats de prestation — et identifie les clauses à risque, les engagements cachés et les points de négociation.',
      'Calibrée pour le droit suisse et français, la solution s\'adresse aux freelances, consultants, PME et directions juridiques qui veulent reprendre le contrôle de leurs obligations contractuelles.',
    ],
    highlights: [
      { label: 'Marché', value: 'B2B — SaaS' },
      { label: 'Technologie', value: 'IA générative + NLP juridique' },
      { label: 'Zones', value: 'Suisse · France · Europe' },
      { label: 'Statut', value: 'Live' },
    ],
    cta: { label: 'Accéder à Subblink', href: 'https://subblink.boha-group.com', external: true },
  },
  kryv: {
    headline: 'Le SSL du code IA — chaque déploiement, immuablement scellé.',
    paragraphs: [
      'KRYV Protocol est un protocole blockchain de certification de l\'intégrité du code IA. Il garantit qu\'un modèle déployé est exactement celui qui a été audité et approuvé, sans altération.',
      'Dans un monde où l\'IA devient infrastructure critique, KRYV pose les bases d\'une certification de confiance vérifiable on-chain.',
    ],
    highlights: [
      { label: 'Catégorie', value: 'Protocole — Blockchain' },
      { label: 'Cas d\'usage', value: 'Certification IA, audit on-chain' },
      { label: 'Statut', value: 'Restricted — accès sur invitation' },
    ],
  },
  neediu: {
    headline: 'La mise en relation intelligente pour les services à domicile.',
    paragraphs: [
      'Neediu connecte les particuliers aux prestataires qualifiés pour tous leurs besoins à domicile : ménage, jardinage, bricolage, garde d\'enfants et bien plus.',
      'L\'algorithme analyse la disponibilité, la localisation et les évaluations pour proposer le prestataire idéal en quelques secondes.',
    ],
    highlights: [
      { label: 'Marché', value: 'B2C — Marketplace' },
      { label: 'Zone', value: 'Région parisienne → France' },
      { label: 'Statut', value: 'En développement' },
    ],
  },
  movtoo: {
    headline: 'La livraison à la demande, pilotée par l\'IA.',
    paragraphs: [
      'Movtoo réinvente la logistique du dernier kilomètre avec une plateforme de livraison immédiate optimisée par l\'intelligence artificielle.',
      'Les expéditeurs et destinataires bénéficient d\'une transparence totale sur le trajet, le délai et le coût — en temps réel.',
    ],
    highlights: [
      { label: 'Marché', value: 'B2C — Livraison' },
      { label: 'Technologie', value: 'IA routage + optimisation flotte' },
      { label: 'Statut', value: 'En développement' },
    ],
  },
  primiom: {
    headline: 'L\'immobilier réinventé par l\'IA.',
    paragraphs: [
      'Primiom accompagne acheteurs, vendeurs et investisseurs immobiliers avec des outils d\'analyse de marché et d\'aide à la décision basés sur l\'IA.',
      'Évaluation prédictive, détection des opportunités, simulation de rentabilité — tout ce dont vous avez besoin pour décider avec confiance.',
    ],
    highlights: [
      { label: 'Marché', value: 'B2C — Immobilier' },
      { label: 'Zones', value: 'France · Europe' },
      { label: 'Statut', value: 'En développement' },
    ],
  },
  hobconnect: {
    headline: 'Le réseau social qui rassemble autour des passions.',
    paragraphs: [
      'Hobconnect crée des communautés authentiques autour des centres d\'intérêt partagés — sport, musique, art, gaming, voyages et bien d\'autres.',
      'Une alternative aux réseaux généralistes, centrée sur la profondeur des échanges plutôt que sur la quantité d\'interactions.',
    ],
    highlights: [
      { label: 'Marché', value: 'B2C — Social' },
      { label: 'Modèle', value: 'Freemium — communautés privées/publiques' },
      { label: 'Statut', value: 'En développement' },
    ],
  },
}

/* ── Drawer ──────────────────────────────────────────────────────── */
function Drawer({ asset, onClose }: { asset: Asset; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const details = ASSET_DETAILS[asset.id]

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
          {details ? (
            <>
              <p
                className="font-sans font-bold text-ag-black leading-[1.15] tracking-[-0.02em]"
                style={{ fontSize: 'clamp(16px,1.6vw,20px)' }}
              >
                {details.headline}
              </p>

              <div className="space-y-4">
                {details.paragraphs.map((p, i) => (
                  <p key={i} className="font-sans font-normal text-[14px] text-ag-gray leading-[1.8]">
                    {p}
                  </p>
                ))}
              </div>

              {/* Highlights grid */}
              <div className="grid grid-cols-2 gap-px bg-ag-border">
                {details.highlights.map((h) => (
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
          {details?.cta ? (
            <a
              href={details.cta.href}
              target={details.cta.external ? '_blank' : undefined}
              rel={details.cta.external ? 'noopener noreferrer' : undefined}
              className="w-full inline-flex items-center justify-center gap-3 bg-ag-navy text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-4 hover:bg-ag-apex hover:text-ag-navy transition-all duration-300"
            >
              {details.cta.label} <ArrowUpRight size={13} />
            </a>
          ) : asset.id === 'kryv' ? (
            <p className="font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-gray-light text-center">
              Accès sur invitation uniquement
            </p>
          ) : (
            <Link
              href="/contact"
              className="w-full inline-flex items-center justify-center gap-3 border border-ag-border text-ag-black font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-4 hover:border-ag-black hover:bg-ag-black hover:text-white transition-all duration-300"
              onClick={close}
            >
              Nous contacter <ArrowUpRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Grille principale avec drawers ─────────────────────────────── */
export function AssetGridWithDrawer() {
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
              / Tous les actifs
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
