'use client'

import { useState }              from 'react'
import { ArrowRight, Lock }      from 'lucide-react'
import type { AssetTeaser }      from '@/types/transaction'
import DossierRequestModal       from './DossierRequestModal'

const T = {
  ink:     '#0C0C0C',
  gold:    '#9C7A3C',
  grey900: '#1A1A1A',
  grey600: '#5C5C5C',
  paper:   '#FAF8F3',
  line:    '#D9D2C2',
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="text-[22px] sm:text-[26px] font-bold leading-none mb-1"
        style={{ fontFamily: 'Georgia, serif', color: T.ink }}
      >
        {value}
      </div>
      <div
        className="text-[10px] uppercase"
        style={{ color: T.grey600, letterSpacing: '0.07em', fontFamily: 'Arial, sans-serif' }}
      >
        {label}
      </div>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block text-[10px] font-bold uppercase px-2.5 py-1 rounded-sm mr-2 mb-2"
      style={{
        color:        T.gold,
        border:       `1px solid ${T.gold}`,
        letterSpacing:'0.06em',
        fontFamily:   'Arial, sans-serif',
      }}
    >
      {children}
    </span>
  )
}

interface Props {
  teaser:  AssetTeaser
  assetId: string
}

export default function AssetTeaserDocument({ teaser, assetId }: Props) {
  const [showModal, setShowModal] = useState(false)
  if (!teaser) return null

  const {
    lotNumber,
    name,
    tagline,
    catalogContext,
    pitch,
    stats,
    investmentNote,
    tags,
    recipientName,
  } = teaser

  return (
    <div
      className="w-full max-w-[640px] mx-auto rounded-sm overflow-hidden border"
      style={{ borderColor: T.line, backgroundColor: '#FFFFFF' }}
    >
      {/* Confidentiality banner */}
      <div
        className="flex items-center gap-2 px-6 py-2.5"
        style={{ backgroundColor: T.ink }}
      >
        <Lock size={11} color="#D9C9A3" strokeWidth={2} />
        <span
          className="text-[10px] font-bold uppercase"
          style={{ color: '#D9C9A3', letterSpacing: '0.12em', fontFamily: 'Arial, sans-serif' }}
        >
          Document confidentiel, usage personnel{recipientName ? ` · ${recipientName}` : ''}
        </span>
      </div>

      <div className="px-7 sm:px-9 pt-8 pb-9">
        {/* Header */}
        <p
          className="text-[10px] font-bold uppercase mb-2"
          style={{ color: T.gold, letterSpacing: '0.16em', fontFamily: 'Arial, sans-serif' }}
        >
          {catalogContext}
        </p>
        <p
          className="text-[16px] font-bold mb-0.5"
          style={{ fontFamily: 'Georgia, serif', color: T.grey600 }}
        >
          Lot N° {lotNumber}
        </p>
        <h1
          className="text-[42px] sm:text-[52px] font-bold leading-none mb-3"
          style={{ fontFamily: 'Georgia, serif', color: T.ink }}
        >
          {name}
        </h1>
        <p
          className="text-[15px] sm:text-[16px] italic mb-5"
          style={{ fontFamily: 'Georgia, serif', color: T.grey600 }}
        >
          {tagline}
        </p>

        {/* Gold rule */}
        <div className="border-t-2 mb-6" style={{ borderColor: T.gold, width: 56 }} />

        {/* Pitch */}
        <p
          className="mb-6 leading-[1.7]"
          style={{ fontFamily: 'Georgia, serif', fontSize: '16px', color: T.grey900 }}
        >
          {pitch}
        </p>

        {/* Tags */}
        <div className="mb-7">
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>

        {/* Stats grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-5 py-6 px-1 mb-6 rounded-sm"
          style={{ backgroundColor: T.paper }}
        >
          {stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>

        {/* Investment note */}
        <div
          className="px-5 py-4 mb-7 rounded-sm border-l-4"
          style={{ borderColor: T.gold, backgroundColor: T.paper }}
        >
          <p
            className="text-[10px] font-bold uppercase mb-1.5"
            style={{ color: T.gold, letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif' }}
          >
            Investissement de développement engagé
          </p>
          <p
            className="text-[15px] leading-[1.6]"
            style={{ fontFamily: 'Georgia, serif', color: T.ink }}
          >
            {investmentNote}
          </p>
        </div>

        {/* CTA */}
        {showModal && (
          <DossierRequestModal
            assetId={assetId}
            assetName={name}
            onClose={() => setShowModal(false)}
          />
        )}

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-sm transition-opacity hover:opacity-90"
          style={{ backgroundColor: T.ink }}
        >
          <span
            className="text-[12px] font-bold uppercase"
            style={{ color: '#FFFFFF', letterSpacing: '0.1em', fontFamily: 'Arial, sans-serif' }}
          >
            Demander le dossier complet
          </span>
          <ArrowRight size={14} color="#FFFFFF" strokeWidth={2} />
        </button>

        <p
          className="text-[11px] italic text-center mt-4"
          style={{ color: T.grey600, fontFamily: 'Arial, sans-serif' }}
        >
          Accès réservé aux acquéreurs qualifiés, justificatif de capacité financière requis.
        </p>
      </div>

      {/* Footer */}
      <div
        className="text-center py-4 border-t"
        style={{ borderColor: T.line, backgroundColor: T.paper }}
      >
        <p
          className="text-[10px] font-bold"
          style={{ color: T.ink, letterSpacing: '0.18em', fontFamily: 'Arial, sans-serif' }}
        >
          Aegryn TRANSACTION
        </p>
        <p
          className="text-[9px] mt-0.5"
          style={{ color: T.grey600, letterSpacing: '0.06em', fontFamily: 'Arial, sans-serif' }}
        >
          Genève · Suisse
        </p>
      </div>
    </div>
  )
}
