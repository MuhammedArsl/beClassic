'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  removeInquiry,
  saveNote,
  setStatus,
  type ActionResult,
} from '@/app/admin/actions'
import {
  INQUIRY_STATUSES,
  STATUS_LABELS,
  type InquiryStatus,
} from '@/lib/inquiry-shared'
import ActionFeedback from './ActionFeedback'

/**
 * Bearbeitungsstand, interne Notiz und Löschen.
 *
 * Drei kleine Formulare in einem Baustein — sie stehen in der Seitenspalte
 * beieinander und teilen sich die Rückmeldezeile.
 */
export default function StatusControl({
  inquiryId,
  currentStatus,
  note,
}: {
  inquiryId: string
  currentStatus: InquiryStatus
  note: string | null
}) {
  const router = useRouter()

  const [statusState, statusAction, statusPending] = useActionState<
    ActionResult | null,
    FormData
  >(setStatus, null)

  const [noteState, noteAction, notePending] = useActionState<
    ActionResult | null,
    FormData
  >(saveNote, null)

  const [deleteState, deleteAction] = useActionState<ActionResult | null, FormData>(
    async (previous, formData) => {
      const result = await removeInquiry(previous, formData)
      // Die Anfrage gibt es nicht mehr — auf der Detailseite bleiben
      // wäre eine Sackgasse.
      if (result.ok) router.push('/admin')
      return result
    },
    null,
  )

  const [confirming, setConfirming] = useState(false)

  return (
    <div className="space-y-8">
      {/* Bearbeitungsstand */}
      <section>
        <h2 className="eyebrow">Bearbeitungsstand</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {INQUIRY_STATUSES.map((status) => (
            <form key={status} action={statusAction}>
              <input type="hidden" name="id" value={inquiryId} />
              <input type="hidden" name="status" value={status} />
              <button
                type="submit"
                disabled={statusPending || status === currentStatus}
                aria-current={status === currentStatus ? 'true' : undefined}
                className={`px-4 py-2 text-[0.8125rem] uppercase tracking-[0.12em] transition-colors duration-300 ${
                  status === currentStatus
                    ? 'cursor-default bg-ink text-cream'
                    : 'text-mist ring-1 ring-inset ring-line hover:text-ink disabled:opacity-40'
                }`}
              >
                {STATUS_LABELS[status]}
              </button>
            </form>
          ))}
        </div>
        <ActionFeedback state={statusState} />
      </section>

      {/* Interne Notiz */}
      <section>
        <h2 className="eyebrow">Interne Notiz</h2>
        <form action={noteAction} className="mt-4">
          <input type="hidden" name="id" value={inquiryId} />
          <label htmlFor="note" className="sr-only">
            Interne Notiz
          </label>
          <textarea
            id="note"
            name="note"
            defaultValue={note ?? ''}
            rows={4}
            placeholder="Nur für Sie sichtbar — Preis, Absprachen, Besonderheiten …"
            className="w-full resize-y border border-line bg-cream px-4 py-3 text-[0.9375rem] leading-relaxed text-ink outline-none transition-colors duration-300 placeholder:text-mist/70 focus:border-ink"
          />
          <button
            type="submit"
            disabled={notePending}
            className="mt-3 text-[0.8125rem] uppercase tracking-[0.18em] text-mist underline underline-offset-4 transition-colors duration-300 hover:text-ink disabled:opacity-40"
          >
            {notePending ? 'Wird gespeichert …' : 'Notiz speichern'}
          </button>
        </form>
        <ActionFeedback state={noteState} />
      </section>

      {/* Löschen — mit Rückfrage, weil der Verlauf mit verschwindet */}
      <section className="border-t border-line pt-6">
        {confirming ? (
          <div>
            <p className="text-[0.875rem] leading-relaxed text-ink">
              Anfrage und gesamter Verlauf werden endgültig gelöscht.
            </p>
            <div className="mt-3 flex gap-4">
              <form action={deleteAction}>
                <input type="hidden" name="id" value={inquiryId} />
                <button
                  type="submit"
                  className="text-[0.8125rem] uppercase tracking-[0.18em] text-champagne underline underline-offset-4"
                >
                  Endgültig löschen
                </button>
              </form>
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-[0.8125rem] uppercase tracking-[0.18em] text-mist underline underline-offset-4 hover:text-ink"
              >
                Abbrechen
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="text-[0.8125rem] uppercase tracking-[0.18em] text-mist underline underline-offset-4 transition-colors duration-300 hover:text-ink"
          >
            Anfrage löschen
          </button>
        )}
        <ActionFeedback state={deleteState} />
      </section>
    </div>
  )
}
