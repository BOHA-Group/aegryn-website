'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'

const hiringSchema = z.object({
  company: z.string().min(2, 'Company name required'),
  contactName: z.string().min(2, 'Contact name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(1, 'Téléphone requis').regex(/^\+\d{1,3}\s\d/, 'Format invalide').optional(),
  roleTitle: z.string().min(2, 'Role title required'),
  roleDescription: z.string().min(20, 'Role description too short (min 20 characters)'),
  location: z.string().min(2, 'Location required'),
  budgetAnnualChf: z.string().optional(),
  urgency: z.enum(['immediate', 'month', 'quarter', 'flexible']),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialité',
  }),
})

type HiringFormData = z.infer<typeof hiringSchema>

export default function TalentHiringForm() {
  const t = useTranslations('talent.forms.hiring')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<HiringFormData>({
    resolver: zodResolver(hiringSchema),
  })

  const onSubmit = async (data: HiringFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await fetch('/api/talent/hiring', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Submission failed')

      setSubmitStatus('success')
      reset()
    } catch (error) {
      console.error('Hiring form error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Company */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('company')} *
          </label>
          <input
            {...register('company')}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('companyPlaceholder')}
          />
          {errors.company && (
            <p className="mt-1 text-[12px] text-red-600">{errors.company.message}</p>
          )}
        </div>

        {/* Contact Name */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('contactName')} *
          </label>
          <input
            {...register('contactName')}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('contactNamePlaceholder')}
          />
          {errors.contactName && (
            <p className="mt-1 text-[12px] text-red-600">{errors.contactName.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('email')} *
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('emailPlaceholder')}
          />
          {errors.email && (
            <p className="mt-1 text-[12px] text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('phone')}
          </label>
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

        {/* Role Title */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('roleTitle')} *
          </label>
          <input
            {...register('roleTitle')}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('roleTitlePlaceholder')}
          />
          {errors.roleTitle && (
            <p className="mt-1 text-[12px] text-red-600">{errors.roleTitle.message}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('location')} *
          </label>
          <input
            {...register('location')}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('locationPlaceholder')}
          />
          {errors.location && (
            <p className="mt-1 text-[12px] text-red-600">{errors.location.message}</p>
          )}
        </div>

        {/* Budget */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('budget')}
          </label>
          <input
            {...register('budgetAnnualChf')}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('budgetPlaceholder')}
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('urgency')} *
          </label>
          <select
            {...register('urgency')}
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
          >
            <option value="immediate">{t('urgencyImmediate')}</option>
            <option value="month">{t('urgencyMonth')}</option>
            <option value="quarter">{t('urgencyQuarter')}</option>
            <option value="flexible">{t('urgencyFlexible')}</option>
          </select>
          {errors.urgency && (
            <p className="mt-1 text-[12px] text-red-600">{errors.urgency.message}</p>
          )}
        </div>
      </div>

      {/* Role Description */}
      <div>
        <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
          {t('roleDescription')} *
        </label>
        <textarea
          {...register('roleDescription')}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] resize-none transition-colors"
          placeholder={t('roleDescriptionPlaceholder')}
        />
        {errors.roleDescription && (
          <p className="mt-1 text-[12px] text-red-600">{errors.roleDescription.message}</p>
        )}
      </div>

      {/* RGPD/LPD Consent */}
      <div className="flex items-start gap-3">
        <input
          {...register('gdprConsent')}
          type="checkbox"
          id="gdprConsent"
          className="mt-1 w-4 h-4 rounded border-ag-border text-ag-apex focus:ring-ag-apex focus:ring-2"
        />
        <label htmlFor="gdprConsent" className="text-[13px] text-ag-gray leading-relaxed">
          {t('gdprConsent')}{' '}
          <a href="mailto:contact@boha-group.com" className="text-ag-apex hover:underline">
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
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto inline-flex items-center justify-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white bg-ag-navy px-8 py-4 hover:bg-ag-apex hover:text-ag-navy transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
