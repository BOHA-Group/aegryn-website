'use client'

import { useState }        from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, ArrowUpRight } from 'lucide-react'
import NextLink from 'next/link'

const inputCls  = 'w-full border border-ag-border bg-ag-white px-4 py-3 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light focus:outline-none focus:border-ag-black transition-colors'
const labelCls  = 'block font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2'

type AcquirerType = 'individual' | 'company' | 'fund'
type CapacityRange = '<500k' | '500k-2m' | '2m-10m' | '>10m'

const SECTORS = ['saas', 'fintech', 'healthtech', 'edtech', 'proptech', 'hrtech', 'legaltech', 'ecommerce'] as const

function RadioGroup<T extends string>({
  options, value, onChange,
}: {
  options: { key: T; label: string }[]
  value: T | ''
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2 mt-1">
      {options.map(({ key, label }) => (
        <button key={key} type="button" onClick={() => onChange(key)}
          className={`border px-4 py-2 font-sans text-[12px] transition-colors whitespace-nowrap ${
            value === key ? 'border-ag-black bg-ag-black text-white' : 'border-ag-border text-ag-black hover:border-ag-black'
          }`}>
          {label}
        </button>
      ))}
    </div>
  )
}

export default function CatalogNotifyForm({ locale }: { locale: string }) {
  const t = useTranslations('auction.catalog')

  const [email,         setEmail]         = useState('')
  const [acquirerType,  setAcquirerType]  = useState<AcquirerType | ''>('')
  const [capacityRange, setCapacityRange] = useState<CapacityRange | ''>('')
  const [sectors,       setSectors]       = useState<string[]>([])
  const [loading,       setLoading]       = useState(false)
  const [sent,          setSent]          = useState(false)
  const [error,         setError]         = useState(false)

  function toggleSector(s: string) {
    setSectors(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    try {
      const res = await fetch('/api/catalog/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          acquirer_type:    acquirerType || undefined,
          sectors_interest: sectors,
          capacity_range:   capacityRange || undefined,
          locale,
        }),
      })
      if (res.ok) setSent(true)
      else setError(true)
    } catch { setError(true) }
    finally  { setLoading(false) }
  }

  if (sent) {
    return (
      <div className="flex flex-col gap-4 pt-6">
        <CheckCircle2 size={28} className="text-ag-apex" />
        <p className="font-sans font-bold text-ag-black text-[16px]">{t('notifySuccessTitle')}</p>
        <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('notifySuccessDesc')}</p>
        <NextLink href="/client/register"
          className="self-start inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.14em] px-5 py-3 hover:bg-ag-navy-mid transition-colors">
          {t('notifySuccessCtaAcquirer')} <ArrowUpRight size={12} />
        </NextLink>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5 pt-6">

        <div>
          <label className={labelCls}>{t('notifyEmail')} *</label>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
            placeholder={t('notifyEmailPlaceholder')} className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>{t('notifyType')}</label>
          <RadioGroup<AcquirerType>
            options={[
              { key: 'individual', label: t('notifyTypeIndividual') },
              { key: 'company',    label: t('notifyTypeCompany')    },
              { key: 'fund',       label: t('notifyTypeFund')       },
            ]}
            value={acquirerType}
            onChange={setAcquirerType}
          />
        </div>

        <div>
          <label className={labelCls}>{t('notifyCapacity')}</label>
          <RadioGroup<CapacityRange>
            options={[
              { key: '<500k',   label: '< 500K€'   },
              { key: '500k-2m', label: '500K – 2M€' },
              { key: '2m-10m',  label: '2M – 10M€'  },
              { key: '>10m',    label: '> 10M€'      },
            ]}
            value={capacityRange}
            onChange={setCapacityRange}
          />
        </div>

        <div>
          <label className={labelCls}>{t('notifySectors')}</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {SECTORS.map(s => (
              <button key={s} type="button" onClick={() => toggleSector(s)}
                className={`border px-3 py-1.5 font-sans text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  sectors.includes(s) ? 'border-ag-apex bg-ag-apex/10 text-ag-black' : 'border-ag-border text-ag-gray-light hover:border-ag-black'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="font-sans text-[11px] text-red-500">{t('notifyError')}</p>
        )}

        <button type="submit" disabled={loading || !email}
          className="self-start inline-flex items-center gap-2 bg-ag-navy text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? t('notifyLoading') : t('notifyCta')}
        </button>
    </form>
  )
}
