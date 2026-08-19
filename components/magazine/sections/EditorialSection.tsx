'use client'

import { useRef } from 'react'
import type { MagazineArticle } from '@/lib/magazine/types'
import { useFadeUp } from '../hooks/useFadeUp'

interface Props {
  article:    MagazineArticle
  paragraphs: string[]
}

/**
 * Editorial section template.
 * Replaces the hardcoded Editorial.tsx — content via props.
 */
export function EditorialSection({ article, paragraphs }: Props) {
  const ref = useRef<HTMLElement>(null)
  useFadeUp('.editorial-body > *', ref)

  return (
    <section id="s-editorial" ref={ref} className="bg-magazine-ivory px-6 md:px-[120px] py-32">
      <div className="max-w-prose mx-auto editorial-body">
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-8">Editorial</p>
        <h2 className="text-h1-mag font-sans font-bold text-magazine-black mb-4">
          {article.title}
        </h2>
        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] mb-12">
          The Founding Team — AEGRYN
        </p>
        {paragraphs.map((p, i) => (
          <p key={i} className="text-body-mag text-magazine-black/75 mb-6 leading-[1.75]">{p}</p>
        ))}
      </div>
    </section>
  )
}
