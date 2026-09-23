import type { MouseEvent, ReactNode } from 'react'
import Chevrons from './Chevrons'
import { goToSection, scrollToTop } from '../../hooks/useLenis'

type Props = {
  children: ReactNode
  /** When omitted, renders a real <button> (useful for form submits). */
  href?: string
  type?: 'button' | 'submit'
  variant?: 'black' | 'red' | 'white'
  className?: string
  onClick?: (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => void
}

const styles = {
  black: 'bg-ink text-white',
  red: 'bg-brand text-white',
  white: 'bg-white text-ink',
}

/**
 * Chamfered CTA — CSS hover scale + shine (win-portfolio feel), no spring jank.
 */
export default function TechButton({
  children,
  href,
  type = 'button',
  variant = 'black',
  className = '',
  onClick,
}: Props) {
  const cls = `group relative inline-flex min-h-[48px] items-center justify-center clip-diag-8 sm:clip-diag-9 px-6 sm:px-9 py-3 text-tech text-[15px] font-semibold touch-manipulation transition-transform duration-500 hover:scale-[1.03] active:scale-[0.98] ${styles[variant]} ${className}`
  const tick = variant === 'white' ? 'bg-ink' : 'bg-white'
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full" />
      <Chevrons className="absolute right-4 -top-[1px] opacity-90 transition-transform duration-500 group-hover:translate-x-0.5" count={2} color={tick} dir="left" />
      <Chevrons className="absolute left-4 -bottom-[1px] opacity-90 transition-transform duration-500 group-hover:-translate-x-0.5" count={2} color={tick} dir="left" />
    </>
  )

  const handleClick = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || !href || !href.startsWith('#')) return
    if (href.startsWith('#product/')) {
      e.preventDefault()
      if (location.hash === href) scrollToTop()
      else location.hash = href
      return
    }
    e.preventDefault()
    goToSection(href)
  }

  if (href === undefined) {
    return (
      <button type={type} onClick={onClick} className={cls}>
        {inner}
      </button>
    )
  }
  return (
    <a href={href} onClick={handleClick} className={cls}>
      {inner}
    </a>
  )
}
