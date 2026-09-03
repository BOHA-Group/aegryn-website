'use client'

import { useEffect, useRef, useState } from 'react'

interface Layer { key: string; title: string; desc: string }
interface Props { layers: Layer[]; verticalsLabel: string }

const META: Record<string, { color: string; tag: string }> = {
  governance: { color: '#C4A882', tag: 'Audit · RBAC · AI Act · NIS2' },
  knowledge:  { color: '#8B9EC4', tag: 'Graphe · Index sémantique' },
  ai:         { color: '#6EC6A0', tag: 'On-premise · Cloud CH/EU' },
  data:       { color: '#5B8AF0', tag: 'Ingestion · Normalisation' },
}

const ORDER = ['governance', 'knowledge', 'ai', 'data']
const VERTICALS = ['FinTech', 'HealthTech', 'PropTech', 'LegalTech', 'HRTech']

export function PlatformArchitectureDiagram({ layers, verticalsLabel }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [pulse, setPulse] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const sorted = ORDER.map(k => layers.find(l => l.key === k)).filter(Boolean) as Layer[]
  const display = sorted.length === 4 ? sorted : layers

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => setPulse(p => (p + 1) % display.length), 900)
    return () => clearInterval(id)
  }, [visible, display.length])

  return (
    <div ref={ref} className="flex justify-center py-6 select-none">
      <div className="w-full max-w-lg flex flex-col gap-0">

        {/* Apps banner */}
        <div
          className="border border-white/20 bg-white/5 px-4 py-2.5 text-center mb-1"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease' }}
        >
          <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/40">
            Applications métier — ContractAI · DataRoom · RiskEngine · Compliance
          </p>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-1">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <line x1="5" y1="0" x2="5" y2="10" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <polyline points="2,8 5,12 8,8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        {/* Layers */}
        {display.map((layer, i) => {
          const m = META[layer.key] ?? { color: '#888', tag: '' }
          const isOn = active === layer.key
          const isPulse = pulse === i
          return (
            <div key={layer.key} className="flex flex-col">
              <div
                className="relative border px-4 py-3 cursor-pointer transition-colors duration-200"
                style={{
                  borderColor: isPulse || isOn ? m.color + '90' : m.color + '35',
                  background: isOn ? m.color + '18' : isPulse ? m.color + '0D' : 'transparent',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(6px)',
                  transition: `opacity 0.4s ease ${i * 0.08}s, transform 0.4s ease ${i * 0.08}s, border-color 0.2s, background 0.2s`,
                }}
                onMouseEnter={() => setActive(layer.key)}
                onMouseLeave={() => setActive(null)}
              >
                {/* left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300"
                  style={{ background: m.color, opacity: isPulse || isOn ? 1 : 0.3, boxShadow: isPulse ? `0 0 6px ${m.color}` : 'none' }} />
                <div className="pl-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase font-semibold" style={{ color: m.color }}>
                      {layer.title}
                    </p>
                    <p className="font-mono text-[8px] text-white/35 mt-0.5">{m.tag}</p>
                  </div>
                  <p className="font-sans text-[11px] text-white/50 leading-relaxed text-right max-w-[240px] transition-opacity duration-200"
                    style={{ opacity: isOn ? 1 : 0.35 }}>
                    {layer.desc}
                  </p>
                </div>
              </div>

              {/* Dependency arrow between layers */}
              {i < display.length - 1 && (
                <div className="flex items-center gap-2 px-4 py-0.5">
                  <svg width="10" height="12" viewBox="0 0 10 12" className="shrink-0">
                    <line x1="5" y1="0" x2="5" y2="8" stroke={m.color} strokeWidth="1"
                      strokeOpacity={isPulse ? 0.9 : 0.25}/>
                    <polyline points="2,6 5,10 8,6" stroke={m.color} strokeWidth="1" fill="none"
                      strokeOpacity={isPulse ? 0.9 : 0.25}/>
                  </svg>
                  <span className="font-mono text-[7px] tracking-[0.08em] transition-opacity duration-300"
                    style={{ color: m.color, opacity: isPulse ? 0.7 : 0.2 }}>
                    {i === 0 ? 'encadre' : i === 1 ? 'enrichit' : 'traite'}
                  </span>
                </div>
              )}
            </div>
          )
        })}

        {/* Arrow down */}
        <div className="flex justify-center my-1">
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <line x1="5" y1="0" x2="5" y2="10" stroke="rgba(255,255,255,0.25)" strokeWidth="1"/>
            <polyline points="2,8 5,12 8,8" stroke="rgba(255,255,255,0.25)" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        {/* Verticals */}
        <div className="border border-white/15 bg-white/5 px-4 py-2.5"
          style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease 0.5s' }}>
          <p className="font-mono text-[7px] tracking-[0.2em] uppercase text-white/30 mb-1.5">{verticalsLabel}</p>
          <div className="flex gap-2 flex-wrap">
            {VERTICALS.map(v => (
              <span key={v} className="font-mono text-[8px] tracking-[0.12em] uppercase text-white/50">{v}</span>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
