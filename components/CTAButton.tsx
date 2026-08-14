import type { ReactNode } from 'react'

interface CTAButtonProps {
  href?: string
  children: ReactNode
  /**
   * `solid-dark`  — anthrazit gefüllt, für helle Flächen
   * `solid-light` — creme gefüllt, für dunkle Flächen
   * `outline`     — nur Kontur auf hellem Grund
   * `outline-light` — nur Kontur auf dunklem Grund
   */
  variant?: 'solid-dark' | 'solid-light' | 'outline' | 'outline-light'
  className?: string
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
}

const base =
  'group relative inline-flex items-center justify-center overflow-hidden rounded-full px-9 py-4 text-[0.875rem] font-normal uppercase tracking-[0.22em] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed disabled:opacity-55'

const variants = {
  'solid-dark': {
    shell: 'bg-ink text-cream hover:shadow-[0_18px_50px_-18px_rgba(26,24,21,0.7)]',
    fill: 'bg-champagne',
    label: 'group-hover:text-ink',
  },
  'solid-light': {
    shell: 'bg-cream text-ink hover:shadow-[0_18px_50px_-18px_rgba(0,0,0,0.5)]',
    fill: 'bg-champagne-soft',
    label: 'group-hover:text-ink',
  },
  outline: {
    shell: 'border border-ink/25 text-ink hover:border-ink',
    fill: 'bg-ink',
    label: 'group-hover:text-cream',
  },
  'outline-light': {
    shell: 'border border-cream/35 text-cream hover:border-cream',
    fill: 'bg-cream',
    label: 'group-hover:text-ink',
  },
} as const

/**
 * Einheitlicher Call-to-Action. Beim Hover läuft eine Füllung von unten ein —
 * eine ruhige Bewegung, die ohne Farbwechsel auskommt.
 */
export default function CTAButton({
  href,
  children,
  variant = 'solid-dark',
  className = '',
  type = 'button',
  disabled,
  onClick,
}: CTAButtonProps) {
  const style = variants[variant]

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 group-disabled:hidden ${style.fill}`}
      />
      <span className={`relative transition-colors duration-500 ${style.label}`}>
        {children}
      </span>
    </>
  )

  if (href) {
    return (
      <a href={href} className={`${base} ${style.shell} ${className}`.trim()}>
        {content}
      </a>
    )
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${style.shell} ${className}`.trim()}
    >
      {content}
    </button>
  )
}
