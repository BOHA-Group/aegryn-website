'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type NavItem = {
  href:  string
  label: string
  icon:  LucideIcon
  badge?: number
}

export type NavGroup = {
  label:    string
  items:    NavItem[]
}

type Props = {
  groups:      NavGroup[]
  rootHref:    string
}

function NavLink({ item, rootHref }: { item: NavItem; rootHref: string }) {
  const pathname  = usePathname()
  const isActive  = item.href === rootHref
    ? pathname === item.href
    : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-sm transition-colors group ${
        isActive
          ? 'bg-white/10 text-white'
          : 'text-white/40 hover:text-white/75 hover:bg-white/5'
      }`}
    >
      <item.icon size={13} className="shrink-0" />
      <span className="font-sans text-[12px] flex-1 leading-tight">{item.label}</span>
      {item.badge != null && item.badge > 0 && (
        <span className="bg-ag-apex text-ag-navy font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      )}
    </Link>
  )
}

function NavGroupSection({ group, rootHref, defaultOpen }: {
  group:       NavGroup
  rootHref:    string
  defaultOpen: boolean
}) {
  const pathname = usePathname()
  const hasActive = group.items.some(it =>
    it.href === rootHref ? pathname === it.href : pathname.startsWith(it.href)
  )
  const [open, setOpen] = useState(defaultOpen || hasActive)

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-3 py-1.5 mb-0.5 group"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25 group-hover:text-white/45 transition-colors">
          {group.label}
        </span>
        <ChevronRight
          size={10}
          className={`text-white/20 group-hover:text-white/40 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-0.5">
          {group.items.map(item => (
            <NavLink key={item.href} item={item} rootHref={rootHref} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SideNav({ groups, rootHref }: Props) {
  return (
    <nav className="flex-1 px-3 py-4 flex flex-col gap-3 overflow-y-auto">
      {groups.map((group, i) => (
        <NavGroupSection
          key={group.label}
          group={group}
          rootHref={rootHref}
          defaultOpen={i === 0}
        />
      ))}
    </nav>
  )
}
