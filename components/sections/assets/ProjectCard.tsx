'use client'

import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { assetPath, type AegrynAsset } from '@/data/assets'
import { ConfidentialStamp } from '@/components/ui/ConfidentialStamp'

/** Fiche projet du portfolio : image, secteur et savoir-faire ; détails dépliés au survol (optionnels).
 *  Les fiches `confidential` sont scellées : tampon rouge, pas de lien ni de dépliage. */
export function ProjectCard({ asset, showDetails = true }: { asset: AegrynAsset; showDetails?: boolean }) {
  const t = useTranslations('assets.page')
  const tItems = useTranslations('assets.items')
  const locked = !!asset.confidential

  const image = asset.image && (
    <>
      <Image
        src={asset.image}
        alt={locked ? '' : tItems(`${asset.id}.tagline`)}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className={locked
          ? 'object-cover grayscale'
          : 'object-cover grayscale-[35%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500'}
      />
      <span className="absolute top-3 right-3 font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-1 bg-black/40 backdrop-blur-sm border border-white/15 text-white/70 rounded-md whitespace-nowrap">
        {tItems(`${asset.id}.badge`)}
      </span>
      {locked && <ConfidentialStamp label={t('confidential')} />}
    </>
  )

  return (
        <div
          className="asset-card bg-ag-white rounded-2xl border border-ag-border overflow-hidden flex flex-col group hover:bg-ag-off-white transition-colors"
            >
              {/* Image dominante cliquable + badge en haut à droite */}
              {image && (locked
                ? <div className="relative aspect-[4/3] overflow-hidden">{image}</div>
                : <Link href={assetPath(asset.slug) as never} className="relative aspect-[4/3] overflow-hidden block">{image}</Link>
              )}
              <div className="p-5 flex flex-col gap-3 flex-1">
              {/* Titre : capacité démontrée */}
              <h2 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.02em] leading-snug">
                {tItems(`${asset.id}.capability`)}
              </h2>

              {asset.internalOnly && (
                    <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-ag-gray-light border border-ag-border px-2 py-0.5 rounded-md">
                      {t('internalOnly')}
                    </span>
              )}

              {/* Détails pliés — dépliés au survol (absents de l'aperçu en accueil de La Boutique) */}
              {showDetails && !locked && <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-500 ease-out">
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
                    <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light pt-3">
                      {t('confidential')}
                    </p>
                  )}
                </div>
              </div>}
              </div>
        </div>
  )
}
