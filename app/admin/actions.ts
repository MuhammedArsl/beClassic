'use server'

import { revalidatePath } from 'next/cache'
import {
  addMessage,
  deleteInquiry,
  fullName,
  getInquiry,
  occasionLabel,
  updateInquiry,
  formatDateTime,
  INQUIRY_STATUSES,
  type InquiryStatus,
} from '@/lib/inquiries'
import { buildIcs, icsFilename } from '@/lib/ics'
import { sendMail } from '@/lib/mail'
import { site } from '@/data/site'

/**
 * Server-Actions des Dashboards.
 *
 * Alle Aktionen laufen ausschliesslich auf dem Server; der Zugang ist
 * bereits durch die Middleware abgesichert (siehe middleware.ts).
 *
 * Rückgabewert ist immer `ActionResult`, damit das Formular eine
 * Rückmeldung anzeigen kann, statt bei einem Fehler stumm zu bleiben.
 */

export interface ActionResult {
  ok: boolean
  message: string
}

function fail(error: unknown): ActionResult {
  const message = error instanceof Error ? error.message : 'Unbekannter Fehler.'
  console.error('[BeClassic Dashboard]', message)
  return { ok: false, message }
}

/** Aktualisiert Übersicht und Detailseite nach jeder Änderung. */
function refresh(id: string) {
  revalidatePath('/admin')
  revalidatePath(`/admin/anfrage/${id}`)
}

function text(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

/**
 * Wandelt die Eingabe eines datetime-local-Felds in einen Zeitstempel.
 *
 * Das Formular liefert bereits einen ISO-String mit Zeitzone (der Browser
 * rechnet ihn vor dem Absenden um, siehe AppointmentForm) — hier wird nur
 * noch geprüft, ob ein gültiges Datum dabei herauskommt.
 */
function timestamp(value: string): string | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

/* ── Antwort an den Kunden ──────────────────────────────────── */

/**
 * Schreibt eine Antwort in den Verlauf und versendet sie per E-Mail.
 *
 * Schlägt der Versand fehl (oder ist kein Schlüssel hinterlegt), bleibt die
 * Nachricht trotzdem im Verlauf stehen — der Text ist dann nicht verloren
 * und lässt sich über den mailto-Link von Hand verschicken.
 */
export async function sendReply(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = text(formData, 'id')
  const body = text(formData, 'body')

  if (!id) return { ok: false, message: 'Anfrage nicht gefunden.' }
  if (!body) return { ok: false, message: 'Bitte eine Nachricht eingeben.' }

  try {
    const inquiry = await getInquiry(id)
    if (!inquiry) return { ok: false, message: 'Anfrage nicht gefunden.' }

    const mail = await sendMail({
      to: inquiry.email,
      replyTo: site.contact.email,
      subject: `Ihre Anfrage bei ${site.name} — ${occasionLabel(inquiry.occasion)}`,
      text: `Hallo ${inquiry.first_name},\n\n${body}\n\nHerzliche Grüsse\n${site.name}\n${site.contact.phone}`,
    })

    await addMessage({
      inquiryId: id,
      direction: 'ausgehend',
      body,
      emailSent: mail.sent,
      emailError: mail.error ?? null,
    })

    // Eine beantwortete Anfrage ist nicht mehr „neu“.
    if (inquiry.status === 'neu') {
      await updateInquiry(id, { status: 'in_bearbeitung' })
    }

    refresh(id)

    return {
      ok: true,
      message: mail.sent
        ? 'Antwort versendet und im Verlauf gespeichert.'
        : `Im Verlauf gespeichert, aber nicht versendet: ${mail.error}`,
    }
  } catch (error) {
    return fail(error)
  }
}

/**
 * Hält eine Antwort des Kunden fest, die ausserhalb des Systems kam
 * (per E-Mail oder Telefon). Damit bleibt der Verlauf vollständig.
 */
export async function logIncoming(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = text(formData, 'id')
  const body = text(formData, 'body')

  if (!id) return { ok: false, message: 'Anfrage nicht gefunden.' }
  if (!body) return { ok: false, message: 'Bitte den Inhalt eintragen.' }

  try {
    await addMessage({ inquiryId: id, direction: 'eingehend', body })
    refresh(id)
    return { ok: true, message: 'Im Verlauf festgehalten.' }
  } catch (error) {
    return fail(error)
  }
}

/* ── Termin bestätigen ──────────────────────────────────────── */

/**
 * Setzt den Termin und schaltet die Anfrage auf „akzeptiert“.
 *
 * Erst danach steht die ICS-Datei zum Download bereit — ohne
 * Startzeitpunkt gäbe es nichts einzutragen.
 */
export async function acceptInquiry(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = text(formData, 'id')
  if (!id) return { ok: false, message: 'Anfrage nicht gefunden.' }

  const start = timestamp(text(formData, 'appointmentStart'))
  if (!start) return { ok: false, message: 'Bitte Beginn des Termins angeben.' }

  const end = timestamp(text(formData, 'appointmentEnd'))
  if (end && new Date(end) <= new Date(start)) {
    return { ok: false, message: 'Das Ende muss nach dem Beginn liegen.' }
  }

  const location = text(formData, 'appointmentLocation')
  const notifyCustomer = formData.get('notifyCustomer') === 'on'

  try {
    await updateInquiry(id, {
      status: 'akzeptiert',
      appointment_start: start,
      appointment_end: end,
      appointment_location: location || null,
    })

    // Frisch laden, damit die Bestätigungsmail und die ICS-Datei den
    // gerade gespeicherten Termin enthalten.
    const inquiry = await getInquiry(id)
    if (!inquiry) return { ok: false, message: 'Anfrage nicht gefunden.' }

    let note = 'Termin bestätigt.'

    if (notifyCustomer) {
      const ics = buildIcs(inquiry)
      const zeitraum = inquiry.appointment_end
        ? `${formatDateTime(inquiry.appointment_start)} – ${formatDateTime(inquiry.appointment_end)}`
        : formatDateTime(inquiry.appointment_start)

      const body = [
        `Hallo ${inquiry.first_name},`,
        '',
        'wir freuen uns — Ihr Termin ist bestätigt:',
        '',
        `Anlass:  ${occasionLabel(inquiry.occasion)}`,
        `Termin:  ${zeitraum}`,
        ...(inquiry.appointment_location ? [`Ort:     ${inquiry.appointment_location}`] : []),
        ...(inquiry.vehicle ? [`Fahrzeug: ${inquiry.vehicle}`] : []),
        '',
        'Im Anhang finden Sie den Termin als Kalenderdatei.',
        '',
        'Herzliche Grüsse',
        site.name,
        site.contact.phone,
      ].join('\n')

      const mail = await sendMail({
        to: inquiry.email,
        replyTo: site.contact.email,
        subject: `Terminbestätigung — ${site.name}`,
        text: body,
        attachments: ics
          ? [{ filename: icsFilename(inquiry), content: ics }]
          : undefined,
      })

      await addMessage({
        inquiryId: id,
        direction: 'ausgehend',
        body,
        emailSent: mail.sent,
        emailError: mail.error ?? null,
      })

      note = mail.sent
        ? 'Termin bestätigt und Bestätigung an den Kunden versendet.'
        : `Termin bestätigt. Die Bestätigungsmail ging nicht raus: ${mail.error}`
    }

    refresh(id)
    return { ok: true, message: `${note} Die Kalenderdatei steht jetzt bereit.` }
  } catch (error) {
    return fail(error)
  }
}

/* ── Weitere Änderungen ─────────────────────────────────────── */

/** Setzt den Bearbeitungsstand ohne weitere Nebenwirkungen. */
export async function setStatus(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = text(formData, 'id')
  const status = text(formData, 'status') as InquiryStatus

  if (!id) return { ok: false, message: 'Anfrage nicht gefunden.' }
  if (!INQUIRY_STATUSES.includes(status)) {
    return { ok: false, message: 'Unbekannter Bearbeitungsstand.' }
  }

  try {
    await updateInquiry(id, { status })
    refresh(id)
    return { ok: true, message: 'Bearbeitungsstand geändert.' }
  } catch (error) {
    return fail(error)
  }
}

/** Speichert die interne Notiz. */
export async function saveNote(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = text(formData, 'id')
  if (!id) return { ok: false, message: 'Anfrage nicht gefunden.' }

  try {
    await updateInquiry(id, { internal_note: text(formData, 'note') || null })
    refresh(id)
    return { ok: true, message: 'Notiz gespeichert.' }
  } catch (error) {
    return fail(error)
  }
}

/** Löscht die Anfrage samt Verlauf — für Spam und Testeinträge. */
export async function removeInquiry(
  _previous: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = text(formData, 'id')
  if (!id) return { ok: false, message: 'Anfrage nicht gefunden.' }

  try {
    const inquiry = await getInquiry(id)
    await deleteInquiry(id)
    revalidatePath('/admin')
    return {
      ok: true,
      message: inquiry
        ? `Anfrage von ${fullName(inquiry)} gelöscht.`
        : 'Anfrage gelöscht.',
    }
  } catch (error) {
    return fail(error)
  }
}
