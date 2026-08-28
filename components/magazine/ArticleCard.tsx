import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { MagazineArticle, MagazineIssue } from '@/lib/magazine/types'
import { PillarBadge } from './PillarBadge'

interface Props {
  article: MagazineArticle
  issue: MagazineIssue
}

/**
 * Clickable card linking to /magazine/[issue.slug]/[article.slug]
 */
export function ArticleCard({ article, issue }: Props) {
  return (
    <Link
      href={`/magazine/${issue.slug}/${article.slug}`}
      className="group flex flex-col gap-4 bg-magazine-white border border-magazine-black/8 p-7 hover:border-magazine-black/20 transition-colors"
    >
      <div className="flex items-center justify-between">
        <PillarBadge pillar={article.pillar} />
        <span className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em]">
          {article.readingTimeMinutes} min
        </span>
      </div>

      <h3 className="text-h2-mag font-sans font-semibold text-magazine-black leading-snug group-hover:text-magazine-black transition-colors">
        {article.title}
      </h3>

      <p className="text-body-mag text-magazine-black/55 leading-[1.7] flex-1">
        {article.excerpt}
      </p>

      <span className="inline-flex items-center gap-1.5 text-label-mag uppercase tracking-[0.12em] text-magazine-black/50 group-hover:text-magazine-black transition-colors self-start mt-auto">
        Read <ArrowUpRight size={11} />
      </span>
    </Link>
  )
}
