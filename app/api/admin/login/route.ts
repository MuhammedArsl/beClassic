import { NextResponse } from 'next/server'
import {
  SESSION_COOKIE,
  checkPassword,
  createSessionToken,
  isAuthConfigured,
} from '@/lib/admin-auth'

/**
 * Anmeldung am Dashboard.
 *
 * Bewusst als Route-Handler und nicht als Server-Action: Hier wird ein
 * Cookie gesetzt, und das ist im Route-Handler der direkte Weg.
 */

/** Bremst Rateversuche aus — je Absender ein Zähler im Arbeitsspeicher. */
const attempts = new Map<string, { count: number; until: number }>()

const MAX_ATTEMPTS = 8
const LOCKOUT_MS = 15 * 60 * 1000

function clientKey(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'lokal'
  )
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      {
        error:
          'Kein Zugang eingerichtet. Bitte ADMIN_PASSWORD und ADMIN_SESSION_SECRET in .env.local hinterlegen.',
      },
      { status: 503 },
    )
  }

  const key = clientKey(request)
  const record = attempts.get(key)
  const now = Date.now()

  if (record && record.count >= MAX_ATTEMPTS && record.until > now) {
    const minutes = Math.ceil((record.until - now) / 60_000)
    return NextResponse.json(
      { error: `Zu viele Fehlversuche. Bitte in ${minutes} Minuten erneut versuchen.` },
      { status: 429 },
    )
  }

  let password = ''
  try {
    const body = (await request.json()) as { password?: unknown }
    password = typeof body.password === 'string' ? body.password : ''
  } catch {
    return NextResponse.json({ error: 'Ungültige Anfrage.' }, { status: 400 })
  }

  if (!checkPassword(password)) {
    const count = (record && record.until > now ? record.count : 0) + 1
    attempts.set(key, { count, until: now + LOCKOUT_MS })

    // Speicher begrenzen, damit die Map nicht unbegrenzt wächst.
    if (attempts.size > 1_000) attempts.clear()

    return NextResponse.json({ error: 'Passwort stimmt nicht.' }, { status: 401 })
  }

  attempts.delete(key)

  const session = await createSessionToken()
  const response = NextResponse.json({ ok: true })

  response.cookies.set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: 'lax',
    // In der lokalen Entwicklung läuft die Seite über http — dort würde
    // ein secure-Cookie gar nicht erst gesetzt.
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: session.maxAge,
  })

  return response
}
