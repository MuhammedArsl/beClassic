import { NextResponse } from 'next/server'
import { getInquiry } from '@/lib/inquiries'
import { buildIcs, icsFilename } from '@/lib/ics'

/**
 * Liefert den bestätigten Termin als Kalenderdatei.
 *
 * Ein Klick lädt die .ics herunter; ein Doppelklick legt sie in Apple
 * Kalender an, in Google Kalender geht sie über „Einstellungen →
 * Importieren“ hinein.
 *
 * Der Zugang ist über die Middleware geschützt (Pfad /api/admin/*).
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  const inquiry = await getInquiry(id)
  if (!inquiry) {
    return NextResponse.json({ error: 'Anfrage nicht gefunden.' }, { status: 404 })
  }

  const ics = buildIcs(inquiry)
  if (!ics) {
    return NextResponse.json(
      { error: 'Für diese Anfrage ist noch kein Termin gesetzt.' },
      { status: 409 },
    )
  }

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${icsFilename(inquiry)}"`,
      // Ein geänderter Termin soll nicht aus dem Zwischenspeicher kommen.
      'Cache-Control': 'no-store',
    },
  })
}
