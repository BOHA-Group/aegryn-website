'use client'

import { useState } from 'react'

export default function RequestNda({ need, label, doneLabel }: { need: 'certification' | 'partner'; label: string; doneLabel: string }) {
  const [state, setState] = useState<'idle' | 'busy' | 'done' | 'error'>('idle')
  async function go() {
    setState('busy')
    const res = await fetch('/api/client/nda/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ need }) })
    setState(res.ok ? 'done' : 'error')
  }
  if (state === 'done') return <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">{doneLabel}</p>
  return (
    <div className="space-y-2">
      <button onClick={go} disabled={state === 'busy'} className="rounded-lg bg-ag-navy px-5 py-2.5 font-sans text-sm font-semibold text-white hover:bg-ag-black disabled:opacity-50">
        {state === 'busy' ? '...' : label}
      </button>
      {state === 'error' && <p className="text-[12px] text-red-600">La demande n’a pas pu être envoyée. Écrivez-nous à contact@boha-group.com.</p>}
    </div>
  )
}
