'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'

export type PartnerLogo = {
  src: string
  alt: string
  href?: string
}

export const PARTNER_LOGOS: PartnerLogo[] = [
  { src: '/images/partners/partner-01-cofidex.png', alt: 'Cofidex' },
]

const LOGO_HEIGHT = 40
const GAP         = 64

export default function PartnersCarousel() {
  const trackRef    = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animRef     = useRef<gsap.core.Tween | null>(null)
  const [shouldAnimate, setShouldAnimate] = useState(false)

  useEffect(() => {
    const track     = trackRef.current
    const container = containerRef.current
    if (!track || !container) return

    const check = () => {
      const totalW = track.scrollWidth / 2
      setShouldAnimate(totalW > container.offsetWidth)
    }

    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    if (animRef.current) {
      animRef.current.kill()
      animRef.current = null
      gsap.set(track, { x: 0 })
    }

    if (!shouldAnimate) return

    const tileW = track.scrollWidth / 2

    animRef.current = gsap.fromTo(
      track,
      { x: 0 },
      {
        x: -tileW,
        duration: Math.max(tileW / 60, 12),
        ease: 'none',
        repeat: -1,
      },
    )

    return () => { animRef.current?.kill() }
  }, [shouldAnimate])

  const logos = PARTNER_LOGOS.map((p, i) => (
    <div
      key={i}
      className="shrink-0 flex items-center justify-center"
      style={{ paddingLeft: GAP / 2, paddingRight: GAP / 2 }}
    >
      {p.href ? (
        <a href={p.href} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity duration-200">
          <Image src={p.src} alt={p.alt} height={LOGO_HEIGHT} width={160} className="h-10 w-auto object-contain" />
        </a>
      ) : (
        <Image src={p.src} alt={p.alt} height={LOGO_HEIGHT} width={160} className="h-10 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity duration-200" />
      )}
    </div>
  ))

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center whitespace-nowrap will-change-transform"
      >
        {logos}
        {shouldAnimate && logos}
      </div>
    </div>
  )
}
