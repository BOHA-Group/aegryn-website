'use client'

interface AegrynLogoProps {
  className?: string
  size?: number
  variant?: 'full' | 'mark'
  onDark?: boolean
}

export function AegrynLogo({ className = '', size = 32, variant = 'full', onDark = false }: AegrynLogoProps) {
  const bodyColor = onDark ? '#FFFFFF' : '#050505'

  /**
   * Logo mark — faithful to provided brand image:
   * Λ (lambda): left leg thin, right leg thick, apex cut = mint #5ADDA4
   * ViewBox 160×160 for crisp rendering at all sizes
   */
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 160 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      {/* Left leg — thin */}
      <polygon points="2,155 20,155 80,22 66,22" fill={bodyColor} />
      {/* Right leg — thick */}
      <polygon points="94,22 158,155 140,155 80,22" fill={bodyColor} />
      {/* Apex cut — mint emerald triangle */}
      <polygon points="66,22 94,22 80,2" fill="#5ADDA4" />
    </svg>
  )

  if (variant === 'mark') return <span className={className} aria-label="Aegryn">{mark}</span>

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Aegryn">
      {mark}
      <span
        style={{
          fontFamily: 'var(--font-unbounded)',
          fontWeight: 800,
          fontSize: size * 0.42,
          letterSpacing: '0.15em',
          color: bodyColor,
          lineHeight: 1,
          textTransform: 'uppercase' as const,
        }}
      >
        Aegryn
      </span>
    </span>
  )
}
