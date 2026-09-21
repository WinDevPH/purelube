import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  duration?: number
  reverse?: boolean
  className?: string
  pauseOnHover?: boolean
}

/** Infinite CSS marquee with optional hover pause — same as win-portfolio. */
export default function Marquee({
  children,
  duration = 40,
  reverse = false,
  className = '',
  pauseOnHover = true,
}: Props) {
  return (
    <div
      className={`marquee-mask overflow-hidden ${pauseOnHover ? 'marquee-paused' : ''} ${className}`}
    >
      <div
        className={`marquee-track ${reverse ? 'marquee-track-reverse' : ''}`}
        style={{ ['--marquee-duration' as string]: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
