import { occasionOptions, site } from '@/data/site'

/**
 * Typen, Beschriftungen und Formatierer rund um Anfragen.
 *
 * Bewusst OHNE Datenbankzugriff und ohne `server-only`: Diese Datei wird
 * auch von Client-Komponenten geladen (etwa der Statusleiste). Alles, was
 * Supabase anfasst, steht in lib/inquiries.ts und bleibt auf dem Server.
 */

/* ── Typen ──────────────────────────────────────────────────── */

export const INQUIRY_STATUSES = [
  'neu',
  'in_bearbeitung',
  'akzeptiert',
  'abgelehnt',
] as const

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number]

/** Anzeigetexte der Bearbeitungsstände — an einer Stelle gepflegt. */
export const STATUS_LABELS: Record<InquiryStatus, string> = {
  neu: 'Neu',
  in_bearbeitung: 'In Bearbeitung',
  akzeptiert: 'Akzeptiert',
  abgelehnt: 'Abgelehnt',
}

export interface Inquiry {
  id: string
  created_at: string
  updated_at: string
  first_name: string
  last_name: string
  email: string
  phone: string
  start_date: string
  end_date: string | null
  occasion: string
  message: string | null
  vehicle: string | null
  vehicle_slug: string | null
  status: InquiryStatus
  appointment_start: string | null
  appointment_end: string | null
  appointment_location: string | null
  internal_note: string | null
}

export interface InquiryMessage {
  id: string
  inquiry_id: string
  created_at: string
  direction: 'eingehend' | 'ausgehend'
  body: string
  email_sent: boolean
  email_error: string | null
}

/** Eingangsdaten aus dem öffentlichen Formular. */
export interface NewInquiry {
  firstName: string
  lastName: string
  email: string
  phone: string
  startDate: string
  endDate?: string
  occasion: string
  message?: string
  vehicle?: string
  vehicleSlug?: string
}

/* ── Darstellung ────────────────────────────────────────────── */

/** Voller Name — an vielen Stellen gebraucht, deshalb hier zentral. */
export function fullName(inquiry: Pick<Inquiry, 'first_name' | 'last_name'>): string {
  return `${inquiry.first_name} ${inquiry.last_name}`.trim()
}

/** Übersetzt den Anlass-Schlüssel in den Anzeigetext des Formulars. */
export function occasionLabel(value: string): string {
  return occasionOptions.find((option) => option.value === value)?.label ?? value
}

/**
 * Formatiert Datum und Uhrzeit in deutscher Schreibweise.
 *
 * Die Zeitzone ist fest auf Europe/Berlin gesetzt, damit Server und Browser
 * dasselbe anzeigen — sonst hinge das Ergebnis davon ab, wo die Anwendung
 * gerade läuft, und React meldete beim Abgleich einen Unterschied.
 */
export function formatDateTime(value: string | null): string {
  if (!value) return '—'
  return new Date(value).toLocaleString('de-DE', {
    timeZone: 'Europe/Berlin',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** Nur das Datum, ohne Uhrzeit. */
export function formatDate(value: string | null): string {
  if (!value) return '—'
  // Reine Datumsangaben (YYYY-MM-DD) ohne Zeitzonenumrechnung ausgeben:
  // sonst kippt der Erste eines Monats je nach Zeitzone auf den Vortag.
  const [year, month, day] = value.slice(0, 10).split('-')
  return `${day}.${month}.${year}`
}

/** Zählt die Anfragen je Bearbeitungsstand — für die Filterleiste. */
export function countByStatus(
  inquiries: Pick<Inquiry, 'status'>[],
): Record<InquiryStatus, number> {
  const counts = { neu: 0, in_bearbeitung: 0, akzeptiert: 0, abgelehnt: 0 }
  for (const inquiry of inquiries) counts[inquiry.status] += 1
  return counts
}

/* ── Antwort an den Kunden ──────────────────────────────────── */

/**
 * Betreff und Text einer Antwort — an einer Stelle, weil zwei Seiten sie
 * brauchen und sonst mit der Zeit auseinanderlaufen:
 *
 *   der Server, wenn er die Antwort über Resend verschickt
 *   (app/admin/actions.ts),
 *
 *   der Browser, wenn kein Versand eingerichtet ist und stattdessen das
 *   Mailprogramm mit fertigem Text geöffnet wird
 *   (components/admin/Composer.tsx).
 *
 * Der Wortlaut muss in beiden Fällen derselbe sein — der Kunde soll nicht
 * merken, auf welchem Weg die Nachricht entstanden ist.
 */
export function replySubject(occasion: string): string {
  return `Ihre Anfrage bei ${site.name} — ${occasionLabel(occasion)}`
}

export function replyText(firstName: string, body: string): string {
  return `Hallo ${firstName},\n\n${body}\n\nHerzliche Grüsse\n${site.name}\n${site.contact.phone}`
}

/**
 * `mailto:`-Adresse mit Empfänger, Betreff und fertigem Text.
 *
 * Zur Länge: Mailprogramme kürzen sehr lange `mailto:`-Adressen — Outlook
 * unter Windows bei etwa 2000 Zeichen. Das ist verkraftbar, weil der Text
 * ohnehin vollständig im Verlauf steht und dort notfalls herauskopiert
 * werden kann. Bei üblichen Antwortlängen tritt es nicht auf.
 */
export function replyMailtoUrl(options: {
  email: string
  firstName: string
  occasion: string
  body: string
}): string {
  const query = new URLSearchParams({
    subject: replySubject(options.occasion),
    body: replyText(options.firstName, options.body),
  })
  // URLSearchParams kodiert Leerzeichen als „+“. In einer mailto-Adresse
  // gehört dort %20 hin, sonst stehen Pluszeichen im Betreff des Kunden.
  return `mailto:${options.email}?${query.toString().replace(/\+/g, '%20')}`
}
