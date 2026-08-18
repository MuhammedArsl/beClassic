'use client'

import { useEffect, useState } from 'react'
import Logo from './Logo'

interface NavigationProps {
  /**
   * `overlay` — liegt über dem dunklen Hero und ist zunächst transparent
   * `solid`   — steht auf hellem Grund und ist von Beginn an sichtbar
   */
  variant?: 'overlay' | 'solid'
}

/**
 * Kopfleiste der One-Page.
 *
 * Bewusst auf zwei Elemente reduziert: Wortmarke und Anfrage-Button. Da die
 * gesamte Seite ein einziger Scrollweg ist, würde eine Linkliste nur vom
 * einzigen Ziel ablenken — der Anfrage. Beim Scrollen wird die Leiste
 * kompakter und legt einen hellen Grund unter sich.
 */
export default function Navigation({ variant = 'overlay' }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const compact = scrolled || variant === 'solid'
  const onDarkGround = variant === 'overlay' && !scrolled

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        compact
          ? 'border-b border-line bg-cream/85 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      {/* `gap` statt reinem `justify-between`: damit Wortmarke und Knopf auch
          auf schmalen Geräten garantiert Abstand halten, statt sich bei
          390 px auf null Lücke zusammenzuschieben. */}
      <div
        className={`mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-6 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:gap-8 sm:px-10 ${
          compact ? 'h-16 sm:h-[4.5rem]' : 'h-20 sm:h-28'
        }`}
      >
        <Logo
          tone={onDarkGround ? 'light' : 'dark'}
          showTagline={!compact}
          // Die Unterzeile erst ab 640 px: darunter bricht sie zweizeilig um
          // und läuft in den Knopf hinein.
          taglineClassName="hidden sm:block"
          className={`min-w-0 ${compact ? 'origin-left scale-[0.92]' : ''}`.trim()}
        />

        <a
          href="#anfrage"
          className={`group relative inline-flex shrink-0 items-center overflow-hidden rounded-full border px-5 py-3 text-[0.75rem] font-normal uppercase tracking-[0.14em] transition-colors duration-500 sm:px-8 sm:text-[0.875rem] sm:tracking-[0.2em] ${
            onDarkGround
              ? 'border-cream/35 text-cream hover:border-cream'
              : 'border-ink/25 text-ink hover:border-ink'
          }`}
        >
          {/* Füllung läuft beim Hover von unten ein */}
          <span
            aria-hidden="true"
            className={`absolute inset-0 origin-bottom scale-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 ${
              onDarkGround ? 'bg-cream' : 'bg-ink'
            }`}
          />
          <span
            className={`relative transition-colors duration-500 ${
              onDarkGround ? 'group-hover:text-ink' : 'group-hover:text-cream'
            }`}
          >
            Anfragen
          </span>
        </a>
      </div>
    </header>
  )
}
