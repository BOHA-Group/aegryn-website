'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { BOUTIQUE_AUDIO_START, BOUTIQUE_INTRO_SECONDS, BOUTIQUE_TEMPO } from '@/content/boutique/clips'
import { BoutiqueIntro } from './BoutiqueIntro'

const L: Record<string, { on: string; off: string; label: string }> = {
  fr: { on: 'Activer la musique', off: 'Couper la musique', label: 'Son' },
  en: { on: 'Turn the music on', off: 'Turn the music off', label: 'Sound' },
  de: { on: 'Musik einschalten', off: 'Musik ausschalten', label: 'Ton' },
  es: { on: 'Activar la música', off: 'Silenciar la música', label: 'Sonido' },
  it: { on: 'Attiva la musica', off: 'Disattiva la musica', label: 'Audio' },
  nl: { on: 'Muziek aanzetten', off: 'Muziek uitzetten', label: 'Geluid' },
}

interface ClockCtx { getTime: () => number; playing: boolean; ready: boolean; titleCycle: number; noteTitleCycle: () => void }
const Ctx = createContext<ClockCtx>({ getTime: () => 0, playing: false, ready: true, titleCycle: 0, noteTitleCycle: () => {} })
export const useBoutiqueClock = () => useContext(Ctx)

/** Public-layout player: audio starts within the concept-link's trusted click.
 * Playback remains limited to Boutique routes; the intro uses the audio clock. */
export function BoutiqueAudioProvider({ locale, children }: { locale: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const conceptPath = `/${locale}/boutique`
  const projectsPath = `${conceptPath}/projets`
  const inside = pathname === conceptPath || pathname.startsWith(`${conceptPath}/`)
  const isConcept = pathname === conceptPath
  const audioRef = useRef<HTMLAudioElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const userCut = useRef(false)
  const insideRef = useRef(inside)
  const pendingEntry = useRef(false)
  const previousPath = useRef<string | null>(null)
  const disposed = useRef(false)
  const loading = useRef(isConcept)
  const frozen = useRef(false)
  const epoch = useRef(0)
  const baseElapsed = useRef(0)
  /* Horloge monotone : la piste boucle, `currentTime` saute alors en arrière ;
     on additionne la durée de chaque boucle pour que la position ne recule jamais. */
  const lastT = useRef(0)
  const loopOffset = useRef(0)
  const trackDur = useRef(0)
  const [intro, setIntro] = useState(isConcept)
  const [entry, setEntry] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [titleCycle, setTitleCycle] = useState(0)
  const noteTitleCycle = useCallback(() => setTitleCycle(c => c + 1), [])
  const txt = L[locale] ?? L.en

  const getElapsed = useCallback(() => {
    if (loading.current) return 0
    if (frozen.current) return baseElapsed.current
    const a = audioRef.current
    if (a && !a.paused && a.currentTime > 0) {
      if (trackDur.current && lastT.current - a.currentTime > 2) loopOffset.current += trackDur.current
      lastT.current = a.currentTime
      return a.currentTime - BOUTIQUE_AUDIO_START + loopOffset.current
    }
    return baseElapsed.current + (performance.now() - epoch.current) / 1000
  }, [])

  const stop = useCallback(() => {
    baseElapsed.current = getElapsed()
    epoch.current = performance.now()
    audioRef.current?.pause()
    setPlaying(false)
  }, [getElapsed])

  const startMusic = useCallback(async (from?: number) => {
    const a = audioRef.current
    if (!a || userCut.current) return false
    if (!a.paused && from === undefined) return true
    const elapsed = from ?? getElapsed()
    baseElapsed.current = elapsed
    epoch.current = performance.now()
    loading.current = from === 0
    const target = Math.max(0, BOUTIQUE_AUDIO_START + elapsed)
    const seek = Number.isFinite(a.duration) ? target % a.duration : target
    loopOffset.current = Number.isFinite(a.duration) ? target - seek : 0
    lastT.current = seek
    try {
      a.currentTime = seek
    } catch {
      a.addEventListener('loadedmetadata', () => { if (!disposed.current) a.currentTime = seek }, { once: true })
    }
    try {
      a.volume = .4
      await a.play()
      loading.current = false
      if (disposed.current || userCut.current || frozen.current || document.hidden || (!insideRef.current && !pendingEntry.current)) { a.pause(); return false }
      setPlaying(true)
      return true
    } catch {
      loading.current = false
      epoch.current = performance.now()
      return false
    }
  }, [getElapsed])

  /* Entrée Boutique : intro noire rejouée. La musique ne démarre que via le lien
   * « Le concept » (ou si elle joue déjà) ; Portfolio et les autres entrées sont muettes,
   * le bouton « Son » reste disponible. */
  const beginEntry = useCallback((withMusic: boolean) => {
    const audible = withMusic || Boolean(audioRef.current && !audioRef.current.paused)
    audioRef.current?.pause()
    baseElapsed.current = 0
    epoch.current = performance.now()
    frozen.current = false
    userCut.current = !audible
    loading.current = audible
    setEntry(n => n + 1)
    setIntro(true)
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (audible) void startMusic(0)
  }, [startMusic])

  useEffect(() => {
    insideRef.current = inside
    const previous = previousPath.current
    previousPath.current = pathname
    if (!inside) {
      if (!pendingEntry.current) { stop(); setIntro(false); userCut.current = false; loading.current = false }
    } else if (pendingEntry.current) {
      pendingEntry.current = false
    } else if (isConcept) {
      if (previous !== pathname) beginEntry(false)
    } else {
      setIntro(false)
    }
  }, [pathname, inside, isConcept, conceptPath, beginEntry, stop])

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href]') : null
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return
      const url = new URL(link.href, location.href)
      const target = url.pathname.replace(/\/$/, '')
      if (url.origin !== location.origin || url.hash) return
      const isConceptLink = target === conceptPath
      if (!isConceptLink && target !== projectsPath) return
      pendingEntry.current = pathname !== target
      beginEntry(isConceptLink)
    }
    const gesture = (e: Event) => {
      if (!insideRef.current || userCut.current || btnRef.current?.contains(e.target as Node)) return
      if (audioRef.current?.paused) void startMusic()
    }
    const hide = () => {
      if (!insideRef.current && !pendingEntry.current) return
      stop()
      frozen.current = true
      userCut.current = true
    }
    const visibility = () => {
      if (document.hidden) hide()
      else { epoch.current = performance.now(); frozen.current = false }
    }
    document.addEventListener('click', click, true)
    window.addEventListener('pointerdown', gesture, { passive: true })
    window.addEventListener('keydown', gesture)
    document.addEventListener('visibilitychange', visibility)
    window.addEventListener('pagehide', hide)
    return () => {
      document.removeEventListener('click', click, true)
      window.removeEventListener('pointerdown', gesture)
      window.removeEventListener('keydown', gesture)
      document.removeEventListener('visibilitychange', visibility)
      window.removeEventListener('pagehide', hide)
    }
  }, [pathname, conceptPath, projectsPath, beginEntry, startMusic, stop])

  useEffect(() => {
    if (!intro) return
    let raf = 0
    const tick = () => {
      if (getElapsed() >= BOUTIQUE_INTRO_SECONDS) setIntro(false)
      else raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [intro, entry, getElapsed])

  useEffect(() => {
    disposed.current = false
    const audio = audioRef.current
    const onMeta = () => { if (audio) trackDur.current = audio.duration }
    const onTime = () => {
      if (!audio || !trackDur.current) return
      if (lastT.current - audio.currentTime > 2) loopOffset.current += trackDur.current
      lastT.current = audio.currentTime
    }
    audio?.addEventListener('loadedmetadata', onMeta)
    audio?.addEventListener('timeupdate', onTime)
    return () => {
      disposed.current = true
      audio?.removeEventListener('loadedmetadata', onMeta)
      audio?.removeEventListener('timeupdate', onTime)
      audio?.pause()
    }
  }, [])

  const getTime = useCallback(() => getElapsed() - BOUTIQUE_INTRO_SECONDS + BOUTIQUE_TEMPO.firstBeat, [getElapsed])
  const value = useMemo(() => ({ getTime, playing, ready: !intro, titleCycle, noteTitleCycle }), [getTime, playing, intro, titleCycle, noteTitleCycle])

  return (
    <Ctx.Provider value={value}>
      <audio ref={audioRef} src={BOUTIQUE_TEMPO.track} loop preload="none" />
      <div inert={intro || undefined} aria-hidden={intro || undefined}>{children}</div>
      {intro && <BoutiqueIntro key={entry} getElapsed={getElapsed} />}
      {inside && !intro && (
        <button ref={btnRef} type="button" translate="no"
          onClick={() => {
            if (audioRef.current?.paused) { userCut.current = false; frozen.current = false; void startMusic() }
            else { userCut.current = true; stop() }
          }}
          aria-pressed={playing} aria-label={playing ? txt.off : txt.on} title="Beyond the Clicks"
          className="fixed bottom-3 right-20 z-40 sm:bottom-8 sm:right-24 flex items-center gap-2.5 rounded-full bg-ag-navy/55 px-3.5 py-2 text-white/80 backdrop-blur-md transition-colors hover:bg-ag-navy/80 hover:text-white"
        >
          <span className="flex h-3.5 items-end gap-[3px]" aria-hidden="true">
            {[.9, .5, 1, .65].map((h, i) => (
              <span key={i} className="w-[3px] origin-bottom rounded-full bg-ag-apex"
                style={{ height: '100%', transform: `scaleY(${playing ? h : .25})`, animation: playing ? `boutique-eq ${.57 * (i % 2 ? 1 : 2)}s ease-in-out ${i * .14}s infinite alternate` : undefined }} />
            ))}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em]">{txt.label}</span>
        </button>
      )}
    </Ctx.Provider>
  )
}
