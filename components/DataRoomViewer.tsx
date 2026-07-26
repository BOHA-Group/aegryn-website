'use client'

/**
 * DataRoomViewer
 *
 * Viewer sécurisé pour les documents de la data room.
 * - Récupère une URL signée (1h) via POST /api/data-room/signed-url
 * - Rendu PDF via react-pdf (canvas — jamais iframe natif)
 * - Watermark dynamique superposé en diagonale sur chaque page
 * - Détection capture : blur fenêtre, changement onglet, raccourcis OS, DevTools
 * - Écran noir 3s sur tentative détectée + log serveur
 * - Aucun téléchargement direct (Content-Disposition: inline côté storage)
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { X, ChevronLeft, ChevronRight, Loader2, AlertTriangle, Lock } from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  documentId: string
  fileName: string
  userName: string
  userEmail: string
  onClose: () => void
}

export function DataRoomViewer({ documentId, fileName, userName, userEmail, onClose }: Props) {
  const [url, setUrl] = useState<string | null>(null)
  const [isSensitive, setIsSensitive] = useState(false)
  const [numPages, setNumPages] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [blacked, setBlacked] = useState(false)
  const [blackReason, setBlackReason] = useState('')
  const viewStartRef = useRef<number>(Date.now())
  const blackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* ── Fetch URL signée ── */
  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch('/api/data-room/signed-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId }),
    })
      .then((r) => r.json())
      .then((data: { url?: string; isSensitive?: boolean; error?: string }) => {
        if (cancelled) return
        if (data.error || !data.url) {
          setError(data.error ?? 'Impossible de charger le document.')
          setLoading(false)
          return
        }
        setUrl(data.url)
        setIsSensitive(data.isSensitive ?? false)
        setLoading(false)
        logAction('view_start', null)
      })
      .catch(() => {
        if (!cancelled) { setError('Erreur réseau.'); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [documentId])

  /* ── Log helper ── */
  const logAction = useCallback((action: string, detail: string | null) => {
    fetch('/api/data-room/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, action, detail }),
    }).catch(() => { /* non-blocking */ })
  }, [documentId])

  /* ── Blackout helper ── */
  const triggerBlackout = useCallback((reason: string) => {
    setBlacked(true)
    setBlackReason(reason)
    logAction('suspicious_activity', reason)
    if (blackTimerRef.current) clearTimeout(blackTimerRef.current)
    blackTimerRef.current = setTimeout(() => setBlacked(false), 3000)
  }, [logAction])

  /* ── Détection capture / fuite focus ── */
  useEffect(() => {
    const onBlur = () => triggerBlackout('window_blur')
    const onVisibility = () => {
      if (document.hidden) triggerBlackout('tab_hidden')
    }
    const onKey = (e: KeyboardEvent) => {
      const isCaptureKey =
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && ['3', '4', '5'].includes(e.key)) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'u')
      if (isCaptureKey) {
        e.preventDefault()
        triggerBlackout('capture_attempt_key')
      }
    }
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault()
    }

    window.addEventListener('blur', onBlur)
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('keydown', onKey)
    document.addEventListener('contextmenu', onContextMenu)

    return () => {
      window.removeEventListener('blur', onBlur)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('keydown', onKey)
      document.removeEventListener('contextmenu', onContextMenu)
      if (blackTimerRef.current) clearTimeout(blackTimerRef.current)
    }
  }, [triggerBlackout])

  /* ── Log view_end à la fermeture ── */
  const handleClose = useCallback(() => {
    const duration = Math.round((Date.now() - viewStartRef.current) / 1000)
    fetch('/api/data-room/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, action: 'view_end', detail: null, sessionDurationSeconds: duration }),
    }).catch(() => { /* non-blocking */ })
    onClose()
  }, [documentId, onClose])

  /* ── Watermark text ── */
  const watermarkText = `AEGRYN CONFIDENTIEL — ${userName} <${userEmail}> — ${new Date().toLocaleDateString('fr-CH')}`

  /* ── Rendu ── */
  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90">
      {/* Écran noir sécurité */}
      {blacked && (
        <div className="absolute inset-0 bg-black z-[110] flex flex-col items-center justify-center gap-4">
          <Lock size={32} className="text-white/40" />
          <p className="text-white/70 text-[14px] font-semibold text-center max-w-sm leading-relaxed">
            Document masqué<br />
            <span className="text-white/40 text-[11px] font-normal">Activité détectée — cette consultation a été journalisée.</span>
          </p>
        </div>
      )}

      {/* Header viewer */}
      <div className="shrink-0 flex items-center justify-between px-6 py-3 bg-black/80 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Lock size={13} className="text-white/40" />
          <span className="text-[11px] font-semibold text-white/60 max-w-[300px] truncate">{fileName}</span>
          {isSensitive && (
            <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-amber-400 border border-amber-400/40 px-2 py-0.5">
              <AlertTriangle size={9} /> Sensible
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          {numPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-[11px] text-white/50 font-mono w-16 text-center">
                {page} / {numPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(numPages, p + 1))}
                disabled={page === numPages}
                className="text-white/60 hover:text-white disabled:opacity-30 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors p-1"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Zone document */}
      <div className="flex-1 overflow-auto flex items-start justify-center py-8 px-4 select-none">
        {loading && (
          <div className="flex items-center gap-3 text-white/50 mt-20">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-[13px]">Chargement sécurisé…</span>
          </div>
        )}
        {error && (
          <div className="flex items-center gap-3 text-red-400 mt-20">
            <AlertTriangle size={18} />
            <span className="text-[13px]">{error}</span>
          </div>
        )}
        {url && !loading && !error && (
          <div className="relative">
            <Document
              file={url}
              onLoadSuccess={({ numPages: n }: { numPages: number }) => setNumPages(n)}
              loading={<Loader2 size={18} className="animate-spin text-white/50 mt-20" />}
            >
              <Page
                pageNumber={page}
                width={Math.min(window?.innerWidth ? window.innerWidth - 64 : 800, 900)}
                renderTextLayer={false}
                renderAnnotationLayer={false}
              />
            </Document>

            {/* Watermark superposé */}
            <div
              className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden"
              aria-hidden="true"
            >
              <p
                className="text-[13px] font-semibold text-black/[0.08] whitespace-nowrap select-none"
                style={{
                  transform: 'rotate(-35deg)',
                  letterSpacing: '0.03em',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                }}
              >
                {watermarkText}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer : rappel légal */}
      <div className="shrink-0 border-t border-white/10 px-6 py-2 bg-black/80">
        <p className="text-[10px] text-white/30 text-center">
          Document confidentiel AEGRYN — consultation journalisée (IP, horodatage, durée) — reproduction interdite par NDA
        </p>
      </div>
    </div>
  )
}
