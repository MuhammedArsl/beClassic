import 'server-only'

/**
 * Push-Benachrichtigung über ntfy.sh.
 *
 * Warum nicht E-Mail: Eine neue Anfrage soll sofort auffallen. Eine Mail
 * landet im Posteingang zwischen allem anderen, eine Push-Nachricht klingelt.
 * Und ntfy braucht weder Konto noch eigene Absenderdomain — es genügt ein
 * Kanalname („Topic“), den die App auf dem Handy abonniert.
 *
 * >>> EINRICHTEN
 *   1. App „ntfy“ installieren (Android, iOS, oder ntfy.sh im Browser).
 *   2. Dort den Kanal abonnieren, der in NTFY_TOPIC steht.
 *   3. NTFY_TOPIC als Umgebungsvariable setzen — lokal in .env.local,
 *      auf Cloudflare mit `npx wrangler secret put NTFY_TOPIC`.
 *
 * >>> WICHTIG: DER KANALNAME IST DAS PASSWORT
 * Auf dem öffentlichen ntfy.sh kann jeder mitlesen, der den Namen kennt —
 * und jeder etwas hineinschreiben. Deshalb ein langer, zufälliger Name,
 * kein „beclassic-anfragen“. Personenbezogene Daten gehören aus demselben
 * Grund nicht hinein: Die Nachricht nennt bewusst nur den Namen und den
 * Anlass, nie Telefonnummer, E-Mail oder Nachrichtentext. Alles Weitere
 * steht hinter der Anmeldung im Dashboard, auf das der Knopf verweist.
 *
 * Ohne NTFY_TOPIC passiert nichts — das ist kein Fehlerfall, sondern der
 * Zustand „nicht eingerichtet“.
 */

const STANDARD_SERVER = 'https://ntfy.sh'

export interface NotifyResult {
  sent: boolean
  /** Grund, wenn nichts rausging — wird ins Serverprotokoll geschrieben. */
  error?: string
}

export function isPushConfigured(): boolean {
  return Boolean(process.env.NTFY_TOPIC)
}

export async function sendPush(options: {
  title: string
  message: string
  /** Adresse, die sich beim Antippen der Nachricht öffnet. */
  click?: string
}): Promise<NotifyResult> {
  const topic = process.env.NTFY_TOPIC

  if (!topic) {
    return { sent: false, error: 'Kein NTFY_TOPIC hinterlegt — nicht gesendet.' }
  }

  const server = process.env.NTFY_SERVER || STANDARD_SERVER

  try {
    /* Der JSON-Weg, nicht der mit den Kopfzeilen: Titel und Text dürfen
       nur bei JSON Umlaute enthalten. Als HTTP-Kopfzeile („Title: …“)
       müssten sie umständlich kodiert werden und kämen sonst verstümmelt
       an — „Anfrage für Hochzeit“ wird zu „Anfrage fÃ¼r Hochzeit“. */
    const response = await fetch(server, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        topic,
        title: options.title,
        message: options.message,
        // Höhere Stufe, damit die Nachricht auch durch „Nicht stören“ kommt.
        priority: 4,
        tags: ['car'],
        ...(options.click ? { click: options.click } : {}),
      }),
      /* Ohne Zeitlimit könnte ein hängender Aufruf die Antwort an den
         Besucher aufhalten. Die Anfrage liegt zu diesem Zeitpunkt längst
         in der Datenbank — Warten bringt ihm also nichts. */
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      return {
        sent: false,
        error: `ntfy antwortete mit ${response.status}: ${detail.slice(0, 200)}`,
      }
    }

    return { sent: true }
  } catch (error) {
    return {
      sent: false,
      error:
        error instanceof Error
          ? // AbortSignal.timeout wirft einen TimeoutError — der Name sagt
            // mehr als die Meldung, deshalb beides.
            `${error.name}: ${error.message}`
          : 'Unbekannter Fehler beim Senden.',
    }
  }
}
