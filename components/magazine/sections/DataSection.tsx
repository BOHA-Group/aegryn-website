import type { ReactNode } from 'react'

interface Props {
  id:       string
  title:    string
  label:    string
  children: ReactNode
}

/**
 * Generic data section template for market and index sections.
 * Wraps content with a consistent header and scroll-anchor ID.
 */
export function DataSection({ id, title, label, children }: Props) {
  return (
    <section id={id} className="bg-magazine-white">
      <div className="px-6 md:px-[120px] py-20">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">{label}</p>
        <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-16">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}
