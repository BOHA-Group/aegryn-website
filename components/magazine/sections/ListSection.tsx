import type { ReactNode } from 'react'

interface Props {
  id:          string
  label:       string
  title:       string
  disclaimer?: string
  children:    ReactNode
}

/**
 * Generic list section template (DealWatch, BuyerLandscape, etc.)
 * Wraps list content with consistent header and optional disclaimer.
 */
export function ListSection({ id, label, title, disclaimer, children }: Props) {
  return (
    <section id={id} className="bg-magazine-white px-6 md:px-[120px] py-32">
      <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">{label}</p>
      <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16 max-w-[720px]">
        {title}
      </h2>

      {children}

      {disclaimer && (
        <p className="text-label-mag text-magazine-black/30 italic mt-10 max-w-prose leading-[1.7]">
          {disclaimer}
        </p>
      )}
    </section>
  )
}
