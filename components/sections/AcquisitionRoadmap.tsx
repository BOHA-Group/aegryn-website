import { Link } from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'

type Status = 'available_on_request' | 'in_deployment' | 'roadmap' | 'roadmap_long'

type RoadmapItem = {
  phase: string
  title: string
  desc: string
  status: Status
}

const BADGE: Record<Status, { label: string; classes: string }> = {
  available_on_request: {
    label: 'available_on_request',
    classes: 'bg-ag-apex/10 text-ag-apex border border-ag-apex/30',
  },
  in_deployment: {
    label: 'in_deployment',
    classes: 'bg-amber-50 text-amber-600 border border-amber-200',
  },
  roadmap: {
    label: 'roadmap',
    classes: 'bg-ag-off-white text-ag-gray border border-ag-border',
  },
  roadmap_long: {
    label: 'roadmap_long',
    classes: 'bg-ag-off-white text-ag-gray border border-ag-border',
  },
}

const HAS_CTA: Record<Status, boolean> = {
  available_on_request: true,
  in_deployment: true,
  roadmap: false,
  roadmap_long: false,
}

const GROUP_ORDER: Status[] = [
  'available_on_request',
  'in_deployment',
  'roadmap',
  'roadmap_long',
]

type Props = {
  label: string
  title: string
  desc: string
  ctaLabel: string
  ctaHref: string
  items: RoadmapItem[]
}

export default function AcquisitionRoadmap({
  label,
  title,
  desc,
  ctaLabel,
  ctaHref,
  items,
}: Props) {
  const groups = GROUP_ORDER.map((status) => ({
    status,
    items: items.filter((i) => i.status === status),
  })).filter((g) => g.items.length > 0)

  return (
    <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
          {label}
        </p>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(26px,3vw,44px)' }}
        >
          {title}
        </h2>
        <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-16 max-w-xl">
          {desc}
        </p>

        <div className="flex flex-col gap-12">
          {groups.map(({ status, items: groupItems }) => {
            const badge = BADGE[status]
            const hasCta = HAS_CTA[status]
            return (
              <div key={status}>
                <div className="flex items-center gap-3 mb-6">
                  <span
                    className={`font-mono text-[10px] tracking-[0.18em] uppercase px-3 py-1 ${badge.classes}`}
                  >
                    {groupItems[0].phase}
                  </span>
                  <span className="flex-1 h-px bg-ag-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
                  {groupItems.map(({ title: itemTitle, desc: itemDesc }) => (
                    <div
                      key={itemTitle}
                      className="bg-ag-white p-8 flex flex-col gap-3"
                    >
                      <h3 className="font-sans font-semibold text-ag-black text-[16px] leading-snug">
                        {itemTitle}
                      </h3>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed flex-1">
                        {itemDesc}
                      </p>
                      {hasCta && (
                        <Link
                          href={`${ctaHref}?subject=${encodeURIComponent(itemTitle)}` as never}
                          className="mt-2 inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-ag-apex hover:text-ag-black transition-colors"
                        >
                          {ctaLabel} <ArrowUpRight size={11} />
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
