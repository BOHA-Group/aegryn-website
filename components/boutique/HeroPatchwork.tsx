'use client'

/**
 * Hero de La Boutique : 26 clips plein cadre, alternés tous les deux temps.
 * Le DOM est piloté directement (refs) pour garder une coupe nette à chaque temps ;
 * chaque clip repart du début et s'agrandit légèrement pendant son temps.
 */
import { useEffect, useRef, useState } from 'react'
import { BEAT_SECONDS, BOUTIQUE_TEMPO, CLIP_START_BEATS, HERO_CLIPS, TOTAL_BEATS, clipBeats, clipSrc } from '@/content/boutique/clips'
import { useBoutiqueClock } from './BoutiqueAudio'

/* Recadrage par clip en `object-cover` : en portrait, le centrage par defaut sort les
   sujets du cadre (statue dans le tiers gauche, voitures et sportive a droite). */
const CLIP_POSITION: Record<string, string> = {
  'statue-of-liberty-loop': '33% 50%',
  '16-gt-race':           '62% 50%',
  '20-stretching':        '55% 50%',
  'speedboat':            '35% 50%',
  'wine-cellar':          '60% 50%',
}

/* Focal points checked at the start, middle and end of the clips in a portrait hero.
   These percentages position the cropped image, not the subject within the source. */
const MOBILE_CLIP_POSITION: Record<string, string> = {
  '01-geneva-fountain': '84% 50%',
  '20-stretching': '44% 50%',
  '18-espresso': '79% 50%',
  'architect-palette': '52% 50%',
  'watchmaker': '66% 50%',
  'jeweler': '64% 50%',
  'metal-grinding': '77% 50%',
  'phone-scroll': '57% 50%',
  '17-taking-notes': '61% 50%',
  'jet-tarmac': '18% 50%',
  '14-back-seat': '43% 50%',
  'resort-aerial': '34% 50%',
  '16-gt-race': '20% 50%',
  'speedboat': '28% 50%',
  '08-seine-sunset': '16% 50%',
  'wine-cellar': '48% 50%',
  'singing-bowl': '48% 50%',
  'dish-plating': '44% 50%',
  'restaurant-night': '97% 50%',
  '11-concert-flames': '33% 50%',
  'bridge-dusk': '57% 50%',
  'statue-of-liberty-loop': '24% 50%',
}

export function HeroPatchwork() {
  const { getTime, ready, titleCycle } = useBoutiqueClock()
  const latestCycle = useRef(titleCycle)
  latestCycle.current = titleCycle
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const container = useRef<HTMLDivElement>(null)
  const current = useRef(-1)
  /* Palier de qualité (0 = -s, 1 = -m, 2 = haut) : décidé une fois, abaissé si le réseau décroche. */
  const qual = useRef<number | null>(null)
  const probeT0 = useRef(0)
  const pumpRef = useRef<() => void>(() => {})
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
    let lateStreak = 0
    let cycleSeen = latestCycle.current
    let cycleStart = 0
    const timeouts = new Set<ReturnType<typeof setTimeout>>()
    const active = () => ready && visible && !document.hidden && !reduced.matches && !disposed

    if (qual.current === null) {
      const c = (navigator as { connection?: { saveData?: boolean; downlink?: number; effectiveType?: string } }).connection
      const slow = c?.saveData || /^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? '') || (c?.downlink != null && c.downlink < 1.5)
      qual.current = slow ? 0 : small ? 1 : 2
    }

    /* Téléchargements un par un, dans l'ordre de lecture : en parallèle, les clips se partagent
       le débit et aucun n'arrive à temps. Le suivant démarre dès que celui-ci peut être lu
       (`canplay`), ou après 2,5 s pour ne jamais bloquer la file. */
    const warm = (from: number, count: number) => {
      for (let k = 0; k < count; k++) {
        const idx = (from + k) % n
        const v = videos.current[idx]
        if (!v) continue
        const want = clipSrc(HERO_CLIPS[idx], small, qual.current ?? 1)
        const cur = v.getAttribute('src')
        if (!cur || (cur !== want && v.readyState < 2)) {
          v.src = want
          v.preload = 'auto'
          v.dataset.t = String(performance.now())
          v.load()
        }
        if (!v.error && v.readyState < 3 && performance.now() - Number(v.dataset.t || 0) < 2500) break
      }
    }
    pumpRef.current = () => { if (!disposed) warm(current.current + 1, 6) }

    const show = (i: number) => {
      const v = videos.current[i]
      if (!v) return
      warm(i, 1)
      if (v.readyState < 2) {
        /* Données pas encore arrivées : lancer le téléchargement en lecture masquée ;
           l'ancien clip reste affiché et boucle jusqu'à la révélation. */
        v.play().catch(() => {})
        return
      }
      const prev = current.current
      v.style.zIndex = '2'
      v.style.opacity = '1'
      v.style.willChange = 'transform'
      v.style.transition = 'none'
      v.style.transform = 'scale(1)'
      const duration = clipBeats(HERO_CLIPS[i]) * BEAT_SECONDS
      const pos = (getTime() - BOUTIQUE_TEMPO.firstBeat) / BEAT_SECONDS - cycleStart
      const offset = Math.max(0, (pos - CLIP_START_BEATS[i]) * BEAT_SECONDS)
      const target = Math.min(offset, Math.max(0, (Number.isFinite(v.duration) ? v.duration : duration) - .1))
      /* Un seek inutile fige la lecture le temps du décodage : seulement si l'écart compte. */
      if (Math.abs(v.currentTime - target) > .04) { try { v.currentTime = target } catch { /* Métadonnées pas encore chargées. */ } }
      v.play().then(() => {
        if (!active() || current.current !== i) { v.pause(); return }
        if (active() && !small) {
          v.style.transition = `transform ${duration}s linear`
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
            if (current.current !== prev) { old.style.opacity = '0'; old.style.willChange = ''; old.pause() }
          }, 120)
          timeouts.add(timer)
        }
      }
      current.current = i
      /* Débit retombé : plusieurs révélations en retard -> palier de qualité inférieur. */
      lateStreak = pos - CLIP_START_BEATS[i] > clipBeats(HERO_CLIPS[i]) + 0.5 ? lateStreak + 1 : 0
      if (lateStreak >= 3) { qual.current = Math.max(0, (qual.current ?? 1) - 1); lateStreak = 0 }
      warm(i + 1, 6)
      /* Libère les décodeurs et tampons des clips déjà passés (ils sont rechargés depuis le
         cache HTTP quand le préchargement y revient) : 26 éléments vidéo actifs saturent les mobiles. */
      for (let j = 0; j < n; j++) {
        const behind = (i - j + n) % n
        const vj = videos.current[j]
        if (vj && behind >= 3 && behind <= n - 7 && vj.getAttribute('src')) {
          vj.pause()
          vj.removeAttribute('src')
          vj.load()
        }
      }
    }

    /* Les clips coupent sur leurs temps ; le dernier tient jusqu'à ce que le cycle
       complet des titres se termine (signal `titleCycle`), puis tout reboucle au début. */
    const loop = () => {
      if (!active()) { update(); return }
      const beatNow = (getTime() - BOUTIQUE_TEMPO.firstBeat) / BEAT_SECONDS
      if (cycleSeen !== latestCycle.current) { cycleSeen = latestCycle.current; cycleStart = beatNow; lastIdx = -1 }
      const b = Math.max(0, beatNow - cycleStart)
      let idx = n - 1
      while (idx > 0 && b < CLIP_START_BEATS[idx]) idx--
      if (idx !== lastIdx) { lastIdx = idx; warm(idx + 1, 6) }
      /* Réessaye à chaque frame : un clip en retard de téléchargement est révélé
         dès qu'il a des données, sans laisser un trou noir entre les plans. */
      if (idx !== current.current) show(idx)
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
    if (!reduced.matches) warm(0, 5)
    /* Palier mesuré pendant le préchargement : les 5 premiers clips lisibles en moins de 2,5 s
       (réseau confortable) = montée en 720p sur mobile ; toujours pas lisibles après 8 s =
       descente d'un palier. Une seule décision, `saveData` et réseau lent démarrent en -s. */
    let probe = 0 as unknown as ReturnType<typeof setInterval>
    const stopProbe = () => { clearInterval(probe); probe = 0 as unknown as ReturnType<typeof setInterval> }
    if (!reduced.matches && probeT0.current >= 0) {
      if (!probeT0.current) probeT0.current = performance.now()
      probe = setInterval(() => {
        const dt = performance.now() - probeT0.current
        if (videos.current.slice(0, 5).every(v => v && v.readyState >= 3)) {
          stopProbe(); probeT0.current = -1
          if (small && dt < 2500 && qual.current === 1) qual.current = 2
        } else if (dt > 8000) {
          stopProbe(); probeT0.current = -1
          qual.current = Math.max(0, (qual.current ?? 1) - 1)
        }
      }, 200)
    }
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() })
    io.observe(container.current)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pagehide', pause)
    reduced.addEventListener('change', update)
    return () => {
      disposed = true
      if (probe) clearInterval(probe)
      pause()
      videos.current.forEach(v => { if (v) v.style.opacity = '0' })
      timeouts.forEach(clearTimeout)
      io.disconnect()
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pagehide', pause)
      reduced.removeEventListener('change', update)
      current.current = -1
    }
  }, [getTime, small, ready])

  return (
    <div ref={container} className="absolute inset-0 isolate overflow-hidden bg-ag-navy bg-cover bg-center" style={{ backgroundImage: "url('/images/boutique/hero-poster.jpg')", backgroundPosition: small ? MOBILE_CLIP_POSITION['01-geneva-fountain'] : undefined }} aria-hidden="true" data-beats={TOTAL_BEATS}>
      {small !== null && HERO_CLIPS.map((name, i) => (
        <video
          key={name}
          ref={el => { videos.current[i] = el }}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: 0, objectPosition: small ? (MOBILE_CLIP_POSITION[name] ?? '50% 50%') : CLIP_POSITION[name] }}
          muted
          playsInline
          loop
          preload="none"
          onCanPlay={() => pumpRef.current()}
          onError={() => pumpRef.current()}
          disablePictureInPicture
          tabIndex={-1}
        />
      ))}
    </div>
  )
}
