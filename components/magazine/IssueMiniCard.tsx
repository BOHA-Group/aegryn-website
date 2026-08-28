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
        {issue.status === 'published' ? (
          /* ── Copie exacte du flipbook : photo + overlay sombre + texte AEGRYN, mise à l'échelle ── */
          <div style={{ position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: 'scale(0.369)', width: 420, height: 595 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/magazine/issue-${padNum}/cover-magazine-issue-${padNum}.jpg`}
              alt=""
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,10,15,.75) 0%,rgba(5,10,15,.45) 45%,rgba(5,10,15,.78) 100%)' }} />
            <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>{formatted}</div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5ADDA4' }}>Special Edition</div>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5ADDA4' }}>{`Issue ${padNum}`}</div>
                </div>
              </div>
              <div style={{ marginTop: -8 }}>
                <div style={{ fontSize: 90, fontWeight: 700, color: '#fff', lineHeight: 0.86, letterSpacing: '-0.04em' }}>Aegryn</div>
                <div style={{ textAlign: 'right', fontSize: 8, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.32)', marginTop: 5 }}>Business Magazine</div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ maxWidth: 170 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5ADDA4', marginBottom: 6 }}>Exclusive</div>
                  <div style={{ width: 28, height: 2, background: '#5ADDA4', marginBottom: 8 }} />
                  <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>Build. Certify. Transact.</div>
                </div>
              </div>
              <div style={{ paddingBottom: 52 }}>
                <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#5ADDA4', lineHeight: 1.0, marginBottom: 5 }}>Built</div>
                <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: 'rgba(255,255,255,.9)', lineHeight: 1.0, marginBottom: 9 }}>to Last.</div>
                <div style={{ fontSize: 8.5, fontWeight: 400, letterSpacing: '0.05em', color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>The anatomy of a tech asset that sells and one that doesn&apos;t.</div>
              </div>
            </div>
          </div>
        ) : (
          /* ── Draft placeholder ── */
          <>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0a1520 0%,#0f2235 60%,#081018 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,10,15,.75) 0%,rgba(5,10,15,.45) 45%,rgba(5,10,15,.78) 100%)' }} />
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
          </>
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
