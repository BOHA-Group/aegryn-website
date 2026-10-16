'use client'

/**
 * Hero de La Boutique : une vidéo plein cadre, alternée à chaque temps de la musique.
 * Les 20 clips (journée type) se déroulent dans l'ordre, puis la séquence reboucle.
 * Le DOM est piloté directement (refs) pour garder une coupe nette à chaque temps ;
 * chaque clip repart du début et s'agrandit légèrement pendant son temps.
 */
import { useEffect, useRef, useState } from 'react'
import { BEAT_SECONDS, BOUTIQUE_TEMPO, HERO_CLIPS, TOTAL_BEATS, clipSrc } from '@/content/boutique/clips'
import { useBoutiqueClock } from './BoutiqueAudio'

/* Recadrage par clip en `object-cover` : la statue de la Liberte est dans le tiers
   gauche du plan ; en portrait, le centrage par defaut la sort du cadre. */
const CLIP_POSITION: Record<string, string> = { '09-statue-of-liberty': '22% 50%' }

export function HeroPatchwork() {
  const { getTime } = useBoutiqueClock()
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const current = useRef(-1)
  const [small, setSmall] = useState<boolean | null>(null)

  useEffect(() => { setSmall(window.matchMedia('(max-width: 899px)').matches) }, [])

  useEffect(() => {
    if (small === null) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const n = HERO_CLIPS.length

    const warm = (from: number, count: number) => {
      for (let k = 0; k < count; k++) {
        const v = videos.current[(from + k) % n]
        if (v && v.preload !== 'auto') { v.preload = 'auto'; v.load() }
      }
    }

    const show = (i: number) => {
      const v = videos.current[i]
      if (!v) return
      const prev = current.current
      v.style.zIndex = '2'
      v.style.opacity = '1'
      v.style.transition = 'none'
      v.style.transform = 'scale(1)'
      try { v.currentTime = 0 } catch { /* métadonnées pas encore chargées */ }
      if (!reduced) {
        v.play().catch(() => {})
        requestAnimationFrame(() => {
          v.style.transition = `transform ${BEAT_SECONDS * BOUTIQUE_TEMPO.beatsPerClip}s linear`
          v.style.transform = 'scale(1.07)'
        })
      }
      /* l'ancien clip reste dessous un instant : pas de flash noir si le nouveau n'est pas encore décodé */
      if (prev >= 0 && prev !== i) {
        const old = videos.current[prev]
        if (old) { old.style.zIndex = '1'; setTimeout(() => { if (current.current !== prev) { old.style.opacity = '0'; old.pause() } }, 120) }
      }
      current.current = i
      warm(i + 1, 4)
    }

    warm(0, 5)
    if (reduced) { show(0); return }

    let raf = 0
    let lastIdx = -1
    const loop = () => {
      const beat = Math.floor((getTime() - BOUTIQUE_TEMPO.firstBeat) / BEAT_SECONDS)
      const idx = ((Math.floor(beat / BOUTIQUE_TEMPO.beatsPerClip) % n) + n) % n
      if (idx !== lastIdx) { lastIdx = idx; show(idx) }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [getTime, small])

  return (
    <div className="absolute inset-0 overflow-hidden bg-ag-navy" aria-hidden="true" data-beats={TOTAL_BEATS}>
      {small !== null && HERO_CLIPS.map((name, i) => (
        <video
          key={name}
          ref={el => { videos.current[i] = el }}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ opacity: 0, objectPosition: CLIP_POSITION[name] }}
          src={clipSrc(name, small)}
          muted
          playsInline
          preload={i < 5 ? 'auto' : 'metadata'}
          disablePictureInPicture
          tabIndex={-1}
        />
      ))}
    </div>
  )
}
