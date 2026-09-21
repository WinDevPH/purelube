import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal, { EASE } from './ui/Reveal'
import { RIDES } from '../data/content'

function TripleArrow({ dir, onClick, disabled }: { dir: 'prev' | 'next'; onClick: () => void; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'prev' ? 'Previous' : 'Next'}
      className="group inline-flex min-h-11 min-w-11 items-center justify-center gap-[2px] p-2 text-ink/45 transition-all duration-500 hover:text-brand hover:scale-[1.06] disabled:opacity-25 disabled:hover:text-ink/45 disabled:hover:scale-100 touch-manipulation"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="block border-y-[9px] border-y-transparent"
          style={
            dir === 'prev'
              ? { borderRight: '11px solid currentColor', opacity: 0.4 + i * 0.3 }
              : { borderLeft: '11px solid currentColor', opacity: 1 - i * 0.3 }
          }
        />
      ))}
    </button>
  )
}

function usePerView() {
  const [n, setN] = useState(3)
  useEffect(() => {
    const calc = () => setN(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1)
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return n
}

export default function Gallery() {
  const [i, setI] = useState(0)
  const perView = usePerView()
  const max = Math.max(0, RIDES.length - perView)
  const index = Math.min(i, max)

  const trackRef = useRef<HTMLDivElement>(null)
  const [trackW, setTrackW] = useState(0)
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    const ro = new ResizeObserver(([e]) => setTrackW(e.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const gap = perView === 1 ? 16 : 32
  const cardW = trackW ? (trackW - gap * (perView - 1)) / perView : 0
  const step = cardW + gap

  return (
    <section id="riders" className="relative scroll-mt-24 pt-8 md:pt-12 pb-14 md:pb-20 overflow-hidden">
      <div className="wrap">
        <SectionHeader title={['Built For', 'Every Ride']} label="PureLube Riders" />
        <Reveal delay={0.2}>
          <p className="mt-5 max-w-[360px] text-tech-sm text-[10px] text-muted">
            From daily scooters to off-road CRF and big bikes, PureLube Platinum Fully Synthetic 10W-40 SN
            turns every ride into pure performance.
          </p>
        </Reveal>
      </div>

      <div className="wrap mt-7 sm:mt-10">
        <div ref={trackRef} className="relative overflow-hidden py-2">
          <motion.div
            className="flex"
            style={{ gap }}
            animate={{ x: -index * step }}
            transition={{ type: 'spring', stiffness: 120, damping: 24, mass: 0.8 }}
            drag="x"
            dragDirectionLock
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60 && index < max) setI(index + 1)
              if (info.offset.x > 60 && index > 0) setI(index - 1)
            }}
          >
            {RIDES.map((r, k) => {
              const visible = k >= index && k < index + perView
              return (
                <motion.figure
                  key={r.src + r.tag}
                  animate={{ opacity: visible ? 1 : 0.45, y: visible ? 0 : 8 }}
                  transition={{ duration: 0.65, ease: EASE }}
                  className="group relative shrink-0"
                  style={{ width: cardW || undefined }}
                >
                  <div className="clip-hud bg-white p-[6px] shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-all duration-500 group-hover:-translate-y-1.5 group-hover:shadow-[0_22px_48px_rgba(0,0,0,0.14)]">
                    <div className="relative clip-hud overflow-hidden bg-ink">
                      <img
                        src={r.src}
                        alt={r.caption}
                        className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        draggable={false}
                        loading="lazy"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
                      <figcaption className="absolute bottom-2 left-3 right-3 sm:bottom-3 sm:left-4 text-white transition-transform duration-500 group-hover:translate-y-[-2px]">
                        <div className="text-tech text-[12px] sm:text-[13px] font-bold">{r.tag}</div>
                        <div className="text-tech-sm text-[8.5px] sm:text-[9px] text-white/70 leading-snug">{r.caption}</div>
                      </figcaption>
                    </div>
                  </div>
                </motion.figure>
              )
            })}
          </motion.div>
        </div>
      </div>

      <div className="wrap mt-6 flex items-center justify-between sm:mt-8">
        <TripleArrow dir="prev" onClick={() => setI(Math.max(0, index - 1))} disabled={index === 0} />
        <div className="flex items-center gap-0.5">
          {Array.from({ length: max + 1 }).map((_, k) => (
            <button
              key={k}
              aria-label={`Go to slide ${k + 1}`}
              onClick={() => setI(k)}
              className="grid h-11 w-8 place-items-center touch-manipulation"
            >
              <span className={`h-[3px] w-6 transition-colors ${k === index ? 'bg-brand' : 'bg-ink/15'}`} />
            </button>
          ))}
        </div>
        <TripleArrow dir="next" onClick={() => setI(Math.min(max, index + 1))} disabled={index === max} />
      </div>
    </section>
  )
}
