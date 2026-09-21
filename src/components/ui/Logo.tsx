type Tone = 'dark' | 'light'

type Props = {
  className?: string
  tone?: Tone
  variant?: 'compact' | 'full'
}

/**
 * All logo assets are transparent PNGs (chroma-keyed, no background, no tagline).
 * tone=dark  → navy/red lockup for light backgrounds
 * tone=light → white/red lockup for dark backgrounds
 */
const LOCKUP: Record<Tone, string> = {
  dark: '/img/purelube-logo.png',
  light: '/img/purelube-logo-light.png',
}

/** Drop + swoosh mark only (square, transparent) */
export function LogoMark({ className = 'h-10 w-10' }: { className?: string; tone?: Tone }) {
  return <img src="/img/purelube-mark.png" alt="" className={`object-contain ${className}`} draggable={false} />
}

/** Official PureLube lockup (mark + wordmark) */
export default function Logo({ className = '', tone = 'dark', variant = 'compact' }: Props) {
  return (
    <a href="#home" className={`inline-flex items-center select-none ${className}`} aria-label="PureLube Lubricant GmbH home">
      <img
        src={LOCKUP[tone]}
        alt="PureLube"
        className={`object-contain ${
          variant === 'full' ? 'h-24 sm:h-32 md:h-36 w-auto max-w-full' : 'h-10 sm:h-12 w-auto max-w-[148px] sm:max-w-[200px]'
        }`}
        draggable={false}
      />
    </a>
  )
}
