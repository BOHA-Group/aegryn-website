'use client'

interface Props {
  htmlSrc: string
  title?:  string
}

/**
 * WebViewer — iframe vers la version web longue du magazine (_web.html).
 * Affiche le contenu complet 80+ sections avec sidebar scrollable intégrée.
 */
export function WebViewer({ htmlSrc, title = 'Aegryn Magazine — Web Edition' }: Props) {
  return (
    <div
      style={{
        position:  'relative',
        width:     '100%',
        height:    'calc(100vh - 52px)',
        minHeight: '800px',
        background: '#F7F5F1',
      }}
    >
      <iframe
        src={htmlSrc}
        title={title}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="fullscreen"
      />
    </div>
  )
}
