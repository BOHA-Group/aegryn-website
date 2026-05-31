'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

const AUDIO_SRC   = '/audio/ambient.mp3'
const TRACK_TITLE = 'Beyond the Clicks'
const STORAGE_KEY = 'ag-music-playing'

/* ── Vintage VU needle SVG ──────────────────────────────────────── */
function VUNeedle({ active }: { active: boolean }) {
  const needleRef = useRef<SVGLineElement>(null)
  const rafRef    = useRef<number>(0)
  const angleRef  = useRef(0)
  const velRef    = useRef(0)

  useEffect(() => {
    if (!active) {
      cancelAnimationFrame(rafRef.current)
      /* Return needle smoothly to center */
      const decay = () => {
        angleRef.current *= 0.85
        if (needleRef.current) {
          needleRef.current.setAttribute(
            'transform',
            `rotate(${angleRef.current}, 10, 18)`,
          )
        }
        if (Math.abs(angleRef.current) > 0.1) rafRef.current = requestAnimationFrame(decay)
      }
      rafRef.current = requestAnimationFrame(decay)
      return () => cancelAnimationFrame(rafRef.current)
    }

    let t = 0
    const animate = () => {
      t += 0.07
      /* Organic oscillation: main swing + small flutter */
      const target = Math.sin(t * 1.3) * 28 + Math.sin(t * 3.7) * 6
      velRef.current  += (target - angleRef.current) * 0.18
      velRef.current  *= 0.72
      angleRef.current += velRef.current

      if (needleRef.current) {
        needleRef.current.setAttribute(
          'transform',
          `rotate(${angleRef.current}, 10, 18)`,
        )
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active])

  return (
    /* 20×20 viewBox — vintage semicircle meter */
    <svg
      width="18" height="14"
      viewBox="0 0 20 18"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Arc background */}
      <path
        d="M2 17 A9 9 0 0 1 18 17"
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Scale ticks */}
      {[-40,-20,0,20,40].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180
        const x1 = 10 + 8.2 * Math.cos(rad)
        const y1 = 18 + 8.2 * Math.sin(rad)
        const x2 = 10 + 9.5 * Math.cos(rad)
        const y2 = 18 + 9.5 * Math.sin(rad)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="#94A3B8" strokeWidth="0.7" />
        )
      })}
      {/* Needle */}
      <line
        ref={needleRef}
        x1="10" y1="18" x2="10" y2="5"
        stroke={active ? '#5ADDA4' : '#94A3B8'}
        strokeWidth="1.2"
        strokeLinecap="round"
        style={{ transition: active ? 'none' : 'stroke 0.4s' }}
      />
      {/* Pivot dot */}
      <circle cx="10" cy="18" r="1.4"
        fill={active ? '#5ADDA4' : '#94A3B8'}
        style={{ transition: 'fill 0.4s' }}
      />
    </svg>
  )
}

/* ── Scrolling title ────────────────────────────────────────────── */
function ScrollingTitle({ text, active }: { text: string; active: boolean }) {
  return (
    <div
      className="overflow-hidden w-[72px] shrink-0"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}
    >
      <div
        className={[
          'flex gap-6 whitespace-nowrap font-sans font-semibold text-[8px] tracking-[0.14em] uppercase',
          active ? 'text-ag-black' : 'text-ag-gray-light',
        ].join(' ')}
        style={{
          animation: active ? 'ag-marquee 8s linear infinite' : 'none',
        }}
      >
        <span>{text}</span>
        {/* duplicate for seamless loop */}
        <span aria-hidden="true">{text}</span>
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────── */
export function MusicPlayer() {
  const audioRef              = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [muted,   setMuted]   = useState(true)
  const [ready,   setReady]   = useState(false)

  useEffect(() => {
    const audio      = new Audio(AUDIO_SRC)
    audio.loop       = true
    audio.volume     = 0.55
    audio.muted      = true
    audio.preload    = 'metadata'
    audioRef.current = audio

    audio.addEventListener('canplaythrough', () => setReady(true))

    const wasPlaying = sessionStorage.getItem(STORAGE_KEY) === 'true'
    if (wasPlaying) {
      audio.muted = false
      setMuted(false)
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }

    return () => { audio.pause(); audio.src = '' }
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      sessionStorage.setItem(STORAGE_KEY, 'false')
    } else {
      audio.muted = muted
      audio.play().then(() => {
        setPlaying(true)
        sessionStorage.setItem(STORAGE_KEY, 'true')
      }).catch(() => {})
    }
  }, [playing, muted])

  const restart = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = 0
    audio.muted = muted
    audio.play().then(() => {
      setPlaying(true)
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }).catch(() => {})
  }, [muted])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = !muted
    audio.muted = next
    setMuted(next)
  }, [muted])

  return (
    <>
      {/* Keyframe injected once */}
      <style>{`
        @keyframes ag-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      <div
        className="flex items-center gap-1.5"
        aria-label="Lecteur musique ambiant"
        title={TRACK_TITLE}
      >
        {/* VU meter needle */}
        <VUNeedle active={playing && !muted} />

        {/* Scrolling track name */}
        <ScrollingTitle text={TRACK_TITLE} active={playing} />

        {/* ─ Controls ─ */}

        {/* Restart */}
        <button
          onClick={restart}
          disabled={!ready}
          aria-label="Recommencer"
          className="w-5 h-5 flex items-center justify-center text-ag-gray-light hover:text-ag-black disabled:opacity-25 transition-colors"
        >
          {/* ⏮ inline SVG — plus petit que lucide SkipBack */}
          <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect x="0" y="1" width="2" height="10" rx="0.5"/>
            <polygon points="11,1 4,6 11,11"/>
          </svg>
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={!ready}
          aria-label={playing ? 'Pause' : 'Lecture'}
          className={[
            'w-6 h-6 flex items-center justify-center border transition-all duration-200',
            playing
              ? 'border-ag-black bg-ag-black text-white'
              : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black',
            !ready ? 'opacity-30 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {playing ? (
            /* Pause bars */
            <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor" aria-hidden="true">
              <rect x="0.5" y="0.5" width="2.5" height="8" rx="0.4"/>
              <rect x="5" y="0.5" width="2.5" height="8" rx="0.4"/>
            </svg>
          ) : (
            /* Play triangle */
            <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor" aria-hidden="true" className="translate-x-px">
              <polygon points="1,0.5 7.5,4.5 1,8.5"/>
            </svg>
          )}
        </button>

        {/* Mute toggle */}
        <button
          onClick={toggleMute}
          disabled={!ready}
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
          className="w-5 h-5 flex items-center justify-center text-ag-gray-light hover:text-ag-black disabled:opacity-25 transition-colors"
        >
          {muted ? (
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
              <polygon points="1,4 5,4 9,1 9,13 5,10 1,10" fill="currentColor" stroke="none"/>
              <line x1="11" y1="4" x2="13" y2="10"/>
              <line x1="13" y1="4" x2="11" y2="10"/>
            </svg>
          ) : (
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
              <polygon points="1,4 5,4 9,1 9,13 5,10 1,10" fill="currentColor" stroke="none"/>
              <path d="M11 4 Q13.5 7 11 10"/>
            </svg>
          )}
        </button>
      </div>
    </>
  )
}
