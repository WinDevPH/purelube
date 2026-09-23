import { useEffect, useId, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'

type Props = {
  label: string
  name: string
  options: string[]
  required?: boolean
  placeholder?: string
  value: string
  onChange: (value: string) => void
}

export default function SelectField({
  label,
  name,
  options,
  required,
  placeholder = 'Select an option',
  value,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const labelId = useId()

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    setActive(Math.max(0, options.indexOf(value)))
  }, [open, options, value])

  function choose(next: string) {
    onChange(next)
    setOpen(false)
  }

  function onTriggerKey(e: ReactKeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
    }
  }

  function onListKey(e: ReactKeyboardEvent<HTMLUListElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => Math.min(options.length - 1, (i < 0 ? -1 : i) + 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => Math.max(0, i - 1))
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (active >= 0) choose(options[active])
    }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative block">
      <span id={labelId} className="text-tech text-[13px] font-bold text-ink">
        {label} {required && <span className="text-brand">*</span>}
      </span>
      <input type="hidden" name={name} value={value} />
      <div className="relative mt-2">
        <button
          type="button"
          aria-labelledby={labelId}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
          onKeyDown={onTriggerKey}
          className={`flex w-full min-w-0 items-center justify-between gap-3 clip-diag-6 bg-panel px-3.5 py-3 text-left text-[13px] font-medium outline-none transition-all duration-300 sm:clip-diag-8 sm:px-4 ${
            open ? 'bg-white ring-2 ring-brand/15' : 'hover:bg-white'
          } ${value ? 'text-ink' : 'text-muted/70'}`}
        >
          <span className="min-w-0 truncate">{value || placeholder}</span>
          <span
            className={`grid h-5 w-5 shrink-0 place-items-center clip-diag-3 bg-ink text-white transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 4.2 6 8l4-3.8" />
            </svg>
          </span>
        </button>
        <span
          className={`pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-brand transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'scale-x-100' : 'scale-x-0'}`}
        />

        {open && (
          <ul
            id={listId}
            role="listbox"
            tabIndex={0}
            onKeyDown={onListKey}
            className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 max-h-56 overflow-auto border border-line bg-white py-1 shadow-[0_16px_40px_rgba(0,0,0,0.12)] outline-none"
          >
            {options.map((option, i) => {
              const selected = option === value
              return (
                <li key={option} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => choose(option)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[13px] font-semibold transition-colors duration-200 sm:px-4 ${
                      selected ? 'bg-brand text-white' : active === i ? 'bg-panel text-ink' : 'text-ink hover:bg-panel'
                    }`}
                  >
                    <span className="min-w-0 leading-snug">{option}</span>
                    {selected && <span className="shrink-0 text-[11px]">✓</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
