import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import SectionHeader from './ui/SectionHeader'
import Reveal from './ui/Reveal'
import TechButton from './ui/TechButton'
import Chevrons from './ui/Chevrons'
import SelectField from './ui/SelectField'
import OfficeMap from './OfficeMap'
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
  as?: 'input' | 'textarea'
}

function Field({ label, name, type = 'text', required, placeholder, as = 'input' }: FieldProps) {
  const base =
    'peer w-full min-w-0 clip-diag-6 sm:clip-diag-8 bg-panel px-3.5 py-3 sm:px-4 text-[13px] font-medium text-ink outline-none transition-all duration-500 placeholder:text-muted/60 placeholder:normal-case placeholder:tracking-normal placeholder:font-normal focus:bg-white focus:ring-2 focus:ring-brand/15'
  return (
    <label className="group relative block">
      <span className="text-tech text-[13px] font-bold text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <div className="relative mt-2">
        {as === 'textarea' ? (
          <textarea name={name} required={required} placeholder={placeholder} rows={5} className={`${base} resize-none`} />
        ) : (
          <input name={name} type={type} required={required} placeholder={placeholder} className={base} />
        )}
        <span className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] peer-focus:scale-x-100" />
      </div>
    </label>
  )
}

function readInquireDefaults() {
  try {
    return {
      product: sessionStorage.getItem('purelube-inquire-product') || '',
      type: sessionStorage.getItem('purelube-inquire-type') || '',
    }
  } catch {
    return { product: '', type: '' }
  }
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [inquire] = useState(readInquireDefaults)
  const [inquiryType, setInquiryType] = useState(inquire.type)
  const [product, setProduct] = useState(inquire.product)
  const office = COMPANY.office
  const phoneHref = `tel:${office.phone.replace(/\s/g, '')}`
  const address = `${office.line1}, ${office.line2}`
  const mapQuery = encodeURIComponent(`${office.company}, ${address}`)
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!inquiryType) return
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') || '')
    const email = String(fd.get('email') || '')
    const phone = String(fd.get('phone') || '')
    const type = String(fd.get('type') || inquiryType || 'Inquiry')
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
    setInquiryType('')
    setProduct('')
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
        <p className="text-[14px] leading-relaxed text-muted">
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
                  <div className="mt-4 text-tech text-[13px] font-bold text-brand">{c.label}</div>
                  <div className="mt-1.5 grid gap-0.5">
                    {c.lines.map((l, j) =>
                      c.href && j === 0 ? (
                        <a key={l} href={c.href} className="text-tech text-[12px] font-semibold text-ink hover:text-brand break-all">
                          {l}
                        </a>
                      ) : (
                        <span key={l} className={`text-[13px] ${j === 0 ? 'font-semibold text-ink' : 'text-muted'}`}>
                          {l}
                        </span>
                      ),
                    )}
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="relative overflow-hidden clip-diag-10 sm:clip-diag-16 border border-line bg-ink shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
              <div className="relative aspect-[16/10] bg-[#d8d8d8]">
                <OfficeMap />
                <div className="pointer-events-none absolute inset-0 z-[400] bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
                <div className="pointer-events-none absolute left-3 top-3 z-[800] clip-diag-6 bg-ink px-2.5 py-1.5 text-tech text-[11px] font-bold tracking-[0.14em] text-white sm:left-4 sm:top-4 sm:px-3 sm:text-[12px]">
                  Leuna · Germany
                </div>
                <div className="absolute inset-x-3 bottom-3 z-[800] flex items-end justify-between gap-3 sm:inset-x-4 sm:bottom-4">
                  <div className="min-w-0 clip-diag-6 bg-white/95 px-3 py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.12)] sm:px-3.5">
                    <div className="text-tech text-[10px] font-bold tracking-[0.16em] text-brand">Headquarters</div>
                    <div className="mt-0.5 truncate text-[12px] font-semibold text-ink sm:text-[13px]">{office.line1}</div>
                    <div className="text-[11px] text-muted">{office.line2}</div>
                  </div>
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 clip-diag-6 bg-brand px-3 py-2.5 text-tech text-[11px] font-bold whitespace-nowrap text-white transition-colors hover:bg-brand-dark sm:px-3.5 sm:text-[12px]"
                  >
                    Google Maps ↗
                  </a>
                </div>
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
                  <SelectField
                    label="Inquiry Type"
                    name="type"
                    required
                    options={INQUIRY_TYPES}
                    value={inquiryType}
                    onChange={setInquiryType}
                  />
                  <div className="sm:col-span-2">
                    <SelectField
                      label="Product of Interest"
                      name="product"
                      options={PRODUCTS.map((p) => p.name)}
                      value={product}
                      onChange={setProduct}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Message" name="message" as="textarea" required placeholder="Tell us about your requirements…" />
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <p className="text-[12px] text-muted max-w-[300px]">
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
                      <div className="text-[13px] text-ink">
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
