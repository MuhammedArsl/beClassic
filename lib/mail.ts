import 'server-only'
import { site } from '@/data/site'

/**
 * E-Mail-Versand über Resend.
 *
 * Bewusst per `fetch` statt über das SDK — es geht um einen einzigen
 * Endpunkt, dafür lohnt keine weitere Abhängigkeit.
 *
 * >>> EINRICHTEN — in .env.local:
 *   RESEND_API_KEY=re_xxx
 *   ANFRAGE_ABSENDER=BeClassic <anfrage@deine-domain.de>
 *   ANFRAGE_EMPFAENGER=deine@adresse.de
 *
 * Die Absenderdomain muss bei Resend verifiziert sein. Zum Ausprobieren
 * ohne eigene Domain funktioniert `onboarding@resend.dev` — damit lässt
 * sich allerdings nur an die eigene, bei Resend registrierte Adresse
 * senden.
 *
 * Ohne API-Key wird nichts versendet. Das ist kein Fehlerfall: Die
 * Nachricht landet trotzdem im Verlauf, und das Dashboard bietet
 * stattdessen einen mailto-Link an.
 */

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY)
}

export interface MailResult {
  sent: boolean
  /** Grund, wenn nicht versendet wurde — wird im Verlauf mitgeschrieben. */
  error?: string
}

export interface Attachment {
  filename: string
  /** Dateiinhalt als Text; wird für Resend base64-kodiert. */
  content: string
}

export async function sendMail(options: {
  to: string
  subject: string
  text: string
  replyTo?: string
  attachments?: Attachment[]
}): Promise<MailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    return { sent: false, error: 'Kein RESEND_API_KEY hinterlegt — nicht versendet.' }
  }

  const from = process.env.ANFRAGE_ABSENDER || `${site.name} <onboarding@resend.dev>`

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [options.to],
        subject: options.subject,
        text: options.text,
        ...(options.replyTo ? { reply_to: options.replyTo } : {}),
        ...(options.attachments?.length
          ? {
              attachments: options.attachments.map((attachment) => ({
                filename: attachment.filename,
                content: Buffer.from(attachment.content, 'utf8').toString('base64'),
              })),
            }
          : {}),
      }),
    })

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      return {
        sent: false,
        error: `Resend antwortete mit ${response.status}: ${detail.slice(0, 300)}`,
      }
    }

    return { sent: true }
  } catch (error) {
    return {
      sent: false,
      error: error instanceof Error ? error.message : 'Unbekannter Fehler beim Versand.',
    }
  }
}
