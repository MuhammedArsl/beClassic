import { STATUS_LABELS, type InquiryStatus } from '@/lib/inquiry-shared'

/**
 * Farbcode der Bearbeitungsstände.
 *
 * Bewusst zurückhaltend im Farbsystem der Seite gehalten — nur „neu“ tritt
 * hervor, weil genau das die Anfragen sind, die noch Arbeit brauchen.
 */
const STYLES: Record<InquiryStatus, string> = {
  neu: 'bg-ink text-cream',
  in_bearbeitung: 'bg-champagne-soft text-ink',
  akzeptiert: 'bg-champagne text-cream',
  abgelehnt: 'bg-transparent text-mist ring-1 ring-inset ring-line-strong',
}

export default function StatusBadge({
  status,
  className = '',
}: {
  status: InquiryStatus
  className?: string
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-[0.14em] ${STYLES[status]} ${className}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
