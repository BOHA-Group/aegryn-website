'use client'

import { useEffect, type RefObject } from 'react'

/** Decorative video: load on screen, pause off screen, use its poster for reduced motion. */
export function useDecorativeVideo(ref: RefObject<HTMLVideoElement | null>, desktop: string, mobile = desktop) {
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    const small = window.matchMedia('(max-width: 767px)')
    let visible = false
    let disposed = false
    const update = () => {
      if (reduced.matches) {
        video.pause()
        if (video.hasAttribute('src')) { video.removeAttribute('src'); video.load() }
        return
      }
      if (!visible || document.hidden) { video.pause(); return }
      const src = small.matches ? mobile : desktop
      if (video.getAttribute('src') !== src) { video.src = src; video.load() }
      video.play().then(() => {
        if (disposed || !visible || document.hidden || reduced.matches) video.pause()
      }).catch(() => {})
    }
    const pause = () => video.pause()
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update() }, { threshold: 0 })
    io.observe(video)
    reduced.addEventListener('change', update)
    small.addEventListener('change', update)
    document.addEventListener('visibilitychange', update)
    window.addEventListener('pagehide', pause)
    return () => {
      disposed = true
      io.disconnect()
      reduced.removeEventListener('change', update)
      small.removeEventListener('change', update)
      document.removeEventListener('visibilitychange', update)
      window.removeEventListener('pagehide', pause)
      video.pause()
    }
  }, [ref, desktop, mobile])
}
