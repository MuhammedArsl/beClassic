'use client'

import { useActionState, useState } from 'react'
import { acceptInquiry, type ActionResult } from '@/app/admin/actions'
import ActionFeedback from './ActionFeedback'

/**
 * Termin festlegen und die Anfrage annehmen.
 *
 * ZEITZONEN — der heikle Teil:
 * Ein `datetime-local`-Feld liefert „2026-08-20T14:00“ ganz ohne Zeitzone.
 * Würde dieser Text an den Server gehen, hinge die Bedeutung davon ab, in
 * welcher Zeitzone der Server läuft — der Termin könnte um Stunden
 * verrutschen. Deshalb rechnet der Browser den Wert hier in einen
 * eindeutigen ISO-Zeitstempel um und schickt diesen in einem versteckten
 * Feld mit. Der Browser weiss als Einziger sicher, welche Ortszeit gemeint
 * war.
 */

/** „2026-08-20T14:00“ (Ortszeit) → „2026-08-20T12:00:00.000Z“ */
function toIso(localValue: string): string {
  if (!localValue) return ''
  const date = new Date(localValue)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString()
}

/** Umgekehrter Weg — für die Vorbelegung eines bereits gesetzten Termins. */
function toLocalInput(iso: string | null): string {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''

  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export default function AppointmentForm({
  inquiry,
  mailConfigured,
}: {
  inquiry: {
    id: string
    start_date: string
    appointment_start: string | null
    appointment_end: string | null
    appointment_location: string | null
    status: string
  }
  mailConfigured: boolean
}) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    acceptInquiry,
    null,
  )

  // Vorbelegung: ein bereits gesetzter Termin, sonst der Wunschtag aus der
  // Anfrage um 10 Uhr — das spart im Regelfall die Datumseingabe.
  const [start, setStart] = useState(
    () =>
      toLocalInput(inquiry.appointment_start) ||
      `${inquiry.start_date.slice(0, 10)}T10:00`,
  )
  const [end, setEnd] = useState(() => toLocalInput(inquiry.appointment_end))

  const isUpdate = inquiry.status === 'akzeptiert'

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="id" value={inquiry.id} />
      {/* Die eindeutigen Zeitstempel — siehe Erklärung oben. */}
      <input type="hidden" name="appointmentStart" value={toIso(start)} />
      <input type="hidden" name="appointmentEnd" value={toIso(end)} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="startInput" className={labelClass}>
            Beginn <span className="text-champagne">*</span>
          </label>
          <input
            id="startInput"
            type="datetime-local"
            value={start}
            onChange={(event) => setStart(event.target.value)}
            required
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="endInput" className={labelClass}>
            Ende
          </label>
          <input
            id="endInput"
            type="datetime-local"
            value={end}
            min={start}
            onChange={(event) => setEnd(event.target.value)}
            className={fieldClass}
          />
          <p className="mt-2 text-[0.8125rem] text-mist">
            Leer lassen — dann wird eine Stunde angesetzt.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="appointmentLocation" className={labelClass}>
          Treffpunkt
        </label>
        <input
          id="appointmentLocation"
          name="appointmentLocation"
          type="text"
          defaultValue={inquiry.appointment_location ?? ''}
          placeholder="z. B. Standesamt, Hotel oder Adresse"
          className={fieldClass}
        />
      </div>

      <label className="flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          name="notifyCustomer"
          defaultChecked={mailConfigured}
          disabled={!mailConfigured}
          className="mt-1 h-4 w-4 shrink-0 cursor-pointer accent-[#1a1815] disabled:cursor-not-allowed disabled:opacity-40"
        />
        <span className="text-[0.9375rem] leading-relaxed text-mist">
          Bestätigung an den Kunden senden — mit dem Termin als Kalenderdatei im
          Anhang.
          {!mailConfigured && (
            <span className="mt-1 block text-[0.8125rem]">
              Nicht möglich: Es ist kein <code className="text-ink">RESEND_API_KEY</code>{' '}
              hinterlegt.
            </span>
          )}
        </span>
      </label>

      <button
        type="submit"
        disabled={pending || !start}
        className="w-full bg-champagne px-6 py-4 text-[0.8125rem] uppercase tracking-[0.18em] text-cream transition-opacity duration-300 hover:opacity-85 disabled:opacity-40 sm:w-auto"
      >
        {pending
          ? 'Wird gespeichert …'
          : isUpdate
            ? 'Termin ändern'
            : 'Annehmen & Termin festlegen'}
      </button>

      <ActionFeedback state={state} className="" />
    </form>
  )
}

const labelClass =
  'block text-[0.8125rem] font-medium uppercase tracking-[0.14em] text-mist'

/**
 * Mindestens 1rem (16 px): Safari auf dem iPhone zoomt beim Hineintippen
 * automatisch heran, sobald ein Eingabefeld kleiner gesetzt ist — die Seite
 * bleibt danach verschoben stehen. Darunter darf hier nichts liegen.
 */
const fieldClass =
  'mt-2 w-full border border-line bg-cream px-4 py-3 text-base text-ink outline-none transition-colors duration-300 focus:border-ink'
