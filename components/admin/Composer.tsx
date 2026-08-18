'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { logIncoming, sendReply, type ActionResult } from '@/app/admin/actions'
import { replyMailtoUrl } from '@/lib/inquiry-shared'
import ActionFeedback from './ActionFeedback'

/**
 * Eingabefeld für den Nachrichtenverlauf — mit zwei Betriebsarten:
 *
 *   Antworten          → geht per E-Mail an den Kunden und in den Verlauf
 *   Eingang festhalten → nur in den Verlauf, für Antworten die per Telefon
 *                        oder direkt per E-Mail kamen
 *
 * Ohne die zweite Variante hätte der Verlauf Lücken, sobald ein Gespräch
 * ausserhalb des Systems stattfindet.
 */

type Mode = 'antwort' | 'eingang'

export default function Composer({
  inquiryId,
  customerEmail,
  customerFirstName,
  occasion,
  mailConfigured,
}: {
  inquiryId: string
  customerEmail: string
  customerFirstName: string
  occasion: string
  mailConfigured: boolean
}) {
  const [mode, setMode] = useState<Mode>('antwort')

  const [replyState, replyAction, replyPending] = useActionState<
    ActionResult | null,
    FormData
  >(sendReply, null)

  const [incomingState, incomingAction, incomingPending] = useActionState<
    ActionResult | null,
    FormData
  >(logIncoming, null)

  const isReply = mode === 'antwort'
  const state = isReply ? replyState : incomingState
  const pending = isReply ? replyPending : incomingPending

  const formRef = useRef<HTMLFormElement>(null)
  const [draft, setDraft] = useState('')

  /* Der zuletzt abgeschickte Text. Nötig, weil das Eingabefeld nach Erfolg
     geleert wird — für die Brücke ins Mailprogramm brauchen wir ihn danach
     aber noch einmal. */
  const letzterEntwurf = useRef('')

  useEffect(() => {
    if (!state?.ok) return

    /* Ohne eingerichteten Versand hat der Server nichts verschickt; die
       Antwort steht nur im Verlauf. Statt sie dort liegen zu lassen, öffnen
       wir das Mailprogramm mit Empfänger, Betreff und fertigem Text —
       abschicken tut es dann der Mensch, aus seinem eigenen Konto.

       Der Wortlaut kommt aus lib/inquiry-shared.ts, also aus derselben
       Quelle wie beim Versand über Resend. */
    if (isReply && !mailConfigured && letzterEntwurf.current.trim()) {
      window.location.href = replyMailtoUrl({
        email: customerEmail,
        firstName: customerFirstName,
        occasion,
        body: letzterEntwurf.current,
      })
    }

    // Feld leeren — sonst steht der eben gesendete Text noch einmal da und
    // wird versehentlich doppelt geschickt.
    setDraft('')
    letzterEntwurf.current = ''
    formRef.current?.reset()
  }, [state])

  return (
    <div className="border border-line bg-shell/40 p-4 sm:p-6">
      {/* Umschalter */}
      <div className="flex gap-2" role="tablist">
        <ModeButton
          active={isReply}
          onClick={() => setMode('antwort')}
          label="Antworten"
        />
        <ModeButton
          active={!isReply}
          onClick={() => setMode('eingang')}
          label="Eingang festhalten"
        />
      </div>

      <form
        ref={formRef}
        action={isReply ? replyAction : incomingAction}
        className="mt-5"
        // key erzwingt ein frisches Formular beim Wechsel der Betriebsart,
        // damit keine Rückmeldung der anderen Variante stehen bleibt.
        key={mode}
      >
        <input type="hidden" name="id" value={inquiryId} />

        <label htmlFor="body" className="sr-only">
          {isReply ? 'Antwort an den Kunden' : 'Eingegangene Nachricht'}
        </label>
        <textarea
          id="body"
          name="body"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value)
            letzterEntwurf.current = event.target.value
          }}
          rows={6}
          required
          placeholder={
            isReply
              ? `Ihre Antwort an ${customerEmail} …`
              : 'Was der Kunde per Telefon oder E-Mail mitgeteilt hat …'
          }
          /* text-base = 16 px: darunter zoomt Safari auf dem iPhone beim
             Hineintippen automatisch heran. */
          className="w-full resize-y border border-line bg-cream px-4 py-3 text-base leading-relaxed text-ink outline-none transition-colors duration-300 placeholder:text-mist/70 focus:border-ink"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <p className="text-[0.8125rem] text-mist">
            {isReply
              ? mailConfigured
                ? `Geht per E-Mail an ${customerEmail}.`
                : `Wird gespeichert und in Ihrem Mailprogramm an ${customerEmail} vorbereitet — abgeschickt wird dort.`
              : 'Wird nur im Verlauf gespeichert, es geht nichts raus.'}
          </p>

          <button
            type="submit"
            disabled={pending || draft.trim().length === 0}
            className="bg-ink px-6 py-3 text-[0.8125rem] uppercase tracking-[0.18em] text-cream transition-opacity duration-300 hover:opacity-85 disabled:opacity-40"
          >
            {/* Der Knopf soll nicht „senden“ heißen, wenn nichts gesendet
                wird — sonst hält man die Antwort für draußen, während sie
                nur im Verlauf liegt. */}
            {pending
              ? 'Einen Moment …'
              : isReply
                ? mailConfigured
                  ? 'Antwort senden'
                  : 'Im Mailprogramm öffnen'
                : 'Festhalten'}
          </button>
        </div>

        <ActionFeedback state={state} />
      </form>
    </div>
  )
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`px-4 py-2 text-[0.8125rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
        active ? 'bg-ink text-cream' : 'text-mist ring-1 ring-inset ring-line hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}
