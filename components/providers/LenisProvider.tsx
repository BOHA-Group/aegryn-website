'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

type Props = { children: React.ReactNode }

export default function LenisProvider({ children }: Props) {
  const lenisRef = useRef<{ destroy: () => void; scrollTo: (target: number, opts?: object) => void } | null>(null)
  const rafFnRef = useRef<((time: number) => void) | null>(null)
  const popstateRef = useRef(false)
  const firstRunRef = useRef(true)
  const pathname = usePathname()

  /* Clic sur un lien interne : mémoriser la position exacte (scroll vertical, fiche cliquée, défilement horizontal
     des carrousels) pour la retrouver au retour arrière. */
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null
      if (!a) return
      const href = a.getAttribute('href') || ''
      if (!href || href.startsWith('#') || /^[a-z]+:/i.test(href)) return
      const r = a.getBoundingClientRect()
      const strips = Array.from(document.querySelectorAll<HTMLElement>('.js-xscroll')).map(el => el.scrollLeft)
      try {
        sessionStorage.setItem('ag-scroll:' + location.pathname, JSON.stringify({
          y: window.scrollY, top: r.top, href, strips, t: Date.now(),
        }))
      } catch { /* stockage indisponible */ }
    }
    const onPop = () => { popstateRef.current = true }
    document.addEventListener('click', onClick, true)
    window.addEventListener('popstate', onPop)
    return () => { document.removeEventListener('click', onClick, true); window.removeEventListener('popstate', onPop) }
  }, [])

  /* Retour arrière (popstate) : restaurer la position mémorisée au clic. Lue une seule fois par page. */
  const restoreScroll = () => {
    let raw: string | null = null
    try {
      raw = sessionStorage.getItem('ag-scroll:' + pathname)
      if (raw) sessionStorage.removeItem('ag-scroll:' + pathname)
    } catch { return }
    if (!raw) return
    let d: { y: number; top: number; href: string; strips: number[]; t: number }
    try { d = JSON.parse(raw) } catch { return }
    if (!d || Date.now() - d.t > 10 * 60 * 1000) return
    const apply = () => {
      document.querySelectorAll<HTMLElement>('.js-xscroll').forEach((el, i) => { if (d.strips?.[i]) el.scrollLeft = d.strips[i] })
      const el = d.href ? document.querySelector<HTMLElement>(`a[href="${CSS.escape(d.href)}"]`) : null
      const y = el ? el.getBoundingClientRect().top + window.scrollY - d.top : d.y
      if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
    }
    let cancelled = false
    const cancel = () => { cancelled = true }
    const go = () => { if (!cancelled) apply() }
    const events = ['wheel', 'touchstart', 'keydown'] as const
    events.forEach(e => window.addEventListener(e, cancel, { passive: true, once: true }))
    const timers = [0, 300, 800, 1600].map(ms => setTimeout(go, ms))
    return () => { timers.forEach(clearTimeout); events.forEach(e => window.removeEventListener(e, cancel)) }
  }

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let destroy = () => {}
    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { gsap } = await import('gsap')
      if (disposed || reduced.matches || lenisRef.current) return

      gsap.registerPlugin(ScrollTrigger)

      const lenis = new Lenis({
        duration: 1.4,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      })

      lenis.on('scroll', ScrollTrigger.update)
      const rafFn = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(rafFn)
      gsap.ticker.lagSmoothing(0)

      lenisRef.current = lenis
      rafFnRef.current = rafFn
      destroy = () => {
        gsap.ticker.remove(rafFn)
        lenis.destroy()
        lenisRef.current = null
        rafFnRef.current = null
      }
    }

    const update = () => { if (reduced.matches) destroy(); else void initLenis() }
    update()
    reduced.addEventListener('change', update)

    return () => {
      disposed = true
      reduced.removeEventListener('change', update)
      destroy()
    }
  }, [])

  /* Changement de page : retour en haut, ou, si l'adresse porte une ancre (#cadrer, #cinq-cycles…), arrivée sur la
     section demandée. Plusieurs essais : les sections épinglées et les images finissent de se mesurer après l'arrivée. */
  useEffect(() => {
    /* Retour arrière/avant : restaurer la position mémorisée plutôt que repartir en haut. */
    let hardBack = false
    try { hardBack = firstRunRef.current && (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined)?.type === 'back_forward' } catch { /* noop */ }
    firstRunRef.current = false
    const isBack = popstateRef.current || hardBack
    popstateRef.current = false
    const hash = decodeURIComponent(window.location.hash.slice(1))
    if (isBack && !hash) return restoreScroll()
    if (!hash) {
      lenisRef.current?.scrollTo(0, { immediate: true })
      return
    }
    let cancelled = false
    const cancel = () => { cancelled = true }
    const go = () => {
      if (cancelled) return
      const el = document.getElementById(hash)
      if (!el) return
      const y = el.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(el).scrollMarginTop) || 0)
      if (lenisRef.current) lenisRef.current.scrollTo(y, { immediate: true, force: true })
      else window.scrollTo(0, y)
    }
    const events = ['wheel', 'touchstart', 'keydown'] as const
    events.forEach(e => window.addEventListener(e, cancel, { passive: true, once: true }))
    const timers = [0, 300, 800, 1600].map(ms => setTimeout(go, ms))
    return () => { timers.forEach(clearTimeout); events.forEach(e => window.removeEventListener(e, cancel)) }
  }, [pathname])

  return <>{children}</>
}
