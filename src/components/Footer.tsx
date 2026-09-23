import { motion } from 'framer-motion'
import Logo from './ui/Logo'
import TechButton from './ui/TechButton'
import Reveal, { EASE } from './ui/Reveal'
import { NAV_LINKS, PRODUCTS } from '../data/content'
import { goToSection, scrollToTop } from '../hooks/useLenis'

export default function Footer() {
  return (
    <footer className="relative overflow-x-clip bg-panel hatch">
      <div
        className="absolute left-0 top-0 h-6 w-[16%] bg-white"
        style={{ clipPath: 'polygon(0 0, 100% 0, 88% 100%, 0 100%)' }}
      />

      <div className="wrap overflow-x-clip pt-12 pb-8 sm:pt-16 sm:pb-10">
        <Reveal>
          <div className="relative clip-diag-12 sm:clip-diag-24 bg-ink hatch-dark px-5 py-7 text-white text-center sm:px-10 sm:py-8 md:text-left md:flex md:items-center md:justify-between transition-transform duration-500 hover:-translate-y-0.5">
            <div>
              <div className="text-tech text-[14px] font-semibold text-brand sm:text-[15px]">Feel Its Power</div>
              <h3 className="mt-1.5 text-[26px] sm:text-[36px] font-bold uppercase leading-[1]">
                German Technology.
                <br />
                Genuine Lubricant.
              </h3>
            </div>
            <div className="mt-5 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-nowrap sm:gap-3 md:mt-0">
              <TechButton
                href="mailto:purelubelubricant@gmail.com"
                variant="red"
                className="w-full md:w-auto md:flex-none px-4 sm:px-9"
              >
                Order Now
              </TechButton>
              <TechButton href="#technology" variant="white" className="w-full md:w-auto md:flex-none px-4 sm:px-9">
                View Specs
              </TechButton>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 text-center justify-items-center sm:mt-12 sm:gap-10 md:text-left md:justify-items-start md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <Reveal>
            <Logo />
            <p className="mt-4 max-w-[320px] mx-auto md:mx-0 text-[13px] font-medium leading-relaxed text-muted sm:text-[14px]">
              PureLube Lubricant GmbH — German Technology, Russian Formulation. Operating across Europe,
              Asia, Africa, and the Americas.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <h4 className="text-tech text-[14px] font-bold tracking-[0.08em] sm:text-[15px]">Product</h4>
            <ul className="mt-4 grid gap-2.5">
              {PRODUCTS.map((p) => (
                <li key={p.id} className="text-[14px] leading-snug text-muted sm:text-[15px]">
                  <a
                    href={`#product/${p.id}`}
                    className="font-semibold text-ink transition-colors duration-500 hover:text-brand"
                  >
                    {p.shortName}
                  </a>
                  <div className="mt-0.5 text-[13px] sm:text-[14px]">{p.tagline}</div>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <h4 className="text-tech text-[14px] font-bold tracking-[0.08em] sm:text-[15px]">Navigate</h4>
            <ul className="mt-4 grid gap-2">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <button
                    type="button"
                    onClick={() => goToSection(l.href)}
                    className="text-tech text-[14px] font-semibold text-muted transition-colors duration-500 hover:text-brand sm:text-[15px]"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.3}>
            <h4 className="text-tech text-[14px] font-bold tracking-[0.08em] sm:text-[15px]">International Office</h4>
            <ul className="mt-4 grid gap-1.5 text-[13px] font-medium leading-snug text-muted sm:text-[14px]">
              <li className="font-semibold text-ink">Purelube Lubricant GmbH</li>
              <li>Am Haupttor, Gebäude 4609</li>
              <li>06237 Leuna, Germany</li>
              <li>
                <a href="tel:+4934618450" className="transition-colors duration-500 hover:text-brand">
                  +49 3461 8450
                </a>
              </li>
              <li>
                <a
                  href="mailto:purelubelubricant@gmail.com"
                  className="break-all transition-colors duration-500 hover:text-brand"
                >
                  purelubelubricant@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-5 flex gap-2 justify-center md:justify-start">
              {[
                { label: 'FB', href: 'https://www.facebook.com/profile.php?id=61587048606590', external: true },
                { label: 'IG', href: '#' },
                { label: 'YT', href: '#' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  {...(s.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  aria-label={s.label === 'FB' ? 'PureLube Lubricant on Facebook' : s.label}
                  className="grid h-9 w-9 place-items-center clip-diag-5 bg-ink text-[12px] font-bold text-white transition-all duration-500 hover:-translate-y-1 hover:scale-[1.06] hover:bg-brand"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-center text-[12px] font-medium text-muted sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:text-left sm:text-[13px]">
          <span>© {new Date().getFullYear()} Purelube Lubricant GmbH. All rights reserved.</span>
          <button
            type="button"
            onClick={() => {
              if (location.hash.startsWith('#product/')) goToSection('#home')
              else scrollToTop()
            }}
            className="group inline-flex items-center justify-center gap-1.5 transition-transform duration-500 hover:-translate-y-0.5 hover:text-ink sm:justify-end"
          >
            Back to top
            <motion.span
              aria-hidden
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: EASE }}
              className="inline-block"
            >
              ↑
            </motion.span>
          </button>
        </div>
      </div>
    </footer>
  )
}
