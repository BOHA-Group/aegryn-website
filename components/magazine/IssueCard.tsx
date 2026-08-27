import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { MagazineIssue } from '@/lib/magazine/types'

interface Props {
  issue:           MagazineIssue
  locale?:         string
  labelReadIssue?: string
  labelSpecial?:   string
}

/**
 * Clickable card linking to /magazine/[issue.slug]
 */
export function IssueCard({ issue, locale = 'fr', labelReadIssue = 'Read issue', labelSpecial = 'Special Edition' }: Props) {
  const date = new Date(issue.publishedAt)
  const formatted = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  return (
    <div className="group grid md:grid-cols-[2fr_3fr] gap-0 border border-magazine-black/10 hover:border-magazine-black/25 transition-colors">
      {/* Cover panel — format magazine portrait style Salford, ratio A4 */}
      <div className="relative flex flex-col justify-between p-8 min-h-[560px] border-r border-magazine-black/10 overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/magazine/issue-${String(issue.number).padStart(2,'0')}/cover-bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(5,10,15,0.80) 0%, rgba(5,10,15,0.60) 50%, rgba(5,10,15,0.85) 100%)' }}
        />

        {/* TOP BAR : date gauche / Special Edition droite */}
        <div className="relative z-10 flex items-start justify-between">
          <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40">{formatted.toUpperCase()}</p>
          <div className="text-right">
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#5ADDA4] font-bold">{labelSpecial}</p>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-[#5ADDA4] font-bold">Issue {String(issue.number).padStart(2, '0')}</p>
          </div>
        </div>

        {/* AEGRYN massif + BUSINESS MAGAZINE aligné droite */}
        <div className="relative z-10 -mt-1">
          <p
            className="font-sans font-bold text-white leading-none"
            style={{ fontSize: 'clamp(52px,8vw,96px)', letterSpacing: '-0.04em', lineHeight: 0.86 }}
          >
            Aegryn
          </p>
          <p className="text-right font-mono text-[9px] tracking-[0.18em] uppercase text-white/35 mt-1">Business Magazine</p>
        </div>

        {/* EXCLUSIVE — milieu gauche */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="max-w-[180px]">
            <p className="font-sans font-bold text-[#5ADDA4] uppercase tracking-[0.08em] mb-2" style={{ fontSize: '11px' }}>Exclusive</p>
            <div className="w-8 h-[2px] bg-[#5ADDA4] mb-2" />
            <p className="font-sans font-bold text-white/55 uppercase leading-snug" style={{ fontSize: '9px', letterSpacing: '0.04em' }}>
              {issue.coverLine}
            </p>
          </div>
        </div>

        {/* BAS : titre accent + theme */}
        <div className="relative z-10">
          <p
            className="font-sans font-bold text-[#5ADDA4] uppercase leading-tight mb-3"
            style={{ fontSize: 'clamp(16px,2.5vw,26px)', letterSpacing: '-0.01em', lineHeight: 1.05 }}
          >
            {issue.title}
          </p>
          <p className="font-sans uppercase text-center text-white/40 leading-snug" style={{ fontSize: '9px', letterSpacing: '0.06em' }}>
            {issue.theme}
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
          <Link
            href={`/${locale}/magazine/${issue.slug}`}
            className="inline-flex items-center gap-2 bg-magazine-black text-white font-mono text-[10px] uppercase tracking-[0.18em] px-6 py-3 hover:bg-magazine-accent hover:text-magazine-black transition-colors font-semibold"
          >
            {labelReadIssue} <ArrowUpRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  )
}
