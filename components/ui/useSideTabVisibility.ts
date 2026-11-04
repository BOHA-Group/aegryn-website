'use client'

import { useEffect, useState } from 'react'

/**
 * Visibilité d'un onglet fixé au bord droit : « within » = face à la section `targetId` ;
 * « from » = à partir de la section `targetId` jusqu'au pied de page.
 */
export function useSideTabVisibility(targetId: string, mode: 'within' | 'from') {
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const target = document.getElementById(targetId)
    if (!target) return
    if (mode === 'within') {
      const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), { rootMargin: '-15% 0px -15% 0px' })
      io.observe(target)
      return () => io.disconnect()
    }
    let pastStart = false
    let footerVisible = false
    const update = () => setShown(pastStart && !footerVisible)
    const onScroll = () => { pastStart = target.getBoundingClientRect().top <= window.innerHeight * 0.5; update() }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    const footer = document.querySelector('footer')
    const io = footer ? new IntersectionObserver(([e]) => { footerVisible = e.isIntersecting; update() }) : null
    if (footer && io) io.observe(footer)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); io?.disconnect() }
  }, [targetId, mode])

  return shown
}
