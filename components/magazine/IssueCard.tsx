import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { MagazineIssue } from '@/lib/magazine/types'

interface Props {
  issue: MagazineIssue
}

/**
 * Clickable card linking to /magazine/[issue.slug]
 */
export function IssueCard({ issue }: Props) {
  const date = new Date(issue.publishedAt)
  const formatted = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <Link
      href={`/magazine/${issue.slug}`}
      className="group grid md:grid-cols-[2fr_3fr] gap-0 border border-magazine-black/10 hover:border-magazine-black/25 transition-colors"
    >
      {/* Cover panel */}
      <div className="bg-magazine-black flex flex-col justify-between p-10 md:p-14 min-h-[380px]">
        <div>
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-magazine-accent mb-3">
            N°{String(issue.number).padStart(2, '0')} · {formatted}
          </p>
          <div className="w-10 h-px bg-magazine-accent mb-8" />
        </div>
        <div>
          <p
            className="font-sans font-bold text-white leading-[0.88] mb-3"
            style={{ fontSize: 'clamp(36px,4.5vw,64px)', letterSpacing: '-0.03em' }}
          >
            {issue.coverStat}
          </p>
          <p className="font-mono text-[10px] tracking-[0.15em] uppercase text-white/35">
            {issue.coverStatLabel}
          </p>
        </div>
      </div>

      {/* Metadata panel */}
      <div className="bg-magazine-ivory flex flex-col justify-between p-10 md:p-14">
        <div>
          <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-magazine-black/30 mb-4">
            Issue {String(issue.number).padStart(2, '0')}
          </p>
          <h2 className="font-sans font-bold text-magazine-black leading-snug mb-2"
            style={{ fontSize: 'clamp(22px,2.5vw,34px)', letterSpacing: '-0.02em' }}
          >
            {issue.title}
          </h2>
          <p className="text-body-mag text-magazine-black/50 italic mb-6">{issue.theme}</p>
          <p className="text-label-mag text-magazine-accent uppercase tracking-[0.1em] font-semibold">
            {issue.coverLine}
          </p>
        </div>

        <div className="pt-8 border-t border-magazine-black/8 mt-6">
          <span className="inline-flex items-center gap-2 bg-magazine-black text-white font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 group-hover:bg-magazine-accent group-hover:text-magazine-black transition-colors">
            Read issue <ArrowUpRight size={11} />
          </span>
        </div>
      </div>
    </Link>
  )
}
