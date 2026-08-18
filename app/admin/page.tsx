import Link from 'next/link'
import {
  countByStatus,
  fullName,
  formatDate,
  formatDateTime,
  listInquiries,
  occasionLabel,
  INQUIRY_STATUSES,
  STATUS_LABELS,
  type Inquiry,
  type InquiryStatus,
} from '@/lib/inquiries'
import { isSupabaseConfigured } from '@/lib/supabase'
import StatusBadge from '@/components/admin/StatusBadge'
import SetupNotice from '@/components/admin/SetupNotice'
import { site } from '@/data/site'

/**
 * Übersicht aller Anfragen.
 *
 * Gefiltert wird über die Adresszeile (?status=neu) statt über einen
 * Client-Zustand — dadurch ist jede Ansicht verlinkbar und die Seite kommt
 * ohne JavaScript aus.
 */

// Anfragen ändern sich laufend; eine zwischengespeicherte Fassung wäre
// hier immer veraltet.
export const dynamic = 'force-dynamic'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  const { status: statusParam } = await searchParams

  const configured = isSupabaseConfigured()
  const inquiries = await listInquiries()
  const counts = countByStatus(inquiries)

  const activeFilter = INQUIRY_STATUSES.includes(statusParam as InquiryStatus)
    ? (statusParam as InquiryStatus)
    : null

  const visible = activeFilter
    ? inquiries.filter((inquiry) => inquiry.status === activeFilter)
    : inquiries

  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12 sm:px-10 sm:py-16">
      {/* Kopfzeile */}
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
        <div>
          <p className="eyebrow">{site.name}</p>
          <h1 className="display mt-3 text-[clamp(2rem,4vw,2.75rem)] leading-tight text-ink">
            Anfragen
          </h1>
        </div>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="link-underline text-[0.8125rem] uppercase tracking-[0.18em] text-mist"
          >
            Zur Website
          </Link>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="link-underline text-[0.8125rem] uppercase tracking-[0.18em] text-mist transition-colors hover:text-ink"
            >
              Abmelden
            </button>
          </form>
        </div>
      </header>

      {!configured && (
        <div className="mt-10">
          <SetupNotice />
        </div>
      )}

      {/* Filterleiste */}
      {configured && inquiries.length > 0 && (
        <nav className="mt-8 flex flex-wrap gap-2" aria-label="Nach Stand filtern">
          <FilterChip
            href="/admin"
            label="Alle"
            count={inquiries.length}
            active={activeFilter === null}
          />
          {INQUIRY_STATUSES.map((status) => (
            <FilterChip
              key={status}
              href={`/admin?status=${status}`}
              label={STATUS_LABELS[status]}
              count={counts[status]}
              active={activeFilter === status}
            />
          ))}
        </nav>
      )}

      {/* Liste */}
      <div className="mt-8">
        {configured && inquiries.length === 0 && (
          <p className="border border-line px-6 py-10 text-center text-[0.9375rem] text-mist">
            Noch keine Anfragen eingegangen.
          </p>
        )}

        {visible.length === 0 && inquiries.length > 0 && (
          <p className="border border-line px-6 py-10 text-center text-[0.9375rem] text-mist">
            Keine Anfrage mit diesem Stand.
          </p>
        )}

        <ul className="divide-y divide-line border-y border-line">
          {visible.map((inquiry) => (
            <li key={inquiry.id}>
              <InquiryRow inquiry={inquiry} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

/* ── Bausteine ──────────────────────────────────────────────── */

function FilterChip({
  href,
  label,
  count,
  active,
}: {
  href: string
  label: string
  count: number
  active: boolean
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={`px-4 py-2 text-[0.8125rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
        active
          ? 'bg-ink text-cream'
          : 'text-mist ring-1 ring-inset ring-line hover:text-ink'
      }`}
    >
      {label}
      <span className={active ? 'ml-2 opacity-60' : 'ml-2 opacity-70'}>{count}</span>
    </Link>
  )
}

function InquiryRow({ inquiry }: { inquiry: Inquiry }) {
  return (
    /* Zuvor eine umbrechende Flex-Zeile: auf dem Handy passten Stand, Name
       und Termin nicht nebeneinander, der Termin rutschte in eine eigene
       Zeile und stand dort rechtsbündig unter dem Namen — als gehörte er
       nicht dazu. Als Grid stapelt die Zeile auf schmalen Geräten sauber
       untereinander und wird erst ab 640 px wieder dreispaltig. */
    <Link
      href={`/admin/anfrage/${inquiry.id}`}
      className="group grid gap-x-6 gap-y-2 px-1 py-4 transition-colors duration-300 hover:bg-shell/60 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:py-5"
    >
      <StatusBadge status={inquiry.status} className="justify-self-start" />

      <div className="min-w-0">
        <p className="text-[1.0625rem] text-ink transition-colors group-hover:text-champagne">
          {fullName(inquiry)}
        </p>
        <p className="mt-0.5 text-[0.875rem] text-mist">
          {occasionLabel(inquiry.occasion)}
          {inquiry.vehicle ? ` · ${inquiry.vehicle}` : ''}
        </p>
      </div>

      <div className="sm:text-right">
        <p className="text-[0.9375rem] text-ink">
          {/* Steht ein Termin fest, zählt der — sonst der Wunschtermin. */}
          {inquiry.appointment_start
            ? formatDateTime(inquiry.appointment_start)
            : formatDate(inquiry.start_date)}
        </p>
        <p className="mt-0.5 text-[0.8125rem] text-mist">
          Eingang {formatDate(inquiry.created_at)}
        </p>
      </div>
    </Link>
  )
}
