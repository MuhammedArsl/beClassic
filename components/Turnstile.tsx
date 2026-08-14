'use client'

import { useEffect, useRef } from 'react'

/** Ausschnitt der Turnstile-API, den wir tatsächlich verwenden. */
interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      'expired-callback'?: () => void
      'error-callback'?: () => void
      theme?: 'light' | 'dark' | 'auto'
      size?: 'normal' | 'compact' | 'flexible'
      language?: string
    },
  ) => string
  reset: (widgetId?: string) => void
  remove: (widgetId?: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
    onTurnstileReady?: () => void
  }
}

const SCRIPT_ID = 'cf-turnstile-script'
const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

interface TurnstileProps {
  siteKey: string
  /** Wird mit dem Prüf-Token aufgerufen, sobald die Prüfung bestanden ist. */
  onVerify: (token: string) => void
  /** Wird aufgerufen, wenn das Token abläuft oder ein Fehler auftritt. */
  onExpire?: () => void
  className?: string
}

/**
 * Cloudflare Turnstile — CAPTCHA-Ersatz.
 *
 * Für die allermeisten Besucher unsichtbar: Turnstile prüft im Hintergrund
 * Signale des Browsers und verlangt nur bei Verdacht eine Interaktion. Es
 * setzt keine Werbe-Cookies und arbeitet ohne Google.
 *
 * Das Widget wird bewusst „explicit“ gerendert, damit wir den Zeitpunkt und
 * das Aufräumen selbst steuern und React den Container nicht überschreibt.
 */
export default function Turnstile({
  siteKey,
  onVerify,
  onExpire,
  className = '',
}: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  // Callbacks in Refs halten, damit ein neuer Render das Widget nicht neu baut.
  const onVerifyRef = useRef(onVerify)
  const onExpireRef = useRef(onExpire)
  onVerifyRef.current = onVerify
  onExpireRef.current = onExpire

  useEffect(() => {
    let cancelled = false

    const renderWidget = () => {
      if (cancelled) return
      if (!container.current || !window.turnstile) return
      // Doppeltes Rendern verhindern (React Strict Mode ruft Effekte doppelt auf).
      if (widgetId.current) return

      widgetId.current = window.turnstile.render(container.current, {
        sitekey: siteKey,
        theme: 'light',
        size: 'flexible',
        language: 'de',
        callback: (token) => onVerifyRef.current(token),
        'expired-callback': () => onExpireRef.current?.(),
        'error-callback': () => onExpireRef.current?.(),
      })
    }

    if (window.turnstile) {
      renderWidget()
    } else if (document.getElementById(SCRIPT_ID)) {
      // Script lädt bereits (zweite Instanz) — auf das load-Ereignis warten.
      document
        .getElementById(SCRIPT_ID)
        ?.addEventListener('load', renderWidget, { once: true })
    } else {
      const script = document.createElement('script')
      script.id = SCRIPT_ID
      script.src = SCRIPT_SRC
      script.async = true
      script.defer = true
      script.addEventListener('load', renderWidget, { once: true })
      document.head.appendChild(script)
    }

    return () => {
      cancelled = true
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current)
        widgetId.current = null
      }
    }
  }, [siteKey])

  return <div ref={container} className={className} />
}
