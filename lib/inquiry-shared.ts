import { occasionOptions } from '@/data/site'

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
  pickup_location: string | null
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
  pickupLocation?: string
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
