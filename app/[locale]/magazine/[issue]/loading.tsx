/**
 * Loading skeleton pour la page issue — affiché immédiatement par Next.js App Router
 * pendant que le Server Component (canAccessIssue + données) charge.
 * Remplace le flash du footer de la page précédente (hub /magazine) lors de la
 * navigation vers une issue.
 */
export default function IssuePageLoading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F7F5F1',
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
            color: 'rgba(15,26,43,.3)',
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
