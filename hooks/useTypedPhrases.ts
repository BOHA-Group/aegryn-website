'use client'

import { useEffect, useState } from 'react'

type Options = {
  /** Home hero: budget the reading pauses to the video, then await restart(). */
  videoMs?: number
  /** Boutique hero: loop the titles independently of the two-beat video cuts. */
  loop?: boolean
  pauseMs?: number
  enabled?: boolean
}

/** Shared home/Boutique typewriter: type, read, erase, then advance. */
export function useTypedPhrases(phrases: readonly string[], { videoMs, loop = false, pauseMs = 3500, enabled = true }: Options = {}) {
  const [text, setText] = useState('')
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!enabled || !phrases.length) { setText(''); return }
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let timer: ReturnType<typeof setTimeout> | undefined
    const start = () => {
      clearTimeout(timer)
      if (reduced.matches) { setText(phrases[0]); return }
      setText('')
      const START = 600, DEL = 35, GAP = 250
      const fixed = START + phrases.reduce((total, phrase, i) =>
        total + phrase.length * 100 + (i < phrases.length - 1 ? phrase.length * DEL + GAP : 0), 0)
      const pause = videoMs && Number.isFinite(videoMs)
        ? Math.max(600, (videoMs - fixed) / phrases.length)
        : pauseMs
      let phrase = 0, char = 0, deleting = false
      const tick = () => {
        const current = phrases[phrase]
        if (!deleting) {
          char++
          setText(current.slice(0, char))
          if (char === current.length) {
            if (phrase === phrases.length - 1 && !loop) return
            deleting = true
            timer = setTimeout(tick, pause)
            return
          }
          timer = setTimeout(tick, 85 + Math.random() * 30)
        } else {
          char--
          setText(current.slice(0, char))
          if (char === 0) {
            deleting = false
            phrase = (phrase + 1) % phrases.length
            timer = setTimeout(tick, GAP)
            return
          }
          timer = setTimeout(tick, DEL)
        }
      }
      timer = setTimeout(tick, START)
    }
    start()
    reduced.addEventListener('change', start)
    return () => {
      clearTimeout(timer)
      reduced.removeEventListener('change', start)
    }
  }, [phrases, cycle, videoMs, loop, pauseMs, enabled])

  return { text, restart: () => setCycle(c => c + 1) }
}
