'use client'

import { useEffect, useRef } from 'react'
import { useAudio } from '@/components/providers/AudioProvider'

const TRACK_TITLE = 'Beyond the Clicks'
const APEX        = '#5ADDA4'

/* ── Vintage VU needle — driven by real audio amplitude ──────────── */
function VUNeedle({
  active,
  analyserRef,
}: {
  active:      boolean
  analyserRef: React.RefObject<AnalyserNode | null>
}) {
  const needleRef  = useRef<SVGLineElement>(null)
  const pivotRef   = useRef<SVGCircleElement>(null)
  const rafRef     = useRef<number>(0)
  const angleRef   = useRef(0)
  const velRef     = useRef(0)
  const dataRef    = useRef<Uint8Array<ArrayBuffer> | null>(null)

  useEffect(() => {
    cancelAnimationFrame(rafRef.current)

    if (!active) {
      const decay = () => {
        angleRef.current *= 0.88
        needleRef.current?.setAttribute('transform', `rotate(${angleRef.current},10,18)`)
        if (Math.abs(angleRef.current) > 0.1) rafRef.current = requestAnimationFrame(decay)
      }
      rafRef.current = requestAnimationFrame(decay)
      return () => cancelAnimationFrame(rafRef.current)
    }

    const animate = () => {
      const analyser = analyserRef.current
      let target = 0

      if (analyser) {
        if (!dataRef.current || dataRef.current.length !== analyser.frequencyBinCount) {
          dataRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount))
        }
        analyser.getByteFrequencyData(dataRef.current)
        let sum = 0
        const len = Math.min(dataRef.current.length, 64)
        for (let i = 0; i < len; i++) sum += dataRef.current[i]
        const rms = sum / len / 255
        target = rms * 52 - 26
      } else {
        /* Fallback organic animation when analyser unavailable */
        velRef.current += 0.07
        target = Math.sin(velRef.current * 1.3) * 28 + Math.sin(velRef.current * 3.7) * 6
      }

      const spring = analyserRef.current ? 0.22 : 0.18
      const damp   = analyserRef.current ? 0.68 : 0.72
      velRef.current  = analyserRef.current
        ? (target - angleRef.current) * spring
        : velRef.current + (target - angleRef.current) * spring
      if (analyserRef.current) velRef.current *= damp
      else velRef.current *= damp
      angleRef.current += velRef.current

      needleRef.current?.setAttribute('transform', `rotate(${angleRef.current},10,18)`)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, analyserRef])

  return (
    <svg width="18" height="14" viewBox="0 0 20 18" aria-hidden="true" className="shrink-0">
      <path d="M2 17 A9 9 0 0 1 18 17" fill="none" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round"/>
      {[-40,-20,0,20,40].map((deg, i) => {
        const rad = (deg - 90) * Math.PI / 180
        return <line key={i}
          x1={10 + 8.2 * Math.cos(rad)} y1={18 + 8.2 * Math.sin(rad)}
          x2={10 + 9.5 * Math.cos(rad)} y2={18 + 9.5 * Math.sin(rad)}
          stroke="#94A3B8" strokeWidth="0.7"/>
      })}
      <line ref={needleRef} x1="10" y1="18" x2="10" y2="5"
        stroke={active ? APEX : '#94A3B8'} strokeWidth="1.4" strokeLinecap="round"
        style={{ transition: active ? 'none' : 'stroke 0.4s' }}/>
      <circle ref={pivotRef} cx="10" cy="18" r="1.6"
        fill={active ? APEX : '#94A3B8'} style={{ transition: 'fill 0.4s' }}/>
    </svg>
  )
}

/* ── Scrolling title ────────────────────────────────────────────── */
function ScrollingTitle({ text, active }: { text: string; active: boolean }) {
  return (
    <div className="overflow-hidden w-[72px] shrink-0"
      style={{ maskImage: 'linear-gradient(to right, transparent, black 12%, black 88%, transparent)' }}>
      <div
        className={[
          'flex gap-6 whitespace-nowrap font-sans font-semibold text-[8px] tracking-[0.14em] uppercase',
          active ? 'text-ag-black' : 'text-ag-gray',
        ].join(' ')}
        style={{ animation: active ? 'ag-marquee 8s linear infinite' : 'none' }}
      >
        <span>{text}</span>
        <span aria-hidden="true">{text}</span>
      </div>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────────────── */
export function MusicPlayer() {
  const {
    playing, muted, volume, ready,
    analyserRef, togglePlay, toggleMute, restart, handleVolume,
  } = useAudio()

  return (
    <>
      <style>{`
        @keyframes ag-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .ag-vol::-webkit-slider-thumb { appearance: none; width: 8px; height: 8px; border-radius: 50%; background: ${APEX}; cursor: pointer; }
        .ag-vol::-moz-range-thumb { width: 8px; height: 8px; border-radius: 50%; background: ${APEX}; border: none; cursor: pointer; }
        .ag-vol { accent-color: ${APEX}; }
      `}</style>

      <div className="flex items-center gap-1.5" aria-label="Lecteur musique ambiant" title={TRACK_TITLE}>

        {/* VU meter needle — audio-reactive */}
        <VUNeedle active={playing && !muted} analyserRef={analyserRef} />

        {/* Scrolling track name */}
        <ScrollingTitle text={TRACK_TITLE} active={playing} />

        {/* Volume slider */}
        <input
          type="range"
          min="0" max="1" step="0.02"
          value={volume}
          onChange={handleVolume}
          disabled={!ready}
          aria-label="Volume"
          className="ag-vol w-12 h-0.5 appearance-none bg-ag-border rounded-full outline-none cursor-pointer disabled:opacity-30"
          style={{ accentColor: APEX }}
        />

        {/* Restart */}
        <button onClick={restart} disabled={!ready} aria-label="Recommencer"
          className="w-5 h-5 flex items-center justify-center text-ag-gray hover:text-ag-black disabled:opacity-30 transition-colors">
          <svg width="9" height="9" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
            <rect x="0" y="1" width="2" height="10" rx="0.5"/>
            <polygon points="11,1 4,6 11,11"/>
          </svg>
        </button>

        {/* Play / Pause */}
        <button onClick={togglePlay} disabled={!ready} aria-label={playing ? 'Pause' : 'Lecture'}
          className={[
            'w-6 h-6 flex items-center justify-center border transition-all duration-200',
            playing ? 'border-ag-black bg-ag-black text-white' : 'border-ag-border text-ag-gray hover:border-ag-black hover:text-ag-black',
            !ready ? 'opacity-30 cursor-not-allowed' : '',
          ].join(' ')}>
          {playing ? (
            <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor" aria-hidden="true">
              <rect x="0.5" y="0.5" width="2.5" height="8" rx="0.4"/>
              <rect x="5" y="0.5" width="2.5" height="8" rx="0.4"/>
            </svg>
          ) : (
            <svg width="8" height="9" viewBox="0 0 8 9" fill="currentColor" aria-hidden="true" className="translate-x-px">
              <polygon points="1,0.5 7.5,4.5 1,8.5"/>
            </svg>
          )}
        </button>

        {/* Mute toggle */}
        <button onClick={toggleMute} disabled={!ready} aria-label={muted ? 'Activer le son' : 'Couper le son'}
          className="w-5 h-5 flex items-center justify-center text-ag-gray hover:text-ag-black disabled:opacity-30 transition-colors">
          {muted ? (
            <svg width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
              <polygon points="1,4 5,4 9,1 9,13 5,10 1,10" fill="currentColor" stroke="none"/>
              <line x1="11" y1="4" x2="13" y2="10"/><line x1="13" y1="4" x2="11" y2="10"/>
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
