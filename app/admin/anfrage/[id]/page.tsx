import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  fullName,
  formatDate,
  formatDateTime,
  getInquiry,
  getMessages,
  occasionLabel,
  type Inquiry,
  type InquiryMessage,
} from '@/lib/inquiries'
import { isMailConfigured } from '@/lib/mail'
import { site } from '@/data/site'
import StatusBadge from '@/components/admin/StatusBadge'
import Composer from '@/components/admin/Composer'
import AppointmentForm from '@/components/admin/AppointmentForm'
import StatusControl from '@/components/admin/StatusControl'

/**
 * Detailansicht einer Anfrage: Stammdaten, Nachrichtenverlauf,
 * Terminvergabe und Kalenderdatei.
 */

export const dynamic = 'force-dynamic'

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const inquiry = await getInquiry(id)
  if (!inquiry) notFound()

  const messages = await getMessages(id)
  const mailConfigured = isMailConfigured()

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12 sm:px-10 sm:py-16">
      {/* Kopfzeile */}
      <div className="border-b border-line pb-8">
        <Link
          href="/admin"
          className="link-underline text-[0.8125rem] uppercase tracking-[0.18em] text-mist"
        >
          ← Alle Anfragen
        </Link>

        <div className="mt-5 flex flex-wrap items-center gap-4">
          <StatusBadge status={inquiry.status} />
          <h1 className="display text-[clamp(1.75rem,3.5vw,2.5rem)] leading-tight text-ink">
            {fullName(inquiry)}
          </h1>
        </div>

        <p className="mt-2 text-[0.9375rem] text-mist">
          {occasionLabel(inquiry.occasion)}
          {inquiry.vehicle ? ` · ${inquiry.vehicle}` : ''} · Eingang{' '}
          {formatDateTime(inquiry.created_at)}
        </p>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-14">
        {/* Hauptspalte: Daten, Termin, Verlauf */}
        <div className="lg:col-span-7">
          <Facts inquiry={inquiry} />

          {/* Termin */}
          <section className="mt-12">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="eyebrow">Termin</h2>
              {inquiry.appointment_start && (
                <a
                  href={`/api/admin/ics/${inquiry.id}`}
                  className="text-[0.8125rem] uppercase tracking-[0.18em] text-champagne underline underline-offset-4 transition-opacity hover:opacity-75"
                >
                  ↓ Kalenderdatei (.ics)
                </a>
              )}
            </div>

            {inquiry.appointment_start && (
              <div className="mt-4 border-l-2 border-champagne bg-sand/40 px-5 py-4">
                <p className="text-[1.0625rem] text-ink">
                  {formatDateTime(inquiry.appointment_start)}
                  {inquiry.appointment_end &&
                    ` – ${formatDateTime(inquiry.appointment_end)}`}
                </p>
                {inquiry.appointment_location && (
                  <p className="mt-1 text-[0.9375rem] text-mist">
                    {inquiry.appointment_location}
                  </p>
                )}
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-mist">
                  Datei herunterladen und doppelklicken — Apple Kalender legt den
                  Termin direkt an. In Google Kalender über Einstellungen →
                  Importieren.
                </p>
              </div>
            )}

            <div className="mt-6">
              <AppointmentForm inquiry={inquiry} mailConfigured={mailConfigured} />
            </div>
          </section>

          {/* Verlauf */}
          <section className="mt-14">
            <h2 className="eyebrow">Verlauf</h2>
            <Conversation messages={messages} customerName={inquiry.first_name} />

            <div className="mt-8">
              <Composer
                inquiryId={inquiry.id}
                customerEmail={inquiry.email}
                mailConfigured={mailConfigured}
              />
            </div>
          </section>
        </div>

        {/* Seitenspalte: Kontakt und Bearbeitung */}
        <aside className="lg:col-span-5">
          <div className="lg:sticky lg:top-10 space-y-10">
            <section>
              <h2 className="eyebrow">Kontakt</h2>
              <div className="mt-4 space-y-2">
                <a
                  href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                    `Ihre Anfrage bei ${site.name}`,
                  )}`}
                  className="link-underline block w-fit text-[1.0625rem] text-ink"
                >
                  {inquiry.email}
                </a>
                <a
                  href={`tel:${inquiry.phone.replace(/[^\d+]/g, '')}`}
                  className="link-underline block w-fit text-[1.0625rem] text-ink"
                >
                  {inquiry.phone}
                </a>
              </div>
            </section>

            <StatusControl
              inquiryId={inquiry.id}
              currentStatus={inquiry.status}
              note={inquiry.internal_note}
            />
          </div>
        </aside>
      </div>
    </main>
  )
}

/* ── Bausteine ──────────────────────────────────────────────── */

/** Die Angaben aus dem Formular, unverändert. */
function Facts({ inquiry }: { inquiry: Inquiry }) {
  const rows: Array<[string, string]> = [
    ['Wunschdatum', formatDate(inquiry.start_date)],
    ...(inquiry.end_date
      ? ([['Rückgabe', formatDate(inquiry.end_date)]] as Array<[string, string]>)
      : []),
    ['Anlass', occasionLabel(inquiry.occasion)],
    ...(inquiry.vehicle
      ? ([['Fahrzeug', inquiry.vehicle]] as Array<[string, string]>)
      : []),
  ]

  return (
    <section>
      <h2 className="eyebrow">Angaben</h2>
      <dl className="mt-4 divide-y divide-line border-y border-line">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6 py-3">
            <dt className="text-[0.9375rem] text-mist">{label}</dt>
            <dd className="text-right text-[0.9375rem] text-ink">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

/** Nachrichtenverlauf — eingehend links, ausgehend rechts abgesetzt. */
function Conversation({
  messages,
  customerName,
}: {
  messages: InquiryMessage[]
  customerName: string
}) {
  if (messages.length === 0) {
    return (
      <p className="mt-4 text-[0.9375rem] text-mist">Noch keine Nachrichten.</p>
    )
  }

  return (
    <ol className="mt-5 space-y-5">
      {messages.map((message) => {
        const outgoing = message.direction === 'ausgehend'

        return (
          <li
            key={message.id}
            className={outgoing ? 'sm:pl-10' : 'sm:pr-10'}
          >
            <div
              className={`border-l-2 px-5 py-4 ${
                outgoing
                  ? 'border-ink bg-shell/60'
                  : 'border-champagne-soft bg-sand/40'
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-[0.75rem] font-medium uppercase tracking-[0.14em] text-mist">
                  {outgoing ? site.name : customerName}
                </span>
                <span className="text-[0.75rem] text-mist">
                  {formatDateTime(message.created_at)}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-[0.9375rem] leading-relaxed text-ink">
                {message.body}
              </p>

              {/* Versandprotokoll — nur zeigen, wenn etwas schiefging. */}
              {outgoing && !message.email_sent && (
                <p className="mt-3 border-t border-line pt-3 text-[0.8125rem] leading-relaxed text-mist">
                  Nicht per E-Mail versendet
                  {message.email_error ? `: ${message.email_error}` : '.'}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
