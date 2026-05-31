import type { AssetStatus } from '@/data/assets'

/* ── Voyants lumineux ─────────────────────────────────────────────── */

export function LiveIndicator() {
  return (
    <span className="relative inline-flex items-center gap-2">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-emerald-400/30 animate-ping" />
      <span
        className="relative w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"
        style={{ boxShadow: '0 0 6px 2px rgba(52,211,153,0.65)' }}
      />
      <span className="font-sans font-semibold text-[10px] tracking-[0.16em] uppercase text-emerald-600">
        Live
      </span>
    </span>
  )
}

export function DevIndicator() {
  return (
    <span className="inline-flex items-center gap-2">
      {/* Harvey Ball demi — cercle avec demi gauche rempli */}
      <svg width="11" height="11" viewBox="0 0 11 11" className="shrink-0" aria-hidden="true">
        <circle cx="5.5" cy="5.5" r="4.8" fill="none" stroke="#f97316" strokeWidth="1.2" />
        <path d="M5.5 0.7 A4.8 4.8 0 0 0 5.5 10.3 Z" fill="#f97316" />
      </svg>
      <span className="font-sans font-semibold text-[10px] tracking-[0.16em] uppercase text-orange-500">
        En développement
      </span>
    </span>
  )
}

export function RestrictedIndicator() {
  return (
    <span className="relative inline-flex items-center gap-2">
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500/30 animate-ping" />
      <span
        className="relative w-2.5 h-2.5 rounded-full bg-red-500 shrink-0"
        style={{ boxShadow: '0 0 6px 2px rgba(239,68,68,0.60)' }}
      />
      <span className="font-sans font-semibold text-[10px] tracking-[0.16em] uppercase text-red-500">
        Restricted
      </span>
    </span>
  )
}

export function StatusIndicator({ status, isRestricted }: { status: AssetStatus; isRestricted?: boolean }) {
  if (isRestricted) return <RestrictedIndicator />
  if (status === 'live') return <LiveIndicator />
  return <DevIndicator />
}

/* ── Badge catégorie pill ─────────────────────────────────────────── */

const BADGE_STYLES: Record<string, string> = {
  'B2B':        'bg-violet-50  text-violet-700  border-violet-200',
  'B2C':        'bg-sky-50     text-sky-700     border-sky-200',
  'SaaS':       'bg-indigo-50  text-indigo-700  border-indigo-200',
  'Marketplace':'bg-amber-50   text-amber-700   border-amber-200',
  'Social':     'bg-pink-50    text-pink-700    border-pink-200',
  'Immobilier': 'bg-teal-50    text-teal-700    border-teal-200',
  'Livraison':  'bg-orange-50  text-orange-700  border-orange-200',
  'Protocole':  'bg-slate-100  text-slate-700   border-slate-300',
  'Blockchain': 'bg-slate-100  text-slate-700   border-slate-300',
}

export function BadgePill({ badge }: { badge: string }) {
  const parts = badge.split(/[\s—–\-]+/).filter(Boolean)
  return (
    <span className="flex flex-wrap gap-1.5">
      {parts.map((part) => {
        const key = Object.keys(BADGE_STYLES).find((k) =>
          part.toLowerCase().includes(k.toLowerCase()),
        )
        const cls = key ? BADGE_STYLES[key] : 'bg-gray-100 text-gray-600 border-gray-200'
        return (
          <span
            key={part}
            className={`inline-flex items-center border px-2 py-0.5 font-sans font-semibold text-[9px] tracking-[0.14em] uppercase rounded-sm ${cls}`}
          >
            {part}
          </span>
        )
      })}
    </span>
  )
}
