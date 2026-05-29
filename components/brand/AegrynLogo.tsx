'use client'

interface AegrynLogoProps {
  className?: string
  size?: number
  variant?: 'full' | 'mark'
  onDark?: boolean
}

export function AegrynLogo({ className = '', size = 32, variant = 'full', onDark = false }: AegrynLogoProps) {
  const textColor = onDark ? '#FFFFFF' : '#0D0C0B'

  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Left leg of Λ — thin */}
      <polygon points="0,80 14,80 40,10 33,10" fill={textColor} />
      {/* Right leg of Λ — thick */}
      <polygon points="47,10 80,80 66,80 40,10" fill={textColor} />
      {/* Cut apex — mint emerald triangle */}
      <polygon points="33,10 47,10 40,0" fill="#5ADDA4" />
    </svg>
  )

  if (variant === 'mark') return <span className={className}>{mark}</span>

  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {mark}
      <span
        style={{
          fontFamily: 'var(--font-unbounded)',
          fontWeight: 900,
          fontSize: size * 0.4,
          letterSpacing: '0.18em',
          color: textColor,
          lineHeight: 1,
          textTransform: 'uppercase' as const,
        }}
      >
        Aegryn
      </span>
    </span>
  )
}
