import Image from 'next/image'
import type { Vehicle } from '@/lib/types'
import CTAButton from './CTAButton'

interface HeroProps {
  vehicle: Vehicle
}

/**
 * Fullscreen-Auftakt.
 *
 * >>> TEXT HIER ANPASSEN: Headline und Untertitel stehen bewusst in dieser
 * Komponente, da sie die Marke tragen und nicht fahrzeugabhängig sind.
 *
 * Ein Video statt des Bildes: <Image> durch ein <video> mit autoPlay, muted,
 * loop und playsInline ersetzen und ein poster-Bild hinterlegen.
 */
export default function Hero({ vehicle }: HeroProps) {
  return (
    <section className="relative h-[100svh] min-h-[620px] w-full overflow-hidden bg-ink">
      {/* Hintergrundbild mit sehr langsamer Zoomfahrt */}
      <div className="absolute inset-0">
        <div className="hero-drift h-full w-full">
          <Image
            src={vehicle.heroImage.src}
            alt={vehicle.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* Abdunklung: unten kräftiger, damit die Typografie sicher trägt */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/85"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-ink/55 via-transparent to-transparent"
      />

      {/* Inhalt */}
      <div className="relative flex h-full flex-col justify-end">
        <div className="mx-auto w-full max-w-[1400px] px-6 pb-20 sm:px-10 sm:pb-24">
          <div className="max-w-4xl">
            <p
              className="eyebrow mb-8 text-cream/72"
              style={{
                animation: 'fade-up 1s cubic-bezier(0.22,1,0.36,1) 0.3s both',
              }}
            >
              {vehicle.eyebrow}
            </p>

            <h1 className="display text-cream">
              {/* Zeilenweiser Auftakt: jede Zeile schiebt sich hinter der Kante
                  ihres Containers hervor. Läuft einmalig beim Laden — daher
                  eine Keyframe-Animation statt der scrollgesteuerten Reveal-
                  Komponente. */}
              <span className="block overflow-hidden">
                <span
                  className="block text-[clamp(2.75rem,8.5vw,7rem)]"
                  style={{
                    animation:
                      'line-in 1.2s cubic-bezier(0.22,1,0.36,1) 0.45s both',
                  }}
                >
                  Klassiker für
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block text-[clamp(2.75rem,8.5vw,7rem)] italic text-champagne-soft"
                  style={{
                    animation:
                      'line-in 1.2s cubic-bezier(0.22,1,0.36,1) 0.6s both',
                  }}
                >
                  besondere Momente.
                </span>
              </span>
            </h1>

            <p
              className="mt-8 max-w-xl text-[1.125rem] font-normal leading-relaxed text-cream/85 sm:text-[1.3125rem]"
              style={{
                animation: 'fade-up 1s cubic-bezier(0.22,1,0.36,1) 0.95s both',
              }}
            >
              Klassische Fahrzeuge für Hochzeiten, Filmproduktionen, Events und
              besondere Fahrten.
            </p>

            <div
              className="mt-11"
              style={{
                animation: 'fade-up 1s cubic-bezier(0.22,1,0.36,1) 1.15s both',
              }}
            >
              <CTAButton href="#anfrage" variant="solid-light">
                Fahrzeug anfragen
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Fußzeile des Heros: Scroll-Hinweis links, Fahrzeugname rechts */}
        <div className="mx-auto flex w-full max-w-[1400px] items-end justify-between border-t border-cream/10 px-6 py-6 sm:px-10">
          <div className="flex items-center gap-4">
            <svg
              className="scroll-hint text-cream/72"
              width="12"
              height="26"
              viewBox="0 0 12 26"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M6 0V24M6 24L1 19M6 24L11 19"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
            <span className="text-[0.75rem] uppercase tracking-[0.28em] text-cream/65">
              Scrollen
            </span>
          </div>

          <p className="hidden text-right text-[0.75rem] uppercase tracking-[0.28em] text-cream/65 sm:block">
            Aktuell im Bestand
            <span className="mt-1.5 block text-cream/80">{vehicle.name}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
