'use client'

import { useTranslations } from 'next-intl'
import { useState } from 'react'

type Props = { locale: string }

const subjects = ['advisory', 'partnership', 'press', 'other'] as const

export default function ContactForm({ locale }: Props) {
  const t = useTranslations('contact.form')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, locale }),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      form.reset()
    } catch {
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex flex-col items-start justify-center gap-4 rounded-2xl border border-ag-apex/30 bg-ag-apex/5 p-10">
        <span className="font-sans font-semibold text-2xl text-ag-apex">✓</span>
        <p className="font-display text-xl font-bold text-ag-dark">{t('success.title')}</p>
        <p className="text-sm text-ag-gray">{t('success.desc')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
            {t('name')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-sm text-ag-dark placeholder-ag-gray-light outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10"
            placeholder="Jean Dupont"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-sm text-ag-dark placeholder-ag-gray-light outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10"
            placeholder="jean@entreprise.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
          {t('company')}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-sm text-ag-dark placeholder-ag-gray-light outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10"
          placeholder="Acme SA"
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
          {t('subject')}
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-sm text-ag-dark outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10"
        >
          <option value="" disabled className="text-ag-gray-light">
            {t('subjectPlaceholder')}
          </option>
          {subjects.map((s) => (
            <option key={s} value={s} className="bg-ag-off-white">
              {t(`subjects.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl border border-ag-border bg-white px-4 py-3 text-sm text-ag-dark placeholder-ag-gray-light outline-none transition-colors focus:border-ag-apex/60 focus:ring-2 focus:ring-ag-apex/10 resize-none"
          placeholder={t('messagePlaceholder')}
        />
      </div>

      {status === 'error' && (
        <p className="font-sans font-semibold text-xs text-red-400">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group flex items-center gap-3 rounded-full bg-ag-apex px-7 py-3.5 font-display text-sm font-bold text-ag-navy transition-all hover:bg-ag-navy hover:text-white disabled:opacity-50"
      >
        {status === 'sending' ? t('sending') : t('submit')}
        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </button>
    </form>
  )
}
