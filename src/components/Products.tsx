import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal, { EASE } from './ui/Reveal'
import TechButton from './ui/TechButton'
import { PRODUCTS } from '../data/content'

const DETAIL_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'standards', label: 'Standards' },
  { id: 'features', label: 'Features' },
] as const

type DetailTab = (typeof DETAIL_TABS)[number]['id']

function ProductCopy({ p }: { p: (typeof PRODUCTS)[number] }) {
  const [tab, setTab] = useState<DetailTab>('overview')
  const isGold = p.id === '5w40'
  const accent = isGold ? 'bg-gold' : 'bg-brand'
  const accentText = isGold ? 'text-gold' : 'text-brand'
  const accentSoft = isGold ? 'bg-gold/15 text-ink' : 'bg-brand/10 text-brand'
  const nameParts = p.name.replace('PureLube Platinum Fully Synthetic ', '').trim()

  useEffect(() => {
    setTab('overview')
  }, [p.id])

  return (
    <motion.div
      initial={{ opacity: 0, x: 28 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -18 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative flex min-h-0 flex-col"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className={`clip-diag-5 px-3 py-1 text-tech text-[9.5px] font-bold uppercase tracking-[0.14em] ${accentSoft}`}>
          {p.category}
        </span>
        <span className="clip-diag-5 bg-ink px-3 py-1 text-tech text-[9.5px] font-bold text-white tracking-[0.12em]">
          SAE {p.grade}
        </span>
        <span className="text-tech-sm text-[9px] text-muted">{p.tagline}</span>
      </div>

      <h3 className="mt-3 sm:mt-4">
        <span className="block text-tech text-[10.5px] sm:text-[11.5px] font-semibold tracking-[0.16em] text-muted">
          PureLube Platinum Fully Synthetic
        </span>
        <span className="mt-1 block text-[24px] sm:text-[32px] md:text-[36px] font-bold uppercase leading-[0.95] tracking-[0.01em] text-ink">
          {nameParts}
        </span>
      </h3>

      <div className="relative mt-3 h-px w-full bg-ink/15">
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className={`absolute left-0 top-[-1px] h-[3px] w-16 origin-left ${accent}`}
        />
      </div>

      {/* detail tabs */}
      <div
        role="tablist"
        aria-label="Product details"
        className="mt-4 flex gap-1 border-b border-ink/10 sm:mt-5"
      >
        {DETAIL_TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t.id)}
              className={`relative min-h-10 flex-1 px-2 py-2.5 text-tech text-[10px] sm:text-[11px] font-bold tracking-[0.08em] transition-colors duration-400 touch-manipulation sm:flex-none sm:px-4 ${
                active ? 'text-ink' : 'text-muted hover:text-ink'
              }`}
            >
              {t.label}
              {active && (
                <motion.span
                  layoutId={`detail-tab-${p.id}`}
                  className={`absolute inset-x-1 -bottom-px h-[2.5px] ${accent}`}
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                />
              )}
            </button>
          )
        })}
      </div>

      <div className="relative mt-4 min-h-[200px] sm:min-h-[220px]">
        <AnimatePresence mode="wait">
          {tab === 'overview' && (
            <motion.div
              key="overview"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="grid gap-3"
            >
              <p className="text-[12.5px] sm:text-[13px] font-medium leading-[1.65] tracking-[0.01em] text-ink/75 line-clamp-6 sm:line-clamp-none">
                {p.intro}
              </p>
              <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5">
                {p.callouts.map((c) => (
                  <div
                    key={c.title}
                    className="relative clip-diag-8 bg-panel hatch px-3.5 py-2.5 transition-transform duration-500 hover:-translate-y-0.5"
                  >
                    <div className={`text-tech text-[11.5px] font-bold ${accentText}`}>{c.title}</div>
                    <p className="mt-1 text-tech-sm text-[8.5px] leading-relaxed text-muted line-clamp-2">
                      {c.desc}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'standards' && (
            <motion.div
              key="standards"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <div className="mb-3 flex items-end justify-between gap-3">
                <p className="text-tech-sm text-[9px] text-muted">Certified specifications met or exceeded</p>
                <span className="text-tech text-[9px] font-bold tabular-nums text-ink/40">
                  {String(p.standards.length).padStart(2, '0')}
                </span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {p.standards.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.35, delay: i * 0.03, ease: EASE }}
                    className="clip-diag-6 border border-ink/10 bg-white px-3 py-2 text-tech text-[10px] font-bold text-ink transition-all duration-500 hover:-translate-y-0.5 hover:border-ink/25"
                  >
                    <span
                      className={`mr-2 inline-block h-[6px] w-[6px] align-middle ${accent}`}
                      style={{ transform: 'skewX(-20deg)' }}
                    />
                    {s}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {tab === 'features' && (
            <motion.div
              key="features"
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              <ul className="grid gap-1 max-h-[240px] overflow-y-auto no-scrollbar pr-1">
                {p.features.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: i * 0.025, ease: EASE }}
                    className="group/feat grid grid-cols-[2rem_1fr] items-start gap-2 px-1.5 py-1.5 transition-colors duration-400 hover:bg-panel sm:grid-cols-[2.5rem_1fr]"
                  >
                    <span className={`pt-0.5 text-tech text-[10px] font-bold tabular-nums ${accentText}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="text-[12px] font-semibold leading-snug text-ink/80 transition-transform duration-400 group-hover/feat:translate-x-0.5">
                      {f}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-auto flex flex-col gap-3 border-t border-ink/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-tech-sm text-[9px] text-muted leading-relaxed">
          <span className="font-bold text-ink">Made in Germany</span>
          <span className="mx-2 text-ink/20">·</span>
          German Technology, Russian Formulation
        </div>
        <TechButton
          href="#technology"
          variant={isGold ? 'black' : 'red'}
          className="w-full sm:w-auto px-6"
          onClick={() => {
            sessionStorage.setItem('purelube-tech-product', p.id)
            window.dispatchEvent(new CustomEvent('purelube:select-tech-product', { detail: p.id }))
          }}
        >
          View Specs
        </TechButton>
      </div>
    </motion.div>
  )
}

export default function Products() {
  const [active, setActive] = useState(0)
  const p = PRODUCTS[active]
  const isGold = p.id === '5w40'

  return (
    <section id="products" className="relative wrap overflow-x-clip scroll-mt-24 pt-8 md:pt-12 pb-14 md:pb-24">
      <SectionHeader title={['PureLube Platinum', 'Lineup']} label="Our Products" />

      <Reveal delay={0.1} className="mt-6 grid grid-cols-2 gap-2 md:mt-8 md:flex md:flex-wrap md:gap-3 md:justify-start">
        {PRODUCTS.map((item, i) => {
          const tabGold = item.id === '5w40'
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              className={`relative flex min-h-[52px] w-full flex-col items-center justify-center clip-diag-8 px-3 py-2.5 text-center text-tech text-[10px] sm:text-[11px] font-semibold transition-transform duration-500 hover:scale-[1.02] touch-manipulation md:min-h-0 md:w-auto md:flex-row md:px-5 ${
                i === active
                  ? tabGold
                    ? 'text-ink'
                    : 'text-white'
                  : 'bg-panel text-ink hover:bg-ink hover:text-white'
              }`}
            >
              {i === active && (
                <motion.span
                  layoutId="product-tab"
                  className={`absolute inset-0 clip-diag-8 ${tabGold ? 'bg-gold' : 'bg-brand'}`}
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{item.shortName}</span>
              <span className="relative z-10 mt-0.5 text-[8.5px] opacity-70 md:ml-2 md:mt-0">{item.category}</span>
            </button>
          )
        })}
      </Reveal>

      <div className="mt-7 grid gap-8 lg:mt-10 lg:grid-cols-[0.92fr_1.18fr] lg:items-stretch lg:gap-12">
        <Reveal>
          <AnimatePresence mode="wait">
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.65, ease: EASE }}
              className="group relative flex h-full flex-col bg-panel hatch p-4 sm:p-6 clip-diag2-12 sm:clip-diag2-24 transition-shadow duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute left-4 top-4 z-10 flex gap-1.5 sm:left-5 sm:top-5">
                <span
                  className={`clip-diag-4 px-2.5 py-1 text-tech text-[8.5px] font-bold tracking-[0.12em] ${isGold ? 'bg-gold text-ink' : 'bg-brand text-white'}`}
                >
                  {p.grade}
                </span>
                <span className="clip-diag-4 bg-ink px-2.5 py-1 text-tech text-[8.5px] font-bold text-white tracking-[0.12em]">
                  {p.category}
                </span>
              </div>
              <img
                src={p.image}
                alt={p.imageAlt}
                className="mx-auto max-h-[220px] sm:max-h-[300px] lg:max-h-[380px] w-auto flex-1 object-contain mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                loading="lazy"
                draggable={false}
              />
              <div className="mt-3 flex flex-col gap-0.5 sm:mt-4">
                <div className={`text-tech text-[12px] font-bold ${isGold ? 'text-gold' : 'text-brand'}`}>
                  {p.category}
                </div>
                <div className="text-tech text-[18px] sm:text-[20px] font-bold uppercase leading-none text-ink">
                  {p.grade}
                </div>
                <div className="text-tech-sm text-[9.5px] text-muted">{p.tagline}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </Reveal>

        <Reveal delay={0.12}>
          <AnimatePresence mode="wait">
            <ProductCopy key={p.id} p={p} />
          </AnimatePresence>
        </Reveal>
      </div>
    </section>
  )
}
