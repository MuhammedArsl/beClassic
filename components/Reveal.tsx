'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type RevealVariant = 'fade' | 'line' | 'image'

interface RevealProps {
  children: ReactNode
  /** Verzögerung in Millisekunden — für gestaffelte Gruppen. */
  delay?: number
  /**
   * `fade`  — Element blendet ein und steigt leicht auf (Standard)
   * `line`  — Textzeile schiebt sich hinter einer Kante hervor
   * `image` — Bild fährt sanft aus einer leichten Vergrößerung zurück
   */
  variant?: RevealVariant
  /** Anteil des Elements, der sichtbar sein muss (0–1). */
  threshold?: number
  className?: string
  /** Gerendertes HTML-Element, z. B. 'span' innerhalb einer Headline. */
  as?: ElementType
}

const variantClass: Record<RevealVariant, string> = {
  fade: 'reveal',
  line: 'reveal-line',
  image: 'reveal reveal-image',
}

/**
 * Blendet Inhalte ein, sobald sie in den Viewport scrollen.
 *
 * Nutzt IntersectionObserver statt einer Animations-Bibliothek — das hält das
 * JavaScript-Bundle klein und die Scroll-Performance hoch. Die eigentliche
 * Animation liegt als CSS-Transition in globals.css, läuft also auf dem
 * Compositor und respektiert `prefers-reduced-motion`.
 */
export default function Reveal({
  children,
  delay = 0,
  variant = 'fade',
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Ohne IntersectionObserver (sehr alte Browser) sofort anzeigen.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          // Einmalig — der Inhalt soll beim Zurückscrollen nicht erneut animieren.
          observer.unobserve(entry.target)
        }
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <Tag
      ref={ref}
      data-visible={visible}
      className={`${variantClass[variant]} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
    >
      {variant === 'line' ? <span>{children}</span> : children}
    </Tag>
  )
}
