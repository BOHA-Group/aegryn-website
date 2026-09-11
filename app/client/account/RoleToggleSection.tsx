'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Briefcase, Loader2, Lock, ArrowUpRight } from 'lucide-react'

type SubRole = 'buyer' | 'seller'

type Props = {
  currentRoles: string[]
}

const SUB_ROLES: {
  value: SubRole
  label: string
  desc: string
  icon: React.ReactNode
  href: string
}[] = [
  {
    value: 'buyer',
    label: 'Espace Acquéreur',
    desc:  'Accès au pipeline d\'acquisition, offres, transactions et NDA.',
    icon:  <ShoppingBag size={16} />,
    href:  '/client/buyer',
  },
  {
    value: 'seller',
    label: 'Espace Cédant',
    desc:  'Gestion de vos actifs, mandats de cession et data room.',
    icon:  <Briefcase size={16} />,
    href:  '/client/seller',
  },
]

export default function RoleToggleSection({ currentRoles }: Props) {
  const router = useRouter()
  const [roles, setRoles]     = useState<string[]>(currentRoles)
  const [pending, setPending] = useState<SubRole | null>(null)
  const [error, setError]     = useState('')
  const [, startTransition]   = useTransition()

  async function toggle(role: SubRole, href: string) {
    if (pending) return
    setError('')

    if (roles.includes(role)) {
      /* Déjà actif → naviguer */
      router.push(href)
      return
    }

    /* Activer le sous-rôle via API */
    setPending(role)
    try {
      const res  = await fetch('/api/client/me/roles', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ role }),
      })
      const json = await res.json() as { roles?: string[]; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Erreur')
      setRoles(json.roles ?? roles)
      startTransition(() => router.push(href))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue.')
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-5 mt-6">
      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">
        Espaces de transaction
      </p>
      <p className="font-sans text-[12px] text-gray-400 mb-4 leading-relaxed">
        Activez les espaces Acquéreur ou Cédant si vous souhaitez accéder aux fonctionnalités de transaction. Ces espaces sont actuellement en configuration — les sections sont accessibles mais grisées.
      </p>

      {error && (
        <p className="rounded-lg font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {SUB_ROLES.map(({ value, label, desc, icon, href }) => {
          const active   = roles.includes(value)
          const loading  = pending === value

          return (
            <div
              key={value}
              className={`rounded-xl border px-4 py-4 flex items-start justify-between gap-4 transition-colors ${
                active
                  ? 'border-ag-navy/20 bg-ag-navy/2'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 shrink-0 ${active ? 'text-ag-navy' : 'text-gray-300'}`}>
                  {icon}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-sans font-semibold text-gray-900 text-[13px]">{label}</p>
                    {!active && (
                      <span className="flex items-center gap-1 font-mono text-[9px] text-gray-400 uppercase tracking-widest border border-gray-200 bg-gray-100 px-1.5 py-0.5 rounded">
                        <Lock size={8} /> Inactif
                      </span>
                    )}
                    {active && (
                      <span className="font-mono text-[9px] text-ag-apex bg-ag-navy px-1.5 py-0.5 uppercase tracking-widest rounded">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[12px] text-gray-500 mt-0.5">{desc}</p>
                </div>
              </div>

              <button
                onClick={() => toggle(value, href)}
                disabled={loading}
                className={`rounded-lg font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 shrink-0 flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                  active
                    ? 'text-ag-navy border border-ag-navy/30 hover:bg-ag-navy hover:text-white'
                    : 'text-white bg-ag-navy border border-ag-navy hover:bg-ag-black'
                }`}
              >
                {loading
                  ? <><Loader2 size={11} className="animate-spin" /> Activation…</>
                  : active
                    ? <><ArrowUpRight size={11} /> Accéder</>
                    : <>Activer</>
                }
              </button>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg mt-4 px-4 py-3 bg-gray-50 border border-gray-100">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          Les fonctionnalités des espaces Acquéreur et Cédant sont en cours de configuration. Les sections sont accessibles mais marquées comme "Prochainement disponible" jusqu'à ouverture complète.
        </p>
      </div>
    </div>
  )
}
