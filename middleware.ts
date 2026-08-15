import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth'

/**
 * Schützt das Dashboard.
 *
 * Die Prüfung sitzt bewusst in der Middleware und nicht erst in den Seiten:
 * So kommt eine nicht angemeldete Anfrage gar nicht bis zur Datenbank.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Die Anmeldeseite und ihr Endpunkt müssen offen bleiben.
  if (pathname === '/admin/login' || pathname === '/api/admin/login') {
    return NextResponse.next()
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value

  if (await verifySessionToken(token)) return NextResponse.next()

  // API-Aufrufe bekommen einen Statuscode, kein Redirect — sonst
  // bekäme ein fetch() die Anmelde-HTML-Seite als vermeintliche Antwort.
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 })
  }

  const loginUrl = new URL('/admin/login', request.url)
  // Nach der Anmeldung dorthin zurück, wo der Aufruf hinwollte.
  loginUrl.searchParams.set('weiter', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
