'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { Check, Link2, Mail, MessageSquareText, Share2 } from 'lucide-react'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  WhatsAppIcon,
} from './socialIcons'

/* Glyph de partage aux couleurs Aegryn : nœuds noirs, pointe vert apex. */
function ShareGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8.7 12 15.2 7.6M8.7 12l6.5 4.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="6.5" cy="12" r="3.3" fill="currentColor" />
      <circle cx="17.4" cy="16.6" r="3.3" fill="currentColor" />
      <circle cx="17.4" cy="7.4" r="3.3" fill="#5ADDA4" />
    </svg>
  )
}

type Channel = { label: string; icon: ReactNode; href: string; external: boolean }

type Props = {
  url?: string      // URL partagée, défaut : page courante
  title?: string    // texte partagé, défaut : "Aegryn"
  variant?: 'light' | 'icon'
}

export function ShareMenu({ url, title, variant = 'light' }: Props) {
  const t = useTranslations('share')
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const pageUrl = () => url ?? window.location.href.split(/[?#]/)[0]
  const shareText = () => title ?? 'Aegryn'

  const channels = (): Channel[] => {
    const u = encodeURIComponent(pageUrl())
    const txt = encodeURIComponent(`${shareText()} ${pageUrl()}`)
    return [
      { label: 'LinkedIn',  icon: <LinkedInIcon size={16} />,  external: true,  href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
      { label: 'Instagram', icon: <InstagramIcon size={16} />, external: true,  href: 'https://www.instagram.com/aegrynhq/' },
      { label: 'TikTok',    icon: <TikTokIcon size={16} />,    external: true,  href: 'https://www.tiktok.com/@aegrynhq' },
      { label: 'Facebook',  icon: <FacebookIcon size={16} />,  external: true,  href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
      { label: t('email'),  icon: <Mail size={16} />,          external: false, href: `mailto:?subject=${encodeURIComponent(shareText())}&body=${u}` },
      { label: 'SMS',       icon: <MessageSquareText size={16} />, external: false, href: `sms:?&body=${txt}` },
      { label: 'WhatsApp',  icon: <WhatsAppIcon size={16} />,  external: true,  href: `https://wa.me/?text=${txt}` },
    ]
  }

  const nativeShare = () => {
    const data = { title: shareText(), url: pageUrl() }
    if (navigator.share) navigator.share(data).catch(() => {})
    setOpen(false)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl())
      setCopied(true)
      setTimeout(() => { setCopied(false); setOpen(false) }, 1400)
    } catch {
      setOpen(false)
    }
  }

  const hasNative = typeof navigator !== 'undefined' && !!navigator.share

  return (
    <div ref={ref} className="relative inline-block">
      {variant === 'icon' ? (
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-label={t('label')}
          aria-expanded={open}
          className="text-white/70 hover:text-ag-apex transition-colors duration-200"
        >
          <ShareGlyph size={18} />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          className="flex flex-col items-center gap-2.5 group"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-ag-border text-ag-black transition-colors duration-200 group-hover:border-ag-black">
            <ShareGlyph size={20} />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ag-apex-ink">
            {t('label')}
          </span>
        </button>
      )}

      {open && (
        <div className={`absolute bottom-full z-50 mb-3 w-52 rounded-2xl border border-ag-border bg-white p-1.5 shadow-xl ${variant === 'icon' ? 'left-0' : 'right-0'}`}>
          {hasNative && (
            <button
              type="button"
              onClick={nativeShare}
              className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium text-ag-black transition-colors hover:bg-ag-off-white"
            >
              <Share2 size={16} className="shrink-0 text-ag-apex-ink" />
              {t('via')}
            </button>
          )}
          {channels().map(c => (
            <a
              key={c.label}
              href={c.href}
              {...(c.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-medium text-ag-black transition-colors hover:bg-ag-off-white"
            >
              <span className="shrink-0 text-ag-black">{c.icon}</span>
              {c.label}
            </a>
          ))}
          <button
            type="button"
            onClick={copyLink}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-medium text-ag-black transition-colors hover:bg-ag-off-white"
          >
            {copied ? <Check size={16} className="shrink-0 text-ag-apex-ink" /> : <Link2 size={16} className="shrink-0" />}
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      )}
    </div>
  )
}
