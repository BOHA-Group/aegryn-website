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
      <div className="flex flex-col items-start justify-center gap-4 rounded-2xl border border-aegryn-apex/30 bg-aegryn-apex/5 p-10">
        <span className="font-mono text-2xl text-aegryn-apex">✓</span>
        <p className="font-display text-xl font-bold text-aegryn-cream">{t('success.title')}</p>
        <p className="text-sm text-aegryn-cream2">{t('success.desc')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-aegryn-muted">
            {t('name')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border border-aegryn-border bg-white px-4 py-3 text-sm text-aegryn-cream placeholder-aegryn-muted outline-none transition-colors focus:border-aegryn-apex/60 focus:ring-2 focus:ring-aegryn-apex/10"
            placeholder="Jean Dupont"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-aegryn-muted">
            {t('email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-xl border border-aegryn-border bg-white px-4 py-3 text-sm text-aegryn-cream placeholder-aegryn-muted outline-none transition-colors focus:border-aegryn-apex/60 focus:ring-2 focus:ring-aegryn-apex/10"
            placeholder="jean@entreprise.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-aegryn-muted">
          {t('company')}
        </label>
        <input
          id="company"
          name="company"
          type="text"
          className="w-full rounded-xl border border-aegryn-border bg-white px-4 py-3 text-sm text-aegryn-cream placeholder-aegryn-muted outline-none transition-colors focus:border-aegryn-apex/60 focus:ring-2 focus:ring-aegryn-apex/10"
          placeholder="Acme SA"
        />
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-aegryn-muted">
          {t('subject')}
        </label>
        <select
          id="subject"
          name="subject"
          required
          className="w-full rounded-xl border border-aegryn-border bg-white px-4 py-3 text-sm text-aegryn-cream outline-none transition-colors focus:border-aegryn-apex/60 focus:ring-2 focus:ring-aegryn-apex/10"
        >
          <option value="" disabled className="text-aegryn-muted">
            {t('subjectPlaceholder')}
          </option>
          {subjects.map((s) => (
            <option key={s} value={s} className="bg-aegryn-bg2">
              {t(`subjects.${s}`)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block font-mono text-[10px] uppercase tracking-[0.2em] text-aegryn-muted">
          {t('message')}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full rounded-xl border border-aegryn-border bg-white px-4 py-3 text-sm text-aegryn-cream placeholder-aegryn-muted outline-none transition-colors focus:border-aegryn-apex/60 focus:ring-2 focus:ring-aegryn-apex/10 resize-none"
          placeholder={t('messagePlaceholder')}
        />
      </div>

      {status === 'error' && (
        <p className="font-mono text-xs text-red-400">{t('error')}</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="group flex items-center gap-3 rounded-full bg-aegryn-apex px-7 py-3.5 font-display text-sm font-bold text-aegryn-obsidian transition-all hover:bg-aegryn-obsidian hover:text-aegryn-white disabled:opacity-50"
      >
        {status === 'sending' ? t('sending') : t('submit')}
        <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
      </button>
    </form>
  )
}
