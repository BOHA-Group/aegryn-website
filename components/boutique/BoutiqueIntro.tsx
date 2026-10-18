'use client'

import Image from 'next/image'
import { useEffect, useId, useRef } from 'react'

// Pen centre-lines, clipped by the actual Covered By Your Grace glyphs.
// Bounds and advances come from the site's original font (1024 units/em).
const GLYPHS = [
  { c: 'L', x: 0, box: [28, 124, 413, 676], pen: 'M 12 5 L 14 94 Q 14 98 25 94 L 93 76' },
  { c: 'a', x: 447, box: [465, 225, 352, 575], pen: 'M 77 9 C 36 13 6 65 10 92 Q 19 105 71 31 L 78 10 L 92 95' },
  { c: 'B', x: 1256, box: [1278, 141, 476, 660], pen: 'M 11 6 L 15 95 M 9 28 Q 63 -6 67 15 Q 52 43 14 55 Q 79 22 93 43 Q 98 66 18 95' },
  { c: 'o', x: 1771, box: [1797, 365, 291, 436], pen: 'M 30 8 C 8 27 0 91 35 91 C 74 98 104 33 77 14 Q 50 -1 29 26' },
  { c: 'u', x: 2109, box: [2123, 328, 304, 512], pen: 'M 14 7 C 1 55 9 109 37 84 C 65 62 79 20 82 7 L 91 95' },
  { c: 't', x: 2459, box: [2475, 44, 416, 756], pen: 'M 30 4 L 38 96 M 8 55 L 94 40' },
  { c: 'i', x: 2900, box: [2914, 15, 145, 785], pen: 'M 37 31 L 63 95 M 34 5 L 38 6' },
  { c: 'q', x: 3073, box: [3095, 356, 346, 762], pen: 'M 72 5 C 25 5 -2 46 23 52 C 42 59 68 28 75 8 L 77 96' },
  { c: 'u', x: 3468, box: [3482, 328, 304, 512], pen: 'M 14 7 C 1 55 9 109 37 84 C 65 62 79 20 82 7 L 91 95' },
  { c: 'e', x: 3818, box: [3834, 335, 425, 461], pen: 'M 9 55 Q 97 20 64 9 Q 31 -1 14 83 Q 6 110 96 54' },
]

function penPath(box: number[], path: string) {
  let coordinate = 0
  return path.replace(/-?\d+/g, n => String(coordinate++ % 2 === 0 ? box[0] + +n * box[2] / 100 : box[1] + +n * box[3] / 100))
}

export function BoutiqueIntro({ getElapsed }: { getElapsed: () => number }) {
  const id = useId().replace(/:/g, '')
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    document.documentElement.classList.add('boutique-intro-open')
    const paths = ref.current!.querySelectorAll<SVGPathElement>('[data-ink]')
    const finishes = ref.current!.querySelectorAll<SVGRectElement>('[data-ink-finish]')
    const signature = ref.current!.querySelector<HTMLElement>('[data-signature]')!
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    const frame = () => {
      const time = getElapsed()
      paths.forEach((path, i) => {
        const progress = reduced.matches ? 1 : Math.min(1, Math.max(0, (time - .15 - i * .265) / .36))
        path.style.strokeDashoffset = String(1 - progress)
        path.style.visibility = progress > 0 ? 'visible' : 'hidden'
        finishes[i].style.opacity = String(Math.max(0, (progress - .9) / .1))
      })
      signature.style.opacity = String(Math.min(1, Math.max(0, (time - 3) / .55)))
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf); document.documentElement.classList.remove('boutique-intro-open') }
  }, [getElapsed])

  return (
    <div ref={ref} data-boutique-intro data-lenis-prevent translate="no" className="fixed inset-0 flex touch-none items-center justify-center bg-black text-white" style={{ zIndex: 2147483000 }}>
      <div className="flex w-[84vw] max-w-[700px] flex-col items-center gap-5">
        <svg viewBox="0 0 4320 1160" className="w-full overflow-visible" role="img" aria-label="La Boutique">
          <defs>
            {GLYPHS.map((g, i) => (
              <mask key={i} id={`${id}-${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width="4320" height="1160">
                <path data-ink d={penPath(g.box, g.pen)} fill="none" stroke="white" strokeWidth="150" strokeLinecap="round" strokeLinejoin="round" pathLength="1" style={{ strokeDasharray: 1, strokeDashoffset: 1, visibility: 'hidden' }} />
                <rect data-ink-finish x="0" y="0" width="4320" height="1160" fill="white" opacity="0" />
              </mask>
            ))}
          </defs>
          {GLYPHS.map((g, i) => (
            <text key={i} x={g.x} y="800" fill="white" mask={`url(#${id}-${i})`} style={{ fontFamily: "'Covered By Your Grace'", fontSize: 1024, fontWeight: 400 }}>{g.c}</text>
          ))}
        </svg>
        <div data-signature style={{ opacity: 0 }}>
          <Image src="/images/brand/logo-aegryn-navbar-white.png" alt="Aegryn" width={1024} height={751} className="h-auto w-16 sm:w-20" priority />
        </div>
      </div>
    </div>
  )
}
