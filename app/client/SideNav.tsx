'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, Gavel, ArrowRightLeft, Receipt,
  ShieldCheck, Bell, UserCircle, Settings, FileText,
  Award, Users, DollarSign, Briefcase, BadgeCheck, CreditCard,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard, BookOpen, Gavel, ArrowRightLeft, Receipt,
  ShieldCheck, Bell, UserCircle, Settings, FileText,
  Award, Users, DollarSign, Briefcase, BadgeCheck, CreditCard,
}

export type NavItem = {
  href:   string
  label:  string
  icon:   string
  badge?: number
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

type Props = {
  groups:   NavGroup[]
  rootHref: string
}

function NavLink({ item, rootHref }: { item: NavItem; rootHref: string }) {
  const pathname = usePathname()
  const isActive = item.href === rootHref
    ? pathname === item.href
    : pathname.startsWith(item.href)

  const Icon = ICON_MAP[item.icon] ?? LayoutDashboard

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 px-3 py-2 transition-colors ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/45 hover:text-white/80 hover:bg-white/5'
      }`}
    >
      <Icon size={13} className="shrink-0" />
      <span className="font-sans text-[12px] flex-1 leading-tight">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="bg-ag-apex text-ag-navy font-mono font-bold text-[9px] px-1.5 py-0.5 min-w-[18px] text-center leading-none">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </Link>
  )
}

export default function SideNav({ groups, rootHref }: Props) {
  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-5 overflow-y-auto">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/20">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map(item => (
              <NavLink key={item.href} item={item} rootHref={rootHref} />
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}
