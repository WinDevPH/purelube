type Props = {
  className?: string
  count?: number
  color?: string
  /** skew direction */
  dir?: 'right' | 'left'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * The stacked slanted "»»" tick marks used on buttons / cards in the reference design.
 */
export default function Chevrons({
  className = '',
  count = 2,
  color = 'bg-white',
  dir = 'right',
  size = 'sm',
}: Props) {
  const dims =
    size === 'lg' ? 'h-5 w-[10px]' : size === 'md' ? 'h-3.5 w-[7px]' : 'h-2.5 w-[5px]'
  return (
    <span className={`inline-flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={`${dims} ${color} block`}
          style={{ transform: dir === 'right' ? 'skewX(-28deg)' : 'skewX(28deg)' }}
        />
      ))}
    </span>
  )
}

/** Red double slash used beside section titles */
export function Slashes({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-end gap-[5px] ${className}`} aria-hidden="true">
      <span className="block h-5 w-[3px] sm:h-6 bg-brand" style={{ transform: 'skewX(-32deg)' }} />
      <span className="block h-5 w-[3px] sm:h-6 bg-brand" style={{ transform: 'skewX(-32deg)' }} />
    </span>
  )
}
