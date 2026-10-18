'use client'

/**
 * Hero de La Boutique : 26 clips plein cadre, alternés tous les deux temps.
 * Le DOM est piloté directement (refs) pour garder une coupe nette à chaque temps ;
 * chaque clip repart du début et s'agrandit légèrement pendant son temps.
 */
import { useEffect, useRef, useState } from 'react'
import { BEAT_SECONDS, BOUTIQUE_TEMPO, HERO_CLIPS, TOTAL_BEATS, clipSrc } from '@/content/boutique/clips'
import { useBoutiqueClock } from './BoutiqueAudio'

/* Recadrage par clip en `object-cover` : en portrait, le centrage par defaut sort les
   sujets du cadre (statue dans le tiers gauche, voitures et sportive a droite). */
const CLIP_POSITION: Record<string, string> = {
  '09-statue-of-liberty': '33% 50%',
  '16-gt-race':           '62% 50%',
  '20-stretching':        '55% 50%',
  'speedboat':            '35% 50%',
  'wine-cellar':          '60% 50%',
}

export function HeroPatchwork() {
  const { getTime } = useBoutiqueClock()
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const container = useRef<HTMLDivElement>(null)
  const current = useRef(-1)
  const [small, setSmall] = useState<boolean | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 899px)')
    const update = () => setSmall(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (small === null || !container.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const n = HERO_CLIPS.length
    let visible = false
    let disposed = false
    let raf = 0
    let lastIdx = -1
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const active = () => visible && !document.hidden && !reduced.matches && !disposed

    const warm = (from: number, count: number) => {
      for (let k = 0; k < count; k++) {
        const v = videos.current[(from + k) % n]
        if (v && v.getAttribute('src') !== v.dataset.src) {
          v.src = v.dataset.src ?? ''
          v.preload = 'auto'
          v.load()
        }
      }
    }

    const show = (i: number) => {
      const v = videos.current[i]
      if (!v) return
      warm(i, 1)
      const prev = current.current
      v.style.zIndex = '2'
      v.style.opacity = '1'
      v.style.transition = 'none'
      v.style.transform = 'scale(1)'
      const duration = BEAT_SECONDS * BOUTIQUE_TEMPO.beatsPerClip
      const offset = ((getTime() - BOUTIQUE_TEMPO.firstBeat) % duration + duration) % duration
      try { v.currentTime = offset } catch { /* Métadonnées pas encore chargées. */ }
      v.play().then(() => {
        if (!active() || current.current !== i) { v.pause(); return }
        if (active()) {
          v.style.transition = `transform ${BEAT_SECONDS * BOUTIQUE_TEMPO.beatsPerClip}s linear`
          v.style.transform = 'scale(1.07)'
        }
      }).catch(() => {})
      /* l'ancien clip reste dessous un instant : pas de flash noir si le nouveau n'est pas encore décodé */
      if (prev >= 0 && prev !== i) {
        const old = videos.current[prev]
        if (old) {
          old.style.zIndex = '1'
          const timer = setTimeout(() => {
            timeouts.delete(timer)
            if (current.current !== prev) { old.style.opacity = '0'; old.pause() }
          }, 120)
          timeouts.add(timer)
        }
      }
      current.current = i
      warm(i + 1, 4)
    }

    const loop = () => {
      if (!active()) { update(); return }
      const beat = Math.floor((getTime() - BOUTIQUE_TEMPO.firstBeat) / BEAT_SECONDS)
      const idx = ((Math.floor(beat / BOUTIQUE_TEMPO.beatsPerClip) % n) + n) % n
      if (idx !== lastIdx) { lastIdx = idx; show(idx) }
      raf = requestAnimationFrame(loop)
    }
    const pause = () => {
      cancelAnimationFrame(raf)
      raf = 0
      lastIdx = -1
      videos.current.forEach(v => v?.pause())
    }
    const update = () => {
      if (!active()) {
        pause()
        if (reduced.matches) videos.current.forEach(v => {
          if (v) { v.style.opacity = '0'; v.style.transform = 'none' }
        })
      } else if (!raf) {
        raf = requestAnimationFrame(loop)
      }
    }
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    io.observe(container.current)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pagehide', pause)
    reduced.addEventListener('change', update)
    return () => {
      disposed = true
      pause()
      videos.current.forEach(v => { if (v) v.style.opacity = '0' })
      timeouts.forEach(clearTimeout)
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pagehide', pause)
      reduced.removeEventListener('change', update)
      current.current = -1
    }
  }, [getTime, small])

  return (
    <div ref={container} className="absolute inset-0 overflow-hidden bg-ag-navy bg-cover bg-center" style={{ backgroundImage: "url('/images/boutique/hero-poster.jpg')" }} aria-hidden="true" data-beats={TOTAL_BEATS}>
      {small !== null && HERO_CLIPS.map((name, i) => (
        <video
          key={name}
          ref={el => { videos.current[i] = el }}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ opacity: 0, objectPosition: CLIP_POSITION[name] }}
          data-src={clipSrc(name, small)}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
        />
      ))}
    </div>
  )
}
