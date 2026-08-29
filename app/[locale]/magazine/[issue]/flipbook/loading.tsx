/**
 * Loading skeleton pour la route flipbook — affiché immédiatement pendant
 * que canAccessIssue() s'exécute côté serveur, évitant le flash du footer.
 */
export default function FlipbookLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0F1A2B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: 28,
            height: 2,
            background: '#5ADDA4',
            margin: '0 auto 16px',
            animation: 'ag-pulse 1.2s ease-in-out infinite',
          }}
        />
        <p
          style={{
            fontFamily: 'monospace',
            fontSize: 9,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.3)',
          }}
        >
          Aegryn Magazine
        </p>
      </div>
      <style>{`
        @keyframes ag-pulse {
          0%, 100% { opacity: 1; transform: scaleX(1); }
          50%       { opacity: 0.4; transform: scaleX(0.5); }
        }
      `}</style>
    </div>
  )
}
