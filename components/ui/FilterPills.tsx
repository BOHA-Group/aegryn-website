'use client'

/**
 * FilterPills — barre de filtres pills harmonisée sur tout le site.
 * Style : fond gris clair arrondi, pill actif blanc + shadow.
 * Inspiré flowpartners.io/insights.
 */

interface FilterOption<T extends string> {
  key:   T
  label: string
}

interface Props<T extends string> {
  options:  FilterOption<T>[]
  active:   T
  onChange: (key: T) => void
  className?: string
}

export function FilterPills<T extends string>({
  options,
  active,
  onChange,
  className = '',
}: Props<T>) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, key: T) => {
    e.preventDefault()
    e.stopPropagation()
    e.currentTarget.blur()
    onChange(key)
  }

  return (
    <div className={`inline-flex items-center gap-1 p-1.5 bg-gray-100 rounded-2xl flex-wrap ${className}`}>
      {options.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={e => handleClick(e, key)}
          className={`font-sans text-[12px] px-4 py-1.5 rounded-xl transition-all duration-200 ${
            active === key
              ? 'bg-white text-ag-navy font-semibold shadow-sm'
              : 'text-ag-gray hover:text-ag-navy'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
