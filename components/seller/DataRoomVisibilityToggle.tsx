'use client'

import { useState, useTransition } from 'react'
import type { DataRoomVisibility } from '@/lib/dataRoom'
import { VISIBILITY_LABELS } from '@/lib/dataRoom'
import { useRouter } from 'next/navigation'

const OPTIONS: DataRoomVisibility[] = ['admin_only', 'assigned_partner', 'light_buyers', 'nda_buyers']

const DOT: Record<DataRoomVisibility, string> = {
  admin_only:       'bg-gray-300',
  assigned_partner: 'bg-amber-500',
  light_buyers:     'bg-indigo-400',
  nda_buyers:       'bg-emerald-500',
}

export function DataRoomVisibilityToggle({
  documentId,
  current,
  assetId: _assetId,
}: {
  documentId: string
  current: DataRoomVisibility
  assetId: string
}) {
  const [value, setValue] = useState<DataRoomVisibility>(current)
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleChange = (next: DataRoomVisibility) => {
    if (next === value) { setOpen(false); return }
    startTransition(async () => {
      const res = await fetch('/api/data-room/visibility', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId, visible_to: next }),
      })
      if (res.ok) {
        setValue(next)
        router.refresh()
      }
      setOpen(false)
    })
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={isPending}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-gray-500 border border-gray-200 px-2.5 py-1.5 hover:border-gray-400 hover:text-gray-800 transition-colors disabled:opacity-50"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${DOT[value]}`} />
        Visibilité
        <svg width="8" height="5" viewBox="0 0 8 5" fill="none" className="ml-0.5">
          <path d="M1 1l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-gray-200 shadow-lg w-64 py-1">
          {OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => handleChange(opt)}
              className={`w-full flex items-start gap-2.5 px-4 py-2.5 text-left text-[11px] hover:bg-gray-50 transition-colors ${
                value === opt ? 'font-semibold text-gray-900' : 'text-gray-600'
              }`}
            >
              <span className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full ${DOT[opt]}`} />
              <span className="leading-tight">{VISIBILITY_LABELS[opt]}</span>
              {value === opt && <span className="ml-auto text-emerald-600 text-[10px]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
