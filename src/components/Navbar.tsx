import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Logo from './ui/Logo'
import TechButton from './ui/TechButton'
import { NAV_LINKS } from '../data/content'
import { scrollToSection, setPageScrollLocked } from '../hooks/useLenis'
import { EASE } from './ui/Reveal'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    setPageScrollLocked(open)
    return () => setPageScrollLocked(false)
  }, [open])

  const go = (href: string) => {
    // Unlock before closing so Lenis can scroll this same tap
    setPageScrollLocked(false)
    setOpen(false)
    setActive(href)
    // Wait for menu exit + Lenis restart, then scroll
    window.setTimeout(() => scrollToSection(href), 50)
  }

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: EASE }}
        className="sticky top-0 z-50 bg-white/95 backdrop-blur-md lg:relative lg:bg-transparent lg:backdrop-blur-none"
      >
        <div className="wrap pt-4 pb-2 lg:pt-6">
          <nav className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <button type="button" onClick={() => go('#home')} aria-label="PureLube home" className="block">
                <Logo />
              </button>
            </div>

            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.06, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => go(l.href)}
                    className={`group relative rounded-sm px-3.5 py-2 text-tech text-[11.5px] font-semibold transition-colors duration-500 ${
                      active === l.href ? 'text-brand' : 'text-ink hover:text-brand'
                    }`}
                  >
                    {l.label}
                    <span
                      className={`absolute inset-x-3.5 -bottom-px h-[2px] origin-left bg-brand transition-transform duration-500 ${
                        active === l.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </button>
                </motion.li>
              ))}
            </ul>

            <div className="flex shrink-0 items-center gap-3">
              <div className="hidden lg:block">
                <TechButton
                  href="#contact"
                  variant="black"
                  onClick={(e) => {
                    e.preventDefault()
                    go('#contact')
                  }}
                >
                  Order Now
                </TechButton>
              </div>
              <button
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="lg:hidden flex h-11 w-11 flex-col items-center justify-center gap-[5px] clip-diag-6 bg-ink text-white touch-manipulation transition-transform duration-500 hover:scale-[1.03]"
              >
                <span
                  className={`h-[2px] w-5 bg-white transition-transform duration-500 ${open ? 'translate-y-[7px] rotate-45' : ''}`}
                />
                <span
                  className={`h-[2px] w-5 bg-white transition-opacity duration-500 ${open ? 'opacity-0' : ''}`}
                />
                <span
                  className={`h-[2px] w-5 bg-white transition-transform duration-500 ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
                />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-[68px] z-40 lg:hidden overflow-y-auto bg-white/98 backdrop-blur-md"
          >
            <ul className="wrap grid gap-1.5 border-t border-line pt-4 pb-8">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.45, delay: 0.06 + i * 0.05, ease: EASE }}
                >
                  <button
                    type="button"
                    onClick={() => go(l.href)}
                    className={`flex min-h-[48px] w-full items-center clip-diag-6 px-4 py-3 text-tech text-[13px] font-semibold touch-manipulation transition-colors duration-500 ${
                      active === l.href ? 'bg-ink text-white' : 'bg-panel hover:bg-ink hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
              <motion.li
                className="pt-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.35, ease: EASE }}
              >
                <TechButton
                  href="#contact"
                  className="w-full"
                  onClick={(e) => {
                    e.preventDefault()
                    go('#contact')
                  }}
                >
                  Order Now
                </TechButton>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
