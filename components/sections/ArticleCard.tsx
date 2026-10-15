import Image from 'next/image'
import type { CSSProperties } from 'react'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'

/**
 * Affiche d'article du bas de page : gabarit unique partagé par l'accueil du cabinet
 * (DiscoverStrip) et par l'accueil de La Boutique, pour garder les mêmes dimensions.
 * Largeur fixe 280 px (320 px dès sm) : les affiches s'alignent en bande, sans étirement.
 */
export function ArticleCard({ slug, title, category, date, image, imagePosition = 'center', readMore, className = '', style }: {
  slug: string; title: string; category: string; date: string; image: string; imagePosition?: string; readMore: string; className?: string; style?: CSSProperties
}) {
  return (
    <Link
      href={`/blog/${slug}` as never}
      className={`${className} group snap-start shrink-0 w-[280px] sm:w-[320px] flex flex-col rounded-2xl overflow-hidden border border-ag-border bg-ag-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
      style={style}
    >
      <div className="relative h-44 w-full overflow-hidden shrink-0">
        <Image src={image} style={{ objectPosition: imagePosition }} alt={title} fill sizes="320px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex-ink">{category}</span>
          <span className="text-ag-gray-light text-[10px]">·</span>
          <span className="font-sans text-[10px] text-ag-gray-light">{date}</span>
        </div>
        <p className="font-sans font-semibold text-ag-black leading-[1.4] group-hover:text-ag-navy transition-colors flex-1" style={{ fontSize: 'clamp(14px,1.2vw,16px)' }}>{title}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 font-sans font-semibold text-[11px] tracking-[0.12em] uppercase text-ag-gray group-hover:text-ag-black transition-colors">
          {readMore} <ArrowUpRight size={11} />
        </span>
      </div>
    </Link>
  )
}
