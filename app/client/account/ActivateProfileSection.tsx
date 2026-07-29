'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Briefcase, Users, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react'

type Role = 'buyer' | 'seller' | 'partner'

const PROFILES: {
  role: Role
  label: string
  desc: string
  kycNote: string
  icon: React.ReactNode
  href: string
}[] = [
  {
    role:    'buyer',
    label:   'Acquéreur',
    desc:    'Accédez au catalogue certifié, signez les NDAs et suivez vos offres.',
    kycNote: 'KYC : pièce d\'identité + justificatif domicile',
    icon:    <ShoppingBag size={16} />,
    href:    '/client/buyer',
  },
  {
    role:    'seller',
    label:   'Cédant',
    desc:    'Soumettez votre actif, suivez la certification et recevez des offres qualifiées.',
    kycNote: 'KYC : pièce d\'identité + justificatif domicile',
    icon:    <Briefcase size={16} />,
    href:    '/client/seller',
  },
  {
    role:    'partner',
    label:   'Partenaire',
    desc:    'Apporteur d\'affaires ou co-certificateur — accédez à l\'espace partenaire AEGRYN.',
    kycNote: 'KYC : pièce d\'identité + justificatif domicile + Kbis + assurance pro',
    icon:    <Users size={16} />,
    href:    '/client/partner',
  },
]

type Props = { currentRoles: string[] }

export default function ActivateProfileSection({ currentRoles }: Props) {
  const router = useRouter()
  const [roles, setRoles] = useState<string[]>(currentRoles)
  const [activating, setActivating] = useState<Role | null>(null)
  const [error, setError] = useState('')
  const [, startTransition] = useTransition()

  async function activate(role: Role, href: string) {
    if (roles.includes(role)) {
      router.push(href)
      return
    }
    setActivating(role)
    setError('')
    try {
      const res = await fetch('/api/client/me/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      })
      const json = await res.json() as { roles?: string[]; error?: string }
      if (!res.ok) throw new Error(json.error ?? 'Erreur')
      setRoles(json.roles ?? roles)
      startTransition(() => { router.push(href) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Impossible d\'activer ce profil')
    } finally {
      setActivating(null)
    }
  }

  const inactive = PROFILES.filter(p => !roles.includes(p.role))

  if (inactive.length === 0) return null

  return (
    <div className="bg-white border border-gray-200 p-5 mt-6">
      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Activer un profil supplémentaire</p>
      <p className="font-sans text-[12px] text-gray-400 mb-4">
        Chaque profil activé est accessible depuis le switcher dans votre espace client.
      </p>

      {error && (
        <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2 mb-4">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {inactive.map(({ role, label, desc, kycNote, icon, href }) => (
          <div key={role} className="border border-gray-200 px-4 py-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
              <div>
                <p className="font-sans font-semibold text-gray-900 text-[13px]">{label}</p>
                <p className="font-sans text-[12px] text-gray-500 mt-0.5">{desc}</p>
                <p className="font-mono text-[10px] text-gray-400 mt-1.5">{kycNote}</p>
              </div>
            </div>
            <button
              onClick={() => activate(role, href)}
              disabled={activating === role}
              className="font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 hover:bg-ag-navy hover:text-white transition-colors shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              {activating === role
                ? <><Loader2 size={11} className="animate-spin" /> Activation…</>
                : <><ArrowUpRight size={11} /> Activer</>
              }
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 px-4 py-3 bg-gray-50 border border-gray-100">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          Le KYC identité (pièce d&apos;identité + justificatif domicile) est commun à tous les profils —
          si déjà soumis, il reste valide. Des documents complémentaires peuvent être requis selon le profil activé.
        </p>
      </div>
    </div>
  )
}
