import type { Metadata }     from 'next'
import { redirect }          from 'next/navigation'
import { getUser }           from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Lock, BookOpen, ShieldCheck, Star, FolderOpen, Newspaper, type LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Espace interne — Aegryn',
  robots: { index: false, follow: false },
}

const SECTION_DEFS: {
  permission: string
  label: string
  desc: string
  icon: LucideIcon
  href: string
}[] = [
  { permission: 'catalog.manage_access', label: 'Accès catalogue',   desc: 'Valider et révoquer les accès qualifiés acquéreurs.',       icon: BookOpen,    href: '/client/internal/catalog'  },
  { permission: 'kyc.review',            label: 'Revue KYC',         desc: 'Instruire et valider les dossiers de vérification.',        icon: ShieldCheck, href: '/client/internal/kyc'      },
  { permission: 'grading.review',        label: 'Revue grading',     desc: 'Conduire des revues de notation CIFS en interne.',          icon: Star,        href: '/client/internal/grading'  },
  { permission: 'dataroom.manage',       label: 'Data room',         desc: 'Gérer les documents et accès aux data rooms des actifs.',   icon: FolderOpen,  href: '/client/internal/dataroom' },
  { permission: 'magazine.publish',      label: 'Magazine',          desc: 'Publier et programmer les numéros du magazine Aegryn.',     icon: Newspaper,   href: '/client/internal/magazine' },
]

export default async function InternalDashboardPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles')
    .eq('id', user.id)
    .single()

  const roles: string[] = Array.isArray(profile?.roles) ? profile.roles : []
  if (!roles.includes('internal')) redirect('/client/login')

  const { data: permsData } = await supa
    .from('user_admin_permissions')
    .select('permission_id')
    .eq('user_id', user.id)
  const permissions: string[] = (permsData ?? []).map((p: { permission_id: string }) => p.permission_id)

  const displayName = profile?.full_name ?? user.email ?? 'Collaborateur'
  const unlockedCount = SECTION_DEFS.filter(s => permissions.includes(s.permission)).length

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">Espace interne</p>
        <h1 className="font-sans font-bold text-ag-black text-[28px] tracking-tight mb-1">
          Bonjour, {displayName}
        </h1>
        <p className="font-sans text-[13px] text-gray-400">
          {unlockedCount === 0
            ? 'Aucune section activée pour le moment. Un administrateur peut vous attribuer des accès.'
            : `${unlockedCount} section${unlockedCount > 1 ? 's' : ''} activée${unlockedCount > 1 ? 's' : ''} sur ${SECTION_DEFS.length}.`
          }
        </p>
      </div>

      {/* Grille sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTION_DEFS.map(({ permission, label, desc, icon: Icon, href }) => {
          const unlocked = permissions.includes(permission)
          return (
            <div
              key={permission}
              className={`border p-6 flex flex-col gap-4 transition-colors ${
                unlocked
                  ? 'border-ag-border bg-white hover:border-ag-black/20 cursor-pointer'
                  : 'border-ag-border bg-gray-50 opacity-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <Icon size={20} className={unlocked ? 'text-ag-apex' : 'text-gray-300'} />
                {!unlocked && <Lock size={13} className="text-gray-300" />}
              </div>
              <div>
                <p className="font-sans font-semibold text-ag-black text-[15px] mb-1">{label}</p>
                <p className="font-sans text-[12px] text-gray-400 leading-relaxed">{desc}</p>
              </div>
              {unlocked ? (
                <a
                  href={href}
                  className="self-start font-mono text-[10px] uppercase tracking-[0.14em] text-ag-apex hover:underline"
                >
                  Accéder →
                </a>
              ) : (
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-gray-300">
                  Non activé
                </p>
              )}
            </div>
          )
        })}
      </div>

      {unlockedCount === 0 && (
        <div className="mt-10 border border-amber-200 bg-amber-50 p-6 max-w-lg">
          <p className="font-sans font-semibold text-[14px] text-amber-900 mb-1">
            Espace en attente d&apos;activation
          </p>
          <p className="font-sans text-[13px] text-amber-800 leading-relaxed">
            Votre compte est créé. Un administrateur Aegryn va configurer vos accès sous peu.
            Contactez votre référent si besoin.
          </p>
        </div>
      )}
    </div>
  )
}
