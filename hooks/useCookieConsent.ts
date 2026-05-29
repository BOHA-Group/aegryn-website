'use client'

import { useState, useEffect } from 'react'

export type ConsentStatus = 'pending' | 'accepted' | 'refused'

const STORAGE_KEY = 'ag_cookie_consent'

export function useCookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>('pending')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus | null
    if (stored === 'accepted' || stored === 'refused') {
      setStatus(stored)
    }
    setReady(true)
  }, [])

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setStatus('accepted')
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'denied',
      })
    }
  }

  const refuse = () => {
    localStorage.setItem(STORAGE_KEY, 'refused')
    setStatus('refused')
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied',
      })
    }
  }

  const reset = () => {
    localStorage.removeItem(STORAGE_KEY)
    setStatus('pending')
  }

  return { status, ready, accept, refuse, reset }
}
