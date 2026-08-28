'use client'

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

  const isDraft = issue.status === 'draft'

  return (
    <Link
      href={isDraft ? '#' : `/${locale}/magazine/${issue.slug}`}
      aria-disabled={isDraft}
      tabIndex={isDraft ? -1 : undefined}
      className={`block shrink-0 transition-transform ${isDraft ? 'cursor-default pointer-events-none' : `hover:scale-[1.03] ${active ? 'scale-[1.06]' : ''}`}`}
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
            backgroundImage: issue.status === 'published' ? `url(/magazine/issue-${padNum}/cover-bg.jpg)` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            background: issue.status !== 'published' ? 'linear-gradient(160deg,#0a1520 0%,#0f2235 60%,#081018 100%)' : undefined,
          }}
        />
        {/* Overlay — identique IssueCard */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,10,15,.75) 0%,rgba(5,10,15,.45) 45%,rgba(5,10,15,.78) 100%)' }} />

        {issue.status === 'published' ? (
          /* ── Cover exact — copie IssueCard à l'échelle 155/420 ≈ 0.369 ── */
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 11px' }}>
            {/* TOP BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontSize: 4, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>{formatted}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 4, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5ADDA4' }}>Special Edition</div>
                <div style={{ fontSize: 4, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5ADDA4' }}>{`Issue ${padNum}`}</div>
              </div>
            </div>
            {/* AEGRYN */}
            <div style={{ marginTop: -4 }}>
              <div style={{ fontSize: 33, fontWeight: 700, color: '#fff', lineHeight: 0.86, letterSpacing: '-0.04em' }}>Aegryn</div>
              <div style={{ textAlign: 'right', fontSize: 3, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.32)', marginTop: 2 }}>Business Magazine</div>
            </div>
            {/* EXCLUSIVE milieu */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ maxWidth: 63 }}>
                <div style={{ fontSize: 4, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5ADDA4', marginBottom: 2 }}>Exclusive</div>
                <div style={{ width: 10, height: 1, background: '#5ADDA4', marginBottom: 3 }} />
                <div style={{ fontSize: 3.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>Build. Certify. Transact.</div>
              </div>
            </div>
            {/* BAS : BUILT TO LAST */}
            <div style={{ paddingBottom: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', color: '#5ADDA4', lineHeight: 1.0, marginBottom: 2 }}>Built</div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '-0.02em', color: 'rgba(255,255,255,.9)', lineHeight: 1.0, marginBottom: 3 }}>to Last.</div>
              <div style={{ fontSize: 3.5, fontWeight: 400, letterSpacing: '0.05em', color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>The anatomy of a tech asset that sells.</div>
            </div>
          </div>
        ) : (
          /* ── Draft placeholder ── */
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 11px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 6, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)' }}>{formatted}</span>
              <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5ADDA4' }}>{`0${issue.number}`}</span>
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 0.88, letterSpacing: '-0.04em' }}>Aegryn</div>
              <div style={{ fontSize: 5.5, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginTop: 3 }}>Business Magazine</div>
            </div>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#5ADDA4', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{issue.title}</div>
            </div>
          </div>
        )}

        {/* Draft badge */}
        {isDraft && (
          <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(90,221,164,.15)', border: '1px solid rgba(90,221,164,.4)', padding: '2px 6px' }}>
            <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5ADDA4' }}>À paraître</span>
          </div>
        )}

        {/* Active indicator */}
        {active && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#5ADDA4' }} />
        )}
      </div>
    </Link>
  )
}
