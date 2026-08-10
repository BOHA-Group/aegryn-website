'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

export default function DeleteAccountSection() {
  const t = useTranslations('clientArea.account')
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')

  async function handleDelete() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/client/delete-account', { method: 'POST' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || t('deleteAccountErrorGeneric'))
        setLoading(false)
        return
      }
      window.location.assign('/client/login')
    } catch {
      setError(t('deleteAccountErrorNetwork'))
      setLoading(false)
    }
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="font-mono text-[10px] uppercase tracking-widest text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 transition-colors"
      >
        {t('deleteAccountButton')}
      </button>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 p-4">
      {error && <p className="font-sans text-[12px] text-red-600 mb-3">{error}</p>}
      <p className="font-sans text-[12px] text-red-700 mb-4">
        {t('deleteAccountWarning')}
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? t('deleteAccountConfirming') : t('deleteAccountConfirm')}
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="border border-gray-300 text-gray-600 font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 hover:border-gray-500 transition-colors disabled:opacity-50"
        >
          {t('deleteAccountCancel')}
        </button>
      </div>
    </div>
  )
}
