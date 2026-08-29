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
          /* ── Mini cover : photo + overlay + texte contextualisé par issue ── */
          (() => {
            /* Accent color par issue */
            const ACCENTS: Record<number, string> = {
              1: '#5ADDA4', // mint — Build
              2: '#C9A84C', // gold — Exit / stratégie
              3: '#E8E0D4', // crème — Buyer / portrait
            }
            const accent = ACCENTS[issue.number] ?? '#5ADDA4'

            /* Position photo par issue (objectPosition) */
            const PHOTO_POS: Record<number, string> = {
              1: 'center top',
              2: 'center center',
              3: 'center 20%',
            }
            const photoPos = PHOTO_POS[issue.number] ?? 'center top'

            /* Overlay gradient par issue */
            const OVERLAYS: Record<number, string> = {
              1: 'linear-gradient(180deg,rgba(5,10,20,.55) 0%,rgba(5,10,20,.35) 40%,rgba(5,10,20,.82) 100%)',
              2: 'linear-gradient(180deg,rgba(10,8,2,.72) 0%,rgba(10,8,2,.38) 45%,rgba(10,8,2,.88) 100%)',
              3: 'linear-gradient(180deg,rgba(0,0,0,.78) 0%,rgba(0,0,0,.42) 45%,rgba(0,0,0,.90) 100%)',
            }
            const overlay = OVERLAYS[issue.number] ?? OVERLAYS[1]

            /* Titre splitté sur 2 lignes si contient un point médian */
            const titleParts = issue.title.replace('.','\n').split('\n').filter(Boolean)

            return (
              <div style={{ position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: 'scale(0.369)', width: 420, height: 595 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/magazine/issue-${padNum}/cover-magazine-issue-${padNum}.jpg`}
                  alt=""
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: photoPos }}
                />
                <div style={{ position: 'absolute', inset: 0, background: overlay }} />
                <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 30px' }}>
                  {/* Top bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.75)' }}>{formatted}</div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: accent }}>Issue {padNum}</div>
                    </div>
                  </div>
                  {/* Masthead */}
                  <div style={{ marginTop: -8 }}>
                    <div style={{ fontSize: 90, fontWeight: 700, color: '#fff', lineHeight: 0.86, letterSpacing: '-0.01em' }}>Aegryn</div>
                    <div style={{ textAlign: 'right', fontSize: 8, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginTop: 5 }}>Business Magazine</div>
                  </div>
                  {/* CoverLine */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div>
                      <div style={{ width: 28, height: 1.5, background: accent, marginBottom: 10 }} />
                      <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: accent, lineHeight: 1.5 }}>{issue.coverLine}</div>
                    </div>
                  </div>
                  {/* Headline */}
                  <div style={{ paddingBottom: 48 }}>
                    {titleParts.map((part, idx) => (
                      <div key={idx} style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.0, marginBottom: idx < titleParts.length - 1 ? 2 : 9 }}>{part.trim()}</div>
                    ))}
                    <div style={{ fontSize: 8.5, fontWeight: 400, letterSpacing: '0.04em', color: 'rgba(255,255,255,.65)', lineHeight: 1.6, maxWidth: 240 }}>{issue.theme}</div>
                  </div>
                </div>
              </div>
            )
          })()
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

        {/* Active indicator — uniquement sur les drafts (fond sombre) */}
        {active && issue.status !== 'published' && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: '#5ADDA4' }} />
        )}
      </div>
    </Link>
  )
}
