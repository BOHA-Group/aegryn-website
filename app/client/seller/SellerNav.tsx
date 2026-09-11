import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

type AssetSummary = { id: string; company_name: string | null }

export default async function SellerNav({
  unreadCount: _unreadCount,
  assets = [],
}: {
  unreadCount: number
  assets?: AssetSummary[]
}) {
  const t = await getTranslations('clientSpace')

  /* ── Lien Data Room dynamique ── */
  let dataRoomItems: NavGroup['items']
  if (assets.length === 0) {
    dataRoomItems = [
      { href: '/client/seller/actifs#data-room', label: 'Data Room', icon: 'FolderLock', disabled: true },
    ]
  } else if (assets.length === 1) {
    dataRoomItems = [
      { href: `/client/seller/actifs/${assets[0].id}/documents`, label: 'Data Room', icon: 'FolderOpen' },
    ]
  } else {
    dataRoomItems = assets.map(a => ({
      href:  `/client/seller/actifs/${a.id}/documents`,
      label: a.company_name ?? `Actif #${a.id.slice(0, 6)}`,
      icon:  'FolderOpen' as const,
    }))
  }

  const groups: NavGroup[] = [
    {
      label: t('navGroupOverview'),
      items: [
        { href: '/client/seller', label: t('navDashboard'), icon: 'LayoutDashboard', locked: true },
      ],
    },
    {
      label: t('navGroupFiles'),
      items: [
        { href: '/client/seller/actifs',       label: t('navAssets'),       icon: 'FileText',       locked: true },
        { href: '/client/seller/transactions', label: t('navTransactions'), icon: 'ArrowRightLeft', locked: true },
        ...dataRoomItems.map(i => ({ ...i, locked: true as const })),
      ],
    },
    {
      label: t('navGroupCompliance'),
      items: [
        { href: '/client/seller/kyc',      label: t('navKyc'),       icon: 'ShieldCheck', locked: true },
        { href: '/client/seller/nda-view', label: t('navSellerNda'), icon: 'FileText',    locked: true },
      ],
    },
    {
      label: t('navGroupAccount'),
      items: [
        { href: '/client/seller/notifications', label: t('navNotifications'), icon: 'Bell',       locked: true },
        { href: '/client/seller/account',       label: t('navMyAccount'),     icon: 'UserCircle' },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/seller" />
}
