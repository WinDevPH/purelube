import { motion } from 'framer-motion'
import { Slashes } from './Chevrons'
import { EASE, useRevealViewport } from './Reveal'

type Props = {
  title: [string, string]
  label: string
  tone?: 'light' | 'dark'
  className?: string
}

export default function SectionHeader({
  title,
  label,
  tone = 'light',
  className = '',
}: Props) {
  const dark = tone === 'dark'
  const viewport = useRevealViewport(true, '-5% 0px')
  const titleColor = dark ? 'text-white' : 'text-ink'

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-end justify-between gap-3 sm:gap-6 pb-3">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: 0.85, ease: EASE }}
          className={`min-w-0 font-display font-semibold uppercase leading-[0.98] tracking-[0.01em] text-[26px] sm:text-[38px] md:text-[42px] ${titleColor}`}
        >
          <span className="inline-flex items-end gap-2.5 sm:items-start sm:gap-5">
            <span>
              <span className="block">{title[0]}</span>
              <span className="block">{title[1]}</span>
            </span>
            <motion.span
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={viewport}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="mb-1 sm:mb-0 sm:mt-2 inline-flex shrink-0"
            >
              <Slashes />
            </motion.span>
          </span>
        </motion.h2>

        <motion.span
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={viewport}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className={`hidden sm:block text-tech text-[14px] md:text-[16px] font-semibold whitespace-nowrap ${titleColor}`}
        >
          {label}
        </motion.span>
      </div>

      <div className={`relative h-px w-full ${dark ? 'bg-white/45' : 'bg-ink/70'}`}>
        <motion.span
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={viewport}
          transition={{ duration: 0.85, delay: 0.3, ease: EASE }}
          className="absolute right-0 -top-[1px] h-[3px] w-[54px] origin-right bg-brand"
        />
      </div>
    </div>
  )
}
