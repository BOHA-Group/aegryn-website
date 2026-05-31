'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

const AUDIO_SRC      = '/audio/ambient.mp3'
const STORAGE_KEY    = 'ag-music-playing'
const VOL_STORAGE    = 'ag-music-volume'
const DEFAULT_VOLUME = 0.8

interface AudioContextValue {
  playing:      boolean
  muted:        boolean
  volume:       number
  ready:        boolean
  analyserRef:  React.RefObject<AnalyserNode | null>
  togglePlay:   () => void
  toggleMute:   () => void
  restart:      () => void
  handleVolume: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef    = useRef<HTMLAudioElement | null>(null)
  const ctxRef      = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceRef   = useRef<MediaElementAudioSourceNode | null>(null)
  const gainRef     = useRef<GainNode | null>(null)

  const [playing, setPlaying] = useState(false)
  const [muted,   setMuted]   = useState(false)
  const [ready,   setReady]   = useState(false)
  const [volume,  setVolume]  = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_VOLUME
    const stored = parseFloat(sessionStorage.getItem(VOL_STORAGE) ?? '')
    return isNaN(stored) ? DEFAULT_VOLUME : stored
  })

  const buildGraph = useCallback(() => {
    const audio = audioRef.current
    if (ctxRef.current || !audio) return
    try {
      const ctx      = new AudioContext()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 128
      analyser.smoothingTimeConstant = 0.75
      const gain = ctx.createGain()
      gain.gain.value = muted ? 0 : volume
      const source = ctx.createMediaElementSource(audio)
      source.connect(analyser)
      analyser.connect(gain)
      gain.connect(ctx.destination)
      ctxRef.current      = ctx
      analyserRef.current = analyser
      sourceRef.current   = source
      gainRef.current     = gain
      audio.volume        = 1
    } catch {
      /* WebAudio unavailable */
    }
  }, [muted, volume])

  /* Mount once — survives locale changes and page navigation */
  useEffect(() => {
    const audio      = new Audio(AUDIO_SRC)
    audio.loop       = true
    audio.volume     = volume
    audio.preload    = 'auto'
    audioRef.current = audio

    const markReady = () => setReady(true)
    audio.addEventListener('loadedmetadata', markReady)
    audio.addEventListener('canplay', markReady)

    const wasPlaying = sessionStorage.getItem(STORAGE_KEY) === 'true'
    if (wasPlaying) {
      buildGraph()
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }

    return () => {
      audio.removeEventListener('loadedmetadata', markReady)
      audio.removeEventListener('canplay', markReady)
      audio.pause()
      audio.src = ''
      ctxRef.current?.close()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      sessionStorage.setItem(STORAGE_KEY, 'false')
    } else {
      buildGraph()
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume()
      audio.play().then(() => {
        setPlaying(true)
        sessionStorage.setItem(STORAGE_KEY, 'true')
      }).catch(() => {})
    }
  }, [playing, buildGraph])

  const restart = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    buildGraph()
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume()
    audio.currentTime = 0
    audio.play().then(() => {
      setPlaying(true)
      sessionStorage.setItem(STORAGE_KEY, 'true')
    }).catch(() => {})
  }, [buildGraph])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    const next = !muted
    audio.muted = next
    if (gainRef.current) gainRef.current.gain.value = next ? 0 : volume
    setMuted(next)
  }, [muted, volume])

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    sessionStorage.setItem(VOL_STORAGE, String(val))
    const audio = audioRef.current
    if (!audio) return
    if (gainRef.current) {
      gainRef.current.gain.value = muted ? 0 : val
    } else {
      audio.volume = val
    }
    if (val > 0 && muted) {
      audio.muted = false
      setMuted(false)
    }
  }, [muted])

  return (
    <AudioCtx.Provider value={{
      playing, muted, volume, ready, analyserRef,
      togglePlay, toggleMute, restart, handleVolume,
    }}>
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider')
  return ctx
}
