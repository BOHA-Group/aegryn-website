'use client'

interface Props {
  htmlSrc:    string
  title?:     string
  baseAsset?: string
}

/**
 * FlipbookViewer — iframe vers le HTML autonome StPageFlip.
 * Le HTML /magazine/issue-01/aegryn-magazine-issue-01_1.html
 * contient StPageFlip.js CDN + UI Barnes (dark bg, thumbs, toolbar, fullscreen).
 */
export function FlipbookViewer({ htmlSrc }: Props) {

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        /* 100vh moins la hauteur du nav site (≈80px) pour ne jamais être masqué */
        height: 'calc(100vh - 80px)',
        minHeight: '680px',
        background: '#1e1e1e',
      }}
    >
      <iframe
        src={htmlSrc}
        title="Aegryn Magazine Flipbook"
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="fullscreen"
      />
    </div>
  )
}
