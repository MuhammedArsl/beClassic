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
    /* min-h war 620 px. Auf einem 320x568-Gerät ist der Hero damit höher als
       der Bildschirm — der Inhalt sitzt unten und schob sich oben unter die
       Kopfleiste, wo Eyebrow und Wortmarke übereinander lagen. 34rem passt
       auch auf die kleinsten Geräte.

       `flex-col`, weil das Bild auf dem Handy als Band im Fluss oben steht
       (siehe unten) und der Text darunter beginnt. */
    <section className="relative flex h-[100svh] min-h-[34rem] w-full flex-col overflow-hidden bg-ink">
      {/* DAS BILD — zwei Auftritte:

          Ab sm liegt es formatfüllend im Hintergrund, die Schrift steht
          darauf. So war es überall.

          Auf dem Handy geht das nicht auf: Der Rahmen ist dort etwa 0,46
          breit wie hoch, die Aufnahme aber 1,5 — `object-cover` zeigte
          keine 30 % der Bildbreite. Vom Wagen, der quer durchs Bild steht,
          blieb die Tür. Deshalb steht das Bild hier als Band in seinem
          eigenen 3:2-Format oben und läuft nach unten in den dunklen Grund
          aus; die Schrift sitzt darunter.

          Bewusst ohne `shrink-0`: Reicht die Höhe nicht (kurze Geräte),
          darf das Band schmaler werden. Beschnitten wird dann oben und
          unten — Himmel und Asphalt — statt links und rechts, wo der Wagen
          steht. */}
      <div className="relative aspect-[3/2] min-h-[9rem] w-full sm:absolute sm:inset-0 sm:aspect-auto sm:min-h-0">
        {/* `relative`, weil <Image fill> einen positionierten Elter braucht. */}
        <div className="hero-drift relative h-full w-full">
          {/* Die Aufnahme ist um etwa ein Drittel Grad verkantet, rechte Seite
              zu hoch. Zwei unabhängige Messungen am Bild stimmen überein: die
              Unterkante der Karosserie steigt um 0,37 Grad nach rechts an, und
              die Dachlinie der Neuen Burg ist zwar ein Bogen (halbrunde
              Fassade), ihre Spiegelpunkte liegen rechts aber durchweg 6 bis
              17 px höher als links — das entspricht 0,36 Grad.

              `scale` ist nötig, damit beim Drehen keine leeren Ecken in den
              Rahmen laufen; 1,012 deckt alle hier vorkommenden Seiten-
              verhältnisse mit Reserve ab. */}
          <Image
            src={vehicle.heroImage.src}
            alt={vehicle.heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="rotate-[0.36deg] scale-[1.012] object-cover"
          />
        </div>

        {/* Weicher Übergang der Bildunterkante in den dunklen Grund — sonst
            stünde dort auf dem Handy eine harte Kante. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ink sm:hidden"
        />

        {/* Schleier unter der Kopfleiste: Das Bildband reicht auf dem Handy
            bis unter den Header, und über hellem Himmel wäre die Wortmarke
            sonst kaum zu lesen. Nur so hoch wie die Leiste — das Bild
            darunter bleibt unangetastet. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-ink/70 to-transparent sm:hidden"
        />
      </div>

      {/* Abdunklung nur dort, wo Schrift auf dem Bild liegt — also ab sm.
          Auf dem Handy steht die Schrift auf dem dunklen Grund und das Bild
          bleibt unverfälscht hell. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-b from-ink/55 via-ink/25 to-ink/85 sm:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-gradient-to-r from-ink/55 via-transparent to-transparent sm:block"
      />

      {/* Inhalt */}
      <div className="relative flex flex-1 flex-col justify-end">
        {/* Mobil mittig in der dunklen Fläche unter dem Bildband — sonst
            klebt der Text unten und darüber steht ein leeres Feld. Die
            Scroll-Zeile bleibt davon unberührt am Fuss stehen. Ab sm wieder
            das gewohnte Blockverhalten über dem formatfüllenden Bild. */}
        <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col justify-center px-6 pb-6 sm:block sm:flex-none sm:px-10 sm:pb-24">
          <div className="max-w-4xl">
            <p
              className="eyebrow mb-5 text-cream/80 sm:mb-8"
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
                  className="block text-[clamp(2.375rem,8.5vw,7rem)]"
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
                  className="block text-[clamp(2.375rem,8.5vw,7rem)] italic text-champagne-soft"
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
              className="mt-6 max-w-xl text-[1.0625rem] font-normal leading-relaxed text-cream/85 sm:mt-8 sm:text-[1.3125rem]"
              style={{
                animation: 'fade-up 1s cubic-bezier(0.22,1,0.36,1) 0.95s both',
              }}
            >
              Klassische Fahrzeuge für Hochzeiten, Filmproduktionen, Events und
              besondere Fahrten.
            </p>

            <div
              className="mt-8 sm:mt-11"
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
        {/* Auf sehr flachen Displays ist die Zeile der erste Kandidat zum
            Streichen: Sie ist reine Zierde, kostet aber 66 px, die Headline
            und Knopf dringender brauchen. */}
        <div className="mx-auto flex w-full max-w-[1400px] items-end justify-between border-t border-cream/10 px-6 py-5 [@media(max-height:660px)]:hidden sm:px-10 sm:py-6">
          <div className="flex items-center gap-3 sm:gap-4">
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
