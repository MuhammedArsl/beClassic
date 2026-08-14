import type { ReactNode } from 'react'
import Reveal from './Reveal'

interface LegalPageProps {
  eyebrow: string
  title: string
  /** Hinweisbanner über dem Text — z. B. dass es sich um eine Vorlage handelt. */
  note?: string
  children: ReactNode
}

/**
 * Ruhiges Textlayout für Impressum und Datenschutz.
 *
 * Die Typografie der Fließtexte wird hier zentral gesetzt, damit die
 * Rechtsseiten ohne zusätzliches Markup lesbar und markenkonform bleiben.
 */
export default function LegalPage({
  eyebrow,
  title,
  note,
  children,
}: LegalPageProps) {
  return (
    <main id="inhalt" className="bg-cream pb-32 pt-40 sm:pt-48">
      <div className="mx-auto max-w-3xl px-6 sm:px-10">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display mt-6 text-[clamp(2.5rem,6vw,4rem)] text-ink">
            {title}
          </h1>
        </Reveal>

        {note && (
          <Reveal delay={80}>
            <p className="mt-10 border-l-2 border-champagne bg-sand/50 px-6 py-4 text-[0.9375rem] font-normal leading-relaxed text-mist">
              {note}
            </p>
          </Reveal>
        )}

        <Reveal delay={140}>
          <div
            className="mt-14 font-normal text-mist
              [&_h2]:mt-14 [&_h2]:font-display [&_h2]:text-[1.5rem] [&_h2]:font-normal [&_h2]:text-ink
              [&_h2:first-child]:mt-0
              [&_p]:mt-5 [&_p]:text-[1.0625rem] [&_p]:leading-[1.85]
              [&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4"
          >
            {children}
          </div>
        </Reveal>
      </div>
    </main>
  )
}
