import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

/** Deux portes d'entrée sous le hero : le cabinet de conseil intégré et La Boutique. */
export async function HomeDoors() {
  const t = await getTranslations('homeDoors')
  return (
    <section className="bg-white px-6 py-16 md:px-12 md:py-24" aria-label="Aegryn">
      <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-3xl bg-ag-off-white p-9 md:p-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink">{t('cabinetLabel')}</p>
            <p className="mt-5 max-w-md font-sans text-[clamp(20px,1.9vw,26px)] font-semibold leading-snug tracking-[-0.015em] text-ag-black">{t('cabinetText')}</p>
          </div>
          <Link href="/advisory" className="mt-10 w-fit font-sans text-[14px] font-semibold text-ag-navy underline decoration-ag-apex decoration-2 underline-offset-4 hover:text-ag-apex-ink">
            {t('cabinetLink')} →
          </Link>
        </div>
        <div className="flex flex-col justify-between rounded-3xl bg-ag-navy p-9 text-white md:p-12">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex">{t('boutiqueLabel')}</p>
            <p className="mt-5 max-w-md font-sans text-[clamp(20px,1.9vw,26px)] font-semibold leading-snug tracking-[-0.015em]">{t('boutiqueText')}</p>
          </div>
          <Link href="/boutique" className="mt-10 w-fit font-sans text-[14px] font-semibold text-ag-apex underline decoration-white/40 decoration-2 underline-offset-4 hover:text-white">
            {t('boutiqueLink')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
