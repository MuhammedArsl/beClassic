import {
  fullName,
  occasionLabel,
  formatDate,
  type Inquiry,
} from './inquiry-shared'
import { site } from '@/data/site'

/**
 * Erzeugt eine Kalenderdatei (.ics) zu einer bestätigten Anfrage.
 *
 * Die Datei folgt RFC 5545 und wird von Apple Kalender, Google Kalender,
 * Outlook und Thunderbird gleichermassen gelesen. Zeiten werden in UTC
 * geschrieben (Suffix `Z`) — dadurch entfällt ein VTIMEZONE-Block und der
 * Termin liegt in jeder Zeitzone auf dem richtigen Moment.
 */

/** Maskiert Sonderzeichen, die im ICS-Format eine Bedeutung haben. */
function escape(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

/** 2026-08-20T14:00:00.000Z → 20260820T140000Z */
function toIcsDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/**
 * Faltet Zeilen auf 75 Oktette, wie es die Norm verlangt.
 *
 * Gezählt wird in Bytes, nicht in Zeichen: Umlaute belegen in UTF-8 zwei
 * Bytes, und ein Umbruch mitten in einem Zeichen macht die Datei unlesbar.
 */
function fold(line: string): string {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line

  const parts: string[] = []
  let start = 0

  while (start < bytes.length) {
    // Erste Zeile 75 Bytes, Folgezeilen 74 (ein Byte geht für das
    // führende Leerzeichen der Fortsetzung ab).
    let end = Math.min(start + (parts.length === 0 ? 75 : 74), bytes.length)

    // Nicht mitten in ein Mehrbyte-Zeichen schneiden: Fortsetzungsbytes
    // beginnen mit den Bits 10xxxxxx.
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) {
      end -= 1
    }

    parts.push(bytes.subarray(start, end).toString('utf8'))
    start = end
  }

  return parts.join('\r\n ')
}

/**
 * Endzeitpunkt des Termins.
 *
 * Ist keiner gesetzt, wird eine Stunde nach Beginn angenommen — ein Termin
 * ohne Ende wird von manchen Kalendern sonst als ganztägig dargestellt.
 */
function resolveEnd(inquiry: Inquiry, start: Date): Date {
  if (inquiry.appointment_end) return new Date(inquiry.appointment_end)
  return new Date(start.getTime() + 60 * 60 * 1000)
}

/** Beschreibungstext des Termins — alles, was bei der Fahrt gebraucht wird. */
function buildDescription(inquiry: Inquiry): string {
  const lines = [
    `Anlass: ${occasionLabel(inquiry.occasion)}`,
    `Kunde: ${fullName(inquiry)}`,
    `E-Mail: ${inquiry.email}`,
    `Telefon: ${inquiry.phone}`,
  ]

  if (inquiry.vehicle) lines.push(`Fahrzeug: ${inquiry.vehicle}`)

  lines.push(`Wunschdatum laut Anfrage: ${formatDate(inquiry.start_date)}`)
  if (inquiry.end_date) lines.push(`Rückgabe: ${formatDate(inquiry.end_date)}`)

  if (inquiry.message?.trim()) {
    lines.push('', 'Nachricht des Kunden:', inquiry.message.trim())
  }

  if (inquiry.internal_note?.trim()) {
    lines.push('', 'Interne Notiz:', inquiry.internal_note.trim())
  }

  return lines.join('\n')
}

/**
 * Baut den vollständigen ICS-Inhalt.
 *
 * Gibt `null` zurück, wenn kein Termin gesetzt ist — ohne Startzeitpunkt
 * gibt es nichts einzutragen.
 */
export function buildIcs(inquiry: Inquiry): string | null {
  if (!inquiry.appointment_start) return null

  const start = new Date(inquiry.appointment_start)
  if (Number.isNaN(start.getTime())) return null

  const end = resolveEnd(inquiry, start)

  const location = inquiry.appointment_location?.trim() || ''

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${site.name}//Anfragen//DE`,
    'CALSCALE:GREGORIAN',
    // PUBLISH statt REQUEST: Der Termin wird in den eigenen Kalender
    // gelegt, es wird keine Einladung an Teilnehmer verschickt.
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    // Stabile UID: Wird der Termin später geändert und erneut geladen,
    // aktualisiert der Kalender den bestehenden Eintrag, statt einen
    // zweiten anzulegen.
    `UID:${inquiry.id}@beclassic`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    // Bei jeder Änderung erhöht sich die Sequenz automatisch mit
    // updated_at — der Kalender erkennt die neuere Fassung.
    `SEQUENCE:${Math.floor(new Date(inquiry.updated_at).getTime() / 1000)}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    `SUMMARY:${escape(`${site.name} — ${occasionLabel(inquiry.occasion)} · ${fullName(inquiry)}`)}`,
    `DESCRIPTION:${escape(buildDescription(inquiry))}`,
    ...(location ? [`LOCATION:${escape(location)}`] : []),
    `ORGANIZER;CN=${escape(site.name)}:mailto:${site.contact.email}`,
    // Erinnerung 24 Stunden vorher.
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'TRIGGER:-P1D',
    `DESCRIPTION:${escape(`Morgen: ${occasionLabel(inquiry.occasion)} · ${fullName(inquiry)}`)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  // Zeilenende ist im ICS-Format zwingend CRLF.
  return lines.map(fold).join('\r\n') + '\r\n'
}

/** Dateiname für den Download — ohne Zeichen, die Dateisysteme stören. */
export function icsFilename(inquiry: Inquiry): string {
  const slug = `${fullName(inquiry)}-${occasionLabel(inquiry.occasion)}`
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return `beclassic-${slug || 'termin'}.ics`
}
