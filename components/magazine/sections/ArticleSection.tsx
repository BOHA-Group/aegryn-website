import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { MagazineArticle } from '@/lib/magazine/types'
import { PillarBadge } from '../PillarBadge'

interface Props {
  article:     MagazineArticle
  content:     string | ReactNode
  backHref:    string
  backLabel?:  string
}

/**
 * Long-form article template used on /magazine/[issue]/[slug].
 * Renders article metadata + prose content.
 */
export function ArticleSection({ article, content, backHref, backLabel = 'Back to issue' }: Props) {
  return (
    <article className="min-h-screen bg-magazine-ivory">
      <div className="max-w-prose mx-auto px-6 py-24">

        {/* Back link */}
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-label-mag text-magazine-black/40 uppercase tracking-[0.12em] hover:text-magazine-black transition-colors mb-12"
        >
          <ArrowLeft size={12} /> {backLabel}
        </Link>

        {/* Pillar + reading time */}
        <div className="flex items-center gap-4 mb-8">
          <PillarBadge pillar={article.pillar} />
          <span className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em]">
            {article.readingTimeMinutes} min read
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-sans font-bold text-magazine-black mb-6"
          style={{ fontSize: 'clamp(32px,5vw,64px)', lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {article.title}
        </h1>

        {/* Excerpt */}
        <p className="text-h2-mag text-magazine-black/50 mb-12 leading-[1.4]">
          {article.excerpt}
        </p>

        <div className="w-16 h-px bg-magazine-accent mb-12" />

        {/* Body content */}
        <div className="text-body-mag text-magazine-black/75 leading-[1.85] space-y-6">
          {typeof content === 'string'
            ? content.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))
            : content
          }
        </div>
      </div>
    </article>
  )
}
