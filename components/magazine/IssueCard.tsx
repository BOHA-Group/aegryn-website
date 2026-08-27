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
      {/* Cover panel — proportions exactes de la cover flipbook (base 420x595), mise à l'échelle
          via container query units (cqw) pour occuper 100% de sa colonne SANS aucun espace
          blanc résiduel ni distorsion : chaque valeur px est convertie en %-de-largeur-conteneur
          identique au ratio flipbook (letter-spacing déjà en em s'adapte automatiquement). */}
      <div
        className="relative flex flex-col justify-between border-r border-magazine-black/10 overflow-hidden w-full"
        style={{ aspectRatio: '420 / 595', containerType: 'inline-size', padding: '6.6667cqw 7.1429cqw' } as React.CSSProperties}
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
        {/* Dark overlay — identique flipbook */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(180deg, rgba(5,10,15,.75) 0%, rgba(5,10,15,.45) 45%, rgba(5,10,15,.78) 100%)' }}
        />

        {/* TOP BAR : date gauche / Special Edition droite */}
        <div className="relative z-10 flex items-start justify-between">
          <p className="font-mono uppercase text-white/40" style={{ fontSize: '2.1429cqw', fontWeight: 500, letterSpacing: '0.22em' }}>{formatted.toUpperCase()}</p>
          <div className="text-right">
            <p className="font-mono uppercase text-[#5ADDA4] font-bold" style={{ fontSize: '2.1429cqw', letterSpacing: '0.18em' }}>{labelSpecial}</p>
            <p className="font-mono uppercase text-[#5ADDA4] font-bold" style={{ fontSize: '2.1429cqw', letterSpacing: '0.18em' }}>Issue {String(issue.number).padStart(2, '0')}</p>
          </div>
        </div>

        {/* AEGRYN massif + BUSINESS MAGAZINE — copie exacte flipbook (Business Magazine légèrement réduit, position inchangée) */}
        <div className="relative z-10" style={{ marginTop: '-1.9048cqw' }}>
          <p
            className="font-sans font-bold text-white"
            style={{ fontSize: '19.0476cqw', letterSpacing: '-0.04em', lineHeight: 0.86 }}
          >
            Aegryn
          </p>
          <p className="text-right font-mono uppercase text-white/35" style={{ fontSize: '2.1429cqw', fontWeight: 400, letterSpacing: '0.18em', marginTop: '1.9048cqw' }}>Business Magazine</p>
        </div>

        {/* EXCLUSIVE — milieu gauche */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div style={{ maxWidth: '40.4762cqw' }}>
            <p className="font-sans font-bold text-[#5ADDA4] uppercase" style={{ fontSize: '2.381cqw', letterSpacing: '0.08em', marginBottom: '1.4286cqw' }}>Exclusive</p>
            <div style={{ width: '6.6667cqw', height: '0.4762cqw', background: '#5ADDA4', marginBottom: '1.9048cqw' }} />
            <p className="font-sans font-bold text-white/55 uppercase" style={{ fontSize: '2.0238cqw', letterSpacing: '0.04em', lineHeight: 1.5 }}>
              {issue.coverLine}
            </p>
          </div>
        </div>

        {/* QR code — coin bas-droit identique flipbook */}
        <div className="absolute z-20 bg-white" style={{ bottom: '3.3333cqw', right: '3.3333cqw', padding: '0.9524cqw', borderRadius: '2px', boxShadow: '0 2px 8px rgba(0,0,0,.3)', width: '14.7619cqw', height: '14.7619cqw' }}>
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=54x54&data=https%3A%2F%2Faegryn.com%2Fmagazine&color=0F1A2B&bgcolor=ffffff&qzone=0&format=png"
            alt="aegryn.com/magazine"
            style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
          />
        </div>

        {/* BAS : titre splitté accent/blanc + theme — copie exacte flipbook */}
        <div className="relative z-10" style={{ paddingBottom: '12.381cqw' }}>
          <p
            className="font-sans font-bold text-[#5ADDA4] uppercase"
            style={{ fontSize: '8.5714cqw', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: '1.1905cqw' }}
          >
            Built
          </p>
          <p
            className="font-sans font-bold text-white/90 uppercase"
            style={{ fontSize: '8.5714cqw', letterSpacing: '-0.02em', lineHeight: 1.0, marginBottom: '2.1429cqw' }}
          >
            to Last.
          </p>
          <p className="font-sans uppercase text-white/40" style={{ fontSize: '2.0238cqw', letterSpacing: '0.05em', lineHeight: 1.6 }}>
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
