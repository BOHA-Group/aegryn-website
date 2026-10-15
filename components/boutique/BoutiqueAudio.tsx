'use client'

/**
 * Lecteur de musique discret de La Boutique.
 * - Démarre automatiquement à l'ouverture de l'espace (si le navigateur l'autorise),
 *   sinon au premier clic, toucher ou touche du visiteur.
 * - Se poursuit pendant la navigation entre les pages de La Boutique (le fournisseur
 *   vit dans le layout /boutique) et s'arrête dès qu'on quitte cet espace.
 * - Le bouton reste visible sur toutes les pages de La Boutique. Le choix « coupé » vaut
 *   pour la navigation en cours : un rafraîchissement du navigateur relance la musique.
 * - Expose une horloge (`getTime`) : temps de lecture de la piste, ou un minuteur de
 *   secours tant que le son n'est pas lancé, pour caler les visuels sur le tempo.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BOUTIQUE_TEMPO } from '@/content/boutique/clips'

const VOLUME = 0.4
const L: Record<string, { on: string; off: string; label: string }> = {
  fr: { on: 'Activer la musique', off: 'Couper la musique', label: 'Son' },
  en: { on: 'Turn the music on', off: 'Turn the music off', label: 'Sound' },
  de: { on: 'Musik einschalten', off: 'Musik ausschalten', label: 'Ton' },
  es: { on: 'Activar la música', off: 'Silenciar la música', label: 'Sonido' },
  it: { on: 'Attiva la musica', off: 'Disattiva la musica', label: 'Audio' },
  nl: { on: 'Muziek aanzetten', off: 'Muziek uitzetten', label: 'Geluid' },
}

interface ClockCtx { getTime: () => number; playing: boolean }
const Ctx = createContext<ClockCtx>({ getTime: () => 0, playing: false })
export const useBoutiqueClock = () => useContext(Ctx)

export function BoutiqueAudioProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const t0 = useRef(0)
  const fade = useRef<ReturnType<typeof setInterval> | null>(null)
  const [playing, setPlaying] = useState(false)
  const txt = L[locale] ?? L.en

  const rampTo = useCallback((target: number, done?: () => void) => {
    const a = audioRef.current; if (!a) return
    if (fade.current) clearInterval(fade.current)
    fade.current = setInterval(() => {
      const step = target > a.volume ? 0.03 : -0.05
      const next = Math.min(1, Math.max(0, a.volume + step))
      a.volume = next
      if (Math.abs(next - target) < 0.03) { a.volume = target; if (fade.current) clearInterval(fade.current); done?.() }
    }, 50)
  }, [])

  const start = useCallback(async () => {
    const a = audioRef.current; if (!a) return false
    try {
      a.volume = 0
      await a.play()
      setPlaying(true); rampTo(VOLUME)
      return true
    } catch { return false }
  }, [rampTo])

  const stop = useCallback(() => {
    rampTo(0, () => audioRef.current?.pause())
    setPlaying(false)
  }, [rampTo])

  useEffect(() => {
    t0.current = performance.now()
    let armed = true
    const onGesture = async () => { if (armed && await start()) cleanup() }
    const cleanup = () => { armed = false; ['pointerdown', 'keydown', 'touchstart'].forEach(e => window.removeEventListener(e, onGesture)) }
    start().then(ok => { if (!ok) ['pointerdown', 'keydown', 'touchstart'].forEach(e => window.addEventListener(e, onGesture, { passive: true })) })
    return () => { cleanup(); if (fade.current) clearInterval(fade.current); audioRef.current?.pause() }
  }, [start])

  const getTime = useCallback(() => {
    const a = audioRef.current
    return a && !a.paused && a.currentTime > 0 ? a.currentTime : (performance.now() - t0.current) / 1000
  }, [])
  const value = useMemo(() => ({ getTime, playing }), [getTime, playing])

  return (
    <Ctx.Provider value={value}>
      <audio ref={audioRef} src={BOUTIQUE_TEMPO.track} loop preload="auto" />
      {children}
      <button
        type="button"
        onClick={() => (playing ? stop() : start())}
        aria-pressed={playing}
        aria-label={playing ? txt.off : txt.on}
        title="Beyond the Clicks"
        className="fixed bottom-8 right-20 z-40 sm:right-24 flex items-center gap-2.5 rounded-full bg-ag-navy/55 px-3.5 py-2 text-white/80 backdrop-blur-md transition-colors hover:bg-ag-navy/80 hover:text-white"
      >
        <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
          {[0.9, 0.5, 1, 0.65].map((h, i) => (
            <span
              key={i}
              className="w-[3px] origin-bottom rounded-full bg-ag-apex"
              style={{ height: '100%', transform: `scaleY(${playing ? h : 0.25})`, animation: playing ? `boutique-eq ${0.57 * (i % 2 ? 1 : 2)}s ease-in-out ${i * 0.14}s infinite alternate` : undefined }}
            />
          ))}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{txt.label}</span>
      </button>
    </Ctx.Provider>
  )
}
