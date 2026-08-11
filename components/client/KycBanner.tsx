'use client'

import Link from 'next/link'
import { ShieldCheck, ShieldAlert, ShieldX, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

type KycStatus = 'pending' | 'in_review' | 'approved' | 'rejected' | string | null | undefined

type Props = {
  kycStatus: KycStatus
  role: 'buyer' | 'seller' | 'partner'
  kycPath: string
}

export default function KycBanner({ kycStatus, role, kycPath }: Props) {
  const t = useTranslations('kyc')

  const approvedMsg =
    role === 'buyer'   ? t('approvedBuyer')
    : role === 'seller'  ? t('approvedSeller')
    : t('approvedPartner')

  if (kycStatus === 'approved') {
    return (
      <div className="flex items-center gap-3 bg-emerald-50 border-b border-emerald-200 px-6 py-3">
        <ShieldCheck size={15} className="text-emerald-600 shrink-0" />
        <p className="font-sans text-[12px] text-emerald-800 flex-1">
          <strong>{t('approvedTitle')}</strong>{' '}{approvedMsg}
        </p>
      </div>
    )
  }

  if (kycStatus === 'in_review') {
    return (
      <div className="flex items-center gap-3 bg-blue-50 border-b border-blue-200 px-6 py-3">
        <Clock size={15} className="text-blue-500 shrink-0" />
        <p className="font-sans text-[12px] text-blue-800 flex-1">
          <strong>{t('inReviewTitle')}</strong>{' '}{t('inReviewDesc')}
        </p>
      </div>
    )
  }

  if (kycStatus === 'rejected') {
    return (
      <div className="flex items-center justify-between gap-3 bg-red-50 border-b border-red-200 px-6 py-3">
        <div className="flex items-center gap-3">
          <ShieldX size={15} className="text-red-500 shrink-0" />
          <p className="font-sans text-[12px] text-red-800">
            <strong>{t('rejectedTitle')}</strong>{' '}{t('rejectedDesc')}
          </p>
        </div>
        <Link href={kycPath}
          className="font-mono text-[9px] uppercase tracking-widest text-red-600 border border-red-300 px-3 py-1.5 hover:bg-red-100 transition-colors shrink-0">
          {t('rejectedCta')}
        </Link>
      </div>
    )
  }

  const reason =
    role === 'buyer'   ? t('pendingBuyer')
    : role === 'seller'  ? t('pendingSeller')
    : t('pendingPartner')

  return (
    <div className="flex items-center justify-between gap-3 bg-amber-50 border-b border-amber-300 px-6 py-3">
      <div className="flex items-center gap-3">
        <ShieldAlert size={15} className="text-amber-600 shrink-0" />
        <p className="font-sans text-[12px] text-amber-900">
          <strong>{t('pendingTitle')}</strong>{' '}{reason}{' '}{t('pendingSuffix')}
        </p>
      </div>
      <Link href={kycPath}
        className="font-mono text-[9px] uppercase tracking-widest text-amber-700 border border-amber-400 px-3 py-1.5 hover:bg-amber-100 transition-colors shrink-0">
        {t('pendingCta')}
      </Link>
    </div>
  )
}
