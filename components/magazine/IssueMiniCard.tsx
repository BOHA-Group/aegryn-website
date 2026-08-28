import Link from 'next/link'
import type { MagazineIssue } from '@/lib/magazine/types'

interface Props {
  issue:   MagazineIssue
  locale?: string
  active?: boolean
}

/**
 * Version compacte du cover magazine pour le carousel "autres issues".
 * Hauteur fixe 220px, largeur 155px — style Barnes.
 */
export function IssueMiniCard({ issue, locale = 'fr', active = false }: Props) {
  const padNum    = String(issue.number).padStart(2, '0')
  const formatted = new Date(issue.publishedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()

  return (
    <Link
      href={`/${locale}/magazine/${issue.slug}`}
      className={`block shrink-0 transition-transform hover:scale-[1.03] ${active ? 'scale-[1.06]' : ''}`}
      style={{ width: 155, flexShrink: 0 }}
    >
      <div
        style={{
          width: 155,
          height: 220,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: active
            ? '0 8px 32px rgba(0,0,0,.32)'
            : '0 3px 14px rgba(0,0,0,.18)',
        }}
      >
        {/* Cover BG */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(/magazine/issue-${padNum}/cover-bg.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
        />
        {/* Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg,rgba(5,10,15,.7) 0%,rgba(5,10,15,.4) 45%,rgba(5,10,15,.8) 100%)',
          }}
        />
        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '10px 11px',
          }}
        >
          {/* Top */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: 6, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)' }}>
              {formatted}
            </span>
            <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5ADDA4' }}>
              {`0${issue.number}`}
            </span>
          </div>
          {/* Title */}
          <div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 0.88, letterSpacing: '-0.04em' }}>Aegryn</div>
            <div style={{ fontSize: 5.5, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginTop: 3 }}>Business Magazine</div>
          </div>
          {/* Bottom: issue title */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#5ADDA4', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{issue.title}</div>
          </div>
        </div>

        {/* Active indicator */}
        {active && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#5ADDA4' }} />
        )}
      </div>
    </Link>
  )
}
