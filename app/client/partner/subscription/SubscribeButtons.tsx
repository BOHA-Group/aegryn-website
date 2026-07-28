'use client'

import { useState } from 'react'
import { CreditCard, Loader2 } from 'lucide-react'

export default function SubscribeButtons({ disabled: kycBlocked = false }: { disabled?: boolean }) {
  const [loading, setLoading] = useState<'monthly' | 'yearly' | null>(null)

  async function checkout(plan: 'monthly' | 'yearly') {
    setLoading(plan)
    try {
      const res = await fetch('/api/partner/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ plan }),
      })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(`Erreur : ${data.error ?? 'Une erreur est survenue.'}`)
        setLoading(null)
      }
    } catch {
      alert('Impossible de contacter le serveur de paiement.')
      setLoading(null)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Mensuel */}
      <button
        onClick={() => checkout('monthly')}
        disabled={loading !== null || kycBlocked}
        className="flex-1 flex items-center justify-between px-5 py-4 border-2 border-ag-navy text-ag-navy hover:bg-ag-navy hover:text-white transition-colors disabled:opacity-50 group"
      >
        <div className="text-left">
          <p className="font-sans font-semibold text-[14px]">Mensuel</p>
          <p className="font-mono text-[12px] opacity-70">89 CHF HT / mois</p>
        </div>
        {loading === 'monthly'
          ? <Loader2 size={16} className="animate-spin shrink-0" />
          : <CreditCard size={16} className="shrink-0 opacity-50 group-hover:opacity-100" />
        }
      </button>

      {/* Annuel */}
      <button
        onClick={() => checkout('yearly')}
        disabled={loading !== null || kycBlocked}
        className="flex-1 flex items-center justify-between px-5 py-4 border-2 border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors disabled:opacity-50 group relative"
      >
        <div className="text-left">
          <p className="font-sans font-semibold text-[14px]">Annuel</p>
          <p className="font-mono text-[12px] opacity-70">
            ~80 CHF HT / mois <span className="font-semibold">−10 %</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[9px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800 px-2 py-0.5 group-hover:bg-emerald-800 group-hover:text-emerald-100 transition-colors">
            Recommandé
          </span>
          {loading === 'yearly'
            ? <Loader2 size={16} className="animate-spin" />
            : <CreditCard size={16} className="opacity-50 group-hover:opacity-100" />
          }
        </div>
      </button>
    </div>
  )
}
