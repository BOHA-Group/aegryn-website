'use client'

import { Construction } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface ComingSoonBannerProps {
  section?: string
}

export function ComingSoonBanner({ section }: ComingSoonBannerProps) {
  const t = useTranslations('comingSoon')

  return (
    <div className="relative overflow-hidden border border-ag-apex/20 bg-ag-navy/5 rounded-sm p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <span className="shrink-0 w-10 h-10 flex items-center justify-center border border-ag-apex/40 bg-ag-apex/10 text-ag-apex">
        <Construction size={16} strokeWidth={1.75} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-[11px] tracking-[0.2em] uppercase text-ag-apex mb-1">
          {t('label')}
        </p>
        <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
          {section ? t('descSection', { section }) : t('desc')}
        </p>
      </div>
    </div>
  )
}
