'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface ParallaxProps {
  children: ReactNode
  /**
   * Stärke des Effekts. 0.15 = das Bild bewegt sich 15 % langsamer als die
   * Seite. Werte über 0.3 wirken schnell unruhig.
   */
  speed?: number
  className?: string
}

/**
 * Dezenter Parallax für großformatige Bilder.
 *
 * Der Scroll-Wert wird in requestAnimationFrame gelesen und ausschließlich per
 * `transform` angewandt — kein Layout, kein Repaint, damit auch auf Mobilgeräten
 * flüssig. Bei aktivierter Systemeinstellung „Bewegung reduzieren“ und auf
 * schmalen Viewports bleibt das Bild bewusst statisch.
 */
export default function Parallax({
  children,
  speed = 0.16,
  className = '',
}: ParallaxProps) {
  const container = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)

  /**
   * Läuft der Effekt tatsächlich? Nur dann bekommt die innere Fläche ihre
   * Überhöhe.
   *
   * Vorher stand die Überhöhe fest im Markup. Auf Mobilgeräten steigt diese
   * Komponente aber gleich wieder aus — dort wurden also 18 % der Bildhöhe
   * weggeschnitten, ohne dass sich je etwas bewegt hätte. Genau die Höhe,
   * die auf dem schmalen Hochformat-Rahmen ohnehin am meisten fehlt.
   */
  const [active, setActive] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const smallScreen = window.matchMedia('(max-width: 768px)')
    if (reducedMotion.matches || smallScreen.matches) return

    setActive(true)

    const wrapper = container.current
    const target = inner.current
    if (!wrapper || !target) return

    let frame = 0
    let visible = false

    const update = () => {
      frame = 0
      const rect = wrapper.getBoundingClientRect()
      // Fortschritt des Elements durch den Viewport: -1 (unten) … 1 (oben)
      const progress =
        (rect.top + rect.height / 2 - window.innerHeight / 2) /
        (window.innerHeight / 2 + rect.height / 2)
      const offset = progress * speed * rect.height
      target.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`
    }

    const onScroll = () => {
      if (!visible || frame) return
      frame = requestAnimationFrame(update)
    }

    // Nur rechnen, solange der Bereich tatsächlich im Bild ist.
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting
        if (visible) update()
      },
      { rootMargin: '100px 0px' },
    )

    observer.observe(wrapper)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
      setActive(false)
    }
  }, [speed])

  return (
    <div ref={container} className={`overflow-hidden ${className}`.trim()}>
      {/* Nur beim laufenden Effekt etwas höher als der Rahmen, damit beim
          Versatz keine Kante frei wird. Steht der Effekt still, füllt das
          Bild den Rahmen genau — ohne unnötigen Beschnitt. */}
      <div
        ref={inner}
        className={active ? 'h-[118%] w-full will-change-transform' : 'h-full w-full'}
      >
        {children}
      </div>
    </div>
  )
}
