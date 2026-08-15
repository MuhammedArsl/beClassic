import 'server-only'
import { getSupabase } from './supabase'
import {
  formatDate,
  occasionLabel,
  type Inquiry,
  type InquiryMessage,
  type NewInquiry,
} from './inquiry-shared'

/**
 * Datenbankzugriff für Anfragen und Nachrichtenverlauf.
 *
 * Ausschliesslich serverseitig (`server-only`). Typen, Beschriftungen und
 * Formatierer, die auch der Browser braucht, stehen in
 * lib/inquiry-shared.ts.
 */

// Der Bequemlichkeit halber weiterreichen, damit Server-Komponenten nur
// ein Modul importieren müssen.
export * from './inquiry-shared'

/* ── Lesen ──────────────────────────────────────────────────── */

/**
 * Alle Anfragen, neueste zuerst.
 *
 * Wirft nicht: Ist Supabase nicht eingerichtet oder die Abfrage
 * fehlgeschlagen, kommt eine leere Liste zurück und das Dashboard zeigt
 * den Einrichtungshinweis, statt mit einem Fehler abzubrechen.
 */
export async function listInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[BeClassic] Anfragen konnten nicht geladen werden:', error.message)
    return []
  }

  return (data ?? []) as Inquiry[]
}

export async function getInquiry(id: string): Promise<Inquiry | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    console.error('[BeClassic] Anfrage konnte nicht geladen werden:', error.message)
    return null
  }

  return (data as Inquiry) ?? null
}

/** Nachrichtenverlauf einer Anfrage, älteste zuerst. */
export async function getMessages(inquiryId: string): Promise<InquiryMessage[]> {
  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('inquiry_messages')
    .select('*')
    .eq('inquiry_id', inquiryId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[BeClassic] Verlauf konnte nicht geladen werden:', error.message)
    return []
  }

  return (data ?? []) as InquiryMessage[]
}

/* ── Schreiben ──────────────────────────────────────────────── */

/**
 * Legt eine Anfrage an und schreibt die Formularnachricht als erste
 * eingehende Nachricht in den Verlauf.
 *
 * Rückgabe `null` bedeutet: Supabase ist nicht eingerichtet. Ein echter
 * Datenbankfehler wird dagegen geworfen — der Absender darf keine
 * Bestätigung sehen, wenn seine Anfrage nirgends gelandet ist.
 */
export async function createInquiry(input: NewInquiry): Promise<Inquiry | null> {
  const supabase = getSupabase()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      first_name: input.firstName,
      last_name: input.lastName,
      email: input.email,
      phone: input.phone,
      start_date: input.startDate,
      end_date: input.endDate || null,
      occasion: input.occasion,
      pickup_location: input.pickupLocation || null,
      message: input.message || null,
      vehicle: input.vehicle || null,
      vehicle_slug: input.vehicleSlug || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Anfrage konnte nicht gespeichert werden: ${error.message}`)
  }

  const inquiry = data as Inquiry

  // Die Formularnachricht eröffnet den Verlauf. Hat der Absender nichts
  // geschrieben, wird die Anfrage selbst als Eröffnung festgehalten — so
  // beginnt jeder Verlauf mit einem eingehenden Eintrag.
  const opening =
    input.message?.trim() ||
    `Anfrage über das Formular — ${occasionLabel(input.occasion)}, ${formatDate(input.startDate)}.`

  const { error: messageError } = await supabase.from('inquiry_messages').insert({
    inquiry_id: inquiry.id,
    direction: 'eingehend',
    body: opening,
  })

  // Der Verlaufseintrag ist Beiwerk — schlägt er fehl, ist die Anfrage
  // trotzdem gespeichert und darf nicht durch einen Fehler verloren gehen.
  if (messageError) {
    console.error('[BeClassic] Verlaufseintrag fehlgeschlagen:', messageError.message)
  }

  return inquiry
}

/** Hängt eine Nachricht an den Verlauf an. */
export async function addMessage(entry: {
  inquiryId: string
  direction: 'eingehend' | 'ausgehend'
  body: string
  emailSent?: boolean
  emailError?: string | null
}): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase ist nicht eingerichtet.')

  const { error } = await supabase.from('inquiry_messages').insert({
    inquiry_id: entry.inquiryId,
    direction: entry.direction,
    body: entry.body,
    email_sent: entry.emailSent ?? false,
    email_error: entry.emailError ?? null,
  })

  if (error) {
    throw new Error(`Nachricht konnte nicht gespeichert werden: ${error.message}`)
  }
}

/** Aktualisiert einzelne Felder einer Anfrage. */
export async function updateInquiry(
  id: string,
  patch: Partial<
    Pick<
      Inquiry,
      | 'status'
      | 'appointment_start'
      | 'appointment_end'
      | 'appointment_location'
      | 'internal_note'
    >
  >,
): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase ist nicht eingerichtet.')

  const { error } = await supabase.from('inquiries').update(patch).eq('id', id)

  if (error) {
    throw new Error(`Anfrage konnte nicht aktualisiert werden: ${error.message}`)
  }
}

/** Löscht eine Anfrage samt Verlauf (Fremdschlüssel mit ON DELETE CASCADE). */
export async function deleteInquiry(id: string): Promise<void> {
  const supabase = getSupabase()
  if (!supabase) throw new Error('Supabase ist nicht eingerichtet.')

  const { error } = await supabase.from('inquiries').delete().eq('id', id)

  if (error) {
    throw new Error(`Anfrage konnte nicht gelöscht werden: ${error.message}`)
  }
}
