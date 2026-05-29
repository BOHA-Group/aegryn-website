const STATS = [
  { num: '6.8B', label: 'Total mobile devices' },
  { num: '5.6B', label: 'Global smartphone connections' },
  { num: '4h12', label: 'Daily screen time' },
  { num: 'CH', label: 'Engineered in Switzerland' },
]

export function StatsRow() {
  return (
    <section className="bg-ag-off-white border-t border-ag-border py-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-ag-border">
        {STATS.map(({ num, label }) => (
          <div
            key={label}
            className="flex-1 py-10 md:py-0 md:px-16 first:pl-0 last:pr-0 flex flex-col gap-2"
          >
            <span
              className="font-display font-black text-ag-black tracking-[-0.04em] leading-none"
              style={{ fontSize: '48px' }}
            >
              {num}
            </span>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ag-gray-light">
              {label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
