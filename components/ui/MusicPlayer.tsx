'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { Play, Pause, SkipBack, Volume2, VolumeX }  from 'lucide-react'

const AUDIO_SRC      = '/audio/ambient.mp3'
const STORAGE_KEY    = 'ag-music-playing'

/**
 * Player musique ambiant discret — inséré dans la navbar.
 * - Mute par défaut (volume 0), état play mémorisé dans sessionStorage
 * - Persiste entre navigations Next.js (composant monté dans layout)
 * - Fonctions : play/pause · restart · mute/unmute
 * - Loop automatique à la fin du morceau
 */
export function MusicPlayer() {
  const audioRef        = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying]   = useState(false)
  const [muted,   setMuted]     = useState(true)
  const [ready,   setReady]     = useState(false)
  const [progress, setProgress] = useState(0) // 0-100

  /* ── Init audio element (once) ─────────────────────────────── */
  useEffect(() => {
    const audio       = new Audio(AUDIO_SRC)
    audio.loop        = true
    audio.volume      = 0.55
    audio.muted       = true
    audio.preload     = 'metadata'
    audioRef.current  = audio

    audio.addEventListener('canplaythrough', () => setReady(true))
    audio.addEventListener('timeupdate', () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100)
    })

    /* Restore session state */
    const wasPlaying = sessionStorage.getItem(STORAGE_KEY) === 'true'
    if (wasPlaying) {
      audio.muted = false
      setMuted(false)
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  /* ── Controls ───────────────────────────────────────────────── */
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
    if (!playing) {
      audio.muted = muted
      audio.play().then(() => {
        setPlaying(true)
        sessionStorage.setItem(STORAGE_KEY, 'true')
      }).catch(() => {})
    }
  }, [playing, muted])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = !muted
    audio.muted = next
    setMuted(next)
  }, [muted])

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <div className="flex items-center gap-1" aria-label="Lecteur musique ambiant">
      {/* Progress bar — thin line under buttons */}
      <div className="relative flex items-center gap-1">

        {/* Restart */}
        <button
          onClick={restart}
          disabled={!ready}
          aria-label="Recommencer"
          className="w-6 h-6 flex items-center justify-center text-ag-gray hover:text-ag-black disabled:opacity-30 transition-colors"
        >
          <SkipBack size={11} strokeWidth={2} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          disabled={!ready}
          aria-label={playing ? 'Pause' : 'Lecture'}
          className={[
            'w-7 h-7 flex items-center justify-center border transition-all duration-200',
            playing
              ? 'border-ag-black bg-ag-black text-white hover:bg-ag-apex hover:border-ag-apex hover:text-ag-navy'
              : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black',
            !ready ? 'opacity-40 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {playing
            ? <Pause size={11} strokeWidth={2} />
            : <Play  size={11} strokeWidth={2} className="translate-x-px" />
          }
        </button>

        {/* Mute / Unmute */}
        <button
          onClick={toggleMute}
          disabled={!ready}
          aria-label={muted ? 'Activer le son' : 'Couper le son'}
          className="w-6 h-6 flex items-center justify-center text-ag-gray hover:text-ag-black disabled:opacity-30 transition-colors"
        >
          {muted
            ? <VolumeX size={11} strokeWidth={2} />
            : <Volume2 size={11} strokeWidth={2} />
          }
        </button>
      </div>

      {/* Mini progress bar */}
      {playing && (
        <div className="w-10 h-px bg-ag-border overflow-hidden rounded-full hidden sm:block">
          <div
            className="h-full bg-ag-apex transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  )
}
