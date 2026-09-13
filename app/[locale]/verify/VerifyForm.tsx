'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Search } from 'lucide-react'

export default function VerifyForm({ initial = '' }: { initial?: string }) {
  const t      = useTranslations('verify')
  const locale = useLocale()
  const router = useRouter()
  const [code, setCode] = useState(initial)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const clean = code.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '')
    if (clean) router.push(`/${locale}/verify/${clean}`)
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-xl">
      <input
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder={t('placeholder')}
        aria-label={t('title')}
        className="flex-1 rounded-xl border border-ag-border bg-white px-5 py-4 font-mono text-[15px] tracking-[0.12em] uppercase text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-navy"
      />
      <button type="submit"
        className="rounded-xl inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[12px] tracking-[0.14em] uppercase px-8 py-4 hover:bg-ag-navy/90 transition-colors">
        <Search size={14} /> {t('cta')}
      </button>
    </form>
  )
}
