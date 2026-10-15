'use client'

/**
 * Patchwork vidéo du hero de La Boutique, calé sur le tempo de la musique.
 * Les scènes (1, 2 ou 3 volets) changent exactement sur les temps du morceau ;
 * la séquence suit une journée type et reboucle une fois les 22 vidéos déroulées.
 * Le DOM est piloté directement (refs) pour garder une coupe nette à chaque temps.
 */
import { useEffect, useRef } from 'react'
import { BEAT_SECONDS, BOUTIQUE_CLIPS, BOUTIQUE_TEMPO, SCENES, TOTAL_BEATS } from '@/content/boutique/clips'
import { useBoutiqueClock } from './BoutiqueAudio'

const GAP = 3 // px entre les volets

const SCENE_AT_BEAT: number[] = (() => {
  const map = new Array<number>(TOTAL_BEATS)
  SCENES.forEach(sc => { for (let b = sc.startBeat; b < sc.startBeat + sc.beats; b++) map[b] = sc.index })
  return map
})()

export function HeroPatchwork() {
  const { getTime } = useBoutiqueClock()
  const panels = useRef<(HTMLDivElement | null)[]>([])
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const current = useRef(-1)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const warm = (sceneIndex: number) => {
      SCENES[sceneIndex].clips.forEach(i => {
        const v = videos.current[i]
        if (v && v.preload !== 'auto') { v.preload = 'auto'; v.load() }
      })
    }

    const show = (sceneIndex: number) => {
      const sc = SCENES[sceneIndex]
      panels.current.forEach((p, i) => {
        const v = videos.current[i]
        if (!p || !v) return
        const k = sc.clips.indexOf(i)
        if (k < 0) {
          if (p.style.opacity !== '0') { p.style.opacity = '0'; v.pause() }
          return
        }
        const [x, y, w, h] = sc.rects[k]
        Object.assign(p.style, {
          left: `calc(${x}% + ${GAP / 2}px)`, top: `calc(${y}% + ${GAP / 2}px)`,
          width: `calc(${w}% - ${GAP}px)`, height: `calc(${h}% - ${GAP}px)`, opacity: '1',
        })
        v.style.transition = 'none'
        v.style.transform = 'scale(1)'
        try { v.currentTime = 0 } catch { /* métadonnées pas encore chargées */ }
        if (!reduced) {
          v.play().catch(() => {})
          requestAnimationFrame(() => {
            v.style.transition = `transform ${sc.beats * BEAT_SECONDS}s linear`
            v.style.transform = 'scale(1.09)'
          })
        }
      })
      warm((sceneIndex + 1) % SCENES.length)
      warm((sceneIndex + 2) % SCENES.length)
    }

    if (reduced) { warm(0); show(0); return }

    let raf = 0
    const loop = () => {
      const beat = Math.floor((getTime() - BOUTIQUE_TEMPO.firstBeat) / BEAT_SECONDS)
      const si = SCENE_AT_BEAT[((beat % TOTAL_BEATS) + TOTAL_BEATS) % TOTAL_BEATS]
      if (si !== current.current) { current.current = si; show(si) }
      raf = requestAnimationFrame(loop)
    }
    warm(0)
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [getTime])

  return (
    <div className="absolute inset-0 overflow-hidden bg-ag-navy" aria-hidden="true">
      {BOUTIQUE_CLIPS.map((name, i) => (
        <div
          key={name}
          ref={el => { panels.current[i] = el }}
          className="absolute overflow-hidden bg-ag-navy"
          style={{ opacity: 0 }}
        >
          <video
            ref={el => { videos.current[i] = el }}
            className="absolute inset-0 h-full w-full object-cover will-change-transform"
            src={`/videos/boutique/${name}.mp4`}
            muted
            playsInline
            preload={i < 6 ? 'auto' : 'metadata'}
            disablePictureInPicture
            tabIndex={-1}
          />
        </div>
      ))}
    </div>
  )
}
