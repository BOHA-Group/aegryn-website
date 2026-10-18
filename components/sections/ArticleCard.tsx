import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

const clamp = (n: number): CSSProperties => ({ display: '-webkit-box', WebkitLineClamp: n, WebkitBoxOrient: 'vertical', overflow: 'hidden' })

/**
 * Fiche d'article : image arrondie, méta (catégorie en pastille, date, durée de lecture),
 * titre et extrait sous l'image, sans cadre. Gabarit unique pour tous les emplacements
 * d'articles : bandes défilantes (accueil cabinet, accueil La Boutique, largeur fixe
 * ~196 px soit six fiches en vue) et grilles de pages (`fluid`, largeur de la colonne).
 * `titleLines`/`excerptLines` bornent le texte pour uniformiser la hauteur des fiches.
 */
export function ArticleCard({ slug, title, category, date, readTime, excerpt, image, imagePosition = 'center', fluid = false, titleLines = 3, excerptLines = 3, className = '', style }: {
  slug: string; title: string; category: string; date: string; readTime?: string; excerpt?: string; image: string; imagePosition?: string; fluid?: boolean; titleLines?: number; excerptLines?: number; className?: string; style?: CSSProperties
}) {
  const t = useTranslations('harmony')
  const illustration = image.endsWith('/product-formulation.jpg')
  return (
    <Link
      href={`/blog/${slug}` as never}
      className={`${className} group ${fluid ? 'w-full' : 'snap-center md:snap-start shrink-0 w-[236px] md:w-[196px]'} flex flex-col`}
      style={style}
    >
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: '46 / 49' }}>
        <Image src={image} style={{ objectPosition: imagePosition }} alt={title} fill sizes={fluid ? '(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw' : '200px'} className="object-cover transition-transform duration-500 group-hover:scale-105" />
        {illustration && <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2 py-1 text-[10px] text-white">{t('illustration')}</span>}
      </div>
      <div className="mt-4 flex min-w-0 flex-col items-start gap-1.5">
        <span className="max-w-full rounded-full bg-ag-light-gray px-2.5 py-1 font-sans text-[11px] font-semibold text-ag-black">{category}</span>
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 font-sans text-[11px] text-ag-gray-light">
          <span>{date}</span>
          {readTime && <span>· {readTime}</span>}
        </div>
      </div>
      <p className="mt-2 font-sans font-bold text-ag-black leading-[1.3] transition-colors group-hover:text-ag-navy" style={{ fontSize: 'clamp(14px,1.05vw,16px)', ...clamp(titleLines) }}>{title}</p>
      {excerpt && <p className="mt-1.5 font-sans text-[13px] leading-relaxed text-ag-gray" style={clamp(excerptLines)}>{excerpt}</p>}
    </Link>
  )
}
