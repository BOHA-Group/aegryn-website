'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import PhoneInput from '@/components/ui/PhoneInput'

const candidateSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(1, 'Téléphone requis').regex(/^\+\d{1,3}\s\d/, 'Format invalide').optional(),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  motivation: z.string().min(50, 'Motivation letter too short (min 50 characters)'),
  availability: z.string().optional(),
  gdprConsent: z.boolean().refine((val) => val === true, {
    message: 'Vous devez accepter la politique de confidentialité',
  }),
})

type CandidateFormData = z.infer<typeof candidateSchema>

export default function TalentCandidateForm() {
  const t = useTranslations('talent.forms.candidate')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CandidateFormData>({
    resolver: zodResolver(candidateSchema),
  })

  const onSubmit = async (data: CandidateFormData) => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const res = await fetch('/api/talent/candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) throw new Error('Submission failed')

      setSubmitStatus('success')
      reset()
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
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('fullName')} *
          </label>
          <input
            {...register('fullName')}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('fullNamePlaceholder')}
          />
          {errors.fullName && (
            <p className="mt-1 text-[12px] text-red-600">{errors.fullName.message}</p>
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

        {/* LinkedIn */}
        <div>
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('linkedin')}
          </label>
          <input
            {...register('linkedinUrl')}
            type="url"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('linkedinPlaceholder')}
          />
          {errors.linkedinUrl && (
            <p className="mt-1 text-[12px] text-red-600">{errors.linkedinUrl.message}</p>
          )}
        </div>

        {/* Availability */}
        <div className="md:col-span-2">
          <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
            {t('availability')}
          </label>
          <input
            {...register('availability')}
            type="text"
            className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] transition-colors"
            placeholder={t('availabilityPlaceholder')}
          />
        </div>
      </div>

      {/* Motivation */}
      <div>
        <label className="block font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-gray mb-2">
          {t('motivation')} *
        </label>
        <textarea
          {...register('motivation')}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border border-ag-border focus:border-ag-apex focus:outline-none text-[14px] resize-none transition-colors"
          placeholder={t('motivationPlaceholder')}
        />
        {errors.motivation && (
          <p className="mt-1 text-[12px] text-red-600">{errors.motivation.message}</p>
        )}
      </div>

      {/* CV Upload Note */}
      <div className="p-4 bg-ag-off-white border border-ag-border rounded-xl">
        <p className="text-[13px] text-ag-gray leading-relaxed">
          {t('cvNote')}
        </p>
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
