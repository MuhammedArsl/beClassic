import { NextResponse } from 'next/server'

/**
 * Endpunkt für das Anfrageformular.
 *
 * AKTUELLER STAND
 *   Die Anfrage wird serverseitig validiert und in der Server-Konsole
 *   ausgegeben. Es wird noch KEINE E-Mail versendet — das Formular ist damit
 *   vollständig bedienbar, ohne dass Zugangsdaten hinterlegt sein müssen.
 *
 * >>> E-MAIL-VERSAND AKTIVIEREN (Beispiel: Resend)
 *   1. npm install resend
 *   2. In .env.local hinterlegen:
 *        RESEND_API_KEY=re_xxx
 *        ANFRAGE_EMPFAENGER=deine@adresse.de
 *   3. Den markierten Block unten einkommentieren.
 *
 *   import { Resend } from 'resend'
 *   const resend = new Resend(process.env.RESEND_API_KEY)
 *   await resend.emails.send({
 *     from: 'BeClassic <anfrage@deine-domain.de>',
 *     to: process.env.ANFRAGE_EMPFAENGER!,
 *     replyTo: data.email,
 *     subject: `Neue Anfrage: ${data.occasion} — ${data.firstName} ${data.lastName}`,
 *     text: buildEmailText(data),
 *   })
 */

interface InquiryPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  startDate: string
  endDate?: string
  occasion: string
  pickupLocation?: string
  message?: string
  privacy: boolean
  vehicle?: string
  vehicleSlug?: string
}

/** Kürzt Freitextfelder, damit keine überlangen Inhalte weiterverarbeitet werden. */
function clean(value: unknown, maxLength = 2000): string {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

/* ── Spam-Schutz ───────────────────────────────────────────────
   Drei Stufen, die ohne externen Dienst und ohne CAPTCHA auskommen.
   Für Besucher bleibt das Formular dadurch unverändert bequem.
   ────────────────────────────────────────────────────────────── */

/** Schneller als das ist keine ernsthafte Eingabe. */
const MIN_FILL_TIME_MS = 3_000

/** Höchstens so viele Anfragen je Absender innerhalb des Zeitfensters. */
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000

/**
 * Zeitstempel der letzten Anfragen je IP-Adresse.
 *
 * Bewusst im Arbeitsspeicher: Das bremst Massenversand wirksam aus, überlebt
 * aber keinen Neustart und wirkt bei mehreren Server-Instanzen nur je
 * Instanz. Für eine Landingpage genügt das. Wird später härteres Limit
 * gebraucht, gehört der Zähler in einen geteilten Speicher
 * (z. B. Cloudflare KV, Upstash Redis).
 */
const requestLog = new Map<string, number[]>()

function getClientKey(request: Request): string {
  // Cloudflare setzt cf-connecting-ip, andere Hoster x-forwarded-for.
  const forwarded = request.headers.get('x-forwarded-for')
  return (
    request.headers.get('cf-connecting-ip') ??
    forwarded?.split(',')[0].trim() ??
    'unbekannt'
  )
}

/**
 * Prüft das Turnstile-Token bei Cloudflare.
 *
 * Ist kein Secret hinterlegt, gilt die Prüfung als bestanden — die Seite
 * funktioniert dadurch auch ohne Cloudflare-Konto, geschützt durch Honeypot,
 * Tempo-Prüfung und Rate-Limit. Sobald `TURNSTILE_SECRET_KEY` gesetzt ist,
 * wird streng geprüft.
 */
async function verifyTurnstile(
  token: string,
  ip: string,
): Promise<{ ok: boolean; reason?: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return { ok: true }

  if (!token) return { ok: false, reason: 'kein Token übermittelt' }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          secret,
          response: token,
          ...(ip !== 'unbekannt' ? { remoteip: ip } : {}),
        }),
      },
    )

    const result = (await response.json()) as {
      success?: boolean
      'error-codes'?: string[]
    }

    if (result.success === true) return { ok: true }
    return { ok: false, reason: result['error-codes']?.join(', ') ?? 'abgelehnt' }
  } catch {
    // Ist Cloudflare nicht erreichbar, soll eine echte Anfrage nicht verloren
    // gehen — die übrigen Schutzstufen greifen weiterhin.
    console.warn('[BeClassic] Turnstile nicht erreichbar — Prüfung übersprungen.')
    return { ok: true }
  }
}

/** true = Limit überschritten. Räumt nebenbei veraltete Einträge auf. */
function isRateLimited(key: string): boolean {
  const now = Date.now()
  const recent = (requestLog.get(key) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  )

  // Speicher sauber halten, damit die Map nicht unbegrenzt wächst.
  if (requestLog.size > 5_000) requestLog.clear()

  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(key, recent)
    return true
  }

  recent.push(now)
  requestLog.set(key, recent)
  return false
}

export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Ungültige Anfrage.' },
      { status: 400 },
    )
  }

  const raw = body as Partial<InquiryPayload> & {
    website?: string
    elapsedMs?: number
    turnstileToken?: string
  }

  const clientKey = getClientKey(request)

  /* Stufe 1 — Honeypot: Nur Bots füllen das unsichtbare Feld aus.
     Stufe 2 — Tempo: Menschen brauchen länger als drei Sekunden.

     In beiden Fällen antworten wir bewusst mit einem normalen Erfolg, statt
     einen Fehler zu melden: Der Bot hält die Einlieferung für geglückt und
     probiert keine Umgehung. Verarbeitet oder versendet wird nichts. */
  const looksAutomated =
    Boolean(clean(raw.website, 200)) ||
    (typeof raw.elapsedMs === 'number' && raw.elapsedMs < MIN_FILL_TIME_MS)

  if (looksAutomated) {
    console.warn('[BeClassic] Anfrage als automatisiert verworfen.')
    return NextResponse.json({ ok: true })
  }

  /* Stufe 3 — Rate-Limit: bremst wiederholtes Absenden derselben Quelle. */
  if (isRateLimited(clientKey)) {
    return NextResponse.json(
      {
        error:
          'Es wurden bereits mehrere Anfragen gesendet. Bitte versuchen Sie es in einigen Minuten erneut oder schreiben Sie uns direkt eine E-Mail.',
      },
      { status: 429 },
    )
  }

  const data: InquiryPayload = {
    firstName: clean(raw.firstName, 100),
    lastName: clean(raw.lastName, 100),
    email: clean(raw.email, 200),
    phone: clean(raw.phone, 60),
    startDate: clean(raw.startDate, 20),
    endDate: clean(raw.endDate, 20),
    occasion: clean(raw.occasion, 60),
    pickupLocation: clean(raw.pickupLocation, 200),
    message: clean(raw.message, 2000),
    privacy: raw.privacy === true,
    vehicle: clean(raw.vehicle, 120),
    vehicleSlug: clean(raw.vehicleSlug, 120),
  }

  // Serverseitige Prüfung — das Frontend validiert zusätzlich, aber ein
  // Endpunkt darf sich darauf nicht verlassen.
  const missing: string[] = []
  if (!data.firstName) missing.push('firstName')
  if (!data.lastName) missing.push('lastName')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) missing.push('email')
  if (data.phone.replace(/\D/g, '').length < 6) missing.push('phone')
  if (!data.startDate) missing.push('startDate')
  if (!data.occasion) missing.push('occasion')
  if (!data.privacy) missing.push('privacy')

  if (missing.length > 0) {
    return NextResponse.json(
      { error: 'Bitte alle Pflichtfelder ausfüllen.', fields: missing },
      { status: 422 },
    )
  }

  /* Stufe 4 — Turnstile: bewusst als letzte Prüfung, damit der Netzwerkaufruf
     zu Cloudflare nur für ansonsten vollständige Anfragen anfällt. */
  const turnstile = await verifyTurnstile(
    clean(raw.turnstileToken, 4000),
    clientKey,
  )

  if (!turnstile.ok) {
    console.warn('[BeClassic] Turnstile abgelehnt:', turnstile.reason)
    return NextResponse.json(
      {
        error:
          'Die Sicherheitsprüfung konnte nicht abgeschlossen werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.',
      },
      { status: 403 },
    )
  }

  // TODO: Hier den E-Mail-Versand einsetzen (siehe Kommentar oben).
  console.log('[BeClassic] Neue Anfrage:', {
    ...data,
    eingegangen: new Date().toISOString(),
  })

  return NextResponse.json({ ok: true })
}
