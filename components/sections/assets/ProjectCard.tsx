'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { assetPath, type AegrynAsset } from '@/data/assets'

/** Fiche projet du portfolio : image, badge, titre (capacité démontrée), statut ; détails dépliés au survol (optionnels). */
export function ProjectCard({ asset, showDetails = true }: { asset: AegrynAsset; showDetails?: boolean }) {
  const t = useTranslations('assets.page')
  const tStatus = useTranslations('assetStatus')
  const tItems = useTranslations('assets.items')

  const statusLabel = (status: string) => {
    if (status === 'live')        return tStatus('live')
    if (status === 'beta')        return tStatus('beta')
    if (status === 'refused')     return tStatus('refused')
    return null
  }
  const statusColor = (status: string) => {
    if (status === 'live')  return 'text-ag-live'
    if (status === 'beta')  return 'text-ag-beta'
    return 'text-ag-gray'
  }

  return (
        <div
          className="asset-card bg-ag-white rounded-2xl border border-ag-border overflow-hidden flex flex-col group hover:bg-ag-off-white transition-colors"
            >
              {/* Image dominante cliquable + badge en haut à droite */}
              {asset.image && (
                <Link href={assetPath(asset.slug) as never} className="relative aspect-[4/3] overflow-hidden block">
                  <Image
                    src={asset.image}
                    alt={tItems(`${asset.id}.tagline`)}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
                  />
                  <span className="absolute top-3 right-3 font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 bg-black/40 backdrop-blur-sm border border-white/15 text-white/70 rounded-md whitespace-nowrap">
                    {tItems(`${asset.id}.badge`)}
                  </span>
                </Link>
              )}
              <div className="p-5 flex flex-col gap-3 flex-1">
              {/* Titre : capacité démontrée */}
              <h2 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.02em] leading-snug">
                {tItems(`${asset.id}.capability`)}
              </h2>

              {/* Badges statut */}
              {(statusLabel(asset.status) || asset.internalOnly) && (
                <div className="flex items-center gap-3 flex-wrap">
                  {statusLabel(asset.status) && (
                    <span className={`font-mono text-[10px] tracking-[0.12em] uppercase ${statusColor(asset.status)}`}>
                      {statusLabel(asset.status)}
                    </span>
                  )}
                  {asset.internalOnly && (
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ag-gray-light border border-ag-border px-2 py-0.5 rounded-md">
                      {t('internalOnly')}
                    </span>
                  )}
                </div>
              )}

              {/* Détails pliés — dépliés au survol (absents de l'aperçu en accueil de La Boutique) */}
              {showDetails && <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
                <div className="min-h-0 min-w-0 overflow-hidden">
                  <p className="font-sans font-semibold text-[13px] text-ag-dark leading-snug">
                    {tItems(`${asset.id}.tagline`)}
                    {asset.namePublic && (
                      <span className="font-normal text-ag-gray"> ({t('publicNameSuffix')} : {asset.name})</span>
                    )}
                  </p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed pt-2 pb-2">
                    {tItems(`${asset.id}.description`)}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.08em] text-ag-gray-light leading-relaxed pb-1">
                    {tItems(`${asset.id}.keywords`)}
                  </p>
                  {asset.internalOnly && (
                    <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light pt-3 border-t border-ag-border">
                      {t('confidential')}
                    </p>
                  )}
                </div>
              </div>}
              </div>
        </div>
  )
}
