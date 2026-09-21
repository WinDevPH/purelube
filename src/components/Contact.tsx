import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import TechButton from './ui/TechButton'
import Chevrons from './ui/Chevrons'
import { COMPANY } from '../data/company'
import { PRODUCTS } from '../data/content'

const INQUIRY_TYPES = ['Distributor / Dealer Inquiry', 'Product Inquiry', 'Bulk Order', 'Technical Support', 'Other']

const icons = {
  pin: 'M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12zm0-9.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z',
  phone:
    'M6.6 10.8a15.5 15.5 0 006.6 6.6l2.2-2.2a1 1 0 011-.25c1.1.37 2.3.57 3.6.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02L6.6 10.8z',
  mail: 'M3 6h18v12H3z M3 7l9 6 9-6',
  clock: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4v5l4 2',
}

type FieldProps = {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder?: string
  as?: 'input' | 'textarea' | 'select'
  options?: string[]
}

function Field({ label, name, type = 'text', required, placeholder, as = 'input', options }: FieldProps) {
  const base =
    'peer w-full min-w-0 clip-diag-6 sm:clip-diag-8 bg-panel px-3.5 py-3 sm:px-4 text-[13px] font-medium text-ink outline-none transition-all duration-500 placeholder:text-muted/60 placeholder:normal-case placeholder:tracking-normal placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-brand/15'
  return (
    <label className="group relative block">
      <span className="text-tech text-[10px] font-bold text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <div className="relative mt-2">
        {as === 'textarea' ? (
          <textarea name={name} required={required} placeholder={placeholder} rows={5} className={`${base} resize-none`} />
        ) : as === 'select' ? (
          <select name={name} required={required} defaultValue="" className={`${base} appearance-none cursor-pointer pr-9`}>
            <option value="" disabled>
              Select an option
            </option>
            {options?.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input name={name} type={type} required={required} placeholder={placeholder} className={base} />
        )}
        {/* animated red underline on focus */}
        <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100" />
        {as === 'select' && (
          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-brand text-[10px]">▼</span>
        )}
      </div>
    </label>
  )
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const office = COMPANY.office
  const phoneHref = `tel:${office.phone.replace(/\s/g, '')}`
  const address = `${office.line1}, ${office.line2}`
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=14&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') || '')
    const email = String(fd.get('email') || '')
    const phone = String(fd.get('phone') || '')
    const type = String(fd.get('type') || 'Inquiry')
    const product = String(fd.get('product') || '')
    const message = String(fd.get('message') || '')

    const subject = `[PureLube] ${type}${product ? ` – ${product}` : ''} from ${name}`
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      phone && `Phone: ${phone}`,
      `Inquiry: ${type}`,
      product && `Product: ${product}`,
      '',
      message,
    ]
      .filter(Boolean)
      .join('\n')

    window.location.href = `mailto:${office.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
    e.currentTarget.reset()
  }

  const infoCards = [
    { icon: icons.pin, label: 'International Office', lines: [office.company, office.line1, office.line2] },
    { icon: icons.phone, label: 'Call Us', lines: [office.phone], href: phoneHref },
    { icon: icons.mail, label: 'Email Us', lines: [office.email], href: `mailto:${office.email}` },
    { icon: icons.clock, label: 'Business Hours', lines: ['Mon – Fri · 08:00 – 17:00 CET', 'Sat – Sun · Closed'] },
  ]

  return (
    /* top padding leaves room for the Technology spec card that overlaps into this section */
    <section id="contact" className="relative wrap overflow-x-clip scroll-mt-24 pt-10 sm:pt-[34%] md:pt-[26%] lg:pt-[19%] pb-14 md:pb-24">
      <SectionHeader title={['Get In', 'Touch']} label="Contact Us" />

      <Reveal className="mt-6 max-w-[620px]">
        <p className="text-tech-sm text-[10.5px] leading-relaxed text-muted">
          Distributor partnerships, bulk orders or technical questions about PureLube Platinum — our international
          office in Germany is ready to help. “Together We Conquer.”
        </p>
      </Reveal>

      <div className="mt-8 grid gap-6 lg:mt-10 lg:grid-cols-[1fr_1.25fr] lg:items-start lg:gap-8">
        {/* ===== Left: info cards + map ===== */}
        <div className="grid gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {infoCards.map((c, i) => (
              <Reveal key={c.label} delay={0.06 * i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="group relative h-full clip-diag-10 sm:clip-diag-16 bg-white border border-line p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
                >
                  <div className="flex h-10 w-10 items-center justify-center clip-diag-6 bg-panel transition-colors group-hover:bg-brand">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-brand transition-colors group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d={c.icon} />
                    </svg>
                  </div>
                  <div className="mt-4 text-tech text-[10px] font-bold text-brand">{c.label}</div>
                  <div className="mt-1.5 grid gap-0.5">
                    {c.lines.map((l, j) =>
                      c.href && j === 0 ? (
                        <a key={l} href={c.href} className="text-tech text-[12px] font-semibold text-ink hover:text-brand break-all">
                          {l}
                        </a>
                      ) : (
                        <span key={l} className={`text-tech-sm text-[9.5px] ${j === 0 ? 'font-semibold text-ink' : 'text-muted'}`}>
                          {l}
                        </span>
                      ),
                    )}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          {/* map */}
          <Reveal delay={0.2}>
            <div className="relative clip-diag-10 sm:clip-diag-20 bg-panel hatch p-2">
              <div className="relative clip-diag-8 sm:clip-diag-16 overflow-hidden aspect-[16/10] bg-panel-2">
                {/* stylised fallback (shows until / if the live map loads) */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)] bg-[size:28px_28px]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(238,28,46,0.18),transparent_38%)]" />
                <svg viewBox="0 0 400 250" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
                  <path d="M-10 170 C80 150 120 200 200 180 S330 130 410 150" stroke="rgba(0,0,0,0.18)" strokeWidth="6" />
                  <path d="M-10 90 C60 110 150 60 230 95 S340 120 410 80" stroke="rgba(0,0,0,0.12)" strokeWidth="4" />
                  <path d="M120 -10 C130 80 90 160 140 260" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
                  <path d="M290 -10 C270 90 320 150 280 260" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
                </svg>
                <motion.div
                  className="absolute left-1/2 top-[46%] -translate-x-1/2 -translate-y-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <svg viewBox="0 0 24 24" className="h-11 w-11 text-brand drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)]" fill="currentColor">
                    <path d="M12 22s7-6.2 7-12a7 7 0 10-14 0c0 5.8 7 12 7 12z" />
                    <circle cx="12" cy="10" r="2.6" fill="#fff" />
                  </svg>
                </motion.div>
                <span className="absolute left-1/2 top-[46%] h-2 w-8 -translate-x-1/2 rounded-full bg-black/25 blur-[3px]" />

                <iframe
                  title="PureLube Lubricant GmbH — Leuna, Germany"
                  src={mapSrc}
                  className="absolute inset-0 h-full w-full border-0 grayscale-[0.35] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
              <div className="mt-2 flex items-center justify-between gap-2 px-1 sm:mt-0">
                <div className="clip-diag-6 bg-ink px-2.5 py-1.5 text-tech text-[9px] font-bold text-white sm:absolute sm:left-5 sm:top-5 sm:px-3 sm:text-[9.5px]">
                  Leuna · Germany
                </div>
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="clip-diag-6 bg-brand px-2.5 py-1.5 text-tech text-[9px] font-bold text-white hover:bg-brand-dark sm:absolute sm:bottom-5 sm:right-5 sm:px-3 sm:text-[9.5px]"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>
          </Reveal>
        </div>

        {/* ===== Right: form ===== */}
        <Reveal delay={0.1}>
          <div className="relative clip-diag-12 sm:clip-diag-24 bg-ink hatch-dark text-white">
            <div className="absolute right-4 top-3 z-10 hidden sm:block sm:right-6 sm:top-4">
              <Chevrons count={3} color="bg-white/60" size="md" dir="left" />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(238,28,46,0.22),transparent_55%)]" />

            <div className="relative px-4 py-6 sm:px-10 sm:py-10">
              <div className="text-tech text-[12px] font-semibold text-brand">Send a Message</div>
              <h3 className="mt-1 text-[24px] sm:text-[30px] font-bold uppercase leading-[1]">
                Let&apos;s Talk
                <br />
                Lubricants.
              </h3>

              {/* white form panel inside the dark frame */}
              <form onSubmit={onSubmit} className="mt-6 clip-diag-10 sm:mt-7 sm:clip-diag-16 bg-white p-4 sm:p-7 text-ink">
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full Name" name="name" required placeholder="Your name" />
                  <Field label="Email" name="email" type="email" required placeholder="you@company.com" />
                  <Field label="Phone" name="phone" type="tel" placeholder="+49 …" />
                  <Field label="Inquiry Type" name="type" as="select" required options={INQUIRY_TYPES} />
                  <div className="sm:col-span-2">
                    <Field label="Product of Interest" name="product" as="select" options={PRODUCTS.map((p) => p.name)} />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Message" name="message" as="textarea" required placeholder="Tell us about your requirements…" />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-tech-sm text-[8.5px] text-muted max-w-[300px]">
                    By sending, you agree to be contacted by PureLube Lubricant GmbH regarding your inquiry.
                  </p>
                  <TechButton type="submit" variant="red" className="w-full sm:w-auto px-10">
                    Send Message
                  </TechButton>
                </div>

                <AnimatePresence>
                  {sent && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-5 flex items-start gap-3 clip-diag-8 bg-panel px-4 py-3"
                    >
                      <span className="mt-[2px] grid h-5 w-5 shrink-0 place-items-center clip-diag-4 bg-brand text-white text-[11px] font-bold">
                        ✓
                      </span>
                      <div className="text-tech-sm text-[9.5px] text-ink">
                        Your email client has opened with the message ready to send to{' '}
                        <a href={`mailto:${office.email}`} className="font-semibold text-brand">
                          {office.email}
                        </a>
                        . We reply within one business day.
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
