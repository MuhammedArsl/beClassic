import type { ActionResult } from '@/app/admin/actions'

/**
 * Rückmeldung einer Server-Action.
 *
 * An einer Stelle definiert, damit Erfolg und Fehler im ganzen Dashboard
 * gleich aussehen — und damit `role="status"` bzw. `role="alert"` überall
 * gesetzt ist und Screenreader die Meldung vorlesen.
 */
export default function ActionFeedback({
  state,
  className = 'mt-4',
}: {
  state: ActionResult | null
  className?: string
}) {
  if (!state) return null

  return (
    <p
      role={state.ok ? 'status' : 'alert'}
      aria-live="polite"
      className={`${className} border-l-2 px-4 py-3 text-[0.875rem] leading-relaxed ${
        state.ok
          ? 'border-champagne bg-sand/50 text-ink'
          : 'border-ink bg-sand/70 text-ink'
      }`}
    >
      {state.message}
    </p>
  )
}
