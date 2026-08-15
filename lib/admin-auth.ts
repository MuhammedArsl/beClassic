/**
 * Zugangsschutz für das Dashboard.
 *
 * Bewusst schlank gehalten: Es gibt genau einen Betreiber, keine
 * Benutzerverwaltung. Statt einer Sitzungstabelle wird ein signiertes
 * Cookie ausgestellt — der Server muss dafür nichts vorhalten.
 *
 * Alle Funktionen nutzen ausschliesslich die Web-Crypto-API, damit sie
 * auch in der Middleware (Edge-Runtime) laufen.
 *
 * >>> EINRICHTEN — in .env.local:
 *   ADMIN_PASSWORD=ein-langes-eigenes-passwort
 *   ADMIN_SESSION_SECRET=<32+ zufällige Zeichen>
 *
 *   Zufallswert erzeugen:  openssl rand -base64 32
 */

export const SESSION_COOKIE = 'beclassic_admin'

/** Gültigkeitsdauer einer Anmeldung. */
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function encoder() {
  return new TextEncoder()
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

async function sign(value: string, secret: string): Promise<string> {
  const key = await importKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder().encode(value))
  return toHex(signature)
}

/**
 * Vergleich in konstanter Zeit.
 *
 * Ein normaler `===` bricht beim ersten abweichenden Zeichen ab; aus der
 * Antwortzeit liesse sich die Signatur Zeichen für Zeichen erraten.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let difference = 0
  for (let index = 0; index < a.length; index += 1) {
    difference |= a.charCodeAt(index) ^ b.charCodeAt(index)
  }
  return difference === 0
}

/** true, sobald Passwort und Signaturschlüssel hinterlegt sind. */
export function isAuthConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET)
}

/** Prüft das eingegebene Passwort gegen `ADMIN_PASSWORD`. */
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return safeEqual(input, expected)
}

/** Erzeugt den Cookie-Wert: Ablaufzeitpunkt plus Signatur darüber. */
export async function createSessionToken(): Promise<{
  value: string
  maxAge: number
}> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) throw new Error('ADMIN_SESSION_SECRET fehlt.')

  const expiresAt = Date.now() + SESSION_DURATION_MS
  const signature = await sign(String(expiresAt), secret)

  return {
    value: `${expiresAt}.${signature}`,
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  }
}

/** Prüft Signatur und Ablauf eines Cookie-Werts. */
export async function verifySessionToken(
  token: string | undefined,
): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || !token) return false

  const separator = token.indexOf('.')
  if (separator < 1) return false

  const expiresAt = token.slice(0, separator)
  const signature = token.slice(separator + 1)

  // Erst die Signatur prüfen, dann den Inhalt auswerten — einem
  // unsignierten Wert darf nicht geglaubt werden.
  const expected = await sign(expiresAt, secret)
  if (!safeEqual(signature, expected)) return false

  const timestamp = Number(expiresAt)
  return Number.isFinite(timestamp) && timestamp > Date.now()
}
