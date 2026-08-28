import Link from 'next/link'
import type { MagazineIssue } from '@/lib/magazine/types'

interface Props {
  issue:              MagazineIssue
  locale?:            string
  labelSpecial?:      string
  labelReadOnline?:   string
  labelDownloadPdf?:  string
  labelSubscribe?:    string
  labelComingSoon?:   string
  isPublic?:          boolean
  isPreview?:         boolean
}

/**
 * Style Barnes : cover portrait centré sur fond blanc, titre sous le cover, 3 boutons d'accès rapide.
 * Boutons désactivés avec tooltip "publication prochainement" au survol.
 */
export function IssueCard({ issue, locale = 'fr', labelSpecial = 'Special Edition', labelReadOnline = 'Explorer en ligne', labelDownloadPdf = 'Feuilleter le PDF', labelSubscribe = 'Recevoir', labelComingSoon = 'Publication prochainement', isPublic = false, isPreview = false }: Props) {
  const date      = new Date(issue.publishedAt)
  const formatted = date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const issueNum  = `Issue ${String(issue.number).padStart(2, '0')}`
  const padNum    = String(issue.number).padStart(2, '0')

  return (
    <div className="flex flex-col items-center bg-white py-12">

      {/* ── Cover portrait — copie exacte du cover flipbook ── */}
      <Link href={`/${locale}/magazine/${issue.slug}`} className="block group" style={{ width: 420, height: 595, flexShrink: 0 }}>
        <div style={{ width: 420, height: 595, position: 'relative', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,.28)', cursor: 'pointer' }}>
          {/* Image de fond */}
          <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(/magazine/issue-${padNum}/cover-magazine-issue-${padNum}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center top' }} />
          {/* Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(5,10,15,.75) 0%,rgba(5,10,15,.45) 45%,rgba(5,10,15,.78) 100%)' }} />
          {/* Contenu */}
          <div style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '28px 30px' }}>
            {/* TOP BAR */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ fontFamily: 'inherit', fontSize: 9, fontWeight: 500, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)' }}>{formatted.toUpperCase()}</div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5ADDA4' }}>{labelSpecial}</div>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#5ADDA4' }}>{issueNum}</div>
              </div>
            </div>
            {/* AEGRYN + BUSINESS MAGAZINE */}
            <div style={{ marginTop: -8 }}>
              <div style={{ fontSize: 90, fontWeight: 700, color: '#fff', lineHeight: 0.86, letterSpacing: '-0.04em' }}>Aegryn</div>
              <div style={{ textAlign: 'right', fontSize: 8, fontWeight: 400, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.32)', marginTop: 5 }}>Business Magazine</div>
            </div>
            {/* EXCLUSIVE milieu */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ maxWidth: 170 }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#5ADDA4', marginBottom: 6 }}>Exclusive</div>
                <div style={{ width: 28, height: 2, background: '#5ADDA4', marginBottom: 8 }} />
                <div style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>Build. Certify. Transact.</div>
              </div>
            </div>
            {/* BAS : BUILT TO LAST */}
            <div style={{ paddingBottom: 52 }}>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: '#5ADDA4', lineHeight: 1.0, marginBottom: 5 }}>Built</div>
              <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', color: 'rgba(255,255,255,.9)', lineHeight: 1.0, marginBottom: 9 }}>to Last.</div>
              <div style={{ fontSize: 8.5, fontWeight: 400, letterSpacing: '0.05em', color: 'rgba(255,255,255,.4)', lineHeight: 1.6 }}>The anatomy of a tech asset that sells and one that doesn&apos;t.</div>
            </div>
          </div>
          {/* QR code — toujours visible, URL /magazine/qr gère le coming-soon côté serveur */}
          <div style={{ position: 'absolute', bottom: 14, right: 14, background: '#fff', padding: 4, borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,.3)', width: 62, height: 62 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=54x54&data=https%3A%2F%2Faegryn.com%2Fmagazine%2Fqr&color=0F1A2B&bgcolor=ffffff&qzone=0&format=png" width={54} height={54} style={{ display: 'block', imageRendering: 'pixelated' }} alt="aegryn.com/magazine" />
          </div>
        </div>
      </Link>

      {/* ── Titre sous le cover — style Barnes ── */}
      <p className="font-sans text-magazine-black mt-8 mb-6 text-center" style={{ fontSize: 18, letterSpacing: '-0.01em' }}>
        {formatted} — {issue.title}
      </p>

      {/* ── 3 boutons d'accès rapide — style Barnes ── */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Boutons 1 & 2 — actifs si isPublic ou isPreview (btn1 seulement), sinon désactivés avec tooltip */}
        {[
          { label: labelReadOnline,  filled: true,  href: `/${locale}/magazine/${issue.slug}`, previewUnlock: true  },
          { label: labelDownloadPdf, filled: false, href: `/${locale}/magazine/${issue.slug}`, previewUnlock: false },
        ].map(({ label, filled, href, previewUnlock }) => (
          (isPublic || (isPreview && previewUnlock)) ? (
            <Link
              key={label}
              href={href}
              className={[
                'inline-block font-mono text-[10px] tracking-[0.18em] uppercase px-8 py-3 font-bold transition-colors',
                filled
                  ? 'bg-magazine-black text-white hover:bg-magazine-black/80'
                  : 'border border-magazine-black text-magazine-black hover:bg-magazine-black hover:text-white',
              ].join(' ')}
            >
              {label}
            </Link>
          ) : (
            <div key={label} className="relative group/btn">
              <span
                className={[
                  'inline-block font-mono text-[10px] tracking-[0.18em] uppercase px-8 py-3 font-bold cursor-not-allowed select-none opacity-50',
                  filled
                    ? 'bg-magazine-black text-white'
                    : 'border border-magazine-black text-magazine-black',
                ].join(' ')}
                aria-disabled="true"
              >
                {label}
              </span>
              <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap bg-magazine-black text-white font-mono text-[8px] tracking-[0.12em] uppercase px-3 py-1.5 opacity-0 group-hover/btn:opacity-100 transition-opacity">
                {labelComingSoon}
              </span>
            </div>
          )
        ))}
        {/* Bouton 3 — Recevoir — scroll vers #wishlist */}
        <a
          href="#wishlist"
          className="magazine-btn-receive inline-block font-mono text-[10px] tracking-[0.18em] uppercase px-8 py-3 font-bold"
        >
          {labelSubscribe}
        </a>
      </div>

    </div>
  )
}
