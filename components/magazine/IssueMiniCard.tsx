'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { MagazineIssue } from '@/lib/magazine/types'

interface Props {
  issue:            MagazineIssue
  locale?:          string
  active?:          boolean
  labelComingSoon?: string
  isPublic?:        boolean
  isPreview?:       boolean
  decorative?:      boolean
}

/* Badge "À venir" — 6 langues */
const COMING_SOON: Record<string, string> = {
  fr: 'À venir',
  en: 'Coming soon',
  de: 'Demnächst',
  es: 'Próximamente',
  it: 'Prossimamente',
  nl: 'Binnenkort',
}

/* Label Exclusive contextualisé par issue */
const EXCLUSIVE_LABEL: Record<number, string> = {
  1: 'Exclusive',
  2: 'Strategy',
  3: 'Insight',
  4: 'Heritage',
}

/* Titre découpé sur 2 lignes — même structure que la cover principale (IssueCard) */
const TITLE_LINES: Record<number, [string, string]> = {
  1: ['Built', 'to Last.'],
  2: ['The Exit', 'Equation.'],
  3: ['The Buyer', 'Inside.'],
  4: ['The Succession', 'Wave.'],
}

/* Accent par issue — sert uniquement au trait séparateur */
const ACCENTS: Record<number, string> = {
  1: '#5ADDA4',
  2: '#C9A84C',
  3: '#E8E0D4',
  4: '#7AB648',
}

/* Position photo par issue */
const PHOTO_POS: Record<number, string> = {
  1: 'center top',
  2: 'center center',
  3: 'center 20%',
  4: 'center center',
}

/* Overlay minimal uniquement pour lisibilité texte (haut + bas), pas de filtre couleur) */
const TEXT_OVERLAY = 'linear-gradient(180deg,rgba(0,0,0,.45) 0%,transparent 35%,transparent 55%,rgba(0,0,0,.60) 100%)'

/**
 * Version compacte du cover magazine pour le carousel "autres issues".
 * Hauteur fixe 220px, largeur 155px — style Barnes.
 */
export function IssueMiniCard({ issue, locale = 'fr', active = false, labelComingSoon, isPublic = false, isPreview = false, decorative = false }: Props) {
  const padNum    = String(issue.number).padStart(2, '0')
  const formatted = new Date(issue.publishedAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }).toUpperCase()

  const isDraft    = issue.status === 'draft'
  /* "À venir" = issues sans flipbook (sections vides), published ou draft */
  const isComingSoon    = issue.sections.length === 0
  const comingSoonLabel = labelComingSoon ?? COMING_SOON[locale] ?? COMING_SOON['fr']

  const accent      = ACCENTS[issue.number]  ?? '#5ADDA4'
  const photoPos    = PHOTO_POS[issue.number] ?? 'center top'
  const exclLabel   = EXCLUSIVE_LABEL[issue.number] ?? 'Exclusive'

  const titleLines   = TITLE_LINES[issue.number] ?? [issue.title, '']
  const [lightboxOpen, setLightboxOpen] = useState(false)

  /* ── Contenu de la cover (canvas 420×595) — réutilisé mini + lightbox ── */
  const coverContent = issue.status === 'published' ? (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/magazine/issue-${padNum}/cover-magazine-issue-${padNum}.jpg`}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: photoPos }}
      />
      <div style={{ position: 'absolute', inset: 0, background: TEXT_OVERLAY }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 30px' }}>
        {/* Top bar — même structure 2 lignes à droite que la cover principale */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.75)' }}>{formatted}</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>Special Edition</div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fff' }}>Issue {padNum}</div>
          </div>
        </div>
        {/* Masthead */}
        <div style={{ marginTop: -8 }}>
          <div style={{ fontSize: 90, fontWeight: 700, color: '#fff', lineHeight: 0.86, letterSpacing: '-0.01em' }}>Aegryn</div>
          <div style={{ textAlign: 'right', fontSize: 8, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', marginTop: 5 }}>Business Magazine</div>
        </div>
        {/* Exclusive label + CoverLine — tout en blanc, même maxWidth que la cover principale */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: 170 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', marginBottom: 6 }}>{exclLabel}</div>
            <div style={{ width: 28, height: 2, background: accent, marginBottom: 8 }} />
            <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#fff', lineHeight: 1.5 }}>{issue.coverLine}</div>
          </div>
        </div>
        {/* Headline */}
        <div style={{ paddingBottom: 20 }}>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.0, marginBottom: 5 }}>{titleLines[0]}</div>
          <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', lineHeight: 1.0, marginBottom: 9 }}>{titleLines[1]}</div>
          <div style={{ fontSize: 17, fontWeight: 400, letterSpacing: '0.02em', color: '#fff', lineHeight: 1.3, maxWidth: 290 }}>{issue.theme}</div>
        </div>
      </div>
    </>
  ) : (
    /* ── Draft placeholder ── */
    <>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg,#0a1520 0%,#0f2235 60%,#081018 100%)' }} />
      <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '10px 11px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontSize: 6, fontWeight: 500, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.38)' }}>{formatted}</span>
          <span style={{ fontSize: 6, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#fff' }}>{`0${issue.number}`}</span>
        </div>
        <div>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 0.88, letterSpacing: '-0.04em' }}>Aegryn</div>
          <div style={{ fontSize: 5.5, fontWeight: 400, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.28)', marginTop: 3 }}>Business Magazine</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', lineHeight: 1.1 }}>{issue.title}</div>
        </div>
      </div>
    </>
  )

  const MINI_W = 232.5
  const MINI_H = 330
  const miniBox = (
    <div
      style={{
        width: MINI_W,
        height: MINI_H,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: active
          ? '0 8px 32px rgba(0,0,0,.32)'
          : '0 3px 14px rgba(0,0,0,.18)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${MINI_W / 420})`, width: 420, height: 595 }}>
        {coverContent}
      </div>
    </div>
  )

  /* ── Mode décoratif — aucun badge, aucune interaction, aucune lightbox ── */
  if (decorative) {
    return (
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div style={{ width: MINI_W, cursor: 'default' }}>
          {miniBox}
        </div>
      </div>
    )
  }

  return (
    /* Conteneur relatif — permet d'ancrer le badge hors overflow:hidden sans impacter l'alignement du carousel */
    <div style={{ position: 'relative', flexShrink: 0, paddingBottom: isComingSoon ? 24 : 0 }}>
      {isComingSoon ? (
        /* Pas encore publié — clic ouvre un aperçu plein écran, pas de navigation */
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className={`block transition-transform hover:scale-[1.03] ${active ? 'scale-[1.06]' : ''}`}
          style={{ width: MINI_W, cursor: 'pointer', border: 0, padding: 0, background: 'none', textAlign: 'left' }}
          aria-label={`${issue.title} — ${comingSoonLabel}`}
        >
          {miniBox}
        </button>
      ) : (
        (isPublic || isPreview) ? (
          <Link
            href={isDraft ? '#' : `/${locale}/magazine/${issue.slug}`}
            aria-disabled={isDraft}
            tabIndex={isDraft ? -1 : undefined}
            className={`block transition-transform ${isDraft ? 'cursor-default pointer-events-none' : `hover:scale-[1.03] ${active ? 'scale-[1.06]' : ''}`}`}
            style={{ width: MINI_W }}
          >
            {miniBox}
          </Link>
        ) : (
          <div style={{ width: MINI_W, cursor: 'default', opacity: 0.6 }}>
            {miniBox}
          </div>
        )
      )}

      {/* Badge "À venir" — position absolute sous la cover, hors overflow:hidden, i18n via prop */}
      {isComingSoon && (
        <div style={{ position: 'absolute', bottom: 0, left: 0, display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(15,26,43,.06)', border: '1px solid rgba(15,26,43,.14)', padding: '3px 8px' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#5ADDA4', display: 'inline-block', flexShrink: 0 }} />
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(15,26,43,.55)', whiteSpace: 'nowrap' }}>
            {comingSoonLabel}
          </span>
        </div>
      )}

      {/* Lightbox — aperçu plein écran de la cover, pas de redirection */}
      {lightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(5,8,12,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'relative', width: 420, height: 595, boxShadow: '0 24px 64px rgba(0,0,0,.5)' }}
          >
            <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
              {coverContent}
            </div>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close"
              style={{ position: 'absolute', top: -44, right: 0, width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.25)', color: '#fff', fontSize: 14, lineHeight: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
