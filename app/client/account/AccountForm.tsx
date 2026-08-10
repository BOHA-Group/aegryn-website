'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2, CheckCircle2, Eye, EyeOff } from 'lucide-react'

type Props = {
  userId: string
  currentName: string
  currentEmail: string
}

export default function AccountForm({ currentName, currentEmail }: Props) {
  const t = useTranslations('clientArea.account')
  const [name,     setName]     = useState(currentName)
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPwd,  setShowPwd]  = useState(false)

  const [loadingProfile,  setLoadingProfile]  = useState(false)
  const [loadingPassword, setLoadingPassword] = useState(false)
  const [successProfile,  setSuccessProfile]  = useState(false)
  const [successPassword, setSuccessPassword] = useState(false)
  const [errorProfile,    setErrorProfile]    = useState('')
  const [errorPassword,   setErrorPassword]   = useState('')

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault()
    setErrorProfile('')
    setSuccessProfile(false)
    if (!name.trim()) { setErrorProfile(t('errorNameEmpty')); return }

    setLoadingProfile(true)
    try {
      const res = await fetch('/api/client/account', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: name.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t('errorProfileUpdate'))
      setSuccessProfile(true)
      setTimeout(() => setSuccessProfile(false), 3000)
    } catch (err: unknown) {
      setErrorProfile(err instanceof Error ? err.message : t('errorUnexpected'))
    } finally {
      setLoadingProfile(false)
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault()
    setErrorPassword('')
    setSuccessPassword(false)
    if (password.length < 8) { setErrorPassword(t('errorPasswordTooShort')); return }
    if (password !== confirm) { setErrorPassword(t('errorPasswordMismatch')); return }

    setLoadingPassword(true)
    try {
      const res = await fetch('/api/client/account/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? t('errorPasswordUpdate'))
      setSuccessPassword(true)
      setPassword('')
      setConfirm('')
      setTimeout(() => setSuccessPassword(false), 3000)
    } catch (err: unknown) {
      setErrorPassword(err instanceof Error ? err.message : t('errorUnexpected'))
    } finally {
      setLoadingPassword(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Profil */}
      <div className="bg-white border border-gray-200 p-5">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">{t('personalInfo')}</p>
        <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">{t('fullNameLabel')}</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">{t('emailLabel')}</label>
            <input
              type="email"
              value={currentEmail}
              disabled
              className="w-full bg-gray-100 border border-gray-200 px-4 py-2.5 font-sans text-[13px] text-gray-400 cursor-not-allowed"
            />
            <p className="font-sans text-[10px] text-gray-400 mt-1">
              {t('emailChangeNotePrefix')} <a href="mailto:support@boha-group.com" className="text-ag-navy underline">support@boha-group.com</a>.
            </p>
          </div>

          {errorProfile && (
            <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">{errorProfile}</p>
          )}
          {successProfile && (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={14} />
              <span className="font-sans text-[12px]">{t('profileUpdated')}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loadingProfile}
              className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-black transition-colors disabled:opacity-50"
            >
              {loadingProfile && <Loader2 size={11} className="animate-spin" />}
              {t('save')}
            </button>
          </div>
        </form>
      </div>

      {/* Mot de passe */}
      <div className="bg-white border border-gray-200 p-5">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">{t('changePassword')}</p>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">{t('newPasswordLabel')}</label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t('newPasswordPlaceholder')}
                className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 pr-10 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
              />
              <button type="button" onClick={() => setShowPwd(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">{t('confirmPasswordLabel')}</label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
              className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
            />
          </div>

          {errorPassword && (
            <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">{errorPassword}</p>
          )}
          {successPassword && (
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 size={14} />
              <span className="font-sans text-[12px]">{t('passwordUpdated')}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loadingPassword}
              className="flex items-center gap-2 border border-gray-300 text-gray-700 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:border-gray-500 transition-colors disabled:opacity-50"
            >
              {loadingPassword && <Loader2 size={11} className="animate-spin" />}
              {t('changePassword')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
