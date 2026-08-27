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
      {/* Cover panel — copie exacte du cover /fr/magazine/issue-01 (CoverSection.tsx), mis à
          l'échelle via container query units (cqw, base réf. 1000px = rendu desktop de
          CoverSection) pour occuper 100% de sa colonne sans espace blanc résiduel. */}
      <div
        className="relative flex flex-col justify-between border-r border-magazine-black/10 overflow-hidden w-full"
        style={{ aspectRatio: '420 / 595', containerType: 'inline-size', padding: '4cqw 3.2cqw' } as React.CSSProperties}
      >
        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(/magazine/issue-${String(issue.number).padStart(2,'0')}/cover-bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        {/* Dark overlay — identique CoverSection (160deg, .82/.65/.88) */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, rgba(5,10,15,0.82) 0%, rgba(5,10,15,0.65) 50%, rgba(5,10,15,0.88) 100%)' }}
        />

        {/* TOP BAR : date gauche / Special Edition droite — identique CoverSection */}
        <div className="relative z-10 flex items-start justify-between">
          <p className="font-mono uppercase text-white/40" style={{ fontSize: '1cqw', letterSpacing: '0.22em' }}>{formatted.toUpperCase()}</p>
          <div className="text-right">
            <p className="font-mono uppercase text-[#5ADDA4] font-bold" style={{ fontSize: '1cqw', letterSpacing: '0.18em' }}>{labelSpecial}</p>
            <p className="font-mono uppercase text-[#5ADDA4] font-bold" style={{ fontSize: '1cqw', letterSpacing: '0.18em' }}>Issue {String(issue.number).padStart(2, '0')}</p>
          </div>
        </div>

        {/* AEGRYN massif + BUSINESS MAGAZINE — identique CoverSection (Aegryn plafonné à 190px, Business Magazine 11px) */}
        <div className="relative z-10" style={{ marginTop: '-0.8cqw' }}>
          <p
            className="font-sans font-bold text-white"
            style={{ fontSize: '19cqw', letterSpacing: '-0.04em', lineHeight: 0.86 }}
          >
            Aegryn
          </p>
          <p className="text-right font-mono uppercase text-white/35" style={{ fontSize: '1.1cqw', letterSpacing: '0.18em', marginTop: '0.8cqw' }}>Business Magazine</p>
        </div>

        {/* EXCLUSIVE — milieu gauche — identique CoverSection */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div style={{ maxWidth: '22cqw' }}>
            <p className="font-sans font-bold text-[#5ADDA4] uppercase" style={{ fontSize: '1.3cqw', letterSpacing: '0.08em', marginBottom: '0.8cqw' }}>Exclusive</p>
            <div style={{ width: '4cqw', height: '0.2cqw', background: '#5ADDA4', marginBottom: '1.2cqw' }} />
            <p className="font-sans font-bold text-white/55 uppercase leading-snug" style={{ fontSize: '1cqw', letterSpacing: '0.05em' }}>
              {issue.coverLine}
            </p>
          </div>
        </div>

        {/* QR code — identique CoverSection (88px, bottom-8 right-14, p-1.5 rounded-sm) */}
        <div className="absolute z-20 bg-white rounded-sm shadow-lg" style={{ bottom: '3.2cqw', right: '5.6cqw', padding: '0.6cqw' }}>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=88x88&data=https%3A%2F%2Faegryn.com%2Fmagazine&color=0F1A2B&bgcolor=ffffff&qzone=0&format=png"
            alt="aegryn.com/magazine"
            style={{ display: 'block', width: '8.8cqw', height: '8.8cqw', imageRendering: 'pixelated' }}
          />
        </div>

        {/* BAS : titre splitté accent/blanc + theme — identique CoverSection (Built/to Last plafonné à 46px) */}
        <div className="relative z-10">
          <p
            className="font-sans font-bold text-[#5ADDA4] uppercase leading-none"
            style={{ fontSize: '4.6cqw', letterSpacing: '-0.01em', lineHeight: 1.0, marginBottom: '0.4cqw' }}
          >
            Built
          </p>
          <p
            className="font-sans font-bold text-white/90 uppercase leading-none"
            style={{ fontSize: '4.6cqw', letterSpacing: '-0.01em', lineHeight: 1.0, marginBottom: '1.6cqw' }}
          >
            to Last.
          </p>
          <p className="font-sans uppercase text-white/45 leading-snug" style={{ fontSize: '1cqw', letterSpacing: '0.07em' }}>
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
