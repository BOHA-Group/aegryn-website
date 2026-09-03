'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  ShieldCheck,
  Star,
  FolderOpen,
  Newspaper,
  Lock,
  type LucideIcon,
} from 'lucide-react'

/* Sections activables par permission */
const SECTIONS: {
  permission: string | null   // null = toujours visible (tableau de bord)
  href: string
  label: string
  icon: LucideIcon
}[] = [
  { permission: null,                    href: '/client/internal',          label: 'Tableau de bord',       icon: LayoutDashboard },
  { permission: 'catalog.manage_access', href: '/client/internal/catalog',  label: 'Accès catalogue',       icon: BookOpen        },
  { permission: 'kyc.review',            href: '/client/internal/kyc',      label: 'Revue KYC',             icon: ShieldCheck     },
  { permission: 'grading.review',        href: '/client/internal/grading',  label: 'Revue grading',         icon: Star            },
  { permission: 'dataroom.manage',       href: '/client/internal/dataroom', label: 'Data room',             icon: FolderOpen      },
  { permission: 'magazine.publish',      href: '/client/internal/magazine', label: 'Magazine',              icon: Newspaper       },
]

export default function InternalNav({ permissions }: { permissions: string[] }) {
  const pathname = usePathname()

  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
      {SECTIONS.map(({ permission, href, label, icon: Icon }) => {
        const active   = permission === null
          ? pathname === href
          : pathname.startsWith(href)
        const unlocked = permission === null || permissions.includes(permission)

        if (!unlocked) {
          return (
            <div
              key={href}
              className="flex items-center gap-3 px-3 py-2.5 opacity-35 cursor-not-allowed select-none"
              title="Section non activée — contactez un administrateur"
            >
              <Lock size={13} className="text-white/30 shrink-0" />
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/30 truncate">
                {label}
              </span>
            </div>
          )
        }

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${
              active
                ? 'bg-white/10 text-white'
                : 'text-white/55 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon size={13} className="shrink-0" />
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] truncate">
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
