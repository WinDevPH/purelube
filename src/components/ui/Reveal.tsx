import { motion, useInView } from 'framer-motion'
import { createElement, useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { useScrollContainer } from '../../context/ScrollContext'

export const EASE = [0.16, 1, 0.3, 1] as const

/** Intersection root: Lenis window scroll → browser viewport. */
export function useRevealViewport(once = true, margin = '-8% 0px') {
  const container = useScrollContainer()
  return {
    once,
    margin,
    ...(container.current ? { root: container } : {}),
    amount: 0.15 as const,
  }
}

type RevealProps = {
  children: ReactNode
  delay?: number
  y?: number
  x?: number
  duration?: number
  className?: string
  once?: boolean
  amount?: number
}

export default function Reveal({
  children,
  delay = 0,
  y = 28,
  x = 0,
  duration = 1.15,
  className = '',
  once = true,
}: RevealProps) {
  const viewport = useRevealViewport(once)

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={viewport}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}

type TextRevealProps = {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: ElementType
  once?: boolean
}

/**
 * Word-masked slide-up. Observes the outer wrapper (not clipped children)
 * so titles never get stuck invisible with Lenis / overflow masks.
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.055,
  as: Tag = 'span',
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const words = String(text).split(' ')
  const viewport = useRevealViewport(once, '-5% 0px')
  const inView = useInView(ref, {
    once: viewport.once,
    margin: viewport.margin as `${number}% ${number}px`,
    amount: 0.01,
    ...(viewport.root ? { root: viewport.root } : {}),
  })
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (inView) setReady(true)
    const t = window.setTimeout(() => setReady(true), 900)
    return () => window.clearTimeout(t)
  }, [inView])

  return createElement(
    Tag,
    { ref, className, 'aria-label': text },
    words.map((word, i) => (
      <span
        key={`${word}-${i}`}
        className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom"
      >
        <motion.span
          className="inline-block will-change-transform"
          initial={{ y: '110%' }}
          animate={{ y: ready ? '0%' : '110%' }}
          transition={{
            duration: 0.95,
            delay: delay + i * stagger,
            ease: EASE,
          }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      </span>
    )),
  )
}

type LetterRevealProps = {
  text: string
  className?: string
  delay?: number
  stagger?: number
}

/** Letter-by-letter masked reveal for hero display type. */
export function LetterReveal({ text, className, delay = 0, stagger = 0.04 }: LetterRevealProps) {
  const letters = Array.from(text)
  return (
    <span className={className} aria-label={text}>
      {letters.map((letter, i) => (
        <span key={`${letter}-${i}`} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '112%', rotate: 3 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{
              duration: 1.2,
              delay: delay + i * stagger,
              ease: EASE,
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
