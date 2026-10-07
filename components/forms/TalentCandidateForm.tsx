'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations, useLocale } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Loader2, Upload } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'

const CYCLES = ['lancement', 'croissance', 'restructuration', 'acquisition', 'transmission'] as const
const FAMILIES = ['general', 'finance', 'operations', 'technology', 'hr', 'sales', 'other'] as const

const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.union([z.literal(''), z.string().regex(/^\+\d{1,3}\s\d/, 'Format invalide')]).optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  functionFamily: z.enum(FAMILIES).optional(),
  lifecycleCycle: z.enum(CYCLES).optional().or(z.literal('')),
  profileType: z.enum(['permanent', 'transition']).optional().or(z.literal('')),
  country: z.string().optional(),
  motivation: z.string().optional().or(z.literal('')),
  availability: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialité',
  }),
})

type CandidateFormData = z.infer<typeof candidateSchema>

const inputCls = 'w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors'
const labelCls = 'block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2'

export default function TalentCandidateForm() {
  const t = useTranslations('talent.forms.candidate')
  const locale = useLocale()
  const params = useSearchParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [cvUploading, setCvUploading] = useState(false)
  const [cvState, setCvState] = useState<{ path: string; filename: string } | null>(null)
  const [cvError, setCvError] = useState<string | null>(null)

  const prefillCycle = params.get('cycle')
  const prefillType  = params.get('type')

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
    defaultValues: {
      lifecycleCycle: (CYCLES as readonly string[]).includes(prefillCycle ?? '') ? (prefillCycle as typeof CYCLES[number]) : undefined,
      profileType: prefillType === 'transition' ? 'transition' : undefined,
    },
  })

  /* Champs requis : bouton désactivé + rappel des champs manquants,
     jamais de message d'erreur en premier écran */
  const [wName, wEmail, wConsent] = watch(['fullName', 'email', 'gdprConsent'])
  const missing: string[] = []
  if (!wName || wName.trim().length < 2) missing.push(t('fullName'))
  if (!wEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wEmail)) missing.push(t('email'))
  if (!wConsent) missing.push(t('gdprShort'))
  const canSubmit = missing.length === 0

  async function handleCvChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setCvUploading(true)
    setCvError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/talent/candidate/cv', { method: 'POST', body: fd })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body?.error ?? 'upload_failed')
      setCvState({ path: body.path, filename: body.filename })
    } catch (err) {
      setCvError(err instanceof Error ? err.message : 'upload_failed')
      setCvState(null)
    } finally {
      setCvUploading(false)
    }
  }

  const onSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await fetch('/api/talent/candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          cvUrl: cvState?.path,
          cvFilename: cvState?.filename,
          locale,
        }),
      })

      if (!res.ok) throw new Error('Submission failed')

      setSubmitStatus('success')
      reset()
      setCvState(null)
    } catch (error) {
      console.error('Candidate form error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className={labelCls}>{t('fullName')} *</label>
          <input
            {...register('fullName')}
            type="text"
            className={inputCls}
            placeholder={t('fullNamePlaceholder')}
          />
          {errors.fullName && (
            <p className="mt-1 text-[12px] text-red-600">{errors.fullName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={labelCls}>{t('email')} *</label>
          <input
            {...register('email')}
            type="email"
            className={inputCls}
            placeholder={t('emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-[12px] text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className={labelCls}>{t('phone')}</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={errors.phone?.message}
              />
            )}
          />
        </div>

        {/* Country */}
        <div>
          <label className={labelCls}>{t('country')}</label>
          <input
            {...register('country')}
            type="text"
            className={inputCls}
            placeholder={t('countryPlaceholder')}
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className={labelCls}>{t('linkedin')}</label>
          <input
            {...register('linkedinUrl')}
            type="url"
            className={inputCls}
            placeholder={t('linkedinPlaceholder')}
          />
          {errors.linkedinUrl && (
            <p className="mt-1 text-[12px] text-red-600">{errors.linkedinUrl.message}</p>
          )}
        </div>

        {/* CV upload */}
        <div>
          <label className={labelCls}>{t('cvLabel')}</label>
          <label className={`${inputCls} flex items-center gap-3 cursor-pointer text-ag-gray`}>
            <Upload size={14} className="shrink-0" />
            <span className="truncate">
              {cvUploading ? t('cvUploading') : cvState ? cvState.filename : t('cvPlaceholder')}
            </span>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleCvChange}
              className="hidden"
            />
          </label>
          {cvError && <p className="mt-1 text-[12px] text-red-600">{t(`cvError_${cvError}` as never)}</p>}
        </div>

        {/* Function family */}
        <div>
          <label className={labelCls}>{t('functionFamily')}</label>
          <select {...register('functionFamily')} className={inputCls}>
            <option value="">{t('functionFamilyPlaceholder')}</option>
            {FAMILIES.map((f) => (
              <option key={f} value={f}>{t(`families.${f}`)}</option>
            ))}
          </select>
        </div>

        {/* Profile type */}
        <div>
          <label className={labelCls}>{t('profileType')}</label>
          <select {...register('profileType')} className={inputCls}>
            <option value="">{t('profileTypePlaceholder')}</option>
            <option value="permanent">{t('profilePermanent')}</option>
            <option value="transition">{t('profileTransition')}</option>
          </select>
        </div>

        {/* Lifecycle cycle */}
        <div>
          <label className={labelCls}>{t('lifecycleCycle')}</label>
          <select {...register('lifecycleCycle')} className={inputCls}>
            <option value="">{t('lifecycleCyclePlaceholder')}</option>
            {CYCLES.map((c) => (
              <option key={c} value={c}>{t(`cycles.${c}`)}</option>
            ))}
          </select>
        </div>

        {/* Availability */}
        <div>
          <label className={labelCls}>{t('availability')}</label>
          <input
            {...register('availability')}
            type="text"
            className={inputCls}
            placeholder={t('availabilityPlaceholder')}
          />
        </div>
      </div>

      {/* Message facultatif */}
      <div>
        <label className={labelCls}>{t('motivation')}</label>
        <textarea
          {...register('motivation')}
          rows={4}
          className={`${inputCls} resize-none`}
          placeholder={t('motivationPlaceholder')}
        />
      </div>

      {/* RGPD/LPD Consent */}
      <div className="flex items-start gap-3">
        <input
          {...register('gdprConsent')}
          type="checkbox"
          id="gdprConsent"
          className="mt-1 w-4 h-4 rounded border-ag-border text-ag-apex-ink focus:ring-ag-apex focus:ring-2"
        />
        <label htmlFor="gdprConsent" className="text-[13px] text-ag-gray leading-relaxed">
          {t('gdprConsent')}{' '}
          <a href="mailto:contact@boha-group.com" className="text-ag-apex-ink hover:underline">
            contact@boha-group.com
          </a>
          .
        </label>
      </div>
      {errors.gdprConsent && (
        <p className="mt-1 text-[12px] text-red-600">{errors.gdprConsent.message}</p>
      )}

      {/* Submit */}
      <div>
        {!canSubmit && (
          <p className="mb-3 font-sans text-[12px] text-ag-gray-light">
            {t('requiredHint')} {missing.join(' · ')}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !canSubmit}
          className="rounded-lg w-full md:w-auto inline-flex items-center justify-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white bg-ag-navy px-8 py-4 hover:bg-ag-apex hover:text-ag-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              {t('submitting')}
            </>
          ) : (
            t('submit')
          )}
        </button>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 text-[14px]">
          {t('successMessage')}
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-[14px]">
          {t('errorMessage')}
        </div>
      )}
    </form>
  )
}
