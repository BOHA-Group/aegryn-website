import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

interface Props {
  roles:        string[]
  unreadCount:  number
  rootHref:     string
}

export default async function AccountNav({ roles, unreadCount, rootHref }: Props) {
  const t = await getTranslations('clientSpace')

  /* Lien notifications selon le rôle principal */
  let notifHref = '/client/buyer/notifications'
  if (roles.includes('partner'))                           notifHref = '/client/partner/notifications'
  else if (roles.includes('seller') && !roles.includes('buyer')) notifHref = '/client/seller/notifications'

  /* Lien retour espace principal */
  const backItems = []
  if (roles.includes('buyer') || roles.includes('partner')) {
    backItems.push({ href: roles.includes('partner') ? '/client/partner' : '/client/buyer', label: t('navDashboard'), icon: 'LayoutDashboard' })
  } else if (roles.includes('seller')) {
    backItems.push({ href: '/client/seller', label: t('navDashboard'), icon: 'LayoutDashboard' })
  }

  const groups: NavGroup[] = [
    ...(backItems.length > 0 ? [{ label: t('navGroupOverview'), items: backItems }] : []),
    {
      label: t('navGroupAccount'),
      items: [
        { href: notifHref,              label: t('navNotifications'), icon: 'Bell',       badge: unreadCount },
        { href: '/client/account',      label: t('navMyAccount'),     icon: 'UserCircle' },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref={rootHref} />
}
